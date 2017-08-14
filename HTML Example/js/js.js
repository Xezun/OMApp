// require OMApp.js

window.onerror = function(message, url, line) { 
	console.log('Error: ' + message + "\nURL: " + url + "\nLine: " + line); 
}

// 调试模式下，设置配置。
omApp.debug({
    currentTheme: OMAppTheme.night,
    currentUser: {
        id: "09",
        name: "John",
        type: OMAppUserType.facebook,
        coin: 1000,
        token: "Test"
    },
    network: {
        type: OMAppNetworkType.unknown,
        ajaxSettings: {
            headers: {
                "Access-Token": "OMApp",
                "User-Token": "Onemena"
            },
            data: { }
        }
    },
    navigation: {
        bar: {
            title: "Onemena",
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

    $(document).ready(function () {

		$("input[name='login']").click(function () {
			omApp.login(function (success) {
				console.log("Login result: " + success);
			});
        });

        $("input[name='open']").click(function () {
            omApp.open(OMAppPage.task, {id: "0"});
        });

        $("input[name='push']").click(function () {
            omApp.navigation.push("http://www.baidu.com", true);
        });

        $("input[name='pop']").click(function () {
            omApp.navigation.pop(true);
        });

        $("input[name='popTo']").click(function () {
            omApp.navigation.popTo(0, false);
        });

        $("input[name='bar.title']").click(function () {
            omApp.navigation.bar.title = "New Title";
        });

        $("input[name='bar.titleColor']").click(function () {
            omApp.navigation.bar.titleColor = "#FF0000";
        });

        $("input[name='bar.backgroundColor']").click(function () {
            omApp.navigation.bar.backgroundColor = "#CCCCCC";
        });

        $("input[name='bar.isHidden']").click(function () {
        	omApp.navigation.bar.isHidden = false;
        });

        $("input[name='theme']").click(function () {
            omApp.currentTheme = OMAppTheme.night;
            console.log(omApp.currentTheme);
        });

        $("input[name='analytics']").click(function () {
            omApp.analytics.track("click", {id: "123"});
        });

        $("input[name='user']").click(function () {
            console.log("currentUser.id:" + omApp.currentUser.id);
            console.log("currentUser.name:" + omApp.currentUser.name);
            console.log("currentUser.coin:" + omApp.currentUser.coin);
            console.log("currentUser.type:" + omApp.currentUser.type);
            console.log("currentUser.token:" + omApp.currentUser.token);
        });

        $("input[name='http']").click(function () {
            omApp.http({
				url: "http://1.dev.wekoora.com/ar_AE/api/get_live_game?live_game_id=51&time_zone=GMT%2B8",
				method: "GET"
			}, function (success, result) {
				console.log(result);
			});
        });

        $("input[name='alert']").click(function () {
        	omApp.alert({
				title: "你好",
				body: "请点击任意按钮！",
				actions: ["确定", "取消"]
			}, function (index) {
				console.log("alert at:" + index);
            });
        });

        $("input[name='network']").click(function () {
            console.log("network.isViaWiFi:" + omApp.network.isViaWiFi);
            console.log("network.isReachable:" + omApp.network.isReachable);
            console.log("network.type:" + omApp.network.type);
        });
	});

});