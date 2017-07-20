# App/HTML 交互协议

## 目录
[TOC] 



## 说明

为了规范并统一 HTML 与原生的交互方式，提高开发效率，降低维护成本，特制定本协议。

- 规定的 HTML 访问 App 的接口协议和 App 访问 HTML 的接口协议。
- 本协议规定了一套接口，但是不限制使用何种机制实现 App/HTML 交互。

## 环境

- App 提供的 `浏览器（WebView）` 环境，通过特殊的 `UserAgent` 来标识：

        `原UserAgent` + `空格` + `Onemena/` + `App发行版本号`
     
    <font size=2>* 例： Mozilla/5.0 (iPad; CPU OS 6_0 like Mac OS X) ... Safari/8536.25 <font color=red>Onemena/1.0.1</font></font>

    ```
    // 判断是否在 App 中
    var isApp = /Onemena/.test(window.navigator.userAgent)
    ```


## 基本规范

1. 通过 URL 参数传递数据时，使用 *Key-Value* 形式，如果 Value 不是基本数据类型，则用 `URL 编码后的 JSON 串` 表示。 


***
## 第一部分：HTML 访问 App 

    为了使 HTML 页面能访问 App 内容，App 在 `WebView` 中不仅要标注特殊的 User Agent ，而且要在 HTML 的 JavaScript 环境中注入相应的访问接口。

### 接口名称

    `omApp`


### 调用方式

    `omApp` 或 `window.omApp`


### 方法列表

#### 1. login(*callback*)

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
    // 如非特殊声明，所有示例代码均为 JavaScript
    omApp.login(function(success) {
        if (success) {
            // do suceess actions.
        } else {
            // do something when failed.
        }
    });
    ```

- 基于 URL 的交互方式:
    
    - URL： `app://login/?callbackID=...`

    - 回调： `omApp.didFinishLogin(callbackID, success)`

        | Name         | Type   | Description |
        | :----------- | :----- | :--------- |
        | callbackID   | String | url 中的 callbackID |
        | success      | Bool   | 登录是否成功 |


#### 2. open(*page*, *parameters*) [暂未启用]

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

- 基于 URL 的交互方式:
    
    - URL： `app://open/?page=...`


#### 3. navigation

    为了使 HTML 提供类似原生 App 的操作体验，`navigation` 接口给 HTML 提供了创建新窗口的能，并通过 `导航栈` 来管理这一系列窗口。

##### 3.1 navigation.push(*url*, *animated*)

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

- 基于 URL 的交互方式:
    
    - URL： `app://navigation.push/?url=...&animated=...`
    

##### 3.2 navigation.pop(*animated*)

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

- 基于 URL 的交互方式:
    
    - URL：`app://navigation.pop/?animated=...`


##### 3.3 navigation.popTo(*index*, *animated*)

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

- 基于 URL 的交互方式:
    
    - URL：`app://navigation.popto/?index=...&animated=...`


##### 3.4 navigation.bar

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

- 基于 URL 的交互方式:
    
    - URL：`app://navigation.bar/?isHidden=...&title=...&titleColor=...`


#### 4. currentTheme

    变更日志：
    2017-06-17: `theme` -> `currentTheme` 

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

- 基于 URL 的交互方式:
    
    - URL：`app://currenttheme/?name=...`


#### 5. statistic(*type*, *parameters*) [暂未启用]

- 接口说明：

    用户行为统计，埋点。

- 参数说明：

    | **Name**  | **Type**        | **Description** |
    | :-------- | :-------------- | :-------------- |
    | type      | OMStatisticType | 见 [OMStatisticType枚举](#OMStatisticType)  |
    | parameters | Object         | 见 [OMStatisticType枚举](#OMStatisticType)  |

- <a name="OMStatisticType">***OMStatisticType*枚举**</a>

    1. 跳转金币商城：*OMStatisticType.**openMall***

        | Name | Type | Description | 
        | :------------- | :---------- | :-------------- |
        | type | String | 根据需求文档，从金币任务内容页跳转到金币商城值为 2 |

    2. 跳转金币任务：*OMStatisticType.**openTask***
  
        | Name | Type | Description | 
        | :------------- | :---------- | :-------------- |
        | type | String | 根据需求文档，从金币商城内容页跳转到金币任务值为 3 |


- 代码示例：

    ```
    omApp.statistic(OMStatisticType.openMall, {"type": 2});
    omApp.statistic(OMStatisticType.openMall, {"type": 3});
    ```


#### 6. <a name="currentUser">currentUser</a>

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


#### 7. http(*request*, *callback*)

- 接口说明：

    当 HTML 页面发送一个请求，需要携带用户身份信息的时候，使用此接口。出于安全等因素，HTML 页面不负责、保持用户状态，相关逻辑由 App 实现，HTML 直接使用结果。

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
    * 2017-06-29: params -> data，目前 SDK 对此改变保持兼容。
    </font>

    - callback 函数参数：
    
    | **Name**       | **Type**    | **Description** |
    | :------------- | :---------- | :-------------- |
    | success        | Bool        | 网络请求是否成功   |
    | result         | Any         | 网络请求返回的数据（如果有） |


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

- 基于 URL 的交互方式:
    
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


#### 8. alert(*message*, *callback*)

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

- 基于 URL 的交互方式:
    
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




***

## 第二部分：App 访问 HTML

    HTML 提供 Javascript 接口实现，App 通过调用该接口实现对 HTML 的访问。

### 接口名称

    `omHTML`

### 调用方式

    `omHTML` 或 `window.omHTML`

### 方法列表

#### 1. ...

- 接口说明：
    ***

- 参数说明：

    | **Name**       | **Type**    | **Description** |
    | :------------- | :---------- | :-------------- |
    |        |     |  |


- 代码示例：

    ```

    ```





***

## 第三部分：`omApp` 基于 URL 交互方式的实现

    通过注入 `OMApp.js` 文件，为 HTML 页面提供与原生的交互环境。

### 1. 基本规则

#### 1.1 URL结构

- 基本形式：app://method.name/?param1=...&param2=...
- 协议名：`app`，App 通过拦截此协议名的 URL 来区分普通请求与交互请求。
- 方法：URL 的 host 部分表示 HTML 要调用 App 的方法名。
- 参数：URL 的 query 部分表示方法所需的参数。
    - 参数值为基本数据类型。
    - 参数值为 Object 时，为 URL 编码后的 JSON 字符串。

#### 1.2 回调函数的处理

- 在有回调方法中，URL 协议会将回调函数（函数ID），通过 `callbackID` 字段传递给原生。
- 原生在执行任务后，通过调用 JS 的 omApp.didFinish** 等方法执行回调。



