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
    func loginViewController(_ viewController: LoginTableViewController, didFinishLoginingWith result: String) -> Void
}

class LoginTableViewController: UITableViewController, NavigationBarCustomizable, NavigationGestureDrivable {
    
    weak var delegate: LoginTableViewControllerDelegate?

    @IBOutlet weak var textView: UITextView!
    override func viewDidLoad() {
        super.viewDidLoad()

        if navigationController!.isNavigationBarCustomizable {
            customNavigationBar.barTintColor = .red
            customNavigationBar.title = "登录"
        }
        
        // Uncomment the following line to preserve selection between presentations
        // self.clearsSelectionOnViewWillAppear = false

        // Uncomment the following line to display an Edit button in the navigation bar for this view controller.
        // self.navigationItem.rightBarButtonItem = self.editButtonItem()
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }

    override func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        switch indexPath.item {
        case 2:
            view.resignFirstResponder()
            delegate?.loginViewController(self, didFinishLoginingWith: textView.text)
            navigationController?.popViewController(animated: true)
        default:
            super.tableView(tableView, didSelectRowAt: indexPath)
        }
    }

}
