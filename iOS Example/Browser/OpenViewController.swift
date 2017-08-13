//
//  OpenViewController.swift
//  WebView
//
//  Created by mlibai on 2017/5/18.
//  Copyright © 2017年 mlibai. All rights reserved.
//

import UIKit

class OpenViewController: UIViewController {
    
    var rawValue: String? {
        didSet {
            rawValueLabel?.text = rawValue
        }
    }
    
    
    var pageName: String? {
        didSet {
            pageNameLabel?.text = pageName
        }
    }
    
    var pageID: String? {
        didSet {
            pageIDLabel?.text = pageID
        }
    }
    
    @IBOutlet weak var rawValueLabel: UILabel!
    

    @IBOutlet weak var pageNameLabel: UILabel!
    @IBOutlet weak var pageIDLabel: UILabel!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        rawValueLabel.text = rawValue
        pageIDLabel.text = pageID
        pageNameLabel.text = pageName
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
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
