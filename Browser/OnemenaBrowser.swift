//
//  TestWebViewController.swift
//  WebView
//
//  Created by mlibai on 2017/5/12.
//  Copyright © 2017年 mlibai. All rights reserved.
//

import UIKit
import XZKit

extension Notification.Name {
    static let OMHTMLOpenPageTest = Notification.Name(rawValue: "OMHTMLOpenPageTest")
}

extension WebViewEvent {
    static let theme = WebViewEvent(rawValue: "theme")
}


class OMWebView: UIWebView {
    deinit {
        print("WebView is deinit.")
    }
}

class OnemenaBrowser: UIViewController, NavigationBarCustomizable, NavigationGestureDrivable, UIWebViewDelegate, UIWebViewJavaScriptDelegate {
    
    var webView: UIWebView
    
    init(url: URL) {
        self.webView = OMWebView()
        webView.loadRequest(URLRequest(url: url))
        super.init(nibName: nil, bundle: nil)
    }
    
    required init?(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
    
    var logsVC = LogsTableViewController()
    
    override func viewDidLoad() {
        super.viewDidLoad()
        self.dataf.dateFormat = "yyyy-MM-dd hh:mm:ss"
        
        webView.frame = view.bounds
        webView.delegate = self
        webView.autoresizingMask = [.flexibleWidth, .flexibleHeight]
        view.addSubview(webView)
        // webView.stringByEvaluatingJavaScript(from: "window.onerror = function(error) { setTimeout(function(){alert(error)}, 2000); }")
        customNavigationBar.barTintColor = UIColor(rgb: 0x3e84e0)
        
        customNavigationBar.infoButton.setImage(#imageLiteral(resourceName: "btn_nav_more_white"), for: .normal)
        customNavigationBar.infoButton.addTarget(self, action: #selector(console(_:)), for: .touchUpInside)
        customNavigationBar.backButton.setImage(UIImage(named: "btn_nav_back_white"), for: .normal)
        customNavigationBar.backButton.addTarget(self, action: #selector(navBack(_:)), for: .touchUpInside);
    }
    
    func console(_ button: UIButton) -> Void {
        let vc = UIStoryboard(name: "Main", bundle: nil).instantiateViewController(withIdentifier: "console") as! ConsoleTableViewController
        vc.webView = webView
        self.present(vc, animated: true, completion: nil)
    }
    
    func navBack(_ button: UIButton) -> Void {
        if webView.canGoBack {
            webView.goBack();
        } else {
            navigationController?.popViewController(animated: true);
        }
    }
    
    func viewControllerForPushGestureInteration(_ navigationController: UINavigationController) -> UIViewController? {
        return logsVC
    }

    
    func webView(_ webView: UIWebView, didCreateJavaScriptContext context: JSContext) {
        let app = AppExport.init(context: context, delegate: self)
        app.currentTheme = "day"
        self.export = app
        print("【事件】JavaScript 环境初始化完成")
        
        
        webView.stringByEvaluatingJavaScript(from: "JSON.parse(decodeURIComponent(''))")
    }
    
    weak var export: AppExport?
    
    var loginCompletion: ((Bool)->Void)?
    var httpCompletion: ((Bool, Any?)->Void)?
    
    var dataf = DateFormatter()
    func print(_ item: Any, line: Int = #line) -> Void {
        let string = self.dataf.string(from: Date())
        logsVC.logs.append("\(string) (\(line)) \(item)");
        logsVC.tableView.reloadData()
        Swift.print(item)
        Swift.print("------------------------------------------------")
    }
}

extension OnemenaBrowser: LoginTableViewControllerDelegate {
    
    func loginViewController(_ viewController: LoginTableViewController, didFinishLoginingWith result: (id: String, name: String, type: String, coin: String, token: String, success: Bool)) {
        export?.currentUser.id      = result.id
        export?.currentUser.name    = result.name
        export?.currentUser.type    = result.type
        export?.currentUser.coin    = Int(forceCast: result.coin)
        export?.currentUser.token   = result.token
        loginCompletion?(result.success)
        loginCompletion = nil
    }
    
}

extension OnemenaBrowser: HTTPViewControllerDelegate {
    
    func toString(_ object: Any?, level: Int, indent: String) -> String {
        guard let object = object else { return "null" }
        
        if let dict = object as? [AnyHashable: Any] {
            if level > 0 {
                let nextIndent = indent.appending("    ")
                let string = dict.map({ (item) -> String in
                    return "\(item.key): \(toString(item.value, level: level - 1, indent: nextIndent))"
                }).joined(separator: ", \n\(nextIndent)")
                return "{\n\(nextIndent)\(string)\(indent)}\n"
            }
            return "{\(dict.count) keyed values}"
        } else if let array = object as? [Any] {
            if level > 0 {
                let nextIndent = indent.appending("    ")
                let string = array.map({ (item) -> String in
                    return toString(item, level: level - 1, indent: nextIndent)
                }).joined(separator: ", ")
                return "[\(string)]"
            }
            return "[\(array.count) items]"
        } else {
            return "\(object)"
        }
    }
    
    func httpViewController(success: Bool, with result: Any?) {
        print("网络请求结果：\(toString(result, level: 3, indent: ""))")
        httpCompletion?(success, result)
        httpCompletion = nil
    }
    
}

extension OnemenaBrowser: AppExportDelegate {
    
    func appExport(_ appExport: AppExport, currentTheme theme: AppTheme) {
        print("【事件】currentTheme：\(theme)")
        switch theme {
        case AppTheme.night:
            view.window?.brightness = 0.5
        default:
            view.window?.brightness = 1.0;
        }
    }
    
    func appExport(_ appExport: AppExport, present url: String) {
        print("【事件】present: \(url)")
        guard let url = URL.init(string: url) else { return }
        let vc = OnemenaBrowser(url: url)
        present(vc, animated: true, completion: nil)
    }
    
    func appExport(_ appExport: AppExport, open page: AppPage, parameters: [String : Any]?) {
        print("【事件】open: \(page), parameters: \(String(describing: parameters))")
        guard let viewControllers = tabBarController?.viewControllers else { return }
        guard viewControllers.count > 1 else {
            return
        }
        guard let testNavigationController = viewControllers[1] as? UINavigationController else { return }
        
        let viewController = UIStoryboard(name: "Main", bundle: nil).instantiateViewController(withIdentifier: "open") as! OpenViewController
        viewController.rawValue = parameters?.description
        viewController.pageName = page.rawValue
        viewController.pageID = parameters?["id"] as? String
        var vcs = testNavigationController.viewControllers
        vcs.append(viewController)
        testNavigationController.setViewControllers(vcs, animated: false)
        
        self.tabBarController?.selectedIndex = 1
        
        guard let rootVC = self.navigationController?.viewControllers.first else { return }
        
        self.navigationController?.setViewControllers([rootVC], animated: false)
    }
    
    func appExport(_ appExport: AppExport, navigationPop animated: Bool) {
        print("【事件】pop")
        navigationController?.popViewController(animated: true)
    }
    
    func appExport(_ appExport: AppExport, navigationPopTo index: Int, animated: Bool) {
        print("【事件】popTo: \(index)")
        navigationController?.popToRootViewController(animated: true)
    }
    
    func appExport(_ appExport: AppExport, navigationPush url: String, animated: Bool) {
        print("【事件】push: \(url)")
        guard let url = URL.init(string: url) else { return }
        let vc = OnemenaBrowser(url: url)
        navigationController?.pushViewController(vc, animated: true)
    }
    
    func appExport(_ appExport: AppExport, http request: AppHTTPRequest, completion: @escaping (Bool, Any?) -> Void) {
        print("【事件】http: \(request)")
        var dict: [String: Any] = [
            "url": request.url,
            "method": request.method
        ]
        dict["params"] = request.params
        dict["headers"] = request.headers
        
        self.httpCompletion = completion
        
        if UserDefaults.standard.bool(forKey: kAutoRequestDefaultsKey) {
            sendHTTP(with: dict, accessToken: UserDefaults.standard.string(forKey: kAccessTokenDefaultsKey), userToken: UserDefaults.standard.string(forKey: kUserTokenDefaultsKey), completion: { (success, result) in
                // completion(success, result)
                self.httpViewController(success: success, with: result)
            })
        } else {
            let viewController = HTTPViewController.viewController(requestObject: dict)
            viewController.delegate = self
            navigationController?.pushViewController(viewController, animated: true)
        }
    }
    
    func appExport(_ appExport: AppExport, login completionHandler: @escaping (Bool) -> Void) {
        print("【事件】login")
        let viewController = UIStoryboard(name: "Main", bundle: nil).instantiateViewController(withIdentifier: "login") as! LoginTableViewController
        viewController.delegate = self
        self.loginCompletion = completionHandler
        navigationController?.pushViewController(viewController, animated: true)
    }
    
    func appExport(_ appExport: AppExport, updateNavigationBarVisibility isHidden: Bool) {
        print("【事件】navigation.bar.isHidden: \(isHidden)")
        customNavigationBar.isHidden = isHidden
    }
    
    func appExport(_ appExport: AppExport, updateNavigationBarTitle title: String?) {
        print("【事件】navigation.bar.title: \(String(describing: title))")
        customNavigationBar.title = title
    }
    
    func appExport(_ appExport: AppExport, updateNavigationBarTitleColor titleColor: UIColor) {
        print("【事件】navigation.bar.titleColor: \(titleColor)")
        customNavigationBar.titleButton.setTitleColor(titleColor, for: .normal)
    }
    
    func appExport(_ appExport: AppExport, updateNavigationBarBackgroundColor backgroundColor: UIColor) {
        print("【事件】navigation.bar.backgroundColor: \(backgroundColor)")
        customNavigationBar.barTintColor = backgroundColor
    }
    
    func appExport(_ appExport: AppExport, didCatchAnException expection: String) {
        print("【异常】 \(expection)")
    }
    
    
    
}
