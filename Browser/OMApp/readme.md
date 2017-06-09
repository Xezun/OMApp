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
     

    <font size=2>* 例： Mozilla/5.0 (iPad; CPU OS 6_0 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) Version/6.0 Mobile/10A403 Safari/8536.25 <font color=red>Onemena/1.0.1</font></font>





***
## 第一部分：HTML 访问 App 

    App 通过向 HTML 注册 Javascript 接口来实现 HTML 内容对 App 功能的访问。

### 接口名称
    
    `omApp`

### 调用方式
    
    `omApp` 或 `window.omApp`

### 方法列表

#### 1. login(*callback*)

- 接口说明：
    当 HTML 页面需要调用原生的登录界面时，调用此接口。

- 参数说明：

    | **Name**       | **Type**    | **Description** |
    | :------------- | :---------- | :-------------- |
    | callback       | Function    | 登录回调函数，用户返回登录结果 |

    - callback 函数参数：
    
    | **Name**       | **Type**    | **Description** |
    | :------------- | :---------- | :-------------- |
    | resultObject   | Object      | 登录信息，如果为空, 表示登录失败 |

- 代码示例：

    ``` javascript
    // 如非特殊声明，所有示例代码均为 Javascript
    omApp.login(function(resultObject) {
        if (resultObject) {
            // do suceess actions.
        } else {
            // do something when failed.
        }
    });
    ```

#### 2. open(*page*, *id*, ...)

- 接口说明：
    当 HTML 页面需要跳转到其它（原生）界面时，调用此接口。

