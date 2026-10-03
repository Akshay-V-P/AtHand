import { type RouteObject } from "react-router-dom"
import homeRoute from "../home/HomeRoutes"
import CustomerLayout from "../layouts/CustomerLayout"
import accountRoutes from "../account/routes/AccountRoutes"
import CategoryPageRoutes from "../category-page/routes/CategoryPageRoutes"
import ServiceRequestRoutes from "../service-request/routes/ServiceRequestRoutes"

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
]

export default customerRoute