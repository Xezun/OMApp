//
//  ConsoleTableViewController.swift
//  Browser
//
//  Created by mlibai on 2017/6/19.
//  Copyright © 2017年 mlibai. All rights reserved.
//

import UIKit

let kConsoleTextDefaultsKey = "kConsoleTextDefaultsKey"

class ConsoleTableViewController: UITableViewController, UITextViewDelegate {
    
    @IBOutlet weak var textView: UITextView!
    @IBOutlet weak var outputLabel: UILabel!
    
    weak var webView: UIWebView?
    
    
    override func viewDidLoad() {
        super.viewDidLoad()
        tableView.rowHeight = UITableViewAutomaticDimension
        tableView.estimatedRowHeight = 200;
        textView.delegate = self
        
        if let string = UserDefaults.standard.string(forKey: kConsoleTextDefaultsKey) {
            textView.text = string
        }
        
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }

    
    @IBAction func exitButtonAction(_ sender: Any) {
        if self.navigationController != nil {
            navigationController?.popViewController(animated: true)
        } else {
            dismiss(animated: true, completion: nil)
        }
    }
   
    @IBAction func runButtonAction(_ sender: Any) {
        guard let js = textView.text else {
            return
        }
        UserDefaults.standard.set(js, forKey: kConsoleTextDefaultsKey)
        outputLabel.text = webView?.stringByEvaluatingJavaScript(from: js)
    }
}
