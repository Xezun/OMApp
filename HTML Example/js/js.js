// require OMApp.js

window.onerror = function(message, url, line) { 
	console.log('Error: ' + message + "\nURL: " + url + "\nLine: " + line); 
}

omApp.debug({
	currentTheme: OMAppTheme.day,
	currentUser: {
		id: "123",
		name: "John",
		type: OMAppUserType.google,
		coin: 100,
		token: "Test"
	},
	network: OMAppNetworkType.unknown,
	http: {
		headers: {
			"Access-Token": "OMApp",
			"User-Token": "Test"
		},
		data: {
			"user_token": "Test"
		}
	},
	navigation: {
		bar: {
			title: "Test",
			titleColor: "#FFFFFF",
			backgroundColor: "#000000",
			isHidden: false
		}
	}
});

omApp.ready(function() {

	console.log("The nav bar old title is " + omApp.navigation.bar.title);
	omApp.navigation.bar.title              = "OMApp Example";
    omApp.navigation.bar.titleColor         = "#000000";
    omApp.navigation.bar.backgroundColor    = "#FFFFFF";

    omApp.login(function (success) {

    });


    $(document).ready(function () {

    });

    omApp.open(OMAppPage.mall);
    omApp.navigation.push("http://www.baidu.com", false);

    omApp.navigation.pop(true);
    omApp.navigation.popTo(0, false);

    console.log(omApp.currentTheme);
    omApp.currentTheme = OMAppTheme.day;

    omApp.analytics.track("read");

    console.log(omApp.currentUser.name);


    omApp.http({url: ""}, function (success, result) {

    });

    omApp.alert({
        "title": "",
        "body": ""
    },function (index) {

    });

    console.log(omApp.network.isReachable);
    console.log(omApp.network.type);
});