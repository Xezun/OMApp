// Type definitions for OMApp 2.0.1

interface OMAppPage_Static {
	mall: 			OMAppPage_Instance;
	task: 			OMAppPage_Instance;
	newsList: 		OMAppPage_Instance;
	newsDetail: 	OMAppPage_Instance;
	videoList:  	OMAppPage_Instance;
	videoDetail: 	OMAppPage_Instance;
}
interface OMAppPage_Instance { }
declare var OMAppPage: OMAppPage_Static;

interface OMAppUserType_Static {
	visitor: 	OMAppUserType_Instance;
	google: 	OMAppUserType_Instance;
	facebook: 	OMAppUserType_Instance;
	twitter: 	OMAppUserType_Instance;
}
interface OMAppUserType_Instance { }
declare var OMAppUserType: OMAppUserType_Static;


interface OMAppTheme_Static {
	day: 	OMAppTheme_Instance;
	night: 	OMAppTheme_Instance;
}
interface OMAppTheme_Instance { }
declare var OMAppTheme: OMAppTheme_Static;


interface OMAppNetworkType_Static {
	none: 		OMAppNetworkType_Instance;
	WiFi: 		OMAppNetworkType_Instance;
	WWan2G: 	OMAppNetworkType_Instance;
	WWan3G: 	OMAppNetworkType_Instance;
	WWan4G: 	OMAppNetworkType_Instance;
	unknown: 	OMAppNetworkType_Instance;
}
interface OMAppNetworkType_Instance { }
declare var OMAppNetworkType: OMAppNetworkType_Static;

interface OMAppNavigationBar {
    isHidden: boolean;
    title: string;
    titleColor: string;
    backgroundColor: string;
}

interface OMAppNavigation {
    push(url: string, animated?: boolean): void;
    pop(animated?: boolean): void;
    popTo(index: int, animated?: boolean): void;
    bar: OMAppNavigationBar;
}

interface OMAppAnalytics {
    track(event: string, parameters?: Object): void;
}

interface OMAppUser {
    isOnline: boolean;
    id: string;
    name: string;
    type: OMAppUserType_Instance;
    coin: string;
}

interface OMAppHTTPRequest {
    url: string;
    method?: string;
    data?: Object;
    headers?: Object;
}

interface OMAppAlertMessage {
    title: string;
    body: string;
    actions: array;
}

interface OMAppNetwork {
    isReachable: boolean;
    isViaWiFi: boolean;
    type: OMAppNetworkType_Instance;
}

interface OMAppDebugConfiguration {
    currentTheme?: OMAppTheme_Instance;
    currentUser?: Object;
    network?: Object;
    http?: Object;
    navigation?: Object;
}


interface OMApp {

    ready(callback: () => void): void;

    login(callback: (success: boolean) => void): void;

    open(page: OMAppPage_Instance, parameters?: Object): void;

    navigation: OMAppNavigation;

    currentTheme: OMAppTheme_Instance;

    analytics: OMAppAnalytics;

    currentUser: OMAppUser;

	http(request: OMAppHTTPRequest, callback: (success: boolean, result?: Object|string) => void): void;

    alert(message: OMAppAlertMessage, callback: (index: Int) => void): void;

    network: OMAppNetwork;

    debug(configuration?: OMAppDebugConfiguration): void;
}
declare var omApp: OMApp;


