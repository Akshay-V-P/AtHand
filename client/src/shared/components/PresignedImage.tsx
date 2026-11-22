import React, { useState, useEffect } from 'react';
import { resolveDisplayUrl } from '../../services/imageService';
import { Image as ImageIcon, ImageOff } from 'lucide-react';

export interface PresignedImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src'> {
    src?: string | null;
    alt?: string;
    className?: string;
    containerClassName?: string;
    fallbackIcon?: React.ReactNode;
    showSkeleton?: boolean;
}

export const PresignedImage: React.FC<PresignedImageProps> = ({
    src,
    alt = 'Image',
    className = 'w-full h-full object-cover',
    containerClassName = '',
    fallbackIcon,
    showSkeleton = true,
    onClick,
    ...imgProps
}) => {
    const [displayUrl, setDisplayUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [hasError, setHasError] = useState<boolean>(false);

    useEffect(() => {
        let isMounted = true;

        if (!src) {
            setDisplayUrl(null);
            setIsLoading(false);
            setHasError(true);
            return;
        }

        const trimmed = src.trim();
        if (!trimmed) {
            setDisplayUrl(null);
            setIsLoading(false);
            setHasError(true);
            return;
        }

        // Direct web or local preview URLs
        if (
            trimmed.startsWith('http://') ||
            trimmed.startsWith('https://') ||
            trimmed.startsWith('blob:') ||
            trimmed.startsWith('data:')
        ) {
            setDisplayUrl(trimmed);
            setIsLoading(false);
            setHasError(false);
            return;
        }

        // S3 key -> resolve asynchronously
        setIsLoading(true);
        setHasError(false);

        resolveDisplayUrl(trimmed)
            .then((resolved) => {
                if (!isMounted) return;
                if (resolved) {
                    setDisplayUrl(resolved);
                    setHasError(false);
                } else {
                    setDisplayUrl(null);
                    setHasError(true);
                }
            })
            .catch(() => {
                if (!isMounted) return;
                setDisplayUrl(null);
                setHasError(true);
            })
            .finally(() => {
                if (isMounted) setIsLoading(false);
            });

        return () => {
            isMounted = false;
        };
    }, [src]);

    const handleImgError = () => {
        setHasError(true);
        setIsLoading(false);
    };

    const handleImgLoad = () => {
        setIsLoading(false);
        setHasError(false);
    };

    if (hasError || (!isLoading && !displayUrl)) {
        return (
            <div
                className={`flex items-center justify-center bg-gray-100 text-gray-400 select-none ${containerClassName || className}`}
                onClick={onClick}
                role={onClick ? 'button' : undefined}
            >
                {fallbackIcon || <ImageOff className="w-5 h-5 text-gray-400" />}
            </div>
        );
    }

    return (
        <div className={`relative overflow-hidden ${containerClassName}`}>
            {isLoading && showSkeleton && (
                <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center z-0">
                    <ImageIcon className="w-5 h-5 text-gray-300 animate-pulse" />
                </div>
            )}
            {displayUrl && (
                <img
                    src={displayUrl}
                    alt={alt}
                    className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-200`}
                    onError={handleImgError}
                    onLoad={handleImgLoad}
                    onClick={onClick}
                    {...imgProps}
                />
            )}
        </div>
    );
};

export default PresignedImage;
