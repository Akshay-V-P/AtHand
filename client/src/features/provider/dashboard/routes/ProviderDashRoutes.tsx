import type { RouteObject } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import ProviderDashLayout from "../layouts/ProviderDashLayout";
import MyServices from "../pages/MyServices";
import AddNewService from "../pages/AddNewService";
import EditService from "../pages/EditService";
import RequestInbox from "../pages/RequestInbox";
import RequestReviewQuote from "../pages/RequestReviewQuote";

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
                path: "/provider/dashboard/requests",
                element: <RequestInbox />
            },
            {
                path: "/provider/dashboard/requests/:id",
                element: <RequestReviewQuote />
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