import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import { Link, useLocation } from "react-router-dom";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MenuIcon from "@mui/icons-material/Menu";
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Badge from "@mui/material/Badge";
import { FiHome, FiLogIn, FiLogOut, FiUser, FiSettings, FiBell, FiPlusCircle } from "react-icons/fi";
import { RiDashboardLine } from "react-icons/ri";
import { Star, Zap, Crown, Sparkles, Settings, User, LogOut, CreditCard, HelpCircle } from "lucide-react";
import Logo from "./Logo.jsx";

// Styled components with enhanced profile styling
const GlassAppBar = styled(AppBar)(({ theme }) => ({
    background: "linear-gradient(to bottom, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.85))",
    backdropFilter: "blur(20px) saturate(180%)",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    borderRadius: theme.breakpoints.up("md") ? "0 0 28px 28px" : 0,
    marginX: theme.breakpoints.up("md") ? 24 : 0,
    marginTop: theme.breakpoints.up("md") ? 24 : 0,
    maxWidth: theme.breakpoints.up("md") ? "calc(100% - 48px)" : "100%",
    boxShadow: `0 8px 32px rgba(0, 0, 0, 0.08),
                0 2px 6px rgba(0, 0, 0, 0.05),
                inset 0 1px 0 rgba(255, 255, 255, 0.3)`,
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    position: "relative",
    overflow: "hidden",
    "&::before": {
        content: '""',
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(168, 85, 247, 0.03) 100%)",
        borderRadius: "inherit",
        zIndex: -1,
    },
}));

const EnhancedNavLink = styled(Button)(({ theme }) => ({
    textTransform: "none",
    fontWeight: 500,
    fontSize: "0.95rem",
    borderRadius: "12px",
    padding: "10px 20px",
    color: "#374151",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    "&:hover": {
        background: "rgba(59, 130, 246, 0.08)",
        transform: "translateY(-2px)",
        color: "#2563eb",
    },
}));

const GradientLoginButton = styled(Button)(({ theme }) => ({
    background: "linear-gradient(135deg, #3B82F6 0%, #A855F7 100%)",
    color: "#FFFFFF",
    fontFamily: "'Inter', sans-serif",
    textTransform: "none",
    fontWeight: 600,
    fontSize: "0.95rem",
    borderRadius: "16px",
    padding: "12px 24px",
    boxShadow: `0 4px 15px rgba(59, 130, 246, 0.3)`,
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    "&:hover": {
        background: "linear-gradient(135deg, #2563EB 0%, #9333EA 100%)",
        transform: "translateY(-2px)",
        boxShadow: `0 8px 25px rgba(59, 130, 246, 0.4)`,
    },
}));

const UserProfileButton = styled(Button)(({ theme }) => ({
    textTransform: "none",
    borderRadius: "16px",
    padding: "8px 12px 8px 8px",
    background: "rgba(255, 255, 255, 0.9)",
    border: "1px solid rgba(0, 0, 0, 0.1)",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    color: "#374151",
    gap: "8px",
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
        background: "linear-gradient(45deg, rgba(59, 130, 246, 0.1), rgba(168, 85, 247, 0.1))",
        borderRadius: "20px",
        opacity: 0,
        filter: "blur(8px)",
        transition: "opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        zIndex: -1,
    },
    "&:hover::before": {
        opacity: 0.3,
    },
}));

const UserDropdownMenu = styled(Menu)(({ theme }) => ({
    "& .MuiPaper-root": {
        width: 320,
        borderRadius: "20px",
        background: "rgba(255, 255, 255, 0.98)",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(255, 255, 255, 0.3)",
        boxShadow: `0 20px 25px -5px rgba(0, 0, 0, 0.1),
                    0 10px 10px -5px rgba(0, 0, 0, 0.04)`,
        padding: theme.spacing(1, 0),
        overflow: "hidden",
    },
    "& .MuiMenuItem-root": {
        padding: theme.spacing(1.5, 2.5),
        margin: theme.spacing(0, 1),
        borderRadius: "12px",
        "&:hover": {
            backgroundColor: "rgba(59, 130, 246, 0.08)",
        },
    },
}));

