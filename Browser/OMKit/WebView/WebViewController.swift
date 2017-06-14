//
//  WebViewController.swift
//  TT
//
//  Created by mlibai on 2017/4/28.
//  Copyright © 2017年 OneMena. All rights reserved.
//

import UIKit
import XZKit


/// 封装了 HTML 和原生交互的一些基础方法。
open class WebViewController: UIViewController {
    
    /// HTML 与原生交互的 url scheme
    let eventScheme: String
    
    /// 子类必须通过此方法初始化。
    public required init(url: URL, eventScheme: String = "app") {
        self.url = url
        self.eventScheme = eventScheme
        super.init(nibName: nil, bundle: nil)
    }
    
    required public init?(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
    
    deinit {
        webView.delegate = nil
    }
    
    open var url: URL
    
    public var webView: UIWebView {
        return (view as! UIWebView)
    }
    
    override open func loadView() {
        let webView = UIWebView(frame: UIScreen.main.bounds)
        webView.delegate = self
        self.view = webView
    }
    
    override open func viewDidLoad() {
        super.viewDidLoad()

        automaticallyAdjustsScrollViewInsets = false
        webView.loadRequest(URLRequest(url: url))
    }
    
    open override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)
        
        guard let count = self.navigationController?.viewControllers.count else { return }
        customNavigationBar.backButton.isHidden = (count < 2)
        customNavigationBar.closeButton.isHidden = (count < 3)
    }

    override open func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
    }
    
    /// 当控制器收到 WebView 的事件时，会调用此方法。
    ///
    /// - Parameters:
    ///   - event: 事件名称
    ///   - parameters: 跟随事件的参数
    open func didRecevie(_ webViewEvent: WebViewEvent, parameters: [String: Any]?) -> Void {
        switch webViewEvent {
        case WebViewEvent.pop:
            guard let navigationController = self.navigationController else {
                return
            }
            navigationController.popViewController(animated: true)
            
        case WebViewEvent.push:
            guard let navigationController = self.navigationController else {
                return
            }
            guard let urlString = parameters?["url"] as? String else {
                return
            }
            guard let url = URL(string: urlString) else {
                return
            }
            let viewController = viewControllerForPushEvent(with: url)
            navigationController.pushViewController(viewController, animated: true)
            
        case WebViewEvent.popTo:
            guard let navigationController = self.navigationController else {
                return
            }
            let index = min(0, Int(forceCast: parameters?["index"]))
            let viewControllers = navigationController.viewControllers
            
            var find: Int = -1
            for i in 0 ..< viewControllers.count {
                let viewController = viewControllers[i]
                if viewController is WebViewController {
                    find += 1
                }
                if find == index {
                    navigationController.popToViewController(viewController, animated: true)
                    break
                }
            }
        
        case WebViewEvent.present:
            guard let urlString = parameters?["url"] as? String else {
                return
            }
            guard let url = URL(string: urlString) else {
                return
            }
            let webViewController = WebViewController(url: url)
            let navigationController = UINavigationController(rootViewController: webViewController)
            present(navigationController, animated: true, completion: nil)
            
        case WebViewEvent.login:
            guard let taskID = parameters?["taskID"] as? String else {
                return
            }
            _ = self.call(.didFinishLogining, parameters: taskID, ["userToken": "a test user token."])
            
        case WebViewEvent.navigationBar:
            guard let parameters = parameters else { return }
            configureNavigationBar(with: parameters)
            
        case WebViewEvent.undefined:
            assert(false, "WebViewController: An undefined WebViewEvent collected, please comfirm!")
            
        default:
            assert(false, "WebViewController: Web view event (\(webViewEvent)) is not handled, please comfirm!")
        }
    }
    
    open func viewControllerForPushEvent(with url: URL) -> WebViewController {
        return type(of: self).init(url: url)
    }
    
    /// 调用 WebView JS 方法。
    ///
    /// - Parameters:
    ///   - action: WebViewAction
    ///   - parameters: 参数
    /// - Returns: String
    open func call(_ action: WebViewAction, parameters: Any? ...) -> Any? {
        func parse(_ value: Any) -> String {
            if let string = value as? String {
                // string wrapped with quote mark.
                let escapedString = string.replacingOccurrences(of: "'", with: "\'")
                return "\"\(escapedString)\""
            } else if let array = value as? [Any] {
                // array formated like `[item1, item2, ...]`
                let string = array.map({ (item) -> String in
                    return parse(item)
                }).joined(separator: ", ")
                return "[\(string)]"
            } else if let dict = value as? [String: Any] {
                // dictionary wrapped as an Object `{"key": value}`
                let string = dict.map({ (item) -> String in
                    return "\"\(item.key)\": \(parse(item.value))"
                }).joined(separator: ", ")
                return "{\(string)}"
            } else {
                return "\(value)"
            }
        }
        
        let string = parameters.map { (value) -> String in
            if let value = value {
                return parse(value)
            } else {
                return "null"
            }
        }.joined(separator: ", ")
        
        let action = "\(action.rawValue)(\(string))"
        let result = webView.stringByEvaluatingJavaScript(from: action)
        guard let data = result?.data(using: .utf8) else {
            return string
        }
        guard let object = (try? JSONSerialization.jsonObject(with: data, options: .allowFragments)) else {
            return string
        }
        return object
    }
    
    open override func navigationControllerPopViewController(animated: Any?) -> UIViewController? {
        /*if webView.canGoBack {
            webView.goBack()
            return nil
        }*/
        return super.navigationControllerPopViewController(animated: animated)
    }
}





