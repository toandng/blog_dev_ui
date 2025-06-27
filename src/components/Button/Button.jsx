import PropTypes from "prop-types";
import clsx from "clsx";
import styles from "./Button.module.scss";

const Button = ({
    children,
    variant = "primary",
    size = "md",
    disabled = false,
    loading = false,
    fullWidth = false,
    type = "button",
    onClick,
    className,
    ...props
}) => {
    const buttonClasses = clsx(
        styles.button,
        styles[variant],
        styles[size],
        {
            [styles.disabled]: disabled,
            [styles.loading]: loading,
            [styles.fullWidth]: fullWidth,
        },
        className
    );

    return (
        <button
            type={type}
            className={buttonClasses}
            disabled={disabled || loading}
            onClick={onClick}
            {...props}
        >
            {loading && <span className={styles.spinner} aria-hidden="true" />}
            <span className={loading ? styles.hiddenText : ""}>{children}</span>
        </button>
    );
};

Button.propTypes = {
    children: PropTypes.node.isRequired,
    variant: PropTypes.oneOf(["primary", "secondary", "ghost", "danger"]),
    size: PropTypes.oneOf(["sm", "md", "lg"]),
    disabled: PropTypes.bool,
    loading: PropTypes.bool,
    fullWidth: PropTypes.bool,
    type: PropTypes.oneOf(["button", "submit", "reset"]),
    onClick: PropTypes.func,
    className: PropTypes.string,
};

export default Button;
