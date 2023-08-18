import { goto } from '$app/navigation';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import * as XLSX from 'xlsx';
import { modalStore, type ModalComponent, type ModalSettings } from '@skeletonlabs/skeleton';
import toast from 'svelte-french-toast';
import { fromZodError } from 'zod-validation-error';
import db from './DB';
import { SelectedGroup, SelectedSession, SelectedStudent } from './Store';
import NewStudent from './components/Modals/NewStudent.svelte';
import { NewGroupSchema } from './validation';
import { get } from 'svelte/store';
import { liveQuery } from 'dexie';

export const NewGroupModal: ModalSettings = {
	type: 'prompt',
	title: 'New Group',
	body: 'Enter Group name:',
	valueAttr: { type: 'text', minlength: 2, maxlength: 20, required: true },
	response: async (r: any) => {
		if (r !== false) {
			try {
				const res = NewGroupSchema.safeParse(r);
				if (res.success) {
					await db.groups.add({
						name: res.data
					});
					ShowToast('success', `Group ${r} successfully added.`);
				} else {
					ShowToast('error', fromZodError(res.error).message);
				}
			} catch (error) {
				ShowToast('error', `Failed to add Group ${r}`);
				console.error(`Failed to add Group ${r}`, error);
			}
		}
	}
};

export function GotoManageStudents(group: Group) {
	SelectedGroup.set(group);
	goto('/groups/manage-students');
}

export function DeleteGroup(group: Group) {
	const DeleteGroupModal: ModalSettings = {
		type: 'confirm',
		title: 'Please Confirm',
		body: 'Are you sure you want to delete group?',
		response: async (r: boolean) => {
			if (r && group.id) {
				try {
					const studentsInGroup = await db.students.where({ groupid: group.id }).toArray();
					const studentIds = studentsInGroup.map((student) => student.id);

					// Delete attendance records for each student
					await db.attendances.where({ 'student': studentIds }).delete();

					// Step 2: Delete students in the group
					await db.students.where({ groupid: group.id }).delete();

					// Step 3: Delete the group
					await db.groups.where('id').equals(group.id).delete();
					ShowToast('success', `Group ${group.name} successfully Deleted.`);
				} catch (e) {
					ShowToast('error', `Failed to Delete Group ${group.name}: ${e}`);
				}
			}
		}
	};
	modalStore.trigger(DeleteGroupModal);
}

export function NewStudentModal(group: Group) {
	const modalComponent: ModalComponent = {
		ref: NewStudent
	};
	const NewStudentModal: ModalSettings = {
		type: 'component',
		component: modalComponent,
		meta: { group }
	};
	modalStore.trigger(NewStudentModal);
}

export function DeleteStudent(student: Student) {
	const DeleteStudentModal: ModalSettings = {
		type: 'confirm',
		title: 'Please Confirm',
		body: `Are you sure you want to delete ${student.lastname}?`,
		response: async (r: boolean) => {
			if (r && student.id) {
				try {
					await db.attendances.where('student').equals(student.id).delete();
					await db.students.where('id').equals(student.id).delete();
					ShowToast('success', `Student ${student.lastname} successfully Deleted.`);
				} catch (e) {
					ShowToast('error', `Failed to Delete Student ${student.lastname}: ${e}`);
				}
			}
		}
	};
	modalStore.trigger(DeleteStudentModal);
}

export async function NewSession() {
	try {
		const s = await db.sessions.add({ date: new Date() });
		ShowToast('success', `Session ${s} added.`);
	} catch (e) {
		ShowToast('error', 'Faild to add new session');
		console.error(e);
	}
}

export function GotoRecordAttendanc(group: Group) {
	SelectedGroup.set(group);
	goto('/attendance/record-attendance');
}

export function GotoViewAttendanc(group: Group) {
	SelectedGroup.set(group);
	goto('/attendance/view-attendance');
}

