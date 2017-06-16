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



class OnemenaBrowser: WebViewController, NavigationBarCustomizable, NavigationGestureDrivable {
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        customNavigationBar.barTintColor = UIColor(rgb: 0x3e84e0)
        
        let ua = UIWebView.userAgent
        if !ua.contains("Onemena") {
            UIWebView.userAgent = ua + " Onemena/" + Bundle.main.shortVersionString
        }
        
//        guard let url = Bundle.main.url(forResource: "OMApp", withExtension: "js") else { return }
//        guard let js = try? String(contentsOf: url) else { return }
//        _ = webView.stringByEvaluatingJavaScript(from: js)
        
        let app = AppExport.init(to: webView, delegate: self)
        app.theme = "day"
        self.export = app
    }
    
    override func didRecevie(_ event: WebViewEvent, parameters: [String : Any]?) {
        #if DEBUG
            print("WebViewEvent: \(event.rawValue)")
        #endif
        switch event {
        case WebViewEvent.login:
            loginHandler(parameters)
            
        case WebViewEvent.open:
            openHandler(parameters)
            
        case WebViewEvent.theme:
            guard let name = parameters?["name"] as? String else { return }
            switch name {
            case "day":
                view.brightness = 1.0
            default:
                view.brightness = 0.5
            }
        case WebViewEvent.http:
            guard let parameters = parameters else { return }
            handleHTTPEvents(parameters)
            
        default:
            super.didRecevie(event, parameters: parameters)
        }
    }
    
    var taskID: String?
    
    func handleHTTPEvents(_ paramters: [String: Any]) {
        guard let data = (paramters["request"] as? String)?.data(using: .utf8) else { return }
        guard let requestObject = (try? JSONSerialization.jsonObject(with: data, options: .allowFragments)) as? [String: Any] else { return }
        
        self.taskID = paramters["taskID"] as? String
        
        if UserDefaults.standard.bool(forKey: kAutoRequestDefaultsKey) {
            sendHTTP(with: requestObject, accessToken: UserDefaults.standard.string(forKey: kAccessTokenDefaultsKey), userToken: UserDefaults.standard.string(forKey: kUserTokenDefaultsKey), completion: { (success, result) in
                self.httpViewController(success: success, with: result)
            })
        } else {
            let viewController = HTTPViewController.viewController(requestObject: requestObject)
            viewController.delegate = self
            navigationController?.pushViewController(viewController, animated: true)
        }
        
    }
    
    func loginHandler(_ parameters: [String : Any]?) -> Void {
        let viewController = UIStoryboard(name: "Main", bundle: nil).instantiateViewController(withIdentifier: "login") as! LoginTableViewController
        viewController.delegate = self
        self.taskID = parameters?["taskID"] as? String
        navigationController?.pushViewController(viewController, animated: true)
    }
    
    func openHandler(_ parameters: [String : Any]?) {
        guard let viewControllers = tabBarController?.viewControllers else { return }
        guard viewControllers.count > 1 else {
            return
        }
        guard let testNavigationController = viewControllers[1] as? UINavigationController else { return }
        
        let viewController = UIStoryboard(name: "Main", bundle: nil).instantiateViewController(withIdentifier: "open") as! OpenViewController
        viewController.rawValue = parameters?.description
        viewController.pageName = parameters?["page"] as? String
        viewController.pageID = parameters?["id"] as? String
        var vcs = testNavigationController.viewControllers
        vcs.append(viewController)
        testNavigationController.setViewControllers(vcs, animated: false)
        
        self.tabBarController?.selectedIndex = 1
        
        guard let rootVC = self.navigationController?.viewControllers.first else { return }
        
        self.navigationController?.setViewControllers([rootVC], animated: false)
    }

    
    override func webViewDidFinishLoad(_ webView: UIWebView) {
        super.webViewDidFinishLoad(webView)
        

    }
    
    weak var export: AppExport?
    
    var loginCompletion: ((Bool)->Void)?
    var httpCompletion: ((Bool, Any?)->Void)?
    
    
}

extension OnemenaBrowser: LoginTableViewControllerDelegate {
    
    func loginViewController(_ viewController: LoginTableViewController, didFinishLoginingWith result: (id: String, name: String, type: String, coin: String, success: Bool)) {
        
        guard let taskID = self.taskID else {
            export?.currentUser.id = result.id
            export?.currentUser.name = result.name
            export?.currentUser.type = result.type
            export?.currentUser.coin = Int(forceCast: result.coin)
            loginCompletion?(result.success)
            loginCompletion = nil
            return
        }
        _ = webView.stringByEvaluatingJavaScript(from: "omApp.currentUser.id = '\(result.id)'; omApp.currentUser.name = '\(result.name)'; omApp.currentUser.type = '\(result.type)'; omApp.currentUser.coin = \(result.coin);")
        _ = webView.stringByEvaluatingJavaScript(from: "omApp.didFinishLogining('\(taskID)', \(result.success))")
        self.taskID = nil
    }
    
}

extension OnemenaBrowser: HTTPViewControllerDelegate {
    
    func httpViewController(success: Bool, with result: String?) {
        // didFinishHTTPRequesting
        guard let taskID = self.taskID else {
            
            httpCompletion?(success, result)
            httpCompletion = nil
            return
        }
        
        let string: String = {
            if let result = result?.addingPercentEncoding(withAllowedCharacters: CharacterSet.alphanumerics) {
                return "JSON.parse(decodeURIComponent('\(result)'))"
            }
            return "null"
        }()
        let js = "omApp.didFinishHTTPRequesting('\(taskID)', \(success), \(string))"
        _ = webView.stringByEvaluatingJavaScript(from: js)
        self.taskID = nil
    }
    
}

extension OnemenaBrowser: AppExportDelegate {
    
    func appExport(_ appExport: AppExport, theme: AppTheme) {
        switch theme {
        case AppTheme.night:
            view.window?.brightness = 0.5
        default:
            view.window?.brightness = 1.0;
        }
    }
    
    func appExport(_ appExport: AppExport, present url: String) {
        guard let url = URL.init(string: url) else { return }
        let vc = OnemenaBrowser(url: url)
        present(vc, animated: true, completion: nil)
    }
    
    func appExport(_ appExport: AppExport, open page: AppPage, parameters: [String : Any]?) {
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
        if UserDefaults.standard.bool(forKey: kAutoRequestDefaultsKey) {
            sendHTTP(with: request, accessToken: UserDefaults.standard.string(forKey: kAccessTokenDefaultsKey), userToken: UserDefaults.standard.string(forKey: kUserTokenDefaultsKey), completion: { (success, result) in
                self.httpViewController(success: success, with: result)
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
