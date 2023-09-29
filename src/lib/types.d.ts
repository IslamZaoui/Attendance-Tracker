interface Attendance {
	id?: number;
	student: number;
	session: number;
	present?: boolean;
	participated?: boolean;
	jus_abs?: boolean;
}

interface Group {
	id?: number;
	name: string;
}

interface Session {
	id?: number;
	date: Date;
}

interface Student {
	id?: number;
	firstname: string;
	lastname: string;
	regis_num: string;
	groupid: number;
}

interface NewAttendance {
	student: number;
	session: number;
}

interface StudentWithAttendance {
	student: Student;
	attendance: Attendance | undefined;
}

interface StudentWithTotals extends Student {
	participationTotal: number;
	unjustifiedAbsencesTotal: number;
}
