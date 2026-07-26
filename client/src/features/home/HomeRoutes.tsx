import type { RouteObject } from "react-router-dom";
import Home from "./pages/Home";
import ProtectedRoute from "../../components/common/ProtectedRoute";


const homeRoute: RouteObject[] = [
    {
        path: "/",
        element: <Home />
    },
]

export default homeRoute

