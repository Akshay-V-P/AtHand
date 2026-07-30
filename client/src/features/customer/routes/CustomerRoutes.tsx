import { type RouteObject } from "react-router-dom"
import homeRoute from "../home/HomeRoutes"
import CustomerLayout from "../layouts/CustomerLayout"
import accountRoutes from "../account/routes/AccountRoutes"

const customerRoute:RouteObject[] = [
    {
        element: <CustomerLayout />,
        children: [
            ...homeRoute,
            ...accountRoutes
        ]
    }
]

export default customerRoute