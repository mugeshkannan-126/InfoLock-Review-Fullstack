import React, { useState, useEffect, useRef } from 'react';
import { LogOut, Users, Trash2, Mail, User, FileText, Zap, Eye, Download, Search, Filter, MoreVertical, Shield, Calendar, Activity, Star, TrendingUp, Database, Clock } from 'lucide-react';
import { userAPI } from '../api.js'; // Adjust the import path as needed

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);
    const [activeCard, setActiveCard] = useState(null);
    const dashboardRef = useRef(null);

    // Fetch users from backend
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setLoading(true);
                const usersData = await userAPI.getAllUsers();
                setUsers(usersData);
            } catch (err) {
                setError(err.message || 'Failed to fetch users');
                console.error('Error fetching users:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    // Mouse tracking with enhanced effects
    useEffect(() => {
        const updateMousePosition = (e) => {
            if (dashboardRef.current) {
                const rect = dashboardRef.current.getBoundingClientRect();
                setMousePosition({
                    x: e.clientX - rect.left,
                    y: e.clientY - rect.top
                });
            }
        };

        const dashboard = dashboardRef.current;
        if (dashboard) {
            dashboard.addEventListener('mousemove', updateMousePosition);
            return () => dashboard.removeEventListener('mousemove', updateMousePosition);
        }
    }, []);

    const filteredUsers = users.filter(user =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this user and all their documents?')) {
            try {
                await userAPI.deleteUserById(id);
                setUsers(users.filter(user => user.id !== id));
            } catch (err) {
                setError(err.message || 'Failed to delete user');
                console.error('Error deleting user:', err);
            }
        }
    };

    const handleLogout = () => {
        // Use your authAPI logout function
        authAPI.logout();
        window.location.href = '/login';
    };

    const getTotalStorage = (documents) => {
        if (!documents || documents.length === 0) return '0 MB';
        const totalBytes = documents.reduce((sum, doc) => sum + (doc.fileSize || 0), 0);
        const megabytes = (totalBytes / (1024 * 1024)).toFixed(2);
        return `${megabytes} MB`;
    };

    const getDocumentCount = (documents) => {
        return documents ? documents.length : 0;
    };

    // Calculate totals based on actual user data
    const totalDocuments = users.reduce((total, user) => total + getDocumentCount(user.documents), 0);
    const totalStorage = getTotalStorage(users.flatMap(user => user.documents || []));

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-lg text-gray-600">Loading user data...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20">
                <div className="text-center p-8 bg-white rounded-xl shadow-lg">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </div>
                    <h2 className="text-xl font-bold text-gray-800 mb-2">Error Loading Data</h2>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div
            ref={dashboardRef}
            className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
        >
            {/* Enhanced Background Effects */}
            <div className="absolute inset-0">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(59,130,246,0.12),transparent_60%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,rgba(168,85,247,0.08),transparent_60%)]" />
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-200/30 to-purple-200/20 rounded-full filter blur-3xl animate-pulse" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-200/20 to-pink-200/30 rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

                {/* Animated geometric shapes */}
                <div className="absolute top-20 right-20 w-4 h-4 bg-blue-400/30 rotate-45 animate-bounce" style={{ animationDelay: '0.5s' }} />
                <div className="absolute top-40 left-20 w-6 h-6 bg-purple-400/30 rounded-full animate-bounce" style={{ animationDelay: '1.5s' }} />
                <div className="absolute bottom-40 left-40 w-3 h-3 bg-pink-400/30 rotate-12 animate-bounce" style={{ animationDelay: '2s' }} />
            </div>

            {/* Enhanced Mouse-following highlight */}
            {isHovering && (
                <div
                    className="absolute w-96 h-96 pointer-events-none transition-all duration-300 ease-out"
                    style={{
                        left: mousePosition.x - 192,
                        top: mousePosition.y - 192,
                        background: 'radial-gradient(circle, rgba(59,130,246,0.15) 0%, rgba(168,85,247,0.1) 30%, transparent 70%)',
                        filter: 'blur(40px)',
                    }}
                />
            )}

            {/* Enhanced Navbar with glassmorphism */}
            <nav className="relative z-20 px-6 py-4 bg-white/90 backdrop-blur-xl shadow-lg border-b border-white/20">
                <div className="mx-auto max-w-7xl flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="relative group cursor-pointer">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 rounded-2xl shadow-xl transform group-hover:scale-110 transition-all duration-300">
                                <div className="flex items-center justify-center w-full h-full relative">
                                    <Shield className="w-7 h-7 text-white relative z-10" />
                                    <div className="absolute inset-0 bg-white/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                </div>
                            </div>
                            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur opacity-30 group-hover:opacity-60 transition-opacity duration-300 -z-10" />
                        </div>
                        <div className="transform hover:scale-105 transition-all duration-300">
                            <h1 className="text-3xl font-bold text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 bg-clip-text">
                                INFOLOCK Admin
                            </h1>
                            <p className="text-sm text-gray-600 font-medium">Secure User Management Portal</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 rounded-full border border-blue-100/50 shadow-sm hover:shadow-md transition-all duration-300">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                <Users className="w-4 h-4 text-blue-600" />
                                <span className="text-sm font-semibold text-blue-700">{users.length} Active Users</span>
                            </div>

                            <div className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-green-50 to-emerald-50 rounded-full border border-green-100/50">
                                <Activity className="w-4 h-4 text-green-600" />
                                <span className="text-sm font-medium text-green-700">Online</span>
                            </div>
                        </div>

                        <button
                            onClick={handleLogout}
                            className="group flex items-center gap-3 px-6 py-3 text-gray-700 hover:text-white bg-white/70 hover:bg-gradient-to-r hover:from-red-500 hover:to-pink-500 rounded-xl border border-gray-200 hover:border-transparent transition-all duration-300 shadow-sm hover:shadow-lg transform hover:scale-105"
                        >
                            <LogOut className="w-5 h-5 transition-transform group-hover:rotate-12" />
                            <span className="font-medium">Logout</span>
                        </button>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <div className="relative z-10 px-6 py-8 mx-auto max-w-7xl">
                {/* Enhanced Header with animation */}
                <div className="mb-12 text-center">
                    <div className="inline-block">
                        <h2 className="text-5xl font-bold text-transparent bg-gradient-to-r from-gray-800 via-blue-600 to-purple-600 bg-clip-text mb-4 animate-pulse">
                            User Management
                        </h2>
                        <div className="w-32 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto mb-4" />
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                            Comprehensive dashboard for managing all system users, documents, and storage analytics
                        </p>
                    </div>
                </div>

                {/* Enhanced Search Bar */}
                <div className="mb-8 max-w-2xl mx-auto">
                    <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition-opacity duration-300" />
                        <div className="relative bg-white rounded-2xl shadow-xl border border-gray-100">
                            <div className="flex items-center">
                                <div className="pl-6 pr-3 py-4">
                                    <Search className="w-6 h-6 text-gray-400 group-hover:text-blue-500 transition-colors duration-300" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search users by username or email..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="flex-1 py-4 pr-6 text-lg placeholder-gray-400 border-none outline-none bg-transparent"
                                />
                                <button className="mr-4 p-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                                    <Filter className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Enhanced Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                    {[
                        {
                            title: "Total Users",
                            value: users.length,
                            icon: Users,
                            color: "blue",
                            gradient: "from-blue-500 to-blue-600",
                            bg: "from-blue-50 to-blue-100",
                            change: "+12%"
                        },
                        {
                            title: "Active Documents",
                            value: totalDocuments,
                            icon: FileText,
                            color: "purple",
                            gradient: "from-purple-500 to-purple-600",
                            bg: "from-purple-50 to-purple-100",
                            change: "+8%"
                        },
                        {
                            title: "Storage Used",
                            value: totalStorage,
                            icon: Database,
                            color: "green",
                            gradient: "from-green-500 to-green-600",
                            bg: "from-green-50 to-green-100",
                            change: "+15%"
                        },
                        {
                            title: "System Health",
                            value: "99.9%",
                            icon: Activity,
                            color: "pink",
                            gradient: "from-pink-500 to-pink-600",
                            bg: "from-pink-50 to-pink-100",
                            change: "+0.1%"
                        }
                    ].map((stat, index) => (
                        <div
                            key={index}
                            className={`group relative bg-white p-6 rounded-3xl shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 cursor-pointer ${
                                activeCard === index ? 'scale-105' : ''
                            }`}
                            onMouseEnter={() => setActiveCard(index)}
                            onMouseLeave={() => setActiveCard(null)}
                        >
                            <div className={`absolute -inset-1 bg-gradient-to-r ${stat.gradient} rounded-3xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-500`} />
                            <div className="relative">
                                <div className="flex items-center justify-between mb-4">
                                    <div className={`w-16 h-16 bg-gradient-to-r ${stat.bg} rounded-2xl flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 shadow-lg`}>
                                        <stat.icon className={`w-8 h-8 text-${stat.color}-600`} />
                                    </div>
                                    <div className={`flex items-center gap-1 px-3 py-1 bg-gradient-to-r ${stat.bg} rounded-full text-${stat.color}-700 text-sm font-medium`}>
                                        <TrendingUp className="w-4 h-4" />
                                        {stat.change}
                                    </div>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 font-medium mb-1">{stat.title}</p>
                                    <p className="text-3xl font-bold text-gray-800 mb-2">{stat.value}</p>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div className={`h-2 bg-gradient-to-r ${stat.gradient} rounded-full transform transition-all duration-1000 ${
                                            activeCard === index ? 'w-4/5' : 'w-3/5'
                                        }`} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Enhanced Users Table */}
                <div className="relative">
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-3xl blur opacity-20" />
                    <div className="relative bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/20">
                        <div className="bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 px-8 py-6 border-b border-gray-100">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                                        <Users className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold text-gray-800">User Directory</h3>
                                        <p className="text-gray-600">Manage and monitor all system users</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 px-4 py-2 bg-white/80 rounded-xl shadow-sm">
                                    <Star className="w-4 h-4 text-yellow-500" />
                                    <span className="text-sm font-medium text-gray-700">Premium View</span>
                                </div>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full">
                                <thead>
                                <tr className="bg-gradient-to-r from-gray-50 to-gray-100">
                                    {[
                                        { label: "User Profile", icon: User },
                                        { label: "Contact", icon: Mail },
                                        { label: "Documents", icon: FileText },
                                        { label: "Storage", icon: Database },
                                        { label: "Join Date", icon: Calendar },
                                        { label: "Actions", icon: MoreVertical }
                                    ].map((header, index) => (
                                        <th key={index} className="px-8 py-6 text-left">
                                            <div className="flex items-center gap-3 text-sm font-bold text-gray-700 uppercase tracking-wider">
                                                <header.icon className="w-5 h-5 text-gray-500" />
                                                {header.label}
                                            </div>
                                        </th>
                                    ))}
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                {filteredUsers.map((user, index) => (
                                    <tr
                                        key={user.id}
                                        className="group hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-purple-50/50 transition-all duration-300"
                                        style={{ animationDelay: `${index * 100}ms` }}
                                    >
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="relative">
                                                    <div className="w-14 h-14 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-all duration-300">
                                                            <span className="text-white font-bold text-lg">
                                                                {user.username.charAt(0).toUpperCase()}
                                                            </span>
                                                    </div>
                                                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                                                        <div className="w-2 h-2 bg-white rounded-full" />
                                                    </div>
                                                </div>
                                                <div>
                                                    <p className="text-lg font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                                                        {user.username}
                                                    </p>
                                                    <p className="text-sm text-gray-500">ID: {user.id}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                                                    <Mail className="w-5 h-5 text-blue-600" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-gray-800">{user.email}</p>
                                                    <p className="text-xs text-gray-500">Verified</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                                                    getDocumentCount(user.documents) > 0
                                                        ? 'bg-gradient-to-r from-green-100 to-emerald-100'
                                                        : 'bg-gray-100'
                                                }`}>
                                                    <FileText className={`w-6 h-6 ${
                                                        getDocumentCount(user.documents) > 0
                                                            ? 'text-green-600'
                                                            : 'text-gray-400'
                                                    }`} />
                                                </div>
                                                <div>
                                                    <p className="text-lg font-bold text-gray-800">
                                                        {getDocumentCount(user.documents)}
                                                    </p>
                                                    <p className="text-xs text-gray-500">Files</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl flex items-center justify-center">
                                                    <Database className="w-6 h-6 text-purple-600" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-gray-800">
                                                        {getTotalStorage(user.documents)}
                                                    </p>
                                                    <div className="w-20 bg-gray-200 rounded-full h-2 mt-1">
                                                        <div className="h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full w-1/3" />
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                                                    <Calendar className="w-5 h-5 text-gray-600" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-gray-800">
                                                        {user.joinDate ? new Date(user.joinDate).toLocaleDateString() : 'N/A'}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => setSelectedUser(user)}
                                                    className="group/btn relative p-3 bg-blue-50 hover:bg-blue-100 text-blue-600 hover:text-blue-700 rounded-xl transition-all duration-300 transform hover:scale-110 hover:rotate-3"
                                                    title="View Details"
                                                >
                                                    <Eye className="w-5 h-5" />
                                                    <div className="absolute -inset-1 bg-blue-500 rounded-xl blur opacity-0 group-hover/btn:opacity-20 transition-opacity duration-300" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(user.id)}
                                                    className="group/btn relative p-3 bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 rounded-xl transition-all duration-300 transform hover:scale-110 hover:rotate-3"
                                                    title="Delete User"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                    <div className="absolute -inset-1 bg-red-500 rounded-xl blur opacity-0 group-hover/btn:opacity-20 transition-opacity duration-300" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Enhanced Footer */}
                <div className="mt-12 text-center">
                    <div className="inline-block p-6 bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20">
                        <div className="flex items-center justify-center gap-4 mb-4">
                            <Shield className="w-6 h-6 text-blue-600" />
                            <span className="text-lg font-bold text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text">
                                INFOLOCK Security Suite
                            </span>
                        </div>
                        <p className="text-gray-600 text-sm max-w-md">
                            © 2024 INFOLOCK Admin Dashboard • Enterprise-grade security and user management platform
                        </p>
                        <div className="flex items-center justify-center gap-6 mt-4">
                            <div className="flex items-center gap-2 text-green-600">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                <span className="text-sm font-medium">System Operational</span>
                            </div>
                            <div className="flex items-center gap-2 text-blue-600">
                                <Shield className="w-4 h-4" />
                                <span className="text-sm font-medium">SSL Secured</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;