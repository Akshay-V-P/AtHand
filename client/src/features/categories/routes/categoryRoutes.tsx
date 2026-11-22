import type { RouteObject } from "react-router-dom";
import CategoryPage from "../pages/CategoryPage";
import ProviderProfilePage from "../pages/ProviderProfilePage";

const categoryRoutes: RouteObject[] = [
    {
        path: "/services",
        element: <CategoryPage />
    },
    {
        path: "/providers/:id",
        element: <ProviderProfilePage />
    }
];

export default categoryRoutes;
