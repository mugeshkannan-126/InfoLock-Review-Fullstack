import React, { useState, useEffect } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MenuIcon from "@mui/icons-material/Menu";
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";

// React Icons
import { FiHome, FiLogIn, FiLogOut, FiUser, FiSettings } from "react-icons/fi";
import { RiDashboardLine } from "react-icons/ri";
import { BsFiles, BsPersonLinesFill } from "react-icons/bs";

// Logo
import logo from "../assets/appLogo.png";

// Styled components for enhanced UI
const GlassAppBar = styled(AppBar, {
    shouldForwardProp: (prop) => prop !== 'scrolled',
})(({ theme, $scrolled }) => ({
    background: $scrolled
        ? "rgba(255, 255, 255, 0.85)"
        : "rgba(255, 255, 255, 0.95)",
    backdropFilter: "blur(20px) saturate(180%)",
    WebkitBackdropFilter: "blur(20px) saturate(180%)",
    border: "1px solid rgba(255, 255, 255, 0.18)",
    borderRadius: theme.breakpoints.up('md') ? "0 0 28px 28px" : 0,
    marginX: theme.breakpoints.up('md') ? 24 : 0,
    marginTop: theme.breakpoints.up('md') ? 24 : 0,
    maxWidth: theme.breakpoints.up('md') ? "calc(100% - 48px)" : "100%",
    boxShadow: $scrolled
        ? `0 8px 32px rgba(0, 0, 0, 0.12),
           0 2px 6px rgba(0, 0, 0, 0.08),
           inset 0 1px 0 rgba(255, 255, 255, 0.3)`
        : `0 4px 6px -1px rgba(0, 0, 0, 0.05),
           0 10px 15px -3px rgba(0, 0, 0, 0.05),
           0 20px 25px -5px rgba(0, 0, 0, 0.04),
           inset 0 1px 0 rgba(255, 255, 255, 0.2)`,
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    "&::before": {
        content: '""',
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "linear-gradient(135deg, rgba(59, 130, 246, 0.03) 0%, rgba(16, 185, 129, 0.02) 100%)",
        borderRadius: "inherit",
        zIndex: -1,
    },
    "&::after": {
        content: '""',
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: "1px",
        background: "linear-gradient(90deg, transparent 0%, rgba(59, 130, 246, 0.2) 50%, transparent 100%)",
        zIndex: 1,
    }
}));

const EnhancedNavLink = styled(Button)(({ theme }) => ({}));

const GradientLoginButton = styled(Button)(({ theme }) => ({
    background: "linear-gradient(135deg, #3B82F6 0%, #6366F1 50%, #8B5CF6 100%)",
    color: "#FFFFFF",
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    textTransform: "none",
    fontWeight: 600,
    fontSize: "0.95rem",
    borderRadius: "16px",
    padding: "12px 24px",
    marginLeft: "16px",
    position: "relative",
    overflow: "hidden",
    boxShadow: `0 4px 15px rgba(59, 130, 246, 0.4),
              0 2px 6px rgba(59, 130, 246, 0.2),
              inset 0 1px 0 rgba(255, 255, 255, 0.2)`,
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    "&::before": {
        content: '""',
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "linear-gradient(135deg, #2563EB 0%, #4F46E5 50%, #7C3AED 100%)",
        opacity: 0,
        transition: "opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        zIndex: 0,
    },
    "&::after": {
        content: '""',
        position: "absolute",
        top: "50%",
        left: "50%",
        width: "0",
        height: "0",
        background: "rgba(255, 255, 255, 0.2)",
        borderRadius: "50%",
        transform: "translate(-50%, -50%)",
        transition: "width 0.6s cubic-bezier(0.4, 0, 0.2, 1), height 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
    },
    "&:hover": {
        transform: "translateY(-3px) scale(1.02)",
        boxShadow: `0 12px 25px rgba(59, 130, 246, 0.4),
                0 6px 12px rgba(59, 130, 246, 0.25),
                inset 0 1px 0 rgba(255, 255, 255, 0.3)`,
        "&::before": {
            opacity: 1,
        },
        "&::after": {
            width: "300px",
            height: "300px",
        }
    },
    "& > *": {
        position: "relative",
        zIndex: 1,
    },
    "& .MuiButton-startIcon": {
        transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    },
    "&:hover .MuiButton-startIcon": {
        transform: "rotate(360deg) scale(1.1)",
    }
}));

const UserProfileButton = styled(Button)(({ theme }) => ({
    textTransform: "none",
    borderRadius: "16px",
    padding: "8px 12px 8px 16px",
    marginLeft: "16px",
    background: "rgba(255, 255, 255, 0.9)",
    border: "1px solid rgba(0, 0, 0, 0.1)",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    color: "#374151",
    "&:hover": {
        background: "rgba(255, 255, 255, 1)",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        transform: "translateY(-2px)",
    },
}));

