import type { AppDispatch } from "../../../store/store";
import { loginSuccess } from "../store/authSlice";
import { setProvider } from "../../provider/applyAsProvider/store/providerSlice";
import { apiService } from "../../provider/applyAsProvider/services/apiService";

/**
 * Initializes the authenticated user by setting their base data in Redux
 * and fetching their Provider profile if they have the PROVIDER role.
 */
export const initializeAuthenticatedUser = async (dispatch: AppDispatch, userData: any) => {
    // 1. Dispatch basic user info to authSlice
    dispatch(loginSuccess(userData));

    // 2. Conditionally fetch and hydrate Provider info if role is present
    if (userData && userData.role && userData.role.includes("PROVIDER")) {
        try {
            const providerResponse = await apiService.getProvider(userData.id);
            if (providerResponse?.data?.data) {
                dispatch(setProvider(providerResponse.data.data));
            }
        } catch (err) {
            console.error("Failed to fetch provider info during auth initialization", err);
        }
    }
};
