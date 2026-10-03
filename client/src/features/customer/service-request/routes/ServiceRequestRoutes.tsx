import { type RouteObject } from "react-router-dom";
import ServiceRequestsListPage from "../pages/ServiceRequestsListPage";
import CreateServiceRequestPage from "../pages/CreateServiceRequestPage";
import ServiceRequestDetailPage from "../pages/ServiceRequestDetailPage";
import ServiceRequestLayout from "../layouts/ServiceRequestLayout";

const ServiceRequestRoutes: RouteObject[] = [
    {
        element: <ServiceRequestLayout />,
        children: [
            {
                path: "service-requests",
                element: <ServiceRequestsListPage />
            },
            {
                path: "service-requests/new",
                element: <CreateServiceRequestPage />
            },
            {
                path: "service-requests/:id",
                element: <ServiceRequestDetailPage />
            }
        ]
    }
];

export default ServiceRequestRoutes;
