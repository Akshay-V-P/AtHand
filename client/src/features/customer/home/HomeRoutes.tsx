import type { RouteObject } from "react-router-dom";
import Home from "./pages/Home";


const homeRoute: RouteObject[] = [
    {
        path: "/",
        element: <Home />
    },
]

export default homeRoute