const LogoContainer = styled(motion.div)(({ theme }) => ({
    position: "relative",
    "&::before": {
        content: '""',
        position: "absolute",
        top: "-8px",
        left: "-8px",
        right: "-8px",
        bottom: "-8px",
        background: "linear-gradient(45deg, #3B82F6, #10B981, #8B5CF6, #F59E0B)",
        borderRadius: "20px",
        opacity: 0,
        filter: "blur(8px)",
        transition: "opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        zIndex: -1,
    },
    "&:hover::before": {
        opacity: 0.4,
    }
}));

const UserDropdownMenu = styled(Menu)(({ theme }) => ({
    "& .MuiPaper-root": {
        width: 280,
        borderRadius: "20px",
        background: "rgba(255, 255, 255, 0.98)",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(255, 255, 255, 0.3)",
        boxShadow: `0 20px 25px -5px rgba(0, 0, 0, 0.1),
              0 10px 10px -5px rgba(0, 0, 0, 0.04)`,
        overflow: "hidden",
        padding: theme.spacing(1, 0),
    },
    "& .MuiMenuItem-root": {
        padding: theme.spacing(1.5, 2.5),
        margin: theme.spacing(0, 1),
        borderRadius: "12px",
        transition: "all 0.2s ease",
        "&:hover": {
            backgroundColor: "rgba(59, 130, 246, 0.08)",
        },
    },
}));

const NavLink = ({ to, icon, children, onClick }) => {
    const location = useLocation();
    const isActive = location.pathname === to;

    return (
        <EnhancedNavLink
            color="inherit"
            component={Link}
            to={to}
            onClick={onClick}
            startIcon={icon}
            sx={{
                fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
                textTransform: "none",
                fontWeight: isActive ? 600 : 500,
                fontSize: "0.95rem",
                color: isActive ? "#1E40AF" : "#6B7280",
                margin: "0 4px",
                padding: "10px 20px",
                borderRadius: "16px",
                position: "relative",
                overflow: "hidden",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                background: isActive
                    ? "linear-gradient(135deg, rgba(59, 130, 246, 0.12) 0%, rgba(99, 102, 241, 0.08) 100%)"
                    : "transparent",
                border: isActive ? "1px solid rgba(59, 130, 246, 0.2)" : "1px solid transparent",
                backdropFilter: isActive ? "blur(8px)" : "none",
                "&:hover": {
                    backgroundColor: "rgba(59, 130, 246, 0.08)",
                    transform: "translateY(-2px)",
                    color: "#1E40AF",
                    boxShadow: `0 8px 25px rgba(59, 130, 246, 0.15), 0 4px 10px rgba(59, 130, 246, 0.1)`,
                    border: "1px solid rgba(59, 130, 246, 0.25)",
                },
                "& .MuiButton-startIcon": {
                    transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                },
                "&:hover .MuiButton-startIcon": {
                    transform: "scale(1.1) rotate(5deg)",
                },
            }}
        >
            {children}
        </EnhancedNavLink>
    );
};

