import type { RouteObject } from "react-router-dom";
import ProviderLayout from "../layouts/ProviderLayout";
import ApplyProviderRoutes from "../applyAsProvider/routes/ApplyProviderRoutes";
import ProtectedRoute from "@/features/auth/components/ProtectedRoute";
import { ProviderDashRoutes } from "../dashboard/routes/ProviderDashRoutes";

const ProviderRoutes: RouteObject[] = [
    {
        element: <ProtectedRoute />,
        children: [{
            element: <ProviderLayout />,
            children: [
                ...ApplyProviderRoutes,
            ]
        },
            ...ProviderDashRoutes
        ]
    }
];

export default ProviderRoutes;
