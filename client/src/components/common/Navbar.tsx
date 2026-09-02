import { Link, useNavigate } from "react-router-dom";
import { Button } from "./Button";
import { useActionState, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/storeHook";
import { apiService } from "../../features/provider/applyAsProvider/services/apiService";
import { setProvider } from "../../features/provider/applyAsProvider/store/providerSlice";



const Navbar = () => {
    const navigate = useNavigate()
    const { user, isAuthenticated, isLoading } = useAppSelector((state) => state.auth)
    const provider = useAppSelector(state => state.provider)
    const dispatch = useAppDispatch()
    const [providerActive, setProviderActive] = useState(false)

    useEffect(() => {
        console.log(user)
        if (!user?.id) return;
        if (!provider.id) {
            apiService
                .getProvider(user.id)
                .then((response) => {

                    const provider = response.data.data
                    console.log(provider)
                    if (provider.status === "ACTIVE") {
                        setProviderActive(true);
                    }

                    dispatch(setProvider(provider))
                })
                .catch((error) => console.log(error));
        }
        
    }, [provider, isLoading]);
    
    return (
        <nav className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
            <div className="text-2xl font-extrabold text-gray-900 tracking-tight">
                At<span className="text-red-500">.</span>Hand
            </div>

            <div className="hidden md:flex items-center gap-8">
                <a
                    href="#"
                    className="text-sm font-medium text-gray-600 hover:text-gray-900"
                >
                    Services
                </a>
                <Link to={provider.status == "ACTIVE"? "/provider" :"/apply-provider/business"}>
                    
                    <p
                    className="text-sm font-medium text-gray-600 hover:text-gray-900"
                    >
                    {provider.status == "ACTIVE"? "Provider Dashboard":"Become a Provider"}
                </p>
                </Link>
            </div>

            <div className="hidden lg:flex flex-1 max-w-md mx-8">
                <div className="relative w-full">
                    <input
                        type="text"
                        placeholder="Search services..."
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-gray-200"
                    />
                    <span className="absolute left-4 top-2 text-gray-400 text-sm">
                        <span className="material-symbols-outlined">
                            search
                        </span>
                    </span>
                </div>
            </div>

            <div className="flex items-center gap-4">
                {isAuthenticated ? (
                    <div className="flex min-w-55 justify-around">
                        <span className="material-symbols-outlined pt-1 cursor-pointer">
                            location_on
                        </span>
                        <span className="material-symbols-outlined pt-1 cursor-pointer">
                            chat_bubble
                        </span>
                        <Link to={"/account"}>
                            <div className="bg-black rounded-full w-8 h-8 flex items-center justify-center cursor-pointer">
                                <span className="material-symbols-outlined text-white">
                                    account_circle
                                </span>
                            </div>
                        </Link>
                    </div>
                ) : (
                    <>
                        <Button
                            variant="ghost"
                            className="hidden sm:block"
                            onClick={() => navigate("/signup")}
                        >
                            Sign up
                        </Button>
                        <Button onClick={() => navigate("/login")}>
                            Login
                        </Button>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