export function GotoViewTotalAttendanc(group: Group) {
	SelectedGroup.set(group);
	goto('/attendance/view-total-attendance');
}

export async function generateAttendancesForSession(
	groupId: number,
	sessionId: number
): Promise<void> {
	await db.transaction('rw', db.students, db.attendances, async () => {
		const studentsWithAttendance: StudentWithAttendance[] = await getStudentsWithAttendance(
			groupId,
			sessionId
		);
		const studentIdsWithAttendance = studentsWithAttendance
			.filter(({ attendance }) => attendance !== undefined)
			.map(({ student }) => student.id);

		const studentsWithoutAttendance = await db.students
			.where('groupid')
			.equals(groupId)
			.filter((student) => !studentIdsWithAttendance.includes(student.id))
			.toArray();
		const newAttendances = studentsWithoutAttendance.map((student) => ({
			student: student.id,
			session: sessionId,
			present: false,
			participated: false,
			jus_abs: false
		}));

		await db.attendances.bulkAdd(newAttendances);
	});
}

export async function getStudentsWithAttendance(
	groupId: number,
	sessionId: number
): Promise<StudentWithAttendance[]> {
	return await db.transaction('r', db.students, db.attendances, async () => {
		const students = await db.students.where('groupid').equals(groupId).toArray();
		const studentsWithAttendance: StudentWithAttendance[] = await Promise.all(
			students.map(async (student) => {
				const attendance = await db.attendances
					.where({ student: student.id, session: sessionId })
					.first();
				return { student, attendance };
			})
		);
		return studentsWithAttendance;
	});
}

export async function updateAttendance(att?: Attendance): Promise<void> {
	try {
		if (att && att.id) {
			await db.attendances.update(att.id, {
				present: att.present,
				participated: att.present ? att.participated : false,
				jus_abs: att.present ? false : att.jus_abs
			});
		}
	} catch (e) {
		ShowToast('error', 'Faild to update attendance.');
		console.error('Faild to update attendance.', e);
	}
}

export async function ExportDB(platform: 'web' | 'ios' | 'android') {
	try {
		const students = await db.students.toArray();
		const attendances = await db.attendances.toArray();
		const sessions = await db.sessions.toArray();
		const groups = await db.groups.toArray();

		const Database = {
			groups,
			students,
			sessions,
			attendances
		};

		const blob = new Blob([JSON.stringify(Database)], { type: 'application/json' });
		if (platform !== 'web') {
			await Filesystem.writeFile({
				path: `AttendanceDB.json`,
				data: JSON.stringify(Database),
				directory: Directory.Documents
			});
			ShowToast('success', 'AttendanceDB.json file Exported To Documents folder');
		} else {
			const url = URL.createObjectURL(blob);

			const a = document.createElement('a');
			a.href = url;
			a.download = 'AttendanceDB.json';
			a.click();

			URL.revokeObjectURL(url);
			ShowToast('success', 'AttendanceDB.json file Exported To Downloads folder');
		}
	} catch (e) {
		ShowToast('error', 'Faild to Export Database, ' + e);
		console.log('Faild to Export Database.', e);
	}
}

export async function ImportDB(file: File): Promise<void> {
	try {
		const reader = new FileReader();

		reader.onload = async () => {
			const json = reader.result as string;
			const parsedData = JSON.parse(json);

			await db.transaction('rw', db.groups, db.students, db.sessions, db.attendances, async () => {
				await db.students.bulkPut(parsedData.students);
				await db.attendances.bulkPut(parsedData.attendances);
				await db.groups.bulkPut(parsedData.groups);
				await db.sessions.bulkPut(parsedData.sessions);
			});
		};

		reader.readAsText(file);
		ShowToast('success', 'Database Import successfully.');
	} catch (e) {
		ShowToast('error', 'Faild to Import Database.');
	}
}