const NotificationBadge = styled(Badge)(({ theme }) => ({
    "& .MuiBadge-badge": {
        backgroundColor: "#EF4444",
        color: "white",
        fontSize: "0.6rem",
        fontWeight: "bold",
        minWidth: "16px",
        height: "16px",
        borderRadius: "8px",
        boxShadow: "0 0 0 2px white",
    },
}));

const PremiumBadge = styled(Box)(({ theme }) => ({
    display: "inline-flex",
    alignItems: "center",
    gap: "4px",
    background: "linear-gradient(135deg, #F59E0B 0%, #D97706 100%)",
    color: "white",
    padding: "4px 8px",
    borderRadius: "12px",
    fontSize: "0.7rem",
    fontWeight: 600,
    marginLeft: "8px",
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
                fontFamily: "'Inter', sans-serif",
                background: isActive ? "rgba(59, 130, 246, 0.1)" : "transparent",
                border: isActive ? "1px solid rgba(59, 130, 246, 0.2)" : "none",
                "&:hover": {
                    background: "rgba(59, 130, 246, 0.08)",
                    transform: "translateY(-2px)",
                    boxShadow: "0 4px 12px rgba(59, 130, 246, 0.1)",
                },
            }}
        >
            {children}
        </EnhancedNavLink>
    );
};

// JWT decode function
const decodeJWT = (token) => {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );
        return JSON.parse(jsonPayload);
    } catch (err) {
        console.error("Invalid token", err);
        return null;
    }
};

