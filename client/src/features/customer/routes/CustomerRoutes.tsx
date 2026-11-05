import { type RouteObject } from "react-router-dom";
import homeRoute from "../home/routes/homeRoutes";
import CustomerLayout from "../layouts/CustomerLayout";
import accountRoutes from "../account/routes/AccountRoutes";
import CategoryPageRoutes from "@/features/categories/routes/categoryRoutes";
import ServiceRequestRoutes from "@/features/service-requests/routes/ServiceRequestRoutes";

const customerRoute: RouteObject[] = [
    {
        element: <CustomerLayout />,
        children: [
            ...homeRoute,
            ...accountRoutes,
            ...CategoryPageRoutes,
            ...ServiceRequestRoutes
        ]
    }
];

export default customerRoute;
