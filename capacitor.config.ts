import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
	appId: 'com.attendance.app',
	appName: 'Attendance',
	webDir: 'build',
	bundledWebRuntime: true,
	server: {
		androidScheme: 'https'
	}
};

export default config;
