import type { RouteObject } from "react-router-dom";
import ApplyAsProviderLayout from "../layouts/ApplyAsProviderLayout";
import BusinessDetails from "../pages/BusinessDetails";
import ServiceDetails from "../pages/ServiceDetails"

const ApplyProviderRoutes: RouteObject[] = [
    {
        element: <ApplyAsProviderLayout />,
        children: [
            {
                element: <BusinessDetails />,
                path: "/apply-provider/business",
            },
            {
                path: "/apply-provider/service",
                element:<ServiceDetails/>
            },
        ],
    },
];

export default ApplyProviderRoutes;
