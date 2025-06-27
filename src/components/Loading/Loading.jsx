import PropTypes from "prop-types";

import styles from "./Loading.module.scss";

const Loading = ({
    size = "md",
    color = "primary",
    className = "",
    text = "",
    fullScreen = false,
}) => {
    const sizeClass = {
        sm: styles.small,
        md: styles.medium,
        lg: styles.large,
    }[size];

    const colorClass = {
        primary: styles.primary,
        secondary: styles.secondary,
        white: styles.white,
    }[color];

    const loadingClasses = `${
        styles.loading
    } ${sizeClass} ${colorClass} ${className} ${
        fullScreen ? styles.fullScreen : ""
    }`.trim();

    if (fullScreen) {
        return (
            <div className={styles.fullScreenOverlay}>
                <div className={loadingClasses}>
                    <div className={styles.spinner}></div>
                    {text && <p className={styles.text}>{text}</p>}
                </div>
            </div>
        );
    }

    return (
        <div className={loadingClasses}>
            <div className={styles.spinner}></div>
            {text && <p className={styles.text}>{text}</p>}
        </div>
    );
};

Loading.propTypes = {
    size: PropTypes.oneOf(["sm", "md", "lg"]),
    color: PropTypes.oneOf(["primary", "secondary", "white"]),
    className: PropTypes.string,
    text: PropTypes.string,
    fullScreen: PropTypes.bool,
};

export default Loading;
