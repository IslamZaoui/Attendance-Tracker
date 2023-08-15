import Dexie from 'dexie';

class MyDatabase extends Dexie {
	attendances: Dexie.Table<Attendance, number>;
	groups: Dexie.Table<Group, number>;
	sessions: Dexie.Table<Session, number>;
	students: Dexie.Table<Student, number>;

	constructor() {
		super('MyDatabase');

		this.version(1).stores({
			attendances: '++id,student,session,present,participated,jus_abs',
			groups: '++id,name',
			sessions: '++id,date',
			students: '++id,firstname,lastname,regis_num,groupid'
		});

		this.attendances = this.table('attendances');
		this.groups = this.table('groups');
		this.sessions = this.table('sessions');
		this.students = this.table('students');
	}
}

const db = new MyDatabase();

export default db;
