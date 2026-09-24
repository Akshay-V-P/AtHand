import type { RouteObject } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import ProviderDashLayout from "../layouts/ProviderDashLayout";
import MyServices from "../pages/MyServices";
import AddNewService from "../pages/AddNewService";
import EditService from "../pages/EditService";

export const ProviderDashRoutes: RouteObject[] = [
    {
        element: <ProviderDashLayout />,
        children: [
            {
                path: "/provider/dashboard",
                element: <Dashboard />
            },
            {
                path: "/provider/dashboard/services",
                element: <MyServices />
            },
            {
                path: "/provider/dashboard/services/new",
                element: <AddNewService />
            },
            {
                path: "/provider/dashboard/services/edit/:id",
                element: <EditService />
            }
        ]
    }
]