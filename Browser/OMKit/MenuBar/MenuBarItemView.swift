//
//  MenuBarItemView.swift
//  OMKit
//
//  Created by mlibai on 2017/5/16.
//  Copyright © 2017年 mlibai. All rights reserved.
//

import UIKit

class MenuBarItemView: UIControl {
    
    override var intrinsicContentSize: CGSize {
        let labelSize = _titleLabel?.intrinsicContentSize ?? .zero
        let imageSize = _imageView?.intrinsicContentSize ?? .zero
        return CGSize(width: max(labelSize.width, imageSize.width), height: labelSize.height + imageSize.height)
    }
    
    override func layoutSubviews() {
        super.layoutSubviews()
    }
    
    var title: String? {
        get {
            return _titleLabel?.text
        }
        set {
            titleLabel.text = newValue
            setNeedsLayout()
        }
    }
    
    var image: UIImage? {
        get {
            return _imageView?.image
        }
        set {
            imageView.image = newValue
            setNeedsLayout()
        }
    }
    
    var _titleLabel: UILabel?
    var titleLabel: UILabel {
        if let titleLabel = _titleLabel {
            return titleLabel
        }
        let titleLabel = UILabel()
        addSubview(titleLabel)
        titleLabel.translatesAutoresizingMaskIntoConstraints = false
        
        let layout1 = NSLayoutConstraint(item: titleLabel, attribute: .bottom, relatedBy: .equal, toItem: self, attribute: .bottom, multiplier: 1.0, constant: 0)
        let layout2 = NSLayoutConstraint(item: titleLabel, attribute: .centerX, relatedBy: .equal, toItem: self, attribute: .centerX, multiplier: 1.0, constant: 0)
        addConstraint(layout1)
        addConstraint(layout2)
        _titleLabel = titleLabel
        
        return titleLabel
    }
    
    var _imageView: UIImageView?
    var imageView: UIImageView {
        if let iconImageView = _imageView {
            return iconImageView
        }
        let iconImageView = UIImageView()
        addSubview(iconImageView)
        
        iconImageView.translatesAutoresizingMaskIntoConstraints = false
        
        let layout1 = NSLayoutConstraint(item: iconImageView, attribute: .top, relatedBy: .equal, toItem: self, attribute: .top, multiplier: 1.0, constant: 0)
        let layout2 = NSLayoutConstraint(item: iconImageView, attribute: .centerX, relatedBy: .equal, toItem: self, attribute: .centerX, multiplier: 1.0, constant: 0)
        let layout3 = NSLayoutConstraint(item: iconImageView, attribute: .width, relatedBy: .equal, toItem: iconImageView, attribute: .height, multiplier: 1.0, constant: 0)
        let layout4 = NSLayoutConstraint(item: iconImageView, attribute: .width, relatedBy: .equal, toItem: nil, attribute: .notAnAttribute, multiplier: 1.0, constant: 24)
        addConstraint(layout1)
        addConstraint(layout2)
        iconImageView.addConstraint(layout3)
        addConstraint(layout4)
        
        _imageView = iconImageView
        return iconImageView
    }
    
}
