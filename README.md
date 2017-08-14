# Onemena App／HTML 交互协议

## 目录

[TOC] 


## 说明
本协议，规范 App 内 HTML 页面与 App 的交互方式，提高开发效率，降低维护成本。

## 基本规范
1. 通过 URL 参数传递数据时，使用 *Key-Value* 形式，如果 Value 不是基本数据类型，则用 `URL 编码后的 JSON 串` 表示。 
2. 所有标注为只读的属性，请在业务逻辑中，不要去修改这些值。它们虽然可能可写，但只是供 App 初始化值时使用。
3. 只读的属性，即使修改其值，也不会影响 App 里的内容。

***
## 第一部分：HTML 访问 App
HTML 页面通过 App 提供 JavaScript 接口，来实现对 App 功能的访问。

### 1. 浏览器环境
- HTML 若要判断是否处于 App 提供的浏览器环境中，可以通过 `User-Agent` 判断。
    ```
    // 无特殊说明，所有代码均为 JavaScript 代码。
    // 判断是否在 App 中。
    var isApp = /Onemena/.test(window.navigator.userAgent);
    ```
- 交互说明：
    - App 须在初始化 WebView 时修改 `User-Agent` 。

### 2. 接口获取方式
- App 提供的接口统一定义在 `omApp` 对象上，所有 HTML 与 App 的交互都通过此对象进行。
    ```
    // 打印 App 提供的 JavaScript 接口
    console.log(omApp); 
    // 或者
    console.log(window.omApp);
    ```
- 在不同的环境下，`omApp` 可能并不是相同的对象，因此除本文档提供的方法、属性外，不要对 `omApp` 的其它属性或方法产生依赖。
- 交互说明：
    - 基于对象注入的方式，须在 WebView 创建 JavaScript 环境时注入 `omApp` 对象。
    - 需保证 `omApp` 对象在使用前已初始化完成。


### 3. 开发调试 
- 引入 `OMApp.js` 交互框架，文件在 OMApp 目录下；
- 在桌面浏览器中开发调试；
- 在 App 中开发调试；
- 请尽量保持 `OMApp.js` 为最新版本。

### 4. 接口列表

#### 4.0 ready(*callback*) 
    2017-07-27： 新增接口。

- 接口说明：
    为了保证 `omApp` 对象在使用时已完成初始化，请将所有用到 `omApp` 方法或属性的代码，放在此方法中进行。该方法可以调用多次，且所有代码会在初始化完成时，按次序执行。

- 参数说明：

    | **Name**       | **Type**    | **Description** |
    | :------------- | :---------- | :-------------- |
    | callback       | Function    | 回调函数，无参数 |

- 代码示例：
    - 常规用法。
    ``` 
    // 本方法类似但不能替代 JQuery.ready 方法。
    // 在基于URL拦截的交互方式中，该方法监听的是 DOMContentLoaded 事件，与 JQuery 一样。
    // 在基于对象注入的交互方式中，调用该方法时，回调可能被立即执行。
    omApp.ready(function() {
        // 基于 omApp 对象的业务逻辑代码。比如：获取 App 的主题设置。
        console.log(omApp.currentTheme);
    });
    ```
    - 与第三方框架一起使用。
    ```
    // 因为基于 omApp 的业务逻辑需要在 ready 方法中执行，
    // 但是往往第三方框架有自己的执行机制，所以需要设置第三方框架延迟执行。
    // 例如 angular 的延迟执行步骤如下：

    // 1. 删除 HTML 标签中的 `ng-app` 属性，因为添加了该属性 angular 在加载时就会自动执行。

    // 2. 定义 angular 模块。
    var moduleName = angular.module('moduleName', []); 
    // more settings such as `moduleName.controller`, `moduleName.directive`

    // 3. 在 omApp.ready 中启动模块。
    omApp.ready(function () {
        // 为了兼容性，建议在 angular 的 ready 中启动模块。
        angular.element(document).ready(function() {
            // 第一个参数表示 angular 的根 DOM 元素。
            // 第二个参数就是`步骤2`中定义的模块名字。
            // `步骤2`模块的定义也可以放在这里进行，也就是在调用 bootstrap 方法前，模块必须被定义。
            angular.bootstrap(document, ['moduleName']);
        });
    });
    ```
    