export default function Navbar({ onLoginClick }) {
    const [anchorEl, setAnchorEl] = useState(null);
    const [userAnchorEl, setUserAnchorEl] = useState(null);
    const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState({
        name: "",
        email: "",
        avatar: "",
        isPremium: true, // For demonstration
        storageUsed: 65, // Percentage
        notifications: 3,
    });
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);
    const navbarRef = useRef(null);

    const { scrollYProgress } = useScroll({
        target: navbarRef,
        offset: ["start start", "end start"]
    });
    const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);
    const y = useTransform(scrollYProgress, [0, 0.2], [0, -10]);

    // Mouse tracking effect
    useEffect(() => {
        const updateMousePosition = (e) => {
            if (navbarRef.current) {
                const rect = navbarRef.current.getBoundingClientRect();
                setMousePosition({
                    x: e.clientX - rect.left,
                    y: e.clientY - rect.top
                });
            }
        };

        const navbar = navbarRef.current;
        if (navbar) {
            navbar.addEventListener('mousemove', updateMousePosition);
            return () => navbar.removeEventListener('mousemove', updateMousePosition);
        }
    }, []);

    // Auth check
    useEffect(() => {
        const checkAuthStatus = () => {
            const token = localStorage.getItem("token");
            console.log("Checking auth status. Token exists:", !!token);

            if (token) {
                try {
                    const decodedToken = decodeJWT(token);
                    console.log("Decoded JWT:", decodedToken);

                    if (decodedToken) {
                        setIsLoggedIn(true);
                        const email = decodedToken.sub || decodedToken.email || "";
                        const username = email.includes("@")
                            ? email.split("@")[0]
                            : "User";
                        const formattedUsername = username.charAt(0).toUpperCase() + username.slice(1);
                        setUser({
                            name: formattedUsername || "User",
                            email: email,
                            isPremium: Math.random() > 0.5, // Random for demo
                            storageUsed: Math.floor(Math.random() * 100),
                            notifications: Math.floor(Math.random() * 5),
                        });
                    } else {
                        setIsLoggedIn(false);
                        setUser({ name: "", email: "", isPremium: false, storageUsed: 0, notifications: 0 });
                        localStorage.removeItem("token");
                    }
                } catch (err) {
                    console.error("JWT decode error", err);
                    setIsLoggedIn(false);
                    setUser({ name: "", email: "", isPremium: false, storageUsed: 0, notifications: 0 });
                    localStorage.removeItem("token");
                }
            } else {
                setIsLoggedIn(false);
                setUser({ name: "", email: "", isPremium: false, storageUsed: 0, notifications: 0 });
            }
        };

        checkAuthStatus();
        const handleStorageChange = (e) => {
            if (e.key === "token") {
                checkAuthStatus();
            }
        };
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
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

    const handleNotificationOpen = (event) => {
        setNotificationAnchorEl(event.currentTarget);
    };

    const handleNotificationClose = () => {
        setNotificationAnchorEl(null);
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        setIsLoggedIn(false);
        setUser({ name: "", email: "", isPremium: false, storageUsed: 0, notifications: 0 });
        handleUserMenuClose();
        console.log("User logged out");
    };

    const menuVariants = {
        open: {
            opacity: 1,
            scale: 1,
            transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] }
        },
        closed: {
            opacity: 0,
            scale: 0.95,
            transition: { duration: 0.15, ease: [0.4, 0, 0.2, 1] }
        }
    };

    return (
        <motion.div
            ref={navbarRef}
            style={{ y, opacity }}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
        >
            <GlassAppBar position="sticky">
                {/* Background effects */}
                <div className="absolute inset-0">
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(59,130,246,0.08),transparent_50%)] opacity-60" />
                    {isHovering && (
                        <motion.div
                            className="absolute w-80 h-80 bg-gradient-radial from-blue-100/30 via-purple-50/20 to-transparent rounded-full blur-2xl pointer-events-none"
                            animate={{
                                x: mousePosition.x - 160,
                                y: mousePosition.y - 160,
                            }}
                            transition={{ type: "spring", damping: 25, stiffness: 150 }}
                        />
                    )}
                    {[...Array(5)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute"
                            animate={{
                                x: [0, Math.random() * 20 - 10],
                                y: [0, Math.random() * 20 - 10],
                                rotate: [0, 360],
                            }}
                            transition={{
                                duration: Math.random() * 6 + 4,
                                repeat: Infinity,
                                delay: Math.random() * 2,
                                ease: "easeInOut"
                            }}
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                            }}
                        >
                            {i % 2 === 0 ? (
                                <Star className="w-2 h-2 text-blue-200 opacity-30" />
                            ) : (
                                <div className="w-1 h-4 bg-gradient-to-b from-blue-200 to-transparent opacity-20 rotate-45" />
                            )}
                        </motion.div>
                    ))}
                </div>

                <Toolbar
                    sx={{
                        maxWidth: { xs: "100%", lg: "1400px" },
                        margin: "auto",
                        width: "100%",
                        px: { xs: 2, sm: 3, md: 4 },
                        py: 1.5,
                        minHeight: "72px !important",
                        position: "relative",
                        zIndex: 10,
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
                                    "&:hover": {
                                        backgroundColor: "rgba(59, 130, 246, 0.08)",
                                        color: "#2563eb",
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
                                open={Boolean(anchorEl)}
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

                    {/* Logo */}
                    <LogoContainer
                        whileHover={{ scale: 1.05 }}
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
                                boxShadow: "none",
                                "&:hover": {
                                    boxShadow: `0 12px 35px rgba(59, 130, 246, 0.15)`,
                                    background: "transparent",
                                },
                            }}
                        >
                            <Logo
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

                    {/* Title */}
                    <Typography
                        variant="h6"
                        component={motion.div}
                        whileHover={{ scale: 1.02 }}
                        sx={{
                            flexGrow: { xs: 1, sm: 0 },
                            fontFamily: "'Poppins', sans-serif",
                            fontWeight: 800,
                            fontSize: { xs: "1.2rem", sm: "1.4rem" },
                            background: "linear-gradient(135deg, #3B82F6 0%, #A855F7 100%)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            textShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
                        }}
                    >
                        INFOLOCK
                    </Typography>

                    {/* Nav Links */}
                    <Box sx={{ display: { xs: "none", md: "flex" }, alignItems: "center", ml: 3, gap: 1.5 }}>
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

                    {/* User/Login Section */}
                    <Box sx={{ flexGrow: 1, display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 1 }}>
                        {isLoggedIn && user.name ? (
                            <>
                                {/* Upload Button */}
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                                >
                                    <Button
                                        variant="outlined"
                                        startIcon={<FiPlusCircle size={16} />}
                                        sx={{
                                            textTransform: "none",
                                            borderRadius: "12px",
                                            padding: "8px 16px",
                                            border: "1px solid rgba(59, 130, 246, 0.3)",
                                            color: "#3B82F6",
                                            fontWeight: 500,
                                            "&:hover": {
                                                background: "rgba(59, 130, 246, 0.08)",
                                                border: "1px solid rgba(59, 130, 246, 0.5)",
                                            },
                                        }}
                                    >
                                        Upload
                                    </Button>
                                </motion.div>

                                {/* Notifications */}
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                                >
                                    <IconButton
                                        onClick={handleNotificationOpen}
                                        sx={{
                                            borderRadius: "12px",
                                            background: "rgba(255, 255, 255, 0.8)",
                                            border: "1px solid rgba(0, 0, 0, 0.1)",
                                            "&:hover": {
                                                background: "rgba(255, 255, 255, 1)",
                                            },
                                        }}
                                    >
                                        <NotificationBadge badgeContent={user.notifications} color="error">
                                            <FiBell size={18} color="#6B7280" />
                                        </NotificationBadge>
                                    </IconButton>
                                </motion.div>

                                {/* User Profile */}
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                                >
                                    <UserProfileButton
                                        onClick={handleUserMenuOpen}
                                        startIcon={
                                            <Badge
                                                overlap="circular"
                                                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                                badgeContent={
                                                    user.isPremium ? (
                                                        <Box
                                                            sx={{
                                                                background: "linear-gradient(135deg, #F59E0B 0%, #D97706 100%)",
                                                                borderRadius: "50%",
                                                                width: "16px",
                                                                height: "16px",
                                                                display: "flex",
                                                                alignItems: "center",
                                                                justifyContent: "center",
                                                                border: "2px solid white",
                                                            }}
                                                        >
                                                            <Crown size={10} color="white" />
                                                        </Box>
                                                    ) : null
                                                }
                                            >
                                                <Avatar
                                                    sx={{
                                                        width: 32,
                                                        height: 32,
                                                        bgcolor: "#3B82F6",
                                                        color: "white",
                                                        fontSize: "0.875rem",
                                                        fontWeight: 600,
                                                        boxShadow: "0 2px 8px rgba(59, 130, 246, 0.3)",
                                                    }}
                                                >
                                                    {user.name.charAt(0).toUpperCase()}
                                                </Avatar>
                                            </Badge>
                                        }
                                    >
                                        <Box sx={{ display: { xs: "none", sm: "block" }, textAlign: "left" }}>
                                            <Typography variant="body2" sx={{ fontWeight: 600, lineHeight: 1.2 }}>
                                                {user.name.split(" ")[0]}
                                            </Typography>
                                            {user.isPremium && (
                                                <PremiumBadge>
                                                    <Crown size={10} />
                                                    Premium
                                                </PremiumBadge>
                                            )}
                                        </Box>
                                    </UserProfileButton>

                                    <UserDropdownMenu
                                        anchorEl={userAnchorEl}
                                        open={Boolean(userAnchorEl)}
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
                                        {/* User Header */}
                                        <Box sx={{ p: 2, pb: 1 }}>
                                            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                                                <Avatar
                                                    sx={{
                                                        width: 56,
                                                        height: 56,
                                                        bgcolor: "#3B82F6",
                                                        color: "white",
                                                        fontSize: "1.25rem",
                                                        fontWeight: 600,
                                                        marginRight: 2,
                                                        boxShadow: "0 4px 12px rgba(59, 130, 246, 0.3)",
                                                    }}
                                                >
                                                    {user.name.charAt(0).toUpperCase()}
                                                </Avatar>
                                                <Box>
                                                    <Box sx={{ display: "flex", alignItems: "center" }}>
                                                        <Typography
                                                            variant="subtitle1"
                                                            sx={{ fontWeight: 600, color: "#111827" }}
                                                        >
                                                            {user.name}
                                                        </Typography>
                                                        {user.isPremium && (
                                                            <PremiumBadge>
                                                                <Crown size={10} />
                                                                Premium
                                                            </PremiumBadge>
                                                        )}
                                                    </Box>
                                                    <Typography
                                                        variant="body2"
                                                        sx={{ color: "#6B7280", fontSize: "0.8rem" }}
                                                    >
                                                        {user.email}
                                                    </Typography>
                                                </Box>
                                            </Box>

                                            {/* Storage Progress */}
                                            <Box sx={{ mb: 2 }}>
                                                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                                                    <Typography variant="caption" sx={{ color: "#6B7280", fontWeight: 500 }}>
                                                        Storage
                                                    </Typography>
                                                    <Typography variant="caption" sx={{ color: "#6B7280" }}>
                                                        {user.storageUsed}%
                                                    </Typography>
                                                </Box>
                                                <Box
                                                    sx={{
                                                        height: 6,
                                                        backgroundColor: "rgba(0, 0, 0, 0.1)",
                                                        borderRadius: 3,
                                                        overflow: "hidden",
                                                    }}
                                                >
                                                    <Box
                                                        sx={{
                                                            height: "100%",
                                                            width: `${user.storageUsed}%`,
                                                            background: "linear-gradient(90deg, #3B82F6 0%, #A855F7 100%)",
                                                            borderRadius: 3,
                                                        }}
                                                    />
                                                </Box>
                                            </Box>
                                        </Box>

                                        <Divider sx={{ my: 1 }} />

                                        {/* Menu Items */}
                                        <MenuItem component={Link} to="/profile" onClick={handleUserMenuClose}>
                                            <ListItemIcon>
                                                <User size={20} color="#6B7280" />
                                            </ListItemIcon>
                                            <ListItemText>Profile</ListItemText>
                                        </MenuItem>
                                        <MenuItem component={Link} to="/settings" onClick={handleUserMenuClose}>
                                            <ListItemIcon>
                                                <Settings size={20} color="#6B7280" />
                                            </ListItemIcon>
                                            <ListItemText>Settings</ListItemText>
                                        </MenuItem>
                                        <MenuItem component={Link} to="/billing" onClick={handleUserMenuClose}>
                                            <ListItemIcon>
                                                <CreditCard size={20} color="#6B7280" />
                                            </ListItemIcon>
                                            <ListItemText>Billing</ListItemText>
                                            {user.isPremium && (
                                                <Sparkles size={16} color="#F59E0B" style={{ marginLeft: "8px" }} />
                                            )}
                                        </MenuItem>
                                        <MenuItem component={Link} to="/help" onClick={handleUserMenuClose}>
                                            <ListItemIcon>
                                                <HelpCircle size={20} color="#6B7280" />
                                            </ListItemIcon>
                                            <ListItemText>Help & Support</ListItemText>
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
                                                <LogOut size={20} color="#EF4444" />
                                            </ListItemIcon>
                                            <ListItemText>Logout</ListItemText>
                                        </MenuItem>
                                    </UserDropdownMenu>
                                </motion.div>
                            </>
                        ) : (
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                transition={{ type: "spring", stiffness: 400, damping: 10 }}
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
                    </Box>
                </Toolbar>
            </GlassAppBar>
        </motion.div>
    );
}