export function searchGroups(searchTerms: string[], existingGroups: Group[]): Group[] {
	const matchingGroups: Group[] = [];

	for (const term of searchTerms) {
		const searchTermLower = term.toLowerCase();

		// Search by name
		const groupsByName = existingGroups.filter((group) =>
			group.name.toLowerCase().includes(searchTermLower)
		);
		matchingGroups.push(...groupsByName);

		// Search by ID (numeric value)
		if (!isNaN(Number(term))) {
			const groupId = Number(term);
			const groupById = existingGroups.find((group) => group.id === groupId);
			if (groupById) {
				matchingGroups.push(groupById);
			}
		}
	}

	return matchingGroups;
}

export function searchStudents(existingStudents: Student[], searchTerms: string[]): Student[] {
	const matchingStudents: Student[] = [];

	for (const term of searchTerms) {
		const searchTermLower = term.toLowerCase();

		// Search by firstname
		const studentsByFirstname = existingStudents.filter((student) =>
			student.firstname.toLowerCase().includes(searchTermLower)
		);
		matchingStudents.push(...studentsByFirstname);

		// Search by lastname
		const studentsByLastname = existingStudents.filter((student) =>
			student.lastname.toLowerCase().includes(searchTermLower)
		);
		matchingStudents.push(...studentsByLastname);

		// Search by registration number
		const studentsByRegisNum = existingStudents.filter((student) =>
			student.regis_num.toLowerCase().includes(searchTermLower)
		);
		matchingStudents.push(...studentsByRegisNum);
	}

	return matchingStudents;
}

export function searchStudentsWithAttendance(
	existingStudents: StudentWithAttendance[],
	searchTerms: string[]
): StudentWithAttendance[] {
	const matchingStudents: StudentWithAttendance[] = [];

	for (const term of searchTerms) {
		const searchTermLower = term.toLowerCase();

		const studentsWithAttendanceByName = existingStudents.filter(
			({ student }) =>
				student.firstname.toLowerCase().includes(searchTermLower) ||
				student.lastname.toLowerCase().includes(searchTermLower) ||
				student.regis_num.toLowerCase().includes(searchTermLower)
		);
		matchingStudents.push(...studentsWithAttendanceByName);
	}

	return matchingStudents;
}

export async function calculateTotalsForGroup(groupId: number): Promise<StudentWithTotals[]> {
	return await db.transaction('r', db.students, db.attendances, async () => {
		const students = await db.students.where('groupid').equals(groupId).toArray();

		const studentTotals: StudentWithTotals[] = await Promise.all(
			students.map(async (student) => {
				if (student.id) {
					const attendances = await db.attendances.where('student').equals(student.id).toArray();

					const presentTotal = attendances.filter((att) => att.present).length;
					const participationTotal = attendances.filter((att) => att.participated).length;
					const jusAbsTotal = attendances.filter((att) => att.jus_abs).length;

					return {
						...student,
						presentTotal,
						participationTotal,
						jusAbsTotal
					};
				} else {
					return <StudentWithTotals>{};
				}
			})
		);

		return studentTotals;
	});
}

export function searchStudentsWithTotal(
	existingStudents: StudentWithTotals[],
	searchTerms: string[]
): StudentWithTotals[] {
	const matchingStudents: StudentWithTotals[] = [];

	for (const term of searchTerms) {
		const searchTermLower = term.toLowerCase();

		// Search by firstname
		const studentsByFirstname = existingStudents.filter((student) =>
			student.firstname.toLowerCase().includes(searchTermLower)
		);
		matchingStudents.push(...studentsByFirstname);

		// Search by lastname
		const studentsByLastname = existingStudents.filter((student) =>
			student.lastname.toLowerCase().includes(searchTermLower)
		);
		matchingStudents.push(...studentsByLastname);

		// Search by registration number
		const studentsByRegisNum = existingStudents.filter((student) =>
			student.regis_num.toLowerCase().includes(searchTermLower)
		);
		matchingStudents.push(...studentsByRegisNum);
	}

	return matchingStudents;
}

