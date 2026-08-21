import type { RouteObject } from "react-router-dom";
import ApplyAsProviderLayout from "../layouts/ApplyAsProviderLayout";
import BusinessDetails from "../pages/BusinessDetails";
import ServiceDetails from "../pages/ServiceDetails"
import UploadDocuments from "../pages/UploadDocuments"
import VerifyPage from "../pages/VerifyPage";
import ProtectApplication from "../../../../components/provider/applyProvider/ProtectApplication";

const ApplyProviderRoutes: RouteObject[] = [
    {
        element: <ApplyAsProviderLayout />,
        children: [
            {
                element: <ProtectApplication />,
                children:[
                    {
                        element: <BusinessDetails />,
                        path: "/apply-provider/business",
                    },
                    {
                        path: "/apply-provider/service",
                        element: <ServiceDetails />
                    },
                    {
                        path: "/apply-provider/documents",
                        element: <UploadDocuments />,
                    },
                ]
            },
            
            {
                path: "/apply-provider/verify",
                element:<VerifyPage/>
            }
        ],
    },
];

export default ApplyProviderRoutes;