export default function Navbar({ onLoginClick }) {
    const [anchorEl, setAnchorEl] = useState(null);
    const [userAnchorEl, setUserAnchorEl] = useState(null);
    const [scrolled, setScrolled] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState({
        name: "John Doe",
        email: "john.doe@example.com",
        avatar: "",
    });

    const open = Boolean(anchorEl);
    const userMenuOpen = Boolean(userAnchorEl);

    // Check if user is logged in on component mount
    useEffect(() => {
        const token = localStorage.getItem("token");
        console.log("Raw token:", token); // 👈 check if token is stored

        if (token) {
            try {
                const decodedToken = decodeJWT(token);
                console.log("Decoded JWT:", decodedToken); // 👈 check payload

                setIsLoggedIn(true);

                // Extract username from email (before @)
                const email = decodedToken.sub || "";
                const username = email.includes("@")
                    ? email.split("@")[0].toUpperCase()
                    : email.toUpperCase();

                setUser({
                    name: username || "USER",
                    email: email,
                });

            } catch (err) {
                console.error("JWT decode error", err);
            }
        }
    }, []);



    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            const isScrolled = window.scrollY > 20;
            setScrolled(isScrolled);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleUserMenuOpen = (event) => {
        setUserAnchorEl(event.currentTarget);
    };

    const handleUserMenuClose = () => {
        setUserAnchorEl(null);
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        setIsLoggedIn(false);
        handleUserMenuClose();
    };

    const menuVariants = {
        open: {
            opacity: 1,
            scale: 1,
            transition: {
                duration: 0.2,
                ease: [0.4, 0, 0.2, 1]
            }
        },
        closed: {
            opacity: 0,
            scale: 0.95,
            transition: {
                duration: 0.15,
                ease: [0.4, 0, 0.2, 1]
            }
        }
    };

    return (
        <GlassAppBar position="sticky" $scrolled={scrolled}>
            <Toolbar
                sx={{
                    maxWidth: { xs: "100%", lg: "1400px" },
                    margin: "auto",
                    width: "100%",
                    px: { xs: 2, md: 4 },
                    py: 1.5,
                    minHeight: "72px !important",
                }}
            >
                {/* Mobile Menu Button */}
                <Box sx={{ display: { xs: "flex", md: "none" }, mr: 1 }}>
                    <motion.div
                        whileTap={{ scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                        <IconButton
                            size="large"
                            edge="start"
                            color="inherit"
                            aria-label="menu"
                            onClick={handleMenuOpen}
                            sx={{
                                color: "#6B7280",
                                borderRadius: "12px",
                                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                                "&:hover": {
                                    backgroundColor: "rgba(59, 130, 246, 0.08)",
                                    color: "#3B82F6",
                                    transform: "scale(1.05)",
                                },
                            }}
                        >
                            <MenuIcon />
                        </IconButton>
                    </motion.div>

                    <AnimatePresence>
                        <Menu
                            id="mobile-menu"
                            anchorEl={anchorEl}
                            open={open}
                            onClose={handleMenuClose}
                            MenuListProps={{
                                "aria-labelledby": "mobile-menu-button",
                            }}
                            PaperProps={{
                                component: motion.div,
                                variants: menuVariants,
                                initial: "closed",
                                animate: "open",
                                exit: "closed",
                                sx: {
                                    borderRadius: "20px",
                                    background: "rgba(255, 255, 255, 0.95)",
                                    backdropFilter: "blur(20px)",
                                    border: "1px solid rgba(255, 255, 255, 0.2)",
                                    boxShadow: `0 20px 25px -5px rgba(0, 0, 0, 0.1),
                              0 10px 10px -5px rgba(0, 0, 0, 0.04)`,
                                    minWidth: "220px",
                                    py: 1,
                                    mt: 1,
                                    overflow: "hidden",
                                }
                            }}
                        >
                            {[
                                { to: "/", icon: FiHome, label: "Home" },
                                { to: "/dashboard", icon: RiDashboardLine, label: "Dashboard" },
                            ].map((item, index) => (
                                <motion.div
                                    key={item.to}
                                    initial={{ x: -20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <MenuItem
                                        component={Link}
                                        to={item.to}
                                        onClick={handleMenuClose}
                                        sx={{
                                            py: 2,
                                            px: 3,
                                            mx: 1,
                                            my: 0.5,
                                            borderRadius: "12px",
                                            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                                            "&:hover": {
                                                backgroundColor: "rgba(59, 130, 246, 0.08)",
                                                transform: "translateX(8px)",
                                            },
                                        }}
                                    >
                                        <item.icon size={20} style={{ marginRight: "16px", color: "#6B7280" }} />
                                        <Typography
                                            sx={{
                                                fontFamily: "'Inter', sans-serif",
                                                fontWeight: 500,
                                                color: "#374151",
                                            }}
                                        >
                                            {item.label}
                                        </Typography>
                                    </MenuItem>
                                </motion.div>
                            ))}
                        </Menu>
                    </AnimatePresence>
                </Box>

                {/* Logo with enhanced animation */}
                <LogoContainer
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                    <IconButton
                        edge="start"
                        color="inherit"
                        aria-label="logo"
                        component={Link}
                        to="/"
                        sx={{
                            mr: 2,
                            borderRadius: "18px",
                            background: "linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.6) 100%)",
                            backdropFilter: "blur(10px)",
                            border: "1px solid rgba(255,255,255,0.3)",
                            boxShadow: `0 8px 25px rgba(0, 0, 0, 0.08),
                          inset 0 1px 0 rgba(255, 255, 255, 0.6)`,
                            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                            "&:hover": {
                                boxShadow: `0 12px 35px rgba(59, 130, 246, 0.15),
                            0 6px 15px rgba(0, 0, 0, 0.08),
                            inset 0 1px 0 rgba(255, 255, 255, 0.8)`,
                                background: "linear-gradient(135deg, rgba(255,255,255,1) 0%, rgba(255,255,255,0.8) 100%)",
                            }
                        }}
                    >
                        <img
                            src={logo}
                            alt="Logo"
                            style={{
                                height: "48px",
                                width: "48px",
                                borderRadius: "16px",
                                objectFit: "cover",
                                filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))",
                            }}
                        />
                    </IconButton>
                </LogoContainer>

                {/* Enhanced Title */}
                <Typography
                    variant="h6"
                    component={motion.div}
                    whileHover={{ scale: 1.02 }}
                    sx={{
                        flexGrow: 1,
                        fontFamily: "'Poppins', -apple-system, BlinkMacSystemFont, sans-serif",
                        fontWeight: 800,
                        letterSpacing: "1px",
                        background: "linear-gradient(135deg, #3B82F6 0%, #10B981 50%, #8B5CF6 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                        fontSize: { xs: "1.2rem", sm: "1.4rem" },
                        textShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
                        cursor: "pointer",
                        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                        position: "relative",
                        "&::after": {
                            content: '""',
                            position: "absolute",
                            bottom: "-4px",
                            left: 0,
                            width: "0",
                            height: "2px",
                            background: "linear-gradient(90deg, #3B82F6, #10B981)",
                            transition: "width 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                        },
                    }}
                >
                    INFOLOCK
                </Typography>

                {/* Enhanced Nav Links - Hidden on small screens */}
                <Box sx={{ display: { xs: "none", md: "flex" }, alignItems: "center" }}>
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <NavLink to="/" icon={<FiHome size={18} />}>
                            Home
                        </NavLink>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <NavLink to="/dashboard" icon={<RiDashboardLine size={18} />}>
                            Dashboard
                        </NavLink>
                    </motion.div>
                </Box>

                {/* Conditional rendering based on login status */}
                {isLoggedIn ? (
                    <>
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            transition={{ type: "spring", stiffness: 400, damping: 10 }}
                        >
                            <UserProfileButton
                                onClick={handleUserMenuOpen}
                                startIcon={
                                    <Avatar
                                        sx={{
                                            width: 32,
                                            height: 32,
                                            bgcolor: "#3B82F6",
                                            color: "white",
                                            fontSize: "0.875rem",
                                            fontWeight: 600,
                                            marginRight: 1,
                                        }}
                                    >
                                        {user.name.charAt(0).toUpperCase()}
                                    </Avatar>
                                }
                            >
                                <Box sx={{ display: { xs: "none", sm: "block" } }}>
                                    {user.name.split(" ")[0]}
                                </Box>
                            </UserProfileButton>
                        </motion.div>

                        <UserDropdownMenu
                            anchorEl={userAnchorEl}
                            open={userMenuOpen}
                            onClose={handleUserMenuClose}
                            anchorOrigin={{
                                vertical: "bottom",
                                horizontal: "right",
                            }}
                            transformOrigin={{
                                vertical: "top",
                                horizontal: "right",
                            }}
                            PaperProps={{
                                component: motion.div,
                                variants: menuVariants,
                                initial: "closed",
                                animate: "open",
                                exit: "closed",
                            }}
                        >
                            <MenuItem onClick={handleUserMenuClose}>
                                <Avatar
                                    sx={{
                                        width: 56,
                                        height: 56,
                                        bgcolor: "#3B82F6",
                                        color: "white",
                                        fontSize: "1.25rem",
                                        fontWeight: 600,
                                        marginRight: 2,
                                    }}
                                >
                                    {user.name.charAt(0).toUpperCase()}
                                </Avatar>
                                <Box>
                                    <Typography
                                        variant="subtitle1"
                                        sx={{ fontWeight: 600, color: "#111827" }}
                                    >
                                        {user.name}
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        sx={{ color: "#6B7280", fontSize: "0.8rem" }}
                                    >
                                        {user.email}
                                    </Typography>
                                </Box>
                            </MenuItem>

                            <Divider sx={{ my: 1 }} />

                            <MenuItem component={Link} to="/profile" onClick={handleUserMenuClose}>
                                <ListItemIcon>
                                    <FiUser size={20} color="#6B7280" />
                                </ListItemIcon>
                                <ListItemText>Profile</ListItemText>
                            </MenuItem>

                            <MenuItem component={Link} to="/settings" onClick={handleUserMenuClose}>
                                <ListItemIcon>
                                    <FiSettings size={20} color="#6B7280" />
                                </ListItemIcon>
                                <ListItemText>Settings</ListItemText>
                            </MenuItem>

                            <Divider sx={{ my: 1 }} />

                            <MenuItem
                                onClick={handleLogout}
                                sx={{
                                    color: "#EF4444",
                                    "&:hover": {
                                        backgroundColor: "rgba(239, 68, 68, 0.08)",
                                    },
                                }}
                            >
                                <ListItemIcon>
                                    <FiLogOut size={20} color="#EF4444" />
                                </ListItemIcon>
                                <ListItemText>Logout</ListItemText>
                            </MenuItem>
                        </UserDropdownMenu>
                    </>
                ) : (
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        style={{ transition: "opacity 0.4s, transform 0.4s" }}
                    >
                        <GradientLoginButton
                            variant="contained"
                            onClick={onLoginClick}
                            startIcon={<FiLogIn size={18} />}
                        >
                            Login
                        </GradientLoginButton>
                    </motion.div>
                )}
            </Toolbar>
        </GlassAppBar>
    );
}