- 参数说明：

    | **Name**       | **Type**    | **Description** |
    | :------------- | :---------- | :-------------- |
    | page           | OMAppPage   | 见 [OMAppPage枚举](#OMAppPage)  |
    | id             | String      | 见 [OMAppPage枚举](#OMAppPage) |
    | ...            | Any         | 未来可能增加的参数，见 [OMAppPage枚举](#OMAppPage) |

- <a name="OMAppPage">***OMAppPage*枚举**</a>

    1. 新闻列表：*OMAppPage.**newsList***

        | Name | Type | Description | 
        | :------------- | :---------- | :-------------- |
        | id | String | 新闻栏目 ID |
 
    2. 新闻详情：*OMAppPage.**newsDetail***
  
        | Name | Type | Description | 
        | :------------- | :---------- | :-------------- |
        | id | String | 新闻 ID |
 
    3. 视频列表：*OMAppPage.**videoList***
  
        | Name | Type | Description | 
        | :------------- | :---------- | :-------------- |
        | id | String | 视频栏目 ID |
 
    4. 视频详情：*OMAppPage.**videoDetail***
  
        | Name | Type | Description | 
        | :------------- | :---------- | :-------------- |
        | id | String | 视频 ID |
 
    5. 金币商城：*OMAppPage.**mall***
 
    6. 金币任务：*OMAppPage.**task***



- 代码示例：

    ``` javascript
    // 打开金币商城页
    omApp.open(OMAppPage.mall); 
    // 打开金币任务页
    omApp.open(OMAppPage.task); 
    ```

#### 3. navigation

##### 3.1 navigation.push(*url*)

- 接口说明：
    导航到下级页面。

- 参数说明：

    | **Name**       | **Type**    | **Description** |
    | :------------- | :---------- | :-------------- |
    | url            | String      | 下级页面的 URL   |

- 代码示例：

    ``` javascript
    // 支持相对根目录的路径
    omApp.navigation.push('/relative/path/page.html'); 
    // 完整URL
    omApp.navigation.push('http://8.dev.arabsada.com/?userToken'); 
    ```

##### 3.2 navigation.pop()

- 接口说明：
    返回到上级页面。

- 参数说明：

    无

- 代码示例：

    ``` javascript
    omApp.navigation.pop(); 
    ```

##### 3.3 navigation.popTo(*index*)

- 接口说明：
    返回到指定级页面。

- 参数说明：

    | **Name**       | **Type**    | **Description** |
    | :------------- | :---------- | :-------------- |
    | index          | Int         | 目的页面所在的位置索引，0 为第一个 HTML 页面 |

- 代码示例：

    ``` javascript
    omApp.navigation.popTo(0);
    ```

##### 3.4 navigation.bar

- 接口说明：
    导航条对象，控制导航条外观的接口。

- 属性说明：

    | **Name**        | **Type**    | **Description** |
    | :-------------- | :---------- | :-------------- |
    | isHidden        | Bool        | 导航条是否隐藏    |
    | title           | String      | 标题       |
    | titleColor      | String      | 标题颜色       |
    | backgroundColor | String      | 背景色           |
    

- 代码示例：

    ``` javascript
    omApp.navigation.bar.isHidden = false;
    omApp.navigation.bar.title = '自定义的标题';
    omApp.navigation.bar.titleColor = '#FF0000';
    omApp.navigation.bar.backgroundColor = '#0000FF';
    ```

#### 4. theme

- 接口说明：
    App 属性，当前主题名称。

- 属性说明：

    可写，[OMAppTheme](#OMAppTheme) 枚举值。
    
- <a name="OMAppTheme">***OMAppTheme*枚举**</a>

    | Name                   | Type     | Description | 
    | :--------------------- | :------- | :-------------- |
    | *OMAppTheme.**day***   | String   | 新闻栏目 ID |
    | *OMAppTheme.**night*** | String   | 新闻栏目 ID |

- 代码示例：
    ``` javascript
    if (omApp.theme == OMAppTheme.day) {
        // do something when the theme is day.
    } else if (omApp.theme == OMAppTheme.night) {
        // do something when the theme is night.
    }
    ```

#### 5. statistic(*type*, *parameters*)

- 接口说明：
    用户行为统计，埋点。

- 参数说明：

    | **Name**       | **Type**           | **Description**                |
    | :------------- | :----------------- | :----------------------------------------- |
    | type           | OMStatisticType    | 见 [OMStatisticType枚举](#OMStatisticType)  |
    | parameters     | Object             | 见 [OMStatisticType枚举](#OMStatisticType)  |

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
    ``` javascript
    omApp.statistic(OMStatisticType.openMall, {"type": 2});
    omApp.statistic(OMStatisticType.openMall, {"type": 3});
    ```




***
## 第二部分：App 访问 HTML

    HTML 提供 Javascript 接口实现，App 通过调用该接口实现对 HTML 的访问。

### 接口名称
    
    `omHTML`

### 调用方式
    
    `omHTML` 或 `window.omHTML`

### 方法列表

#### 1. ***

- 接口说明：
    ***

- 参数说明：

    | **Name**       | **Type**    | **Description** |
    | :------------- | :---------- | :-------------- |
    | ***       | ***    | *** |


- 代码示例：

    ``` javascript

    ```





***
## 第三部分：`omApp` 基于 URL 交互方式的实现

    金币商城、金币任务一期，安卓、iOS都使用的是基于 URL 的交互方式。

### 1. API 与 URL

| **API**                   | **URL**                                   | **Description** |
| :------------------------ | :---------------------------------------- | :-------------- |
| omApp.login               | app://login/?taskID=...                   |                 |
| omApp.open                | app://open/?page=...&id=...               |                 |
| omApp.navigation.push     | app://push/?url=...                       |                 |
| omApp.navigation.pop      | app://pop/                                |                 |
| omApp.navigation.popTo    | app://popTo/?index=...                    |                 |
| omApp.navigation.bar      | app://navigationBar/?title=..             |                 |
| omApp.theme               | app://theme/?name=...                     |                 |
| omApp.statistic           | app://statistic/?key1=...&key2=...        |                 |

### 2. URL 方式回调的处理
    
#### 2.1 omApp.didFinishLogining(*taskID*, *resultObject*)

- 接口说明：
    通过URL交互方式回调处理函数。

- 参数说明：

    | **Name**       | **Type**    | **Description**        |
    | :------------- | :---------- | :--------------        |
    | taskID         | String      | 调用此次登录的 taskID     |
    | resultObject   | Object      | 登录结果信息             |


- 代码示例：

    ``` swift
    // Swift
    // App 执行 Javascript. 在执行为登录操作后，将登录信息返回给 HTML
    let token = "a user token string." 
    let js = "omApp.didFinishLogining(\"\(taskID)\", {\"userToken\": \(token)})"
    _ = webView.stringByEvaluatingJavaScript(from: js)
    ```

