//
//  HTTPViewController.swift
//  Browser
//
//  Created by mlibai on 2017/6/14.
//  Copyright © 2017年 mlibai. All rights reserved.
//

import UIKit
import XZKit

let kUserTokenDefaultsKey = "kHTTPHeadersDefaultsKey"
let kAccessTokenDefaultsKey = "kHTTPParametersDefaultsKey"

let kAutoRequestDefaultsKey = "kAutoRequestDefaultsKey"

protocol HTTPViewControllerDelegate: class {
    func httpViewController(success: Bool, with result: Any?)
}

class HTTPViewController: UITableViewController, NavigationBarCustomizable, NavigationGestureDrivable {
    
    static func viewController(requestObject: [String: Any]) -> HTTPViewController {
        let viewController = UIStoryboard(name: "Main", bundle: nil).instantiateViewController(withIdentifier: "http") as! HTTPViewController
        viewController.requestObject = requestObject
        return viewController
    }
    
    lazy var requestObject: [String: Any] = [:]
    
    weak var delegate: HTTPViewControllerDelegate?
    
    @IBOutlet weak var requestLabel: UILabel!
    @IBOutlet weak var accessTokenTextField: UITextField!
    @IBOutlet weak var userTokenTextField: UITextField!
    @IBOutlet weak var autoRequestSwitch: UISwitch!
    
    override func viewDidLoad() {
        super.viewDidLoad()

        if navigationController!.isNavigationBarCustomizable {
            customNavigationBar.barTintColor = .red
            customNavigationBar.title = "HTTP 测试"
        }
        
        let string = requestObject.map { (item) -> String in
            return "\(item.key): \(item.value)"
        }.joined(separator: " \n")
        requestLabel.text = string
        
        if let text = UserDefaults.standard.object(forKey: kUserTokenDefaultsKey) as? String {
            userTokenTextField.text = text
        }
        if let text = UserDefaults.standard.object(forKey: kAccessTokenDefaultsKey) as? String {
            accessTokenTextField.text = text
        } else {
            let uuid = UUID().uuidString
            accessTokenTextField.text = uuid
            UserDefaults.standard.setValue(uuid, forKey: kAccessTokenDefaultsKey)
        }
        
        self.autoRequestSwitch.isOn = UserDefaults.standard.bool(forKey: kAutoRequestDefaultsKey)
    }
    
    override func viewDidAppear(_ animated: Bool) {
        super.viewDidAppear(animated)
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
    }

    @IBAction func autoRequestSwitchAction(_ sender: UISwitch) {
        UserDefaults.standard.set(sender.isOn, forKey: kAutoRequestDefaultsKey)
    }
    
    
    override func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        guard indexPath.row == tableView.numberOfRows(inSection: 0) - 1 else {
            return
        }
        
        sendHTTP(with: requestObject, accessToken: accessTokenTextField.text, userToken: userTokenTextField.text) { (success, result) in
            self.delegate?.httpViewController(success: success, with: result)
            self.navigationController?.popViewController(animated: true)
        }
    }
    
    /*
    // MARK: - Navigation

    // In a storyboard-based application, you will often want to do a little preparation before navigation
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        // Get the new view controller using segue.destinationViewController.
        // Pass the selected object to the new view controller.
    }
    */

}


func sendHTTP(with requestObject: [String: Any], accessToken: String?, userToken: String?, completion: @escaping ((Bool, Any?)->Void)) {
    guard let url: String = requestObject["url"] as? String else {
        return
    }
    guard let method: String = requestObject["method"] as? String else {
        return
    }
    
    var request = URLRequest(url: URL(string: url)!)
    request.httpMethod = method
    
    if let headers = requestObject["headers"] as? [String: Any] {
        for item in headers {
            request.addValue(String.init(forceCast: item.value), forHTTPHeaderField: item.key)
        }
    }
    
    if let userToken = userToken {
        request.setValue(userToken, forHTTPHeaderField: "User-Token")
    }
    if let accessToken = accessToken {
        request.setValue(accessToken, forHTTPHeaderField: "Access-Token")
    }
    
    if let tmp = requestObject["params"] as? [String: Any] {
        let string = tmp.map({ (item) -> String in
            return "\(item.key)=\(item.value)"
        }).joined(separator: "&")
        request.httpBody = string.data(using: .utf8)
    }
    
    let activity = UIActivityIndicatorView(activityIndicatorStyle: .whiteLarge)
    activity.frame = UIScreen.main.bounds
    activity.backgroundColor = UIColor.black.withAlphaComponent(0.7)
    UIApplication.shared.keyWindow?.addSubview(activity)
    
    activity.startAnimating()
    activity.hidesWhenStopped = true
    URLSession.shared.dataTask(with: request, completionHandler: { (data, response, error) -> Void in
        var result: Any? = nil
        
        if let data = data {
            if let response = response {
                if let mimeType = response.mimeType {
                    if mimeType == "application/json" {
                        result = try? JSONSerialization.jsonObject(with: data, options: .allowFragments)
                    }
                }
            }
            if result == nil {
                result = String(data: data, encoding: .utf8)
            }
        }
        
        DispatchQueue.main.async {
            activity.stopAnimating()
            activity.removeFromSuperview()
            completion(error == nil,  result)
        }
    }).resume()
    
    UserDefaults.standard.setValue(userToken, forKey: kUserTokenDefaultsKey)
    UserDefaults.standard.setValue(accessToken, forKey: kAccessTokenDefaultsKey)
}
