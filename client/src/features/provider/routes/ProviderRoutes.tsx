import type { RouteObject } from "react-router-dom";
import ProviderLayout from "../layout/ProviderLayout";
import ApplyProviderRoutes from "../applyAsProvider/routes/ApplyProviderRoutes";

const ProviderRoutes: RouteObject[] = [
    {
        element: <ProviderLayout />,
        children: [
            ...ApplyProviderRoutes,
        ]
    }
]

export default ProviderRoutes