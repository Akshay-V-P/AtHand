import { useEffect, useState } from 'react'
import SidebarItem from './SideBarItem'
import {User, Wrench, FileText, CheckCircle} from "lucide-react"
import { useLocation } from 'react-router-dom'

const SideBar = () => {
  const [activeTab, setActiveTab] = useState("account")
  const location = useLocation()
  useEffect(() => {
    const pathName = location.pathname.split("/")[2]
    setActiveTab(pathName)
  },[location])
  return (
    <aside className="w-full md:w-64 bg-[#F8F9FA] border-r border-gray-100 flex-col md:pt-8">
          <div className="px-6 mb-8 hidden md:block">
            <h2 className="text-2xl font-bold text-blue-700 mb-1">Registration</h2>
            <p className="text-sm text-gray-500">Step-by-step setup</p>
          </div>
          
          <nav className="flex justify-between  md:flex-col overflow-scroll hide-scrollbar">
            <SidebarItem icon={User} label="Account" isActive={activeTab == "business"} />
            <SidebarItem icon={Wrench} label="Services" isActive={activeTab == "service"} />
            <SidebarItem icon={FileText} label="Documents" isActive={activeTab == "documents"} />
            <SidebarItem icon={CheckCircle} label="Verify" isActive={activeTab == "verify"} />
          </nav>
        </aside>
  )
}

export default SideBar