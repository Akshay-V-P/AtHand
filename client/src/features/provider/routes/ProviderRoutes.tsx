import type { RouteObject } from "react-router-dom";
import ProviderLayout from "../layout/ProviderLayout";
import ApplyProviderRoutes from "../applyAsProvider/routes/ApplyProviderRoutes";
import ProtectedRoute from "../../../components/common/ProtectedRoute";

const ProviderRoutes: RouteObject[] = [
    {
        element: <ProtectedRoute />,
        children: [{
            element: <ProviderLayout />,
            children: [
                ...ApplyProviderRoutes,
            ]
        }]
    }
]

export default ProviderRoutes