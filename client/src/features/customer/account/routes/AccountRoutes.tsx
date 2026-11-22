import { type RouteObject } from "react-router-dom";
import Profile from "../pages/Profile";
import AccountLayout from "../layouts/AccountLayout";
import ProtectedRoute from "@/features/auth/components/ProtectedRoute";
import AddressPage from "../pages/AddressPage";
import CustomerWalletPage from "../pages/CustomerWalletPage";

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
                        path: '/account/profile',
                        element: <Profile />
                    },
                    {
                        path: '/account/address',
                        element: <AddressPage />
                    },
                    {
                        path: '/account/wallet',
                        element: <CustomerWalletPage />
                    }
                ]
            }
        ]
    }
]

export default accountRoutes;
