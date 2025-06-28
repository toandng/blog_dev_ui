import { useState } from "react";
import PropTypes from "prop-types";
import styles from "./MetricCard.module.scss";

const MetricCard = ({
    title,
    value,
    previousValue,
    change,
    changeType = "auto", // auto, positive, negative, neutral
    format = "number", // number, percentage, currency, time
    icon,
    color = "primary",
    size = "medium",
    showTrend = true,
    isLoading = false,
    onClick,
    subtitle,
    target,
    className,
    ...props
}) => {
    const [isHovered, setIsHovered] = useState(false);

    // Calculate change if not provided
    const calculatedChange =
        change !== undefined
            ? change
            : previousValue !== undefined && value !== undefined
            ? ((value - previousValue) / previousValue) * 100
            : null;

    // Determine trend direction
    const getTrendDirection = () => {
        if (calculatedChange === null || calculatedChange === 0)
            return "neutral";
        if (changeType === "auto") {
            return calculatedChange > 0 ? "positive" : "negative";
        }
        return changeType;
    };

    const trendDirection = getTrendDirection();

    // Format value
    const formatValue = (val) => {
        if (val === null || val === undefined) return "--";

        switch (format) {
            case "percentage":
                return `${val.toFixed(1)}%`;
            case "currency":
                return new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                }).format(val);
            case "time":
                return `${val}h`;
            case "number":
            default:
                if (val >= 1000000) {
                    return `${(val / 1000000).toFixed(1)}M`;
                } else if (val >= 1000) {
                    return `${(val / 1000).toFixed(1)}K`;
                }
                return val.toLocaleString();
        }
    };

    // Get trend icon
    const getTrendIcon = () => {
        switch (trendDirection) {
            case "positive":
                return "📈";
            case "negative":
                return "📉";
            default:
                return "➡️";
        }
    };

    // Calculate progress to target
    const getProgress = () => {
        if (!target || !value) return null;
        return Math.min((value / target) * 100, 100);
    };

    const progress = getProgress();

    return (
        <div
            className={`
                ${styles.metricCard} 
                ${styles[color]} 
                ${styles[size]}
                ${onClick ? styles.clickable : ""}
                ${isLoading ? styles.loading : ""}
                ${className || ""}
            `}
            onClick={onClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            {...props}
        >
            {/* Loading overlay */}
            {isLoading && (
                <div className={styles.loadingOverlay}>
                    <div className={styles.spinner} />
                </div>
            )}

            {/* Card header */}
            <div className={styles.cardHeader}>
                <div className={styles.titleSection}>
                    {icon && (
                        <div className={styles.icon}>
                            {typeof icon === "string" ? (
                                <span>{icon}</span>
                            ) : (
                                icon
                            )}
                        </div>
                    )}
                    <div className={styles.titleContent}>
                        <h3 className={styles.title}>{title}</h3>
                        {subtitle && (
                            <p className={styles.subtitle}>{subtitle}</p>
                        )}
                    </div>
                </div>

                {showTrend && calculatedChange !== null && (
                    <div
                        className={`${styles.trendBadge} ${styles[trendDirection]}`}
                    >
                        <span className={styles.trendIcon}>
                            {getTrendIcon()}
                        </span>
                        <span className={styles.trendValue}>
                            {calculatedChange > 0 ? "+" : ""}
                            {calculatedChange.toFixed(1)}%
                        </span>
                    </div>
                )}
            </div>

            {/* Main value */}
            <div className={styles.valueSection}>
                <div className={styles.mainValue}>{formatValue(value)}</div>

                {previousValue !== undefined && (
                    <div className={styles.previousValue}>
                        vs {formatValue(previousValue)} last period
                    </div>
                )}
            </div>

            {/* Progress bar for target */}
            {target && (
                <div className={styles.progressSection}>
                    <div className={styles.progressInfo}>
                        <span className={styles.progressLabel}>
                            Target: {formatValue(target)}
                        </span>
                        <span className={styles.progressPercentage}>
                            {progress?.toFixed(1)}%
                        </span>
                    </div>
                    <div className={styles.progressBar}>
                        <div
                            className={styles.progressFill}
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>
            )}

            {/* Additional info on hover */}
            {isHovered && onClick && (
                <div className={styles.hoverOverlay}>
                    <span className={styles.clickHint}>Click for details</span>
                </div>
            )}
        </div>
    );
};

MetricCard.propTypes = {
    title: PropTypes.string.isRequired,
    value: PropTypes.number,
    previousValue: PropTypes.number,
    change: PropTypes.number,
    changeType: PropTypes.oneOf(["auto", "positive", "negative", "neutral"]),
    format: PropTypes.oneOf(["number", "percentage", "currency", "time"]),
    icon: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
    color: PropTypes.oneOf([
        "primary",
        "success",
        "warning",
        "danger",
        "info",
        "neutral",
    ]),
    size: PropTypes.oneOf(["small", "medium", "large"]),
    showTrend: PropTypes.bool,
    isLoading: PropTypes.bool,
    onClick: PropTypes.func,
    subtitle: PropTypes.string,
    target: PropTypes.number,
    className: PropTypes.string,
};

export default MetricCard;
