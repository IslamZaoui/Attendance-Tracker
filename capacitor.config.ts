import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
	appId: 'com.attendancetracker.app',
	appName: 'Attendance Tracker',
	webDir: 'build',
	bundledWebRuntime: true,
	server: {
		androidScheme: 'https'
	}
};

export default config;
