import type { RouteObject } from "react-router-dom";
import CategoryPage from "../pages/CategoryPage";

const categoryRoutes: RouteObject[] = [
    {
        path: "/services",
        element: <CategoryPage />
    }
];

export default categoryRoutes;
