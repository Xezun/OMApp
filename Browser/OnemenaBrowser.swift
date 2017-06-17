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

class OnemenaBrowser: UIViewController, NavigationBarCustomizable, NavigationGestureDrivable, UIWebViewDelegate {
    
    var webView: UIWebView
    
    init(url: URL) {
        self.webView = OMWebView()
        webView.loadRequest(URLRequest(url: url))
        super.init(nibName: nil, bundle: nil)
    }
    
    required init?(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
    
    override func viewDidLoad() {
        super.viewDidLoad()
        webView.frame = view.bounds
        webView.delegate = self
        webView.autoresizingMask = [.flexibleWidth, .flexibleHeight]
        view.addSubview(webView)
        // webView.stringByEvaluatingJavaScript(from: "window.onerror = function(error) { setTimeout(function(){alert(error)}, 2000); }")
        customNavigationBar.barTintColor = UIColor(rgb: 0x3e84e0)
        
        let ua = UIWebView.userAgent
        if !ua.contains("Onemena") {
            UIWebView.userAgent = ua + " Onemena/" + Bundle.main.shortVersionString
        }
        

    }
    
    func webView(_ webView: UIWebView, shouldStartLoadWith request: URLRequest, navigationType: UIWebViewNavigationType) -> Bool {
        return true
    }
    
    
    func webViewDidFinishLoad(_ webView: UIWebView) {
        
    }
    
    @objc override func webView(_ webView: UIWebView, didCreateJavaScriptContext context: JSContext) {
        let app = AppExport.init(to: webView, delegate: self)
        app.theme = "day"
        self.export = app
        print("didCreateJavaScriptContext")
    }
    
    weak var export: AppExport?
    
    var loginCompletion: ((Bool)->Void)?
    var httpCompletion: ((Bool, Any?)->Void)?
    
}

extension OnemenaBrowser: LoginTableViewControllerDelegate {
    
    func loginViewController(_ viewController: LoginTableViewController, didFinishLoginingWith result: (id: String, name: String, type: String, coin: String, success: Bool)) {
        export?.currentUser.id = result.id
        export?.currentUser.name = result.name
        export?.currentUser.type = result.type
        export?.currentUser.coin = Int(forceCast: result.coin)
        loginCompletion?(result.success)
        loginCompletion = nil
    }
    
}

extension OnemenaBrowser: HTTPViewControllerDelegate {
    
    func httpViewController(success: Bool, with result: Any?) {
        httpCompletion?(success, result)
        httpCompletion = nil
    }
    
}

extension OnemenaBrowser: AppExportDelegate {
    
    func appExport(_ appExport: AppExport, theme: AppTheme) {
        print("更改 Theme：\(theme)")
        switch theme {
        case AppTheme.night:
            view.window?.brightness = 0.5
        default:
            view.window?.brightness = 1.0;
        }
    }
    
    func appExport(_ appExport: AppExport, present url: String) {
        print("present: \(url)")
        guard let url = URL.init(string: url) else { return }
        let vc = OnemenaBrowser(url: url)
        present(vc, animated: true, completion: nil)
    }
    
    func appExport(_ appExport: AppExport, open page: AppPage, parameters: [String : Any]?) {
        print("open: \(page), parameters: \(String(describing: parameters))")
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
        print(Thread.current)
        navigationController?.popViewController(animated: true)
    }
    
    func appExport(_ appExport: AppExport, navigationPopTo index: Int, animated: Bool) {
        navigationController?.popToRootViewController(animated: true)
    }
    
    func appExport(_ appExport: AppExport, navigationPush url: String, animated: Bool) {
        guard let url = URL.init(string: url) else { return }
        let vc = OnemenaBrowser(url: url)
        navigationController?.pushViewController(vc, animated: true)
    }
    
    func appExport(_ appExport: AppExport, http request: [String : Any], completion: @escaping (Bool, Any?) -> Void) {
        print("http: \(request)")
        if UserDefaults.standard.bool(forKey: kAutoRequestDefaultsKey) {
            sendHTTP(with: request, accessToken: UserDefaults.standard.string(forKey: kAccessTokenDefaultsKey), userToken: UserDefaults.standard.string(forKey: kUserTokenDefaultsKey), completion: { (success, result) in
                completion(success, result)
            })
        } else {
            let viewController = HTTPViewController.viewController(requestObject: request)
            viewController.delegate = self
            self.httpCompletion = completion
            navigationController?.pushViewController(viewController, animated: true)
        }
    }
    
    func appExport(_ appExport: AppExport, loginWithCompletion completionHandler: @escaping (Bool) -> Void) {
        let viewController = UIStoryboard(name: "Main", bundle: nil).instantiateViewController(withIdentifier: "login") as! LoginTableViewController
        viewController.delegate = self
        self.loginCompletion = completionHandler
        navigationController?.pushViewController(viewController, animated: true)
    }
    
    func appExport(_ appExport: AppExport, updateNavigationBarVisibility isHidden: Bool) {
        customNavigationBar.isHidden = isHidden
    }
    
    func appExport(_ appExport: AppExport, updateNavigationBarTitle title: String?) {
        customNavigationBar.title = title
    }
    
    func appExport(_ appExport: AppExport, updateNavigationBarTitleColor titleColor: UIColor) {
        customNavigationBar.titleButton.setTitleColor(titleColor, for: .normal)
    }
    
    func appExport(_ appExport: AppExport, updateNavigationBarBackgroundColor backgroundColor: UIColor) {
        customNavigationBar.barTintColor = backgroundColor
    }
    
    func appExport(_ appExport: AppExport, didCatchAnException expection: String) {
        print(expection)
    }
}
