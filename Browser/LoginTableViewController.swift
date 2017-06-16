//
//  LoginTableViewController.swift
//  WebView
//
//  Created by mlibai on 2017/5/18.
//  Copyright © 2017年 mlibai. All rights reserved.
//

import UIKit
import XZKit

protocol LoginTableViewControllerDelegate: class {
    func loginViewController(_ viewController: LoginTableViewController, didFinishLoginingWith result: (id: String, name: String, type: String, coin: String, success: Bool)) -> Void
}

class LoginTableViewController: UITableViewController, NavigationBarCustomizable, NavigationGestureDrivable {
    
    weak var delegate: LoginTableViewControllerDelegate?
    
    @IBOutlet weak var idTextField: UITextField!
    @IBOutlet weak var nameTextField: UITextField!
    @IBOutlet weak var coinTextField: UITextField!
    @IBOutlet weak var typeTextField: UITextField!
    @IBOutlet weak var userTokenTextField: UITextField!
    @IBOutlet weak var successSwitch: UISwitch!
    
    override func viewDidLoad() {
        super.viewDidLoad()

        if navigationController!.isNavigationBarCustomizable {
            customNavigationBar.barTintColor = .red
            customNavigationBar.title = "登录"
        }
        
        if let userToken = UserDefaults.standard.object(forKey: kUserTokenDefaultsKey) as? String {
            userTokenTextField.text = userToken
        }
    }
    
    @IBAction func successSwitchAction(_ sender: UISwitch) {
        let isEnabled = sender.isOn
        idTextField.isEnabled = isEnabled
        nameTextField.isEnabled = isEnabled
        coinTextField.isEnabled = isEnabled
        typeTextField.isEnabled = isEnabled
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }

    override func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        switch indexPath.item {
        case 7:
            view.resignFirstResponder()
            if successSwitch.isOn {
                let id = idTextField.text ?? "0"
                let name = nameTextField.text ?? "no name"
                let coin = coinTextField.text ?? "0"
                let type = typeTextField.text ?? "facebook"
                delegate?.loginViewController(self, didFinishLoginingWith: (id, name, type, coin, true))
            } else {
                delegate?.loginViewController(self, didFinishLoginingWith: ("", "未登录", "", "0", true))
            }
            
            if let userToken = userTokenTextField.text {
                if userToken.characters.count > 0 {
                    UserDefaults.standard.setValue(userToken, forKey: kUserTokenDefaultsKey)
                }
            }
            
            navigationController?.popViewController(animated: true)
        default:
            super.tableView(tableView, didSelectRowAt: indexPath)
        }
    }

}
