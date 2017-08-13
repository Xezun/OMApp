// Type definitions for mlibai-OMApp 2.0.1

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

// module 定义模块。
module omApp {

    function ready(callback: () => void): void;

    function login(callback: (success: boolean) => void): void;

	interface PageOptions {
		id: string;
	}
    function open(page: OMAppPage_Instance, parameters?: PageOptions): void;

    module navigation {
        function push(url: string, animated?: boolean): void;
        function pop(animated?: boolean): void;
        function popTo(index: int, animated?: boolean): void;
        module Bar {
            isHidden: boolean;
            title: string;
            titleColor: string;
            backgroundColor: string;
        }
    }

    var currentTheme: OMAppTheme_Instance;

    module analytics {
		function track(event: string, parameters?: Object): void;
	}

    interface User {
		isOnline: boolean;
		id: string;
		name: string;
		type: OMAppUserType_Instance;
		coin: string;
	}
    var	currentUser: User;

    interface HTTPRequest {
		url: string;
		method?: string;
		data?: Object;
		headers?: Object;
	}
	function http(request: HTTPRequest, callback: (success: boolean, result?: Object|string) => void): void;

    interface AlertMessage {
    	title: string;
    	body: string;
    	actions: array;
    }
    function alert(message: AlertMessage, callback: (index: Int) => void): void;

    interface Network {
    	isReachable: boolean;
    	isViaWiFi: boolean;
    	type: OMAppNetworkType_Instance;
    }
    var network: Network;

    interface DebugConfiguration {
    	currentTheme?: OMAppTheme_Instance;
		currentUser?: Object;
		network?: Object;
        http?: Object;
		navigation?: Object;
    }
    function debug(configuration?: DebugConfiguration): void;
}
