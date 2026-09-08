import type { RouteObject } from "react-router-dom";
import ProviderLayout from "../layout/ProviderLayout";
import ApplyProviderRoutes from "../applyAsProvider/routes/ApplyProviderRoutes";
import ProtectedRoute from "../../../components/common/ProtectedRoute";
import {ProviderDashRoutes} from "../dashboard/routes/ProviderDashRoutes"

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
]

export default ProviderRoutes