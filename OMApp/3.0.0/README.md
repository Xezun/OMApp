# OMApp 接口文档

## 目录

[TOC] 


## 说明

OMApp 是一个 JavaScript 模块，在 HTML／App 交互过程中启桥梁作用，其本身不处理任何业务逻辑。

## 开发调试

- `OMApp.d.ts` 文件为 WebStorm 编辑器提供了对 OMApp 的自动补全和基本语法纠错功能。
- `OMApp` 不依赖其它任何第三方库，一般情况下，建议首先引入。

### 2. 接口获取方式

- 模块获取方式：`OMApp` 或 `window.OMApp` 。
- 模块唯一实例：`OMApp.current` 或 `window.omApp` 或 `omApp` 。

### 静态方法

#### version

- 接口说明：

    属性。只读，String，标识框架的版本。

- 示例代码：

```
console.log(OMApp.version); // LOG 当前 OMApp 版本。
```

#### defineProperty(*propertyName*, *descriptor*)

- 接口说明：

    通过此方法为 OMApp 拓展单个静态属性。

- 参数说明：
    
    - `propertyName`: string，必选。属性名。
    - `descriptor`：function, 必选。该函数用于生成属性的描述信息，结构与 Object.defineProperty 方法相同。
    
- 示例代码：

```
OMApp.defineProperty("Method", function () {
    var _Method = {};
    return {
        get: function () {
            return _Method;
        }
    }
});

```


#### defineProperties(*descriptor*)

- 接口说明：

    通过此方法为 OMApp 拓展多个静态属性。

- 参数说明：
    
    - `descriptor`：function, 必选。该函数用于生成属性的描述信息，结构与 Object.defineProperty 方法相同。
    
- 示例代码：

```
OMApp.defineProperty("Method", function () {
    var _Method = {};
    function _registerMethod() {}
    return {
        version: { get: function () { return "3.0.0"; } },
        Method: { get: function () { return _Method; } },
        registerMethod: { get: function () { return _registerMethod; } }
    }
});
```
    
#### Method

- 接口说明：

    - 属性。
    - 只读，OMApp 枚举器。枚举器的所有属性都是一个枚举值，代表一个 App 方法；
    - 通过 `OMApp.registerMethod` 方法为枚举器拓展新的枚举值；
    - 枚举值可以是对象，但是对象最终必须以 String 为属性值。
    - 在 HTML 调用 OMApp 的方法时，OMApp 查找对应的枚举值，并将此值传递给 App ，App 根据此值来区分 HTML 的操作请求并执行相应的操作。
  
- 示例代码：

```
OMApp.Method.login; // 登录
```

#### registerMethod(*method*, *name*)

- 接口说明：

    通过此方法为 OMApp.Method 拓展枚举值。

- 参数说明：
    
    - `method`：string/object, 必选。与 App 约定的方法标识。
    - `name`: string, 可选。方法名，引用枚举值时使用的名字，当 method 参数为 object 类型时，必须指定 name 。
    
- 示例代码：

```
OMApp.registerMethod("login");
OMApp.registerMethod({
    http: "http"
}, "networking");

```

#### current

- 接口说明：

    属性。只读，OMApp 实例，代表当前 App 对象。也可以通过 `window.omApp` 引用。

- 示例代码：

```
var app = OMApp.current;
console.log(app);
```



### 实例方法

#### isInApp

- 接口说明：

    属性。只读，boolean。标识当前是否处于 App 环境。

#### system

- 接口说明：

    属性。只读，Object。当前 App 的系统信息。

- 属性列表： 
    
    system.isAndroid: 只读，boolean。是否是安卓系统。
    system.isiOS: 只读，boolean。是否是 iOS 系统。

#### name

- 接口说明：

    属性。string。标识 OMApp 实例对象，以及交互的 URL Scheme，必须是全小写字母。

#### defineProperty(*propertyName*, *descriptor*)

- 接口说明：

    通过此方法为 OMApp 实例拓展单个属性，参数与用法见 `OMApp.defineProperty`。

#### defineProperties(*descriptor*)

- 接口说明：

    通过此方法为 OMApp 实例拓展多个属性，参数与用法见 `OMApp.defineProperties`。


#### delegate

- 接口说明：

    - 属性。OMAppDelegate对象/function。
    - 当此属性值存在时，对 omApp 方法的调用将不发送到 App 而是直接发送给此属性。因此在非 App 环境中，可以通过设置此属性，模拟一些 App 的操作。
    - 因为 omApp 能自动判断当前环境，所以在非 App 环境中，该属性已被初始化，以输出 LOG 信息。直接设置初始对象的属性，以自定义操作行为。

