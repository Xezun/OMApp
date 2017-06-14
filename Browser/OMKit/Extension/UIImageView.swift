//
//  UIImageView.swift
//  OMKit
//
//  Created by mlibai on 2017/4/26.
//  Copyright © 2017年 mlibai. All rights reserved.
//

import Foundation
import XZKit
import SDWebImage

public class WebImageManager {

    /// 图片缓存大小
    public static var sizeOfCaches: UInt {
        return SDWebImageManager.shared().imageCache?.getSize() ?? 0
    }
    
    /// 异步获取图片大小
    public static func fetchCachesSize(_ completion: @escaping ((_: UInt) -> Void)) -> Void {
        DispatchQueue.global().async {
            let size: UInt = WebImageManager.sizeOfCaches
            DispatchQueue.main.async {
                completion(size)
            }
        }
    }
    
    /// 移除所有缓存的图片
    public static func removeAllCachedImages() {
        SDWebImageManager.shared().imageCache?.clearDisk()
    }
    
    /// 取消所有正在下载的图片
    public static func cancelAllDownloadings() {
        SDWebImageManager.shared().cancelAll()
    }
    
    /// 根据图片 URL 获取缓存的图片
    ///
    /// - Parameter imageURL: 图片 URL
    /// - Returns: 该地址对应的图片已缓存，则返回 UIImage 对象
    public static func cachedImage(for imageURL: URL) -> UIImage? {
        return SDWebImageManager.shared().imageCache?.imageFromMemoryCache(forKey: SDWebImageManager.shared().cacheKey(for: imageURL))
    }
    
    /// 下载图片。该方法首先从缓存获取图片，如果获取失败再从网络下载。
    ///
    /// - Parameters:
    ///   - imageURL: 图片 URL
    ///   - progress: 下载进度 0 ～ 1.0
    ///   - completion: 下载成功的回调。回调参数为图片的缓存地址和 UIImage 对象。
    public static func downloadImage(from imageURL: URL, progress: ((_ progress: CGFloat) -> Void)?, completion:((_ cachePath: String?, _ image: UIImage?) -> Void)?) {
        SDWebImageManager.shared().diskImageExists(for: imageURL, completion: { (isExists) in
            let key = SDWebImageManager.shared().cacheKey(for: imageURL)
            if isExists {
                let path: String! = SDWebImageManager.shared().imageCache?.defaultCachePath(forKey: key)
                completion?(path, SDWebImageManager.shared().imageCache?.imageFromDiskCache(forKey: key))
            } else {
                SDWebImageManager.shared().loadImage(with: imageURL, options: [], progress: { (a, b, url) in
                    guard b > 0 else { return }
                    progress?(CGFloat(a) / CGFloat(b))
                }, completed: { (image, data, error, imageCacheType, finished, url) in
                    if error == nil {
                        self.downloadImage(from: imageURL, progress: progress, completion: completion)
                    } else {
                        completion?(nil, image)
                    }
                })
            }
        })
    }
    
}

extension UIImageView {
    
    public func setImage(with url: URL?) {
        setImage(with: url, completed: nil)
    }
    
    public func setImage(with url: URL?, completed completedBlock: ((_ image: UIImage?, _ imageURL: URL?, _ error: Error?)->Void)?) {
        sd_setImage(with: url) { (image, error, cacheType, imageURL) in
            completedBlock?(image, imageURL, error)
        }
    }
    
    public func setImage(with url: URL?, placeholderImage placeholder: UIImage?) {
        setImage(with: url, placeholderImage: placeholder, completed: nil)
    }
    
    public func setImage(with url: URL?, placeholderImage placeholder: UIImage?, completed completedBlock: ((_ image: UIImage?, _ imageURL: URL?, _ error: Error?)->Void)?) {
        self.placeholder = placeholder
        setImage(with: url, completed: completedBlock)
    }
    
}
