//
//  UIButton.swift
//  Pods
//
//  Created by mlibai on 2017/5/4.
//
//

import Foundation
import SDWebImage


extension UIButton {
    
    public func setImage(with url: URL?, for state: UIControlState) {
        setImage(with: url, for: state, placeholderImage: nil, completed: nil)
    }
    
    public func setImage(with url: URL?, placeholderImage: UIImage, for state: UIControlState) {
        setImage(with: url, for: state, placeholderImage: placeholderImage, completed: nil)
    }
    
    func setImage(with url: URL?, for state: UIControlState, placeholderImage placeholder: UIImage?, completed completedBlock: ((_ image: UIImage?, _ imageURL: URL?, _ error: Error?)->Void)?) {
        sd_setImage(with: url, for: state, placeholderImage: placeholder, options: []) { (image, error, cacheType, url) in
            completedBlock?(image, url, error)
        }
    }
    
//    public func setImage(with url: URL?, for state: UIControlState, completed completedBlock: ((_ image: UIImage?, _ imageURL: URL?, _ error: Error?)->Void)?) {
//        sd_setImage(with: url, for: state) { (image, error, cacheType, url) in
//            completedBlock?(image, url, error)
//        }
//    }
    
}