export async function exportToExcel(
	studentTotals: StudentWithTotals[],
	group: string,
	platform: 'web' | 'ios' | 'android'
): Promise<void> {
	try {
		const excelData = studentTotals.map((student) => ({
			'First Name': student.firstname,
			'Last Name': student.lastname,
			Registration: student.regis_num,
			'Present Total': student.presentTotal,
			'Participation Total': student.participationTotal,
			'Justified Absence': student.jusAbsTotal
		}));

		const worksheet = XLSX.utils.json_to_sheet(excelData, {
			header: [
				'First Name',
				'Last Name',
				'Registration',
				'Present Total',
				'Participation Total',
				'Justified Absence'
			]
		});

		const wb = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(wb, worksheet, `Att_${group}`);
		if (platform === 'web') {
			const buffer = XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' });
			const blob = new Blob([buffer], {
				type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
			});

			const url = URL.createObjectURL(blob);

			const a = document.createElement('a');
			a.href = url;
			a.download = `Att_${group}.xlsx`;
			a.click();

			URL.revokeObjectURL(url);
		} else {
			const data = XLSX.writeXLSX(wb, { type: 'base64' });
			await Filesystem.writeFile({
				data,
				path: `Att_${group}.xlsx`,
				directory: Directory.Documents
			});
		}
		ShowToast(
			'success',
			`Att_${group}.xlsx Exported To ${platform === 'web' ? 'Documents' : 'Downloads'} folder`
		);
	} catch (e) {
		ShowToast('error', `Faild to Exported, ${e}`);
	}
}

export function SessionIsNull() {
	const session = get(SelectedSession);
	return session === null;
}

export function GroupIsNull() {
	const group = get(SelectedGroup);
	return group === null;
}

export function ShowToast(type: 'success' | 'error' | 'msg', msg: string) {
	toast(msg, {
		icon: type == 'success' ? '✅' : type == 'error' ? '❌' : undefined,
		position: 'bottom-center'
	});
}

export async function ExportAttSession(
	studentsWithAttendance: StudentWithAttendance[],
	session: Session,
	group: Group,
	platform: 'web' | 'ios' | 'android'
): Promise<void> {
	try {
		const excelData = studentsWithAttendance.map(({ student, attendance }) => ({
			'First Name': student.firstname,
			'Last Name': student.lastname,
			Registration: student.regis_num,
			Present: attendance?.present ? '✅' : '❌',
			Participation: attendance?.participated ? '✅' : '❌',
			'Jus Abs': attendance?.jus_abs ? '✅' : '❌'
		}));

		const worksheet = XLSX.utils.json_to_sheet(excelData, {
			header: ['First Name', 'Last Name', 'Registration', 'Present', 'Participation', 'Jus Abs']
		});

		const wb = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(wb, worksheet, 'Student Attendance');
		if (platform !== 'web') {
			const data = XLSX.writeXLSX(wb, { type: 'base64' });
			await Filesystem.writeFile({
				data,
				path: `Att_${group.name}_${session.id}.xlsx`,
				directory: Directory.Documents
			});
			ShowToast(
				'success',
				`Att_${group.name}_${session.id}.xlsx file Exported To Downloads folder`
			);
		} else {
			const buffer = XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' });
			const blob = new Blob([buffer], {
				type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
			});
			const url = URL.createObjectURL(blob);

			const a = document.createElement('a');
			a.href = url;
			a.download = `Att_${group.name}_${session.id}.xlsx`;
			a.click();

			URL.revokeObjectURL(url);
			ShowToast('success', `Att_${group.name}_${session.id}.xlsx Exported to Downloads`);
		}
	} catch (e) {
		ShowToast('error', `Failed to Exported Att_${group.name}_${session.id}.xlsx, ${e}`);
	}
}

