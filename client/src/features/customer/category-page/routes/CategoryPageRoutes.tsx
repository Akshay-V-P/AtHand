import type { RouteObject } from "react-router-dom";
import CategoryPage from "../pages/CategoryPage";

const CategoryPageRoutes: RouteObject[] = [
    {
        path: "/services",
        element:<CategoryPage/>
    }
]

export default CategoryPageRoutes