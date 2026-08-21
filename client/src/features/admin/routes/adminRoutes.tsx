import type { RouteObject } from "react-router-dom";
import AdminLogin from "../pages/AdminLogin";
import Dashboard from "../pages/Dashboard";
import AdminLayout from "../layouts/AdminLayout";
import ProviderManagement from "../pages/ProviderManagement";
import ProviderDetailsLayout from "../layouts/ProviderDetailsLayout";
import EditProviderProfile from "../pages/EditProviderProfile";
import AdminProtection from "../../../components/admin/AdminProtection";
import ProviderServiceCatalog from "../pages/ProviderServiceCatalog";
import ProviderVerificationDocuments from "../pages/ProviderVerificationDocuments";
import ProviderPerformanceMetrics from "../pages/ProviderPerformanceMetrics";

const adminRoutes: RouteObject[] = [
    {
        element: <AdminProtection />,
        children: [
            {
                element: <AdminLayout />,
                children: [
                    {
                        path: "/admin/dashboard",
                        element: <Dashboard />,
                    },
                    {
                        path: "/admin/provider-management",
                        element: <ProviderManagement />,
                    },
                    {
                        element: <ProviderDetailsLayout />,
                        children: [
                            {
                                path: "/admin/provider-management/profile",
                                element: <EditProviderProfile />,
                            },
                            {
                                path: "/admin/provider-management/service",
                                element:<ProviderServiceCatalog/>
                            },
                            {
                                path: "/admin/provider-management/documents",
                                element:<ProviderVerificationDocuments/>
                            },
                            {
                                path: "/admin/provider-management/metrics",
                                element:<ProviderPerformanceMetrics/>
                            }
                        ],
                    },
                ],
            },
        ]
    },
    {
        path: "/admin/login",
        element: <AdminLogin />,
    },
];

export default adminRoutes