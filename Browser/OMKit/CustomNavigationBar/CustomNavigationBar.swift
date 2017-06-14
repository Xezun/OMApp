//
//  CustomNavigationBar.swift
//  TT
//
//  Created by Onemena on 2017/4/6.
//  Copyright © 2017年 OneMena. All rights reserved.
//

import UIKit
import XZKit

open class CustomNavigationBar: NavigationBar {
    
    open override var tintColor: UIColor! {
        get {
            return super.tintColor
        }
        set {
            super.tintColor = tintColor
            _titleButton?.tintColor = newValue
            _infoButton?.tintColor = newValue
            _backButton?.tintColor = newValue
            _closeButton?.tintColor = newValue
        }
    }
    
    private var _titleButton: UIButton?
    open var titleButton: UIButton {
        get {
            if let button = _titleButton {
                return button
            }
            let button = UIButton()
            button.titleLabel?.font = UIFont(name: "OM-Arabic-Title-Regular", size: 18.0)
            self.addSubview(button)
            _titleButton = button
            return button
        }
        set {
            _titleButton?.removeFromSuperview()
            addSubview(newValue)
            _titleButton = newValue
        }
    }
    
    private var _infoButton: UIButton?
    open var infoButton: UIButton {
        get {
            if let button = _infoButton {
                return button
            }
            let button = UIButton()
            self.addSubview(button)
            _infoButton = button
            return button
        }
        set {
            _infoButton?.removeFromSuperview()
            addSubview(newValue)
            _infoButton = newValue
        }
    }
    
    private var _backButton: UIButton?
    open var backButton: UIButton {
        get {
            if let button = _backButton {
                return button
            }
            let button = UIButton()
            self.addSubview(button)
            _backButton = button
            return button
        }
        set {
            _backButton?.removeFromSuperview()
            addSubview(newValue)
            _backButton = newValue
        }
    }
    
    private var _closeButton: UIButton?
    open var closeButton: UIButton {
        get {
            if let button = _closeButton {
                return button
            }
            let button = UIButton()
            self.addSubview(button)
            _closeButton = button
            return button
        }
        set {
            _closeButton?.removeFromSuperview()
            addSubview(newValue)
            _closeButton = newValue
        }
    }
    
    open var title: String? {
        get {
            return self.titleButton.title(for: .normal)
        }
        set {
            self.titleButton.setTitle(newValue, for: .normal)
            titleButton.sizeToFit();
        }
    }
    
    open var titleImage: UIImage? {
        get {
            return self.titleButton.image(for: .normal)
        }
        set {
            self.titleButton.setImage(newValue, for: .normal)
        }
    }
    
    override open func layoutSubviews() {
        super.layoutSubviews()
        
        let BOUNDS = self.bounds
        
        if let infoButton = _infoButton {
            if infoButton.frame.isEmpty {
                infoButton.sizeToFit()
            }
            var frame = infoButton.frame
            frame.origin.x = BOUNDS.minX + 16.0
            frame.origin.y = (BOUNDS.height - frame.height) * 0.5
            infoButton.frame = frame
        }
        
        if let titleButton = _titleButton {
            if titleButton.frame.isEmpty {
                titleButton.sizeToFit()
            }
            var frame = titleButton.frame
            frame.origin.x = (BOUNDS.width - frame.width) * 0.5
            frame.origin.y = (BOUNDS.height - frame.height) * 0.5
            titleButton.frame = frame
        }
        
        if let backButton = _backButton {
            if backButton.frame.isEmpty {
                backButton.sizeToFit()
            }
            var frame = backButton.frame
            frame.origin.x = BOUNDS.maxX - frame.width - 16
            frame.origin.y = (BOUNDS.height - frame.height) * 0.5
            backButton.frame = frame
        }
        
        if let closeButton = _closeButton {
            if closeButton.frame.isEmpty {
                closeButton.sizeToFit()
            }
            var frame = closeButton.frame
            frame.origin.x = BOUNDS.maxX - frame.width - 16
            frame.origin.y = (BOUNDS.height - frame.height) * 0.5
            
            if let backButton = _backButton {
                frame.origin.x -= (backButton.frame.width + 20.0)
            }
            
            closeButton.frame = frame
        }
        
        _separatorView.frame.origin.y = BOUNDS.maxY - 0.5
        
    }
    
    private lazy var _separatorView: UIView = self.loadSeparatorView()
    
    open var shadowColor: UIColor? {
        get {
            return _separatorView.backgroundColor
        }
        set {
            _separatorView.backgroundColor = newValue
        }
    }
    
    /*
    // Only override draw() if you perform custom drawing.
    // An empty implementation adversely affects performance during animation.
    override func draw(_ rect: CGRect) {
        // Drawing code
    }
    */

    private func loadSeparatorView() -> UIView {
        let view = UIView()
        view.autoresizingMask = [.flexibleWidth, .flexibleTopMargin]
        var frame = self.bounds
        frame.origin.y = frame.maxY - 0.5
        frame.size.height = 0.5
        view.frame = frame
        addSubview(view)
        return view
    }
    
}

extension UIViewController {
    
    /// 自定义的导航条。与 navigationBar  属性相同，但是在控制器生命周期内，必须首先调用此属性。
    public var customNavigationBar: CustomNavigationBar! {
        if let vc = (self as? NavigationBarCustomizable) {
            if vc.isNavigationBarLoaded {
                return vc.navigationBar as? CustomNavigationBar
            } else {
                let bar = CustomNavigationBar()
                bar.autoresizingMask = [.flexibleWidth]
                bar.isTranslucent = false
                bar.isHidden      = false
                vc.navigationBar  = bar
                return bar
            }
        }
        assert(false, "current controller `\(self)` is not NavigationBarCustomizable")
        return nil
    }
    
    
    /// 控制器将自己从 UINavigationController 栈中弹出。
    ///
    /// - Parameter animated: 当该值为布尔值时，表示是否动画。其它值表示一定执行动画。
    /// - Returns: 弹出的控制器
    public func navigationControllerPopViewController(animated: Any?) -> UIViewController? {
        if let animated = animated as? Bool {
            return navigationController?.popViewController(animated: animated)
        }
        return navigationController?.popViewController(animated: true)
    }
    
    public func navigationControllerPopToRootViewController(animated: Any?) -> [UIViewController]? {
        if let animated = animated as? Bool {
            return navigationController?.popToRootViewController(animated: animated)
        }
        return navigationController?.popToRootViewController(animated: true)
    }
    
}