- 示例代码：

```
// 弹出一个 confirm 对话框来模拟登陆的过程。
omApp.delegate.login = function(callback) {
    callback(confirm("确定 - 登陆成功\n取消 - 登陆失败"));
}
```


#### dispatch(*callbackID*, *argument1*, *argument2*, ...)

- 接口说明：

    由于平台的限制，当 JS 的函数不能直接传递到 App 环境中执行时，App 会收到一个标识该函数的 callbackID ，当 App 中执行完相关操作时，通过调用此方法来调度对应的函数。

- 参数说明：

    - `callbackID`: 必选，string。JS 函数的唯一标识。
    - `argumentN`: 可选。执行 JS 函数时的参数，必须保持参数顺序一致。

#### perform(*method*, *paramters*, *callback*)

- 接口说明：

    执行一个已预定义的 App 方法。

- 参数说明：
    
    - `method`：OMApp.Method 枚举, 必选。与 App 约定的方法标识。
    - `paramters`：array, 可选。方法参数，必选与约定的参数顺序一致。
    - `callback`：function，可选。回调函数，目前只支持一个回调函数。
    
- 示例代码：

```
omApp.perform(OMApp.Method.login, null, function(success) {
    // 接收登陆结果。
});
```

#### config(*configuration*)

- 接口说明：

    在非 App 环境中，配置 omApp 对象的初始属性。请在使用其它方法之前调用此方法。

- 参数说明：
    
    - `configuration`：Object, 必选。配置信息。
    
- 示例代码：

```
omApp.config({
    currentTheme: OMApp.Theme.night, // 模拟 App 夜间模式
    currentUser: {                   // 模拟 App 中的用户信息
        id: "0",
        name: "Jim",
        type: OMApp.UserType.google
    }
});
```

#### isReady

- 接口说明：

    属性。只读，boolean。标识 omApp 对象是否已经由 App 完成初始化。

#### ready(*callback*)

- 接口说明：

    设置一组需要在 App 对象 omApp 对象初始化完成后进行的操作。如果此方法不被调用，那么 omApp 对象不会进行初始化操作。

- 参数说明：
    
    - `callback`：function, 必选。omApp 在初始化完成后需要执行的操作，无参数。
    
- 示例代码：

```
omApp.ready(function() {
    // 某些属性只能在 omApp 完成初始化后才能进行，比如获取当前已登陆用户的用户名。
    console.log(omApp.currentUser.name);
});
```


#### currentTheme

- 接口说明：

    属性。OMApp.Theme 枚举。App 当前主题。

#### login(callback)

- 接口说明：

    当 HTML 通过 omApp.currentUser.isOnline 判断用户未登录，但是用户操作必须在登录后才能执行时，可调用此方法，发起 App 登录流程。

- 参数说明：
    
    - `callback`：function, 必选。omApp 在登录完成后需要执行的操作。
    - `callback` 函数参数：
        - `success`：boolean，必选。是否登录成功。
    
- 示例代码：

```
omApp.login(function(success) {
    console.log(omApp.currentUser.name);
});
```

#### currentUser

- 接口说明：

    属性。Object，该对象描述了 App 已登录的用户的信息。
 
- 属性说明：
    
    | **Name**        | **Type**    | **Description** |
    | :-------------- | :---------- | :-------------- |
    | isOnline        | Bool        | 只读。是否已登录        |
    | id              | String      | 只读。用户ID           |
    | name            | String      | 只读。用户名           |
    | type            | String      | 只读。OMApp.UserType  |
    | coin            | Int         | 只读。用户金币数        |
    | token           | String      | 只读。user token        |

    <font size=2>* 说明： token 字段对外并不是一个好的 API 设计，未来优化的版本中将去掉此值。</font>

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
    

#### open(*page*, *parameters*) 

- 接口说明：

    1. 当 HTML 页面需要跳转到 App 其它界面时，调用此接口。
    2. 基于 URL 的交互方式，适用于深度链接到 App 的 URL 规则。

- 参数说明：

    - `page`：OMApp.Page 枚举，必选。
    - `parameters`：Object，可选。

- 适用于深度链接的额外参数：

    - `actions`：array，可选。
        - follow：关注操作。例如打开新闻详情页时，同时执行关注操作。
    - type: String
        - web：默认，来自 App 内置 WebView 。    
        - push：推送。                         
        - share：分享落地页。   
        - launch：App 启动页。 

