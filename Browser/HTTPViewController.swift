//
//  HTTPViewController.swift
//  Browser
//
//  Created by mlibai on 2017/6/14.
//  Copyright © 2017年 mlibai. All rights reserved.
//

import UIKit
import XZKit

protocol HTTPViewControllerDelegate: class {
    func httpViewController(success: Bool, with result: String?)
}

class HTTPViewController: UIViewController, NavigationBarCustomizable, NavigationGestureDrivable {
    
    static func viewController(requestObject: [String: Any]) -> HTTPViewController {
        let viewController = UIStoryboard(name: "Main", bundle: nil).instantiateViewController(withIdentifier: "http") as! HTTPViewController
        viewController.requestObject = requestObject
        return viewController
    }
    
    var requestObject: [String: Any]!
    
    weak var delegate: HTTPViewControllerDelegate?
    
    @IBOutlet weak var headersTextView: UITextView!
    @IBOutlet weak var parametersTextView: UITextView!
    
    override func viewDidLoad() {
        super.viewDidLoad()

        if navigationController!.isNavigationBarCustomizable {
            customNavigationBar.barTintColor = .red
            customNavigationBar.title = "HTTP 测试"
        }
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        
    }
    
    @IBAction func requestButtonAction(_ sender: Any) {
        
        let url: String = requestObject["url"] as! String
        let method: String = requestObject["method"] as! String
        
        var request = URLRequest(url: URL(string: url)!)
        request.httpMethod = method
        
        if let headers = requestObject["headers"] as? [String: Any] {
            for item in headers {
                request.addValue(String.init(forceCast: item.value), forHTTPHeaderField: item.key)
            }
        }
        
        if let data = headersTextView.text.data(using: .utf8) {
            guard let headers = (try? JSONSerialization.jsonObject(with: data, options: .allowFragments)) as? [String: Any] else { return }
            for item in headers {
                request.addValue(String.init(forceCast: item.value), forHTTPHeaderField: item.key)
            }
        }
        
        var params = [String: Any]()
        if let tmp = requestObject["params"] as? [String: Any] {
            for item in tmp {
                params.updateValue(item.value, forKey: item.key)
            }
        }
        if let data = parametersTextView.text.data(using: .utf8) {
            if let parameters = (try? JSONSerialization.jsonObject(with: data, options: .allowFragments)) as? [String: Any] {
                for item in parameters {
                    params.updateValue(item.value, forKey: item.key)
                }
            }
        }
        let string = params.map({ (item) -> String in
            return "\(item.key)=\(item.value)"
        }).joined(separator: "&")
        request.httpBody = string.data(using: .utf8)
        
        URLSession.shared.dataTask(with: request, completionHandler: { (data, response, error) -> Void in
            var result: String? = nil
            if let data = data {
                result = String(data: data, encoding: .utf8)
            }
            DispatchQueue.main.async {
                self.delegate?.httpViewController(success: (error == nil), with: result)
                self.navigationController?.popViewController(animated: true)
            }
        }).resume()

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
