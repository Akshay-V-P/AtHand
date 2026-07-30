import { type RouteObject } from "react-router-dom";
import Profile from "../pages/Profile";
import AccountLayout from "../layouts/AccountLayout";
import ProtectedRoute from "../../../../components/common/ProtectedRoute";

const accountRoutes: RouteObject[] = [
    {
        element: <ProtectedRoute />,
        children: [
            {
                path: "/account",
                element: <AccountLayout />,
                children: [
                    {
                        index: true,
                        element: <Profile />
                    }
                ]
            }
        ]
    }
]

export default accountRoutes