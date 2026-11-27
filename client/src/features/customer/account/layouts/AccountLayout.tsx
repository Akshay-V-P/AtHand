
import Sidebar from "@/features/customer/account/components/Sidebar";
import { Outlet } from "react-router-dom";

const AccountLayout = () => {
    return (
        <div className="bg-white font-sans">
            <main className="max-w-6xl mx-auto px-4 sm:px-6 pb-10 md:pb-20 mt-4 md:mt-8">
                <div className="flex flex-col md:flex-row gap-5 md:gap-8 lg:gap-12 items-stretch md:items-start">
                    <Sidebar />
                    <div className="flex-1 min-w-0">
                        <Outlet />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AccountLayout;