- 交互说明：
    - 基于 URL 的交互方式， `omApp` 对象的初始化，请在监听到此事件时进行。
    - 需初始化的属性，详见各接口。
    - 交互协议：
        - URL： `app://documentisready`
        - 回调： `omApp.didFinishLoading()`


#### 4.1 login(*callback*)

- 接口说明：

    当 HTML 页面需要调用 App 的 `登录` 功能时，调用此接口。

- 参数说明：

    | **Name**       | **Type**    | **Description** |
    | :------------- | :---------- | :-------------- |
    | callback       | Function    | 可选。登录回调函数，用户返回登录结果 |

    - callback 函数参数：
    
    | **Name**       | **Type**    | **Description** |
    | :------------- | :---------- | :-------------- |
    | success        | Bool        | 是否登录成功。 |

    <font size=2>* 请通过 [omApp.currentUser](#currentUser) 来获取当前已登录用户信息。</font>


- 代码示例：

    ``` 
    // 调起 App 的登录流程
    omApp.login(function(success) {
        if (success) {
            // do suceess actions.
        } else {
            // do something when failed.
        }
    });
    ```

- 基于 URL 的交互方式：
    
    - URL： `app://login/?callbackID=...`

    - 回调： `omApp.didFinishLogin(callbackID, success)`

        | Name         | Type   | Description |
        | :----------- | :----- | :--------- |
        | callbackID   | String | url 中的 callbackID |
        | success      | Bool   | 登录是否成功 |


#### 4.2 open(*page*, *parameters*) [暂未启用]

- 接口说明：

    当 HTML 页面需要跳转到 App 其它界面时，调用此接口。

- 参数说明：

    | **Name**       | **Type**    | **Description** |
    | :------------- | :---------- | :-------------- |
    | page           | OMAppPage   | 必选。见 [OMAppPage枚举](#OMAppPage)  |
    | parameters     | Object      | 可选。见 [OMAppPage枚举](#OMAppPage) |

- <a name="OMAppPage">***OMAppPage*枚举**</a>

    1. 新闻列表：*OMAppPage.**newsList***

        | Name | Type   | Description | 
        | :--- | :----- | :-------------- |
        | id   | String | 新闻栏目 ID |
 
    2. 新闻详情：*OMAppPage.**newsDetail***
  
        | Name           | Type        | Description | 
        | :------------- | :---------- | :-------------- |
        | id             | String      | 新闻 ID |
 
    3. 视频列表：*OMAppPage.**videoList***
  
        | Name    | Type        | Description | 
        | :------ | :---------- | :-------------- |
        | id      | String      | 视频栏目 ID |
 
    4. 视频详情：*OMAppPage.**videoDetail***
  
        | Name           | Type         | Description | 
        | :------------- | :----------  | :-------------- |
        | id             | String       | 视频 ID |
 
    5. 金币商城：*OMAppPage.**mall***
 
    6. 金币任务：*OMAppPage.**task***

- 代码示例：

    ```
    // 打开金币商城页
    omApp.open(OMAppPage.mall); 
    // 打开金币任务页
    omApp.open(OMAppPage.task); 
    ```

- 基于 URL 的交互方式：
    
    - URL： `app://open/?page=...`


#### 4.3 navigation

- 接口说明：

    Object，只读，非空。
    为了使 HTML 提供类似原生 App 的操作体验，`navigation` 接口给 HTML 提供了创建新窗口的能，并通过 `导航栈` 来管理这一系列窗口。

##### 4.3.1 navigation.push(*url*, *animated*)

- 接口说明：

    创建一个新窗口并打开指定 URL，常用于导航到下级页面。新窗口将压入到导航栈顶。

- 参数说明：

    | **Name**       | **Type**    | **Description** |
    | :------------- | :---------- | :-------------- |
    | url            | String      | 必选。下级页面的 URL   |
    | animated       | Bool        | 可选。是否展示转场动画，默认 true   |

- 代码示例：

    ```
    omApp.navigation.push('http://8.dev.arabsada.com/'); 
    omApp.navigation.push('http://8.dev.arabsada.com/', true); 
    ```

- 基于 URL 的交互方式：
    
    - URL： `app://navigation.push/?url=...&animated=...`
    

##### 4.3.2 navigation.pop(*animated*)

- 接口说明：

    关闭当前窗口，并返回到上一个窗口，常用于返回到上级页面。当前窗口从导航栈中弹出。

- 参数说明：

    | **Name**       | **Type**    | **Description** |
    | :------------- | :---------- | :-------------- |
    | animated       | Bool        | 可选。是否展示转场动画，默认 true   |

- 代码示例：

    ```
    omApp.navigation.pop(true); 
    ```

- 基于 URL 的交互方式：
    
    - URL：`app://navigation.pop/?animated=...`


##### 4.3.3 navigation.popTo(*index*, *animated*)

- 接口说明：

    返回到导航栈内指定级页面。如果当前导航栈内已经有很多页面，此方法可以快速回到指定页面。

- 参数说明：

    | **Name**       | **Type**    | **Description** |
    | :------------- | :---------- | :-------------- |
    | index          | Int         | 必选。正数，目的页面所在的位置索引，0 为第一个 HTML 页面 |
    | animated       | Bool        | 可选。是否展示转场动画，默认 true   |

- 代码示例：

    ```
    omApp.navigation.popTo(0, true);
    ```

- 基于 URL 的交互方式：
    
    - URL：`app://navigation.popto/?index=...&animated=...`


##### 4.3.4 navigation.bar

- 接口说明：

    只读，Object。代表了 App 的原生导航条对象。通过此对象，可以控制导航条的外观。

- 属性说明：

    | **Name**        | **Type**    | **Description** |
    | :-------------- | :---------- | :-------------- |
    | isHidden        | Bool        | 导航条是否隐藏    |
    | title           | String      | 标题            |
    | titleColor      | String      | 标题颜色         |
    | backgroundColor | String      | 背景色           |

- 代码示例：

    ```
    omApp.navigation.bar.isHidden = false;
    omApp.navigation.bar.title = '自定义的标题';
    omApp.navigation.bar.titleColor = '#FF0000';
    omApp.navigation.bar.backgroundColor = '#0000FF';
    ```

- 交互说明：
    
    - 基于 URL 的交互方式 App 需在 ready 方法中初始化 bar 各属性的初始值。 
    - 交互协议：
        - URL：`app://navigation.bar/?isHidden=...&title=...&titleColor=...`


#### 4.4 currentTheme

    变更日志：
    2017-06-17： `theme` -> `currentTheme` 

- 接口说明：

    此接口用于获取或设置 App 当前的主题外观，String 类型。

- 属性说明：

    非空，可写，[OMAppTheme](#OMAppTheme) 枚举值。
    
- <a name="OMAppTheme">***OMAppTheme*枚举**</a>

    | Name                   | Type     | Description | 
    | :--------------------- | :------- | :---------- |
    | *OMAppTheme.**day***   | String   | 新闻栏目 ID   |
    | *OMAppTheme.**night*** | String   | 新闻栏目 ID   |

- 代码示例：

    ```
    if (omApp.currentTheme == OMAppTheme.day) {
        // do something when the theme is day.
    } else if (omApp.currentTheme == OMAppTheme.night) {
        // do something when the theme is night.
    }
    ```

- 交互说明：

    - 基于 URL 的交互方式，需在 ready 中初始化此属性。
    - 交互协议：
        - URL：`app://currenttheme/?name=...`


#### 4.5 analytics 

- 接口说明：

    App 统计分析模块。

##### 4.5.1 analytics.track(*event*, *parameters*)

- 接口说明：

    记录一条用户行为。

- 参数说明：

    | **Name**     | **Type**    | **Description** |
    | :----------- | :---------- | :-------------- |
    | event        | String      | 必选，非空。统计名称 |
    | parameters   | Object      | 可选。额外参数 *Key-Value* 为基本数据类型 |

- 代码示例：

    ```
    // 例如：统计 click 。
    omApp.analytics.track("click");
    // 例如：统计 read 。
    omApp.analytics.track("read", {"id": "2", "type": "news"});
    ```

- 交互说明：

    - URL： `app://analytics.track/?event=...&parameters={...}`


#### 4.6 <a name="currentUser">currentUser</a>

- 接口说明：

    只读，非空，Object 类型。当 HTML 需要获取 App 当前用户信息时，调用此接口。例如，判断用户是否登录可通过 `isOnline` 属性来确定。

- 属性说明：
    
    | **Name**        | **Type**    | **Description** |
    | :-------------- | :---------- | :-------------- |
    | isOnline        | Bool        | 只读。是否已登录        |
    | id              | String      | 只读。用户ID           |
    | name            | String      | 只读。用户名           |
    | type            | String      | 只读。见 [OMAppUserType枚举](#OMAppUserType)    |
    | coin            | Int         | 只读。用户金币数        |
    | token           | String      | 只读。user token        |

    <font size=2>* 说明： token 字段对外并不是一个好的 API 设计，未来优化的版本中将去掉此值。</font>

- <a name="OMAppUserType">***OMAppUserType*枚举**</a>

    | **Name**                       | **Type**    | **Description** |
    | :----------------------------- | :---------- | :-------------- |
    | *OMAppUserType.**visitor***       | String      | 游客用户          |
    | *OMAppUserType.**google***        | String      | Google 登录用户   |
    | *OMAppUserType.**facebook***      | String      | Facebook 登录用户  |
    | *OMAppUserType.**twitter***       | String      | Twitter 登录用户  |

- 代码示例：

    ```
    // 判断用户是否登录
    if (omApp.currentUser.isOnline) {
        // do something when user is logged.
    } else {
        // do something
    }
    // get the user name
    var userName = omApp.currentUser.name;
    ```

- 交互说明：

    - 基于 URL 的交互方式，需在 ready 方法中初始化 currentUser 的各个属性。
    - currentUser 属性声明为只读，表示在业务逻辑中，不要去修改它，但是它们实际上是可修改的。
    - 因此在 ready 事件中，直接调用 JS 修改各属性值即可。


#### 4.7 http(*request*, *callback*)

- 接口说明：

    在业务逻辑设计上，HTML 只负责静态展示内容，不需要处理用户状态。但是如果 HTML  页面需要发送一个包括用户状态的请求的时候，可以通过此接口实现。HTML 通过此接口将要请求的网络接口、参数告诉 App，由 App 负责请求，并把结果回调给 HTML。

- 参数说明：

    | **Name**       | **Type**    | **Description** |
    | :------------- | :---------- | :-------------- |
    | request        | Object      | 必选。网络请求         |
    | callback       | Function    | 可选。网络请求的回调    |

    - requestObject 对象属性：
    
    | **Name**       | **Type**    | **Description** |
    | :------------- | :---------- | :-------------- |
    | url            | String      | 必选。url             |
    | method         | String      | 必选。值必须是 GET/POST，区分大小写 |
    | data           | Object      | 可选。网络请求参数     |
    | headers        | Object      | 可选。网络请求的header  |
    
    <font size="2">
    * 字段变更：
    * 2017-06-29： params -> data，目前 SDK 对此改变保持兼容。
    </font>

    - callback 函数参数：
    
    | **Name**       | **Type**    | **Description** |
    | :------------- | :---------- | :-------------- |
    | success        | Bool        | 网络请求是否成功   |
    | result         | Any         | 网络请求返回的数据（如果有） |

    <font size="2" color="gray">*如果请求结果是 JSON 数据，则 result 是解析后的 JSON 对象，否则 result 将是一个 String 。*</font>
    
- 代码示例：

    ```
    var request = {
        url: "http://api.onemena.com/",
        method: "GET",
        params: {"name": "John"}
    };
    omApp.http(request, function(success, result) {
        if (!success) {
            // do something when failed.
            return;
        }
        // do suceess actions.
    });
    ```

- 基于 URL 的交互方式：
    
    - URL： `app://http/?callbackID=...&request={url: ..., method: ...}`

    - 回调： `omApp.didFinishHTTPRequest(callbackID, success, result, contentType)`

        | Name        | Type    | Description |
        | :---------- | :------ | :------------------ |
        | callbackID  | String  | url 中的 callbackID    |
        | success     | Bool    | http 请求是否成功     |
        | result      | String  | URL 编码后的 HTTP 请求结果     |
        | contentType | String  | result 的数据类型，决定数据是否需要解析 |

    - 代码示例：

        ```
        // 1. 为了避免 JavaScript 语法错误，建议先对字符串进行 URL 编码。
        // 2. 对于 JSON 数据，应该返回对象数据。

        // JavaScript URL 解码函数：
        // var string = decodeURIComponent(aString);
        // JavaScript JSON 解析函数：
        // var object = JSON.parse(aString);
        // JavaScript URL 编码函数：
        // var encodedString = encodeURIComponent(aString);
        
        // 返回 String 数据的 JS 代码：
        omApp.didFinishHTTPRequest(callbackID, true, 'anEncodedString');
        // 返回 Object 数据的 JS 代码：
        omApp.didFinishHTTPRequest(callbackID, true, 'anEncodedString', 'application/json');
        ```


#### 4.8 alert(*message*, *callback*)

- 接口说明：

    当 HTML 需要展示一个 alert 的时候。

- 参数说明：

    | **Name**       | **Type**    | **Description** |
    | :------------- | :---------- | :-------------- |
    | message        | Object      | 必选。消息内容     | 
    | callback       | Function    | 可选。回调       |

    - message 对象属性：
    
    | **Name**       | **Type**      | **Description** |
    | :------------- | :------------ | :-------------- |
    | title          | String        | 必选。标题 |
    | body           | String        | 必选。内容 |
    | actions        | Array<String> | 可选。按钮标题，默认确定按钮 |

    - callback 函数参数：
    
    | **Name**       | **Type**    | **Description** |
    | :------------- | :---------- | :-------------- |
    | index          | Int         | 当按钮被点击了，被点击的索引 |


- 代码示例：

    ```
    omApp.alert({
        title: "alert 标题",
        body: "alert 文字内容",
        actions: new Array("确定", "取消")
    }, function(index) {
        if (index == 0) {
            // 点击了 确定 按钮
        } else {
            // 点击了 取消 按钮
        }
    });
    ```

- 基于 URL 的交互方式：
    
    - URL： `app://alert/?callbackID=...&message={title: ..., body: ...}`

    - 回调： `omApp.didSelectAlertActionAtIndex(callbackID, index)`

        | Name        | Type    | Description |
        | :---------- | :------ | :------------------ |
        | callbackID  | String  | url 中的 callbackID    |
        | index       | Int     | 点击按钮的次序     |

    - 代码示例：

        ```
        // 点击了第 0 个按钮
        omApp.didSelectAlertActionAtIndex(callbackID, 0);
        ```


#### 4.9 network

- 接口说明：

    只读，非空，Object 类型。判断是否可联网 `isReachable` 属性来确定。

- 属性说明：
    
    | **Name**        | **Type**        | **Description** |
    | :-------------- | :-------------- | :-------------- |
    | isReachable     | Bool            | 只读。是否能联网。  |
    | isViaWiFi       | Bool            | 只读。是否是 WiFi 。  |
    | type            | OMAppNetworkType   | 只读。见 [OMAppNetworkType枚举](#OMAppNetworkType)  |


- <a name="OMAppNetworkType">***OMAppNetworkType*枚举**</a>

    | **Name**                       | **Type**    | **Description** |
    | :----------------------------- | :---------- | :-------------- |
    | *OMAppNetworkType.**none***    | String      | 无网络           |
    | *OMAppNetworkType.**WiFi***    | String      | WiFi            |
    | *OMAppNetworkType.WWan**2G***  | String      | 蜂窝网 2G        |
    | *OMAppNetworkType.WWan**3G***  | String      | 蜂窝网 3G        |
    | *OMAppNetworkType.WWan**4G***  | String      | 蜂窝网 4G      |
    | *OMAppNetworkType.**unknown*** | String      | 未知的联网方式  |


- 代码示例：

    ```
    // 判断是否联网
    if (omApp.network.isReachable) {
        // 已联网
    } else {
        // 未联网
    }
    // 判断是否 WiFi
    if (omApp.network.isViaWiFi) {
        // 正通过 Wi-Fi 上网
    }
    // 显示网络类型
    document.getElementById("app_network_type").innerHTML = omApp.network.type;
    ```

- 交互说明：
    
    - App 需在 ready 消息中初始化 `omApp.network.type` 的值。
    - 后期考虑加入网络变化 `change` 事件，暂不支持。


***

## 第二部分：HTML 开发调试

交互框架 `OMApp.js` 为桌面浏览器模拟了 `omApp` 对象的一些基本的功能和交互方式。

### 1. 如何在桌面浏览器中测试某个页面已登陆后的情况？

omApp 提供的 http 方法，在浏览器中，默认没有附带用户登录状态信息（user_token) ，所以获取不到已登陆后用户的数据。在这种情况下，可以在浏览器地址栏的 URL 后拼接用户真实 user_token 参数，再次加载页面即可。

### 2. 如何在桌面浏览器中设置 omApp 的初始属性？

可通过 omApp.debug() 函数，在调用 ready 函数之前，设置 omApp 的配置信息。omApp.debug 函数只在浏览器环境中才会生效。
```
// 设置调试信息。
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
```

### 3. omApp 在 IDE 中的自动补全功能。

目前支持在 WebStorm 中自动补全和语法检查，将 OMApp/OMApp.d.ts 文件添加到 WebStorm > Language & Frameworks > JavaScript > Libraries 中即可。


***

## 第三部分：`omApp` 基于 URL 交互方式的实现

### 基本规则

- App 通过拦截特定 URL 协议的请求，通过解析 URL 来判断 HTML 要执行的操作。
- URL 方式无法实现带返回值的函数，只能通过回调来实现。



### 基本环境

App 需设置 WebView 的 `User-Agent`，格式：

    `原UserAgent` + `空格` + `Onemena/` + `App发行版本号`

<font size=2>* 例： Mozilla/5.0 (iPad; CPU OS 6_0 like Mac OS X) ... Safari/8536.25 <font color=red>Onemena/1.0.1</font></font>

### URL 结构

    基本形式：app://method.name/?param1=...&param2=...

    - 协议名：`app`，App 通过拦截此协议名的 URL 来区分普通请求与交互请求。
    - 方法：URL 的 host 部分表示 HTML 要调用 App 的方法名。
    - 参数：URL 的 query 部分表示方法所需的参数。
        - 参数值为基本数据类型。
        - 参数值为 Object 时，为 URL 编码后的 JSON 字符串。

### 回调函数的处理

- 在有回调方法中，URL 协议会将回调函数ID，通过 `callbackID` 字段传递给 App 。
- 原生在执行任务后，通过调用相应 JS 的方法（大部分为 omApp.didFinish**）触发回调函数。

### omApp 初始值

- 拦截 HTML 页面加载 OMApp.js 文件。
- 加载 App 内置 OMApp.js 文件，并在文件末尾添加设置初值的代码。




