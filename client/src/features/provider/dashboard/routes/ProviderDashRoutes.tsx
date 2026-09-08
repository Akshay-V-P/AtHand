import type { RouteObject } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import ProviderDashLayout from "../layouts/ProviderDashLayout";

export const ProviderDashRoutes:RouteObject[] = [
    {
        element: <ProviderDashLayout />,
        children: [
            {
                path: "/provider/dashboard",
                element:<Dashboard/>
            }
        ]
    }
]