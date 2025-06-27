import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import placeholderImage from "../../assets/placeholder.svg";

const FallbackImage = ({
    src,
    alt = "",
    fallbackSrc = placeholderImage,
    className,
    style,
    onError,
    onLoad,
    ...props
}) => {
    const [imgSrc, setImgSrc] = useState(src || fallbackSrc);
    const [hasError, setHasError] = useState(false);

    const handleError = (event) => {
        // Chỉ fallback nếu chưa lỗi và đang không phải là fallback image
        if (!hasError && imgSrc !== fallbackSrc) {
            setHasError(true);
            setImgSrc(fallbackSrc);
        }

        // Gọi onError callback nếu được truyền vào (chỉ cho ảnh gốc, không cho fallback)
        if (onError && imgSrc !== fallbackSrc) {
            onError(event);
        }
    };

    const handleLoad = (event) => {
        // Chỉ reset hasError nếu load thành công và đang là ảnh gốc
        if (imgSrc === src) {
            setHasError(false);
        }

        // Gọi onLoad callback nếu được truyền vào
        if (onLoad) {
            onLoad(event);
        }
    };

    // Reset imgSrc khi src prop thay đổi
    useEffect(() => {
        if (src !== imgSrc) {
            setImgSrc(src || fallbackSrc);
            setHasError(false);
        }
    }, [src, fallbackSrc]);

    return (
        <img
            src={imgSrc}
            alt={alt}
            className={className}
            style={style}
            onError={handleError}
            onLoad={handleLoad}
            {...props}
        />
    );
};

FallbackImage.propTypes = {
    src: PropTypes.string,
    alt: PropTypes.string,
    fallbackSrc: PropTypes.string,
    className: PropTypes.string,
    style: PropTypes.object,
    onError: PropTypes.func,
    onLoad: PropTypes.func,
};

export default FallbackImage;