export async function ImportStudents(
	file: File,
	group: Group,
	studentsList: Student[]
): Promise<void> {
	try {
		const workbook = await XLSX.read(await file.arrayBuffer(), { type: 'array' });
		const sheetName = workbook.SheetNames[0]; // Assuming data is in the first sheet
		const sheet = workbook.Sheets[sheetName];

		const requiredColumns = ['firstname', 'lastname', 'regis_num']; // Adjust as needed
		const sheetColumns = XLSX.utils.sheet_to_json(sheet, { header: 1 })[0];

		if (!requiredColumns.every((col) => sheetColumns.includes(col))) {
			ShowToast('error', 'Required columns are missing in the Excel file.');
			return;
		}

		const students: Student[] = XLSX.utils.sheet_to_json(sheet);

		const gid = group.id ?? 0;
		const existingRegisNums = new Set(studentsList.map((student) => student.regis_num));

		const newStudentsWithoutDuplicates = students.filter(
			(student) => !existingRegisNums.has(student.regis_num)
		);

		const newStudents = newStudentsWithoutDuplicates.map((student) => ({
			...student,
			groupid: gid
		}));
		await db.students.bulkAdd(newStudents);

		ShowToast('success', `Students imported to group ${group.name}`);
	} catch (e) {
		ShowToast('error', 'Failed to Import Students, ' + e);
	}
}

export async function GetStudentByRig_num(
	regNumber: string,
	groupid: number
): Promise<Student | null> {
	try {
		const student = await db.students.where({ groupid: groupid, regis_num: regNumber }).first();
		return student ?? null;
	} catch (e) {
		return null;
	}
}

export async function RecordStudnetAtt(studentId: number, sessionId: number): Promise<boolean> {
	try {
		await db.attendances
			.where({ student: studentId, session: sessionId })
			.modify({ present: true });
		return true;
	} catch (e) {
		return false;
	}
}

export async function SetStudentParticipation(
	studentId: number,
	sessionId: number,
	participated: boolean
): Promise<void> {
	try {
		await db.attendances
			.where({ student: studentId, session: sessionId })
			.modify({ participated: participated });
	} catch (e) { }
}

export function sleep(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

export function GotoStudentInfo(student: Student, group: Group) {
	SelectedStudent.set(student);
	SelectedGroup.set(group);
	goto('/groups/manage-students/student-info');
}

export async function getGroups(): Promise<Group[]> {
	try {
		const groups = await db.groups.toArray();
		return groups;
	} catch (_) {
		return [];
	}
}

export async function getTotalAbsencesWithoutJustification(studentId: number): Promise<number> {
	try {
		const data = (await db.attendances.where({ student: studentId }).toArray())
			.filter((m) => m.present == false)
			.filter((m) => m.jus_abs == false);
		return data.length;
	} catch (e) {
		console.error('Error calculating total absences:', e);
		return 0;
	}
}

export async function GetTotalStudentPresense(studentId: number) {
	try {
		const presense = (await db.attendances.where({ student: studentId }).toArray()).filter(
			(m) => m.present == true
		);
		return presense.length;
	} catch (e) {
		console.error('Error calculating total Presense:', e);
		return 0;
	}
}

export async function ChangeFirstname(NewFirstName:string,id?: number) {
	try {
		await db.students.where({id:id}).modify({ firstname: NewFirstName });
		ShowToast('success',`Firstname changed to ${NewFirstName}`)
	}
	catch (e) {
		ShowToast('error',`Failed Firstname changed to ${NewFirstName}`)
	}
}

export async function ChangeLasttname(NewLastName:string,id?: number) {
	try {
		await db.students.where({id:id}).modify({ lastname: NewLastName });
		ShowToast('success',`Firstname changed to ${NewLastName}`)
	}
	catch (e) {
		ShowToast('error',`Failed Firstname changed to ${NewLastName}`)
	}
}

export async function ChangeGroup(NewGroupID:number,id?: number) {
	try {
		await db.students.where({id:id}).modify({ groupid: NewGroupID });
		ShowToast('success',`Group changed`)
	}
	catch (e) {
		ShowToast('error',`Failed to Change Group`)
	}
}