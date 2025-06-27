import { Link } from "react-router-dom";
import Navigation from "../Navigation/Navigation";
import Button from "../Button/Button";
import styles from "./Header.module.scss";

const Header = () => {
    return (
        <header className={styles.header}>
            <div className="container">
                <div className={styles.content}>
                    {/* Brand/Logo */}
                    <div className={styles.brand}>
                        <Link to="/" className={styles.brandLink}>
                            <h1 className={styles.brandTitle}>BlogUI</h1>
                        </Link>
                    </div>

                    {/* Navigation */}
                    <Navigation />

                    {/* Mobile Menu Toggle */}
                    <button className={styles.mobileMenuToggle}>
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>

                    {/* Auth Actions */}
                    <div className={styles.actions}>
                        <Link to="/login">
                            <Button variant="ghost" size="sm">
                                Login
                            </Button>
                        </Link>
                        <Link to="/register">
                            <Button variant="primary" size="sm">
                                Sign Up
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
