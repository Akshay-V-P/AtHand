import { Link, NavLink, useNavigate } from "react-router-dom";
import { Button } from "@/shared/components/Button";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/storeHook";
import { apiService } from "@/features/provider/applyAsProvider/services/apiService";
import { setProvider } from "@/features/provider/store/providerSlice";
import { useNotifications } from "@/features/notification/hooks/useNotification";
import { NotificationModal } from "@/features/notification/components/NotificationModal";
import {
    getNotificationId,
    type NotificationListItem,
} from "@/features/notification/types/notification.types";
import {
    Bell,
    Briefcase,
    Compass,
    Home,
    PlusCircle,
    Search,
    User,
    X,
} from "lucide-react";

const Navbar = () => {
    const navigate = useNavigate();
    const { user, isAuthenticated, isLoading } = useAppSelector((state) => state.auth);
    const provider = useAppSelector(state => state.provider);
    const dispatch = useAppDispatch();
    const [searchQuery, setSearchQuery] = useState("");
    const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
    const [openNotification, setOpenNotification] = useState(false);
    const notificationContainerRef = useRef<HTMLDivElement | null>(null);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/services?search=${encodeURIComponent(searchQuery)}`);
        } else {
            navigate(`/services`);
        }
        setIsMobileSearchOpen(false);
    };

    const {
        notifications,
        unreadCount,
        isLoading: isNotificationsLoading,
        markAsRead,
        markAllAsRead,
    } = useNotifications();

    const notificationItems = useMemo<NotificationListItem[]>(() => {
        return notifications.map((notification, index) => ({
            id: getNotificationId(notification, index),
            notification,
            isRead: Boolean(notification.isRead),
        }));
    }, [notifications]);

    const handleToggleNotificationModal = () => {
        if (!openNotification) {
            if (unreadCount > 0) {
                markAllAsRead();
            }
            setOpenNotification(true);
        } else {
            setOpenNotification(false);
        }
    };

    const handleCloseNotificationModal = useCallback(() => {
        setOpenNotification(false);
    }, []);

    useEffect(() => {
        if (!openNotification) return;

        const handlePointerDownOutside = (event: PointerEvent) => {
            if (
                notificationContainerRef.current &&
                !notificationContainerRef.current.contains(event.target as Node)
            ) {
                setOpenNotification(false);
            }
        };

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setOpenNotification(false);
            }
        };

        document.addEventListener("pointerdown", handlePointerDownOutside);
        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("pointerdown", handlePointerDownOutside);
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [openNotification]);

    useEffect(() => {
        if (!user?.id) return;
        if (!provider.id) {
            apiService
                .getProvider(user.id)
                .then((response) => {
                    const providerData = response.data.data;
                    if (providerData) {
                        dispatch(setProvider(providerData));
                    }
                })
                .catch((error) => console.log(error));
        }

    }, [provider, isLoading, user?.id, dispatch]);

    const providerDestination =
        provider.status === "ACTIVE" ? "/provider/dashboard" : "/apply-provider/business";
    const providerLabel =
        provider.status === "ACTIVE" ? "Provider Dashboard" : "Become a Provider";

    return (
        <>
            <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 md:border-b-0">
                <nav className="flex items-center justify-between gap-3 px-4 sm:px-6 py-3.5 md:py-4 max-w-7xl mx-auto">
                    <Link
                        to="/"
                        className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight shrink-0"
                    >
                        At<span className="text-red-500">.</span>Hand
                    </Link>

                    <div className="hidden md:flex items-center gap-6 lg:gap-8 shrink-0">
                        <Link
                            to={"/services"}
                            className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                        >
                            Services
                        </Link>

                        <Link to={providerDestination}>
                            <p className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors whitespace-nowrap">
                                {providerLabel}
                            </p>
                        </Link>
                    </div>

                    <div className="hidden lg:flex flex-1 max-w-md mx-6">
                        <form onSubmit={handleSearch} className="relative w-full">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search services..."
                                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-gray-200"
                            />
                            <button
                                type="submit"
                                aria-label="Search"
                                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 flex items-center justify-center cursor-pointer"
                            >
                                <Search className="w-4 h-4" />
                            </button>
                        </form>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-3.5 shrink-0">
                        <button
                            type="button"
                            onClick={() => setIsMobileSearchOpen((prev) => !prev)}
                            aria-label={isMobileSearchOpen ? "Close search" : "Open search"}
                            aria-expanded={isMobileSearchOpen}
                            className="lg:hidden p-2 rounded-full text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors cursor-pointer"
                        >
                            {isMobileSearchOpen ? (
                                <X className="w-5 h-5" />
                            ) : (
                                <Search className="w-5 h-5" />
                            )}
                        </button>

                        <Link to={"/service-requests"} className="hidden md:inline-flex">
                            <Button className="whitespace-nowrap">Request service</Button>
                        </Link>

                        {isAuthenticated ? (
                            <div className="flex items-center gap-2 sm:gap-4">
                                <button
                                    type="button"
                                    aria-label="Location"
                                    className="hidden sm:inline-flex p-1.5 rounded-full text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-colors cursor-pointer"
                                >
                                    <span className="material-symbols-outlined text-[22px]">
                                        location_on
                                    </span>
                                </button>
                                <button
                                    type="button"
                                    aria-label="Messages"
                                    className="p-1.5 rounded-full text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-colors cursor-pointer"
                                >
                                    <span className="material-symbols-outlined text-[22px]">
                                        chat_bubble
                                    </span>
                                </button>
                                <div ref={notificationContainerRef} className="relative flex items-center">
                                    <button
                                        type="button"
                                        onClick={handleToggleNotificationModal}
                                        aria-label="Notifications"
                                        aria-expanded={openNotification}
                                        aria-haspopup="dialog"
                                        className="relative p-1.5 rounded-full text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-300"
                                    >
                                        <Bell className="w-[21px] h-[21px]" />
                                        {unreadCount > 0 && (
                                            <span
                                                aria-label={`${unreadCount} unread notifications`}
                                                className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full bg-red-500 text-white text-[10px] font-bold leading-none ring-2 ring-white"
                                            >
                                                {unreadCount > 99 ? "99+" : unreadCount}
                                            </span>
                                        )}
                                    </button>

                                    <NotificationModal
                                        isOpen={openNotification}
                                        notifications={notificationItems}
                                        unreadCount={unreadCount}
                                        isLoading={isNotificationsLoading}
                                        onClose={handleCloseNotificationModal}
                                        onMarkAsRead={markAsRead}
                                        onMarkAllAsRead={markAllAsRead}
                                    />
                                </div>
                                <Link
                                    to={"/account/profile"}
                                    aria-label="Profile"
                                    className="hidden md:inline-flex"
                                >
                                    <div className="bg-black rounded-full w-8 h-8 flex items-center justify-center cursor-pointer">
                                        <span className="material-symbols-outlined text-white text-[20px]">
                                            account_circle
                                        </span>
                                    </div>
                                </Link>
                            </div>
                        ) : (
                            <div className="flex items-center gap-1.5 sm:gap-2">
                                <Button
                                    variant="ghost"
                                    className="hidden sm:inline-flex px-4 py-2"
                                    onClick={() => navigate("/signup")}
                                >
                                    Sign up
                                </Button>
                                <Button
                                    className="px-4 py-2 text-xs sm:text-sm sm:px-6 sm:py-2.5"
                                    onClick={() => navigate("/login")}
                                >
                                    Login
                                </Button>
                            </div>
                        )}
                    </div>
                </nav>

                {/* Expandable search bar for mobile & tablet (< lg) */}
                {isMobileSearchOpen && (
                    <div className="lg:hidden px-4 sm:px-6 pb-3 pt-1 border-t border-gray-100 bg-white">
                        <form onSubmit={handleSearch} className="relative w-full">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search services..."
                                autoFocus
                                className="w-full pl-10 pr-20 py-2.5 bg-gray-50 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-gray-200"
                            />
                            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                            <button
                                type="submit"
                                className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1 rounded-full bg-gray-900 text-white text-xs font-medium cursor-pointer"
                            >
                                Search
                            </button>
                        </form>
                    </div>
                )}
            </header>

            {/* Mobile Bottom Action Bar */}
            <nav
                aria-label="Mobile navigation"
                className="fixed bottom-0 inset-x-0 z-40 md:hidden bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] pb-[env(safe-area-inset-bottom)]"
            >
                <div className="grid grid-cols-5 items-center h-16 px-1 max-w-lg mx-auto">
                    <NavLink
                        to="/"
                        end
                        className={({ isActive }) =>
                            `flex flex-col items-center justify-center gap-1 py-1.5 text-[11px] font-medium transition-colors ${
                                isActive ? "text-gray-900 font-semibold" : "text-gray-500 hover:text-gray-800"
                            }`
                        }
                    >
                        {({ isActive }) => (
                            <>
                                <Home className={`w-5 h-5 ${isActive ? "stroke-[2.25]" : ""}`} />
                                <span>Home</span>
                            </>
                        )}
                    </NavLink>

                    <NavLink
                        to="/services"
                        className={({ isActive }) =>
                            `flex flex-col items-center justify-center gap-1 py-1.5 text-[11px] font-medium transition-colors ${
                                isActive ? "text-gray-900 font-semibold" : "text-gray-500 hover:text-gray-800"
                            }`
                        }
                    >
                        {({ isActive }) => (
                            <>
                                <Compass className={`w-5 h-5 ${isActive ? "stroke-[2.25]" : ""}`} />
                                <span>Services</span>
                            </>
                        )}
                    </NavLink>

                    <NavLink
                        to="/service-requests"
                        className="flex flex-col items-center justify-center -mt-3"
                    >
                        {({ isActive }) => (
                            <>
                                <span
                                    className={`w-11 h-11 rounded-2xl flex items-center justify-center shadow-md transition-transform active:scale-95 ${
                                        isActive
                                            ? "bg-red-500 text-white"
                                            : "bg-[#2A2A2A] text-white"
                                    }`}
                                >
                                    <PlusCircle className="w-5 h-5" />
                                </span>
                                <span
                                    className={`text-[11px] mt-1 font-medium ${
                                        isActive ? "text-red-600 font-semibold" : "text-gray-700"
                                    }`}
                                >
                                    Request
                                </span>
                            </>
                        )}
                    </NavLink>

                    <NavLink
                        to={providerDestination}
                        className={({ isActive }) =>
                            `flex flex-col items-center justify-center gap-1 py-1.5 text-[11px] font-medium transition-colors ${
                                isActive ? "text-gray-900 font-semibold" : "text-gray-500 hover:text-gray-800"
                            }`
                        }
                    >
                        {({ isActive }) => (
                            <>
                                <Briefcase className={`w-5 h-5 ${isActive ? "stroke-[2.25]" : ""}`} />
                                <span>{provider.status === "ACTIVE" ? "Pro" : "Provide"}</span>
                            </>
                        )}
                    </NavLink>

                    <NavLink
                        to={isAuthenticated ? "/account/profile" : "/login"}
                        className={({ isActive }) =>
                            `flex flex-col items-center justify-center gap-1 py-1.5 text-[11px] font-medium transition-colors ${
                                isActive ? "text-gray-900 font-semibold" : "text-gray-500 hover:text-gray-800"
                            }`
                        }
                    >
                        {({ isActive }) => (
                            <>
                                <User className={`w-5 h-5 ${isActive ? "stroke-[2.25]" : ""}`} />
                                <span>{isAuthenticated ? "Account" : "Login"}</span>
                            </>
                        )}
                    </NavLink>
                </div>
            </nav>
        </>
    );
};

export default Navbar;
