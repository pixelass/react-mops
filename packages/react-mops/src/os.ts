enum OS {
	OSX = "OSX",
	WINDOWS = "WINDOWS",
	LINUX = "LINUX",
	UNIX = "UNIX",
	NODE = "NODE",
	Win = "Win",
	Mac = "Mac",
	Unix = "X11",
	Linux = "Linux"
}
const hasGlobalProp = prop => prop in global;

const getOS = () => {
	if (hasGlobalProp("navigator")) {
		if (navigator.appVersion.indexOf(OS.Win) !== -1) {
			return OS.WINDOWS;
		}
		if (navigator.appVersion.indexOf(OS.Mac) !== -1) {
			return OS.OSX;
		}
		if (navigator.appVersion.indexOf(OS.Unix) !== -1) {
			return OS.UNIX;
		}
		if (navigator.appVersion.indexOf(OS.Linux) !== -1) {
			return OS.LINUX;
		}
	}
	return OS.NODE;
};

export const isOSX = () => getOS() === OS.OSX;
export const isClient = () => hasGlobalProp("window");
