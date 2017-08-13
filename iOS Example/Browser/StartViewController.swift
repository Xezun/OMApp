//
//  ViewController.swift
//  WebView
//
//  Created by mlibai on 2017/4/28.
//  Copyright © 2017年 mlibai. All rights reserved.
//

import UIKit
import XZKit

let kStartUrlDefaultsKey = "kStartUrlDefaultsKey"

class StartViewController: UIViewController, NavigationBarCustomizable, NavigationGestureDrivable {

    @IBOutlet weak var textField: UITextField!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        navigationController?.isNavigationGestureDrivable = true
        navigationController?.isNavigationBarCustomizable = true
        
        customNavigationBar.title = "OM浏览器"
        customNavigationBar.barTintColor = #colorLiteral(red: 0.8901960784, green: 0.8901960784, blue: 0.8901960784, alpha: 1)
        customNavigationBar.titleButton.setTitleColor(#colorLiteral(red: 0.7450980544, green: 0.1568627506, blue: 0.07450980693, alpha: 1), for: .normal)
        
        self.textField.text = UserDefaults.standard.string(forKey: kStartUrlDefaultsKey)
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }

    @IBAction func openButtonAction(_ sender: UIButton) {
        textField.resignFirstResponder()
        var url: URL! = nil
        if let urlString = textField.text {
            UserDefaults.standard.set(urlString, forKey: kStartUrlDefaultsKey)
            url = URL(string: urlString)
        }
        if url == nil {
            var path: String = Bundle.main.path(forResource: "OMApp", ofType: "html", inDirectory:nil)!
            path = "file://" + path
            path = path.addingPercentEncoding(withAllowedCharacters: .urlFragmentAllowed)!
            url  =  URL(string: path)
        }
        let webVC = OnemenaBrowser(url: url)
        webVC.hidesBottomBarWhenPushed = true
        navigationController?.pushViewController(webVC, animated: true)
    }

}

