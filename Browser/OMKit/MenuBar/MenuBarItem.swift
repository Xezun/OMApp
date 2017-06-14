//
//  MenuBarItem.swift
//  OMKit
//
//  Created by mlibai on 2017/5/16.
//  Copyright © 2017年 mlibai. All rights reserved.
//

import Foundation
import UIKit

protocol MenuBarItemDelegate: class {
    func menuBarItemDidChangeContent(_ menuBarItem: MenuBarItem) -> Void
}

open class MenuBarItem: NSObject, NSCoding {
    
    open let id: String
    
    open var title: String {
        didSet {
            delegate?.menuBarItemDidChangeContent(self)
        }
    }
    
    open var image: UIImage? {
        didSet {
            delegate?.menuBarItemDidChangeContent(self)
        }
    }
    
    open var imageURL: URL? {
        didSet {
            delegate?.menuBarItemDidChangeContent(self)
        }
    }
    
    public init(id: String, title: String, image: UIImage? = nil, imageURL: URL? = nil) {
        self.id         = id
        self.title      = title
        self.image      = image
        self.imageURL   = imageURL
    }
    
    open static func ==(lhs: MenuBarItem, rhs: MenuBarItem) -> Bool {
        return (lhs.title == rhs.title)
    }
    
    public required init?(coder aDecoder: NSCoder) {
        let id: String      = aDecoder.decodeObject(forKey: "id") as! String
        let title: String   = aDecoder.decodeObject(forKey: "title") as! String
        let image  = aDecoder.decodeObject(forKey: "image") as? UIImage
        
        self.id         = id
        self.title      = title
        self.image      = image
        
        if let imageURL = aDecoder.decodeObject(forKey: "imageURL") as? String {
            self.imageURL   = URL(string: imageURL)
        }
    }
    
    public func encode(with aCoder: NSCoder) {
        aCoder.encode(id, forKey: "id")
        aCoder.encode(title, forKey: "title")
        aCoder.encode(image, forKey: "image")
        aCoder.encode(imageURL?.absoluteString, forKey: "imageURL")
    }
    
    override open func isEqual(_ object: Any?) -> Bool {
        if let obj = object as? MenuBarItem {
            return (id == obj.id && title == obj.title)
        }
        return super.isEqual(object)
    }
    
    weak var delegate: MenuBarItemDelegate?
    
}