- 代码示例：

    ```
    // 打开金币商城页
    omApp.open(OMAppPage.mall); 
    // 打开金币任务页
    omApp.open(OMAppPage.task); 
    // 打开指定新闻
    omApp.open(OMAppPage.news, {categoryID: "1", id: "9523"});
    // 打开指定视频频道
    omApp.open(OMAppPage.video, {categoryID: "5"});
    // 打开指定网页
    omApp.open(OMAppPage.web, {url: "http://www.baidu.com"});
    ```


#### navigation

- 接口说明：

    Object，只读，非空。
    为了使 HTML 提供类似原生 App 的操作体验，`navigation` 接口给 HTML 提供了创建新窗口的能，并通过 `导航栈` 来管理这一系列窗口。

##### navigation.push(*url*, *animated*)

- 接口说明：

    创建一个新窗口并打开指定 URL，常用于导航到下级页面。新窗口将压入到导航栈顶。

- 参数说明：

    - `url`：String，必选。下级页面的 URL。
    - `animated`：Bool，可选。是否展示转场动画，默认 true 。

- 代码示例：

    ```
    omApp.navigation.push('http://8.dev.arabsada.com/'); 
    omApp.navigation.push('http://8.dev.arabsada.com/', true); 
    ```


##### navigation.pop(*animated*)

- 接口说明：

    关闭当前窗口，并返回到上一个窗口，常用于返回到上级页面。当前窗口从导航栈中弹出。

- 参数说明：

    - `animated`：Bool，可选。是否展示转场动画，默认 true。

- 代码示例：

    ```
    omApp.navigation.pop(true); 
    ```

##### navigation.popTo(*index*, *animated*)

- 接口说明：

    返回到导航栈内指定级页面。如果当前导航栈内已经有很多页面，此方法可以快速回到指定页面。

- 参数说明：

    - `index`：Int，必选。正数，目的页面所在的位置索引，0 为第一个 HTML 页面。
    - `animated`：Bool，可选。是否展示转场动画，默认 true 。

- 代码示例：

    ```
    omApp.navigation.popTo(0, true);
    ```

##### navigation.bar

- 接口说明：

    只读，Object。代表了 App 的原生导航条对象。通过此对象，可以控制导航条的外观。

- 属性说明：

    - `isHidden`：Bool。导航条是否隐藏。
    - `title`：String。标题。
    - `titleColor`：String。标题颜色。
    - `backgroundColor`：String。背景色。

- 代码示例：

    ```
    omApp.navigation.bar.isHidden = false;
    omApp.navigation.bar.title = '自定义的标题';
    omApp.navigation.bar.titleColor = '#FF0000';
    omApp.navigation.bar.backgroundColor = '#0000FF';
    ```

#### present(*url*, *animated*, *completion*)

- 接口说明：

    类似于在页面中呈现一个弹出层，只不过在 App 中，弹出层也是全屏显示的。与导航不同，present 没有栈结构，为单视图层。

- 参数说明：
    
    - `url`：string，必选。omApp 在登录完成后需要执行的操作。
    - `animated`：boolean，可选，默认 true 。是否展示转场动画。
    - `completion`：function，可选。弹出层显示后执行的回调，无参数。
    
- 示例代码：

```
omApp.present("http://www.baidu.com", true, function() {
    // Do something when the view is presented.
});
```

#### dismiss(*animated*, *completion*)

- 接口说明：

    移除当前已 present 出来的视图。

- 参数说明：
    
    - `animated`：boolean，可选，默认 true 。是否展示转场动画。
    - `completion`：function，可选。弹出层显示后执行的回调，无参数。
    
- 示例代码：

```
omApp.dismiss(true, function() {
    // Do something when the view is presented.
});
```

#### networking

- 接口说明：

    属性。只读，Object。App 网络环境及网络支持。

- 参数说明：
    
    - `isReachable`：boolean，只读。当前是否已联网。
    - `isViaWiFi`：boolean，只读，当前网络是否通过 Wi-Fi 连接。
    - `type`：OMApp.NetworkingType，只读。当前网络类型。
    - `http`：方法。网络请求，参见 omApp.http 方法。
    
- 示例代码：

```
if (!omApp.networking.isViaWiFi) {
    confirm("当前非 Wi-Fi 环境，请注意流量使用情况。");
}
```

#### http(*request*, *callback*)

- 接口说明：

    本方法直接引用 omApp.networking.http 方法。

- 参数说明：
    
    - `request`：object 。当前是否已联网。
        - `url`： string。网络请求的 URL。
        - `method`： string。网络请求的方法。
        - `data`： object。请求参数。
        - `headers`： object。请求头参数设置。
    - `callback`：function。参数如下：
        - `response`：object。网络请求响应状态及结果，其属性为：
            - `code`：number。错误码，非 HTTP 状态码。0 表示没有错误。
            - `message`：string。错误消息。
            - `data`：any。请求得到的数据。
            - `contentType`：请求的数据类型。

    
