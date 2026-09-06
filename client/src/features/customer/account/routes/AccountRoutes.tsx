import { type RouteObject } from "react-router-dom";
import Profile from "../pages/Profile";
import AccountLayout from "../layouts/AccountLayout";
import ProtectedRoute from "../../../../components/common/ProtectedRoute";
import AddressPage from "../pages/AddressPage";

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
                        path:'/account/profile',
                        element: <Profile />
                    },
                    {
                        path: '/account/address',
                        element:<AddressPage/>
                    }
                ]
            }
        ]
    }
]

export default accountRoutes