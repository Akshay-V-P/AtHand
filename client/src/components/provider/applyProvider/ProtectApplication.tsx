import { Navigate, Outlet } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "../../../hooks/storeHook"
import { useEffect } from "react";
import { apiService } from "../../../features/provider/applyAsProvider/services/apiService";
import { setLoading, setProvider } from "../../../features/provider/applyAsProvider/store/providerSlice";

const ProtectApplication = () => {

    const user = useAppSelector((state)=>state.auth.user)

    const dispatch = useAppDispatch()

    useEffect(() => {
        if (!user || !user.id) return
        dispatch(setLoading(true))
        apiService
            .getProvider(user?.id!)
            .then((response) => {
                dispatch(setProvider(response.data.data));
            })
            .catch((error) => console.error(error));
        
        dispatch(setLoading(false))
        
    }, [user]);


    const provider = useAppSelector((state) => state.provider)

    if(provider.isLoading) return <div>Loading...</div>

    if(provider?.status == "PENDING" || provider?.status == "ACTIVE") return <Navigate to={"/apply-provider/verify"}/>
    return <Outlet/>
}

export default ProtectApplication