- 示例代码：

```
omApp.http({
    url: "http://api.host.com",
    method: "GET",
    data: {id: "1"},
    
}, function(response) {
    if (response.code !== 0) { alert(response.message); return; }
});
```

#### services

- 接口说明：

    属性，只读。App 提供的功能服务。

- 属性列表：
    
    - `data`：OMApp.DataService，只读。数据服务。
        
        - `numberOfRowsInList(documentName, listName, callback)`
            - documentName: string.
            - listName: string
            - callback(count): function
                - count: number
        - `dataForRowAtIndex(documentName, listName, index, callback)`
            - documentName: string
            - listName: string
            - index: number
            - callback(): function
        - `cachedResourceForURL(url, resourceType, autoDownload, callback)`
            - url: string
            - resourceType: OMApp.ResourceType
            - autoDownload: boolean
            - callback: function

    - `event`：object。事件服务。
        
        - `didSelectRowAtIndex(documentName, listName, index, callback)`
            - documentName: string
            - listName: stirng
            - index: number
            - callback: function
        - `elementWasClicked(documentName, listName, data, callback)`
            - documentName: string
            - listName: string
            - data: any
            - callback: function
        
    - `analytics`：object。统计分析服务。
        
        - `track(eventName, parameters)`
            - `eventName`：string
            - `parameters`：object
    
- 示例代码：

```

```











- <a name="OMAppTheme">***OMAppTheme*枚举**</a>

    | Name                   | Type     | Description | 
    | :--------------------- | :------- | :---------- |
    | *OMAppTheme.**day***   | String   | 新闻栏目 ID   |
    | *OMAppTheme.**night*** | String   | 新闻栏目 ID   |
- OMApp.UserType 枚举

    | **Name**                           | **Type**    | **Description** |
    | :--------------------------------- | :---------- | :-------------- |
    | *OMApp.UserType.**visitor***       | String      | 游客用户          |
    | *OMApp.UserType.**google***        | String      | Google 登录用户   |
    | *OMApp.UserType.**facebook***      | String      | Facebook 登录用户  |
    | *OMApp.UserType.**twitter***       | String      | Twitter 登录用户  |

- <a name="OMAppPage">***OMAppPage*枚举及相关参数**</a>

    - 新闻：*OMAppPage.**news***
    
        | Name        | Type           | Description |
        | :---------- | :------------- | :------------------ |
        | categoryID  | String         | 可选。新闻分类 ID。   |
        | id          | String         | 可选。新闻 ID 。     |

        <font size="2" color="gray">** 不可单独指定新闻 id，必须同时提供 categoryID （默认可传 0 ）。*</font>
 
    - 视频：*OMAppPage.**video***

        | Name        | Type    | Description |
        | :---------- | :------ | :------------------ |
        | categoryID  | String  | 可选。视频分类 ID，默认可传 0 。   |
        | id          | String  | 可选。视频 ID ，必选 categoryID。     |

        <font size="2" color="gray">** 不可单独指定视频 id，必须同时提供 categoryID （默认可传 0 ）。*</font>

    - 金币商城：*OMAppPage.**mall***
    - 金币任务：*OMAppPage.**task***
    - 内置Web页面：*OMAppPage.**web***
    
        | Name        | Type    | Description |
        | :---------- | :------ | :------------------ |
        | url         | String  | 必选。网址。   |



- <a name="OMAppNetworkingType">***OMAppNetworkingType*枚举**</a>

    | **Name**                          | **Type**    | **Description** |
    | :-------------------------------- | :---------- | :-------------- |
    | *OMAppNetworkingType.**none***    | String      | 无网络           |
    | *OMAppNetworkingType.**WiFi***    | String      | WiFi            |
    | *OMAppNetworkingType.WWan**2G***  | String      | 蜂窝网 2G        |
    | *OMAppNetworkingType.WWan**3G***  | String      | 蜂窝网 3G        |
    | *OMAppNetworkingType.WWan**4G***  | String      | 蜂窝网 4G        |
    | *OMAppNetworkingType.**other***   | String      | 未知的联网方式    |



## 基本约定

1. 通过 URL 参数传递数据时，使用 *Key-Value* 形式，如果 Value 不是基本数据类型，则用 `URL 编码后的 JSON 串` 表示。 
2. 所有标注为只读的属性，请在业务逻辑中，不要去修改这些值。它们虽然可能可写，但只是供 App 初始化值时使用。
3. 只读的属性，即使修改其值，也不会影响 App 里的内容。




