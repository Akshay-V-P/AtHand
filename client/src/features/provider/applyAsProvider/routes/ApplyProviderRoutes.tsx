import type { RouteObject } from "react-router-dom";
import ApplyAsProviderLayout from "../layouts/ApplyAsProviderLayout";
import CreateAccount from "../pages/CreateAccount";

const ApplyProviderRoutes: RouteObject[] = [
    {
        element: <ApplyAsProviderLayout />,
        children: [
            {
                element: <CreateAccount />,
                path:"/apply-provider"
            }
        ]
    }
] 

export default ApplyProviderRoutes