import React, { useEffect } from "react";
import SideBar from "../../../../components/provider/applyProvider/SideBar";
import { Outlet, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../../hooks/storeHook";
import { apiService } from "../services/apiService";
import {
    addDocument,
    setBusinessDetails,
    setLocationDetails,
    setServiceDetails,
} from "../store/appyProviderSlice";
import { setProvider } from "../store/providerSlice";

const ApplyAsProviderLayout = () => {
    const user = useAppSelector((state) => state.auth.user);
    const provider = useAppSelector((state) => state.provider);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if (!provider.id) {
            apiService
                .getProvider(user?.id!)
                .then((response) => {
                  console.log(response.data.data);
                  if(response.data.data.status == "ACTIVE") navigate("/provider")
                    dispatch(setProvider(response.data.data));
                })
                .catch((error) => console.log(error));
        }

        if (provider.status == "ACTIVE") navigate("/provider");
    }, [provider]);
  

    useEffect(() => {
        apiService.getDraft(user?.id!).then((response) => {
            const {
                businessDetails,
                locationDetails,
                serviceDetails,
                documents,
            } = response.data.data;

            if (businessDetails) {
                dispatch(setBusinessDetails(businessDetails));
            }

            if (locationDetails) {
                dispatch(setLocationDetails(locationDetails));
            }

            if (serviceDetails) {
                dispatch(setServiceDetails(serviceDetails));
            }

            if (documents && documents.length >= 1) {
                dispatch(addDocument(documents));
            }
        });
    }, []);

    return (
        <div className="md:flex overflow-hidden max-h-dvh">
            <SideBar />
            <Outlet />
        </div>
    );
};

export default ApplyAsProviderLayout;