extension WebViewController: UIWebViewDelegate {
    
    open func webView(_ webView: UIWebView, shouldStartLoadWith request: URLRequest, navigationType: UIWebViewNavigationType) -> Bool {
        guard let url = request.url else { return true }
        #if DEBUG
            print("UIWebView.shouldStart:" + url.absoluteString)
        #endif
        guard let scheme = url.scheme else { return true }
        guard scheme == eventScheme else { return true }
        
        let event: WebViewEvent = WebViewEvent(url: url) ?? .undefined
        let parameters: [String: Any]? = url.keyedQueryValues

        DispatchQueue.main.async {
            self.didRecevie(event, parameters: parameters)
        }
        
        return false
    }
    
    open func webViewDidStartLoad(_ webView: UIWebView) {
        
    }
    
    open func webViewDidFinishLoad(_ webView: UIWebView) {
        //_ = call(WebViewAction.alert, parameters: "This is a alert!")
    }
    
    open func webView(_ webView: UIWebView, didFailLoadWithError error: Error) {
        
    }
    
}

extension WebViewController {
    
    fileprivate func configureNavigationBar(with parmaters: [String: Any]) {
        // 标题
        if let title = parmaters["title"] as? String {
            customNavigationBar.title = title
        }
        
        // 标题颜色
        if let navigationBarTitleColor = parmaters["titleColor"] as? String {
            let titleColor = UIColor(string: navigationBarTitleColor)
            customNavigationBar.titleButton.setTitleColor(titleColor, for: .normal)
        }
        
        // 渲染色
        if let barTintColor = parmaters["tintColor"] as? String {
            customNavigationBar.tintColor = UIColor(string: barTintColor)
        }
        
        // 是否透明
        if let isTranslucent = parmaters["translucent"] as? String {
            customNavigationBar.isTranslucent = (isTranslucent == "true")
        }
        
        // 是否隐藏
        if let isHidden = parmaters["isHidden"] as? String {
            customNavigationBar.isHidden = (isHidden == "true")
        }
        
        // 背景色
        if let backgroundColor = parmaters["backgroundColor"] as? String {
            customNavigationBar.barTintColor = UIColor(string: backgroundColor)
        }
        
        // 返回按钮
        if let isBackButtonHidden = parmaters["backButtonHidden"] as? String {
            customNavigationBar.backButton.isHidden = (isBackButtonHidden == "true")
        }
        
        // 关闭按钮
        if let isCloseButtonHidden = parmaters["closeButtonHidden"] as? String {
            customNavigationBar.closeButton.isHidden = (isCloseButtonHidden == "true")
        }
        
        // 更多按钮
        if let isInfoButtonHidden = parmaters["infoButtonHidden"] as? String {
            customNavigationBar.infoButton.isHidden = (isInfoButtonHidden == "true")
        }
        
    }
}
