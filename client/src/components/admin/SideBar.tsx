import { useState } from "react";
import { adminServices } from "../../features/admin/services/adminServices";
import { useAppDispatch } from "../../hooks/storeHook";
import SidebarItem from "./SideBarItem";
import { adminlogout } from "../../features/admin/store/adminSlice";
import toast from "react-hot-toast";
import { Modal } from "../common/Modal";
import { useNavigate } from "react-router-dom";

const SideBar = () => {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const dispatch = useAppDispatch()
    const navigate = useNavigate()


  const handleLogout = async () => {
    try {
      await adminServices.logout({context:"ADMIN"})
        dispatch(adminlogout())
        navigate("/admin/login")
    } catch (error:any) {
      console.log(error)
      toast.error(error.response.data.message || "Something went wrong")
    }
  }
    return (
        <aside className="w-74 bg-[#f8f9fb] border-r border-gray-200 flex flex-col">
            <div className="p-6">
                <h1 className="text-xl font-bold text-gray-900 tracking-tight">
                    At<span className="text-red-500 mx-[1px]">.</span>Hand{" "}
                    <span className="font-semibold">Admin</span>
                </h1>
                <p className="text-xs text-gray-500 mt-1">Management Suite</p>
            </div>

            <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
                <SidebarItem
                    to="/admin/dashboard"
                    end
                    label="Dashboard"
                    icon={
                        <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                            />
                        </svg>
                    }
                />

                <SidebarItem
                    to="/admin/provider-management"
                    label="Provider Management"
                    icon={
                        <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                            />
                        </svg>
                    }
                />

                <SidebarItem
                    to="/admin/user-management"
                    label="User Management"
                    icon={
                        <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                            />
                        </svg>
                    }
                />

                <SidebarItem
                    to="/admin/service-categories"
                    label="Service Categories"
                    icon={
                        <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414 0.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                            />
                        </svg>
                    }
                />

                <SidebarItem
                    to="/admin/transactions"
                    label="Transactions"
                    icon={
                        <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M9 8h6m-5 0a3 3 0 110 6H9l3 3m-3-6h6m6 1a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                    }
                />

                <SidebarItem
                    to="/admin/resolution-center"
                    label="Resolution Center"
                    icon={
                        <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9"
                            />
                        </svg>
                    }
                />
            </nav>

            <div className="p-4 border-t border-gray-200 space-y-1">
                <SidebarItem
                    to="/admin/settings"
                    label="Settings"
                    icon={
                        <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                            />
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                        </svg>
                    }
                />
                <button
                    className="w-full flex items-center space-x-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors text-gray-600 hover:bg-gray-100 hover:text-gray-900 cursor-pointer"
                    onClick={()=>setIsModalOpen(true)}
                >
                    <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                            />
                    </svg>
                    <p>Logout</p>
                    </button>
            </div>

            <Modal isOpen={isModalOpen} onClose={()=>setIsModalOpen(false) } title='Logout' >
          <p className="text-gray-600 font-medium text-[1.05rem] leading-relaxed mb-8">
          Are you sure you want to logout?
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-end">
          <button 
            onClick={() => setIsModalOpen(false)}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl font-medium text-sm border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
          >
            No
          </button>
          <button 
            onClick={() => {
              handleLogout()
              setIsModalOpen(false);
            }}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl font-medium text-sm bg-[#e30000] hover:bg-[#9f0000] text-white shadow-md transition-colors cursor-pointer"
          >
            Logout
          </button>
        </div>
        </Modal>
        </aside>
    );
};

export default SideBar;
