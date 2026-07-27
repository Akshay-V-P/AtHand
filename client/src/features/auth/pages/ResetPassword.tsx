import React, { useEffect, useState } from "react";
import { Button } from "../../../components/common/Button";
import { InputField } from "../../../components/common/InputField";
import { Form } from "../../../components/common/Form";
import { useForm } from "react-hook-form";
import {
    resetPasswordSchema,
    type ResetFormData,
} from "../validation/resetPasswordSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { authService } from "../services/authService";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import type { UpdatePasswordDto } from "../dtos/UpdatePasswordDto";
import { useTogglePassword } from "../hooks/useTogglePassword";

const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const [isUrlValid, setIsUrlValid] = useState(true);
    const [token, setToken] = useState("");
    const navigate = useNavigate();
    const [inputType, toggelVisibility, isVisible] = useTogglePassword();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<ResetFormData>({
        resolver: zodResolver(resetPasswordSchema),
        mode: "onSubmit",
    });

    const onSubmit = async (data: ResetFormData) => {
        try {
            const payload: UpdatePasswordDto = {
                password: data.password,
                token,
            };
            await authService.updatePassword(payload);
            navigate("/login");
        } catch (error: any) {
            console.log(error);
            toast.error(error.response?.data.message || "Something went wrong");
        }
    };

    useEffect(() => {
        const token = searchParams.get("token");
        if (!token) {
            setIsUrlValid(false);
            return;
        }
        setToken(token);
        authService
            .verifyResetLink(token)
            .then((response) => console.log(response))
            .catch((error) => {
                if (error.response.status != 200) {
                    setIsUrlValid(false);
                }
            });
    }, []);

    return isUrlValid ? (
        <div className="min-h-screen flex items-center justify-center bg-white p-4 sm:p-8">
            <div className="w-full max-w-[98%] md:max-w-[40%] bg-gradient-to-b from-[#BFE7FF] via-[#e4f6fb] to-[#FEFFE8] rounded-[2.5rem] p-6 md:p-10 shadow-sm flex flex-col gap-12 md:gap-8">
                <div className="text-3xl font-extrabold text-gray-900 tracking-tight">
                    At<span className="text-red-500">.</span>Hand
                </div>
                <div>
                    <div className="mb-8">
                        <h2 className="text-3xl font-extrabold text-gray-900">
                            Create new Password
                        </h2>
                        <p className="text-gray-500 mt-1">
                            Enter new password.
                        </p>
                    </div>
                    <Form onSubmit={handleSubmit(onSubmit)}>
                        <InputField
                            type={inputType}
                            placeholder="Password"
                            label={errors.password?.message}
                            {...register("password")}
                        />
                        <InputField
                            type={inputType}
                            placeholder="Confirm Password"
                            label={errors.confirmPassword?.message}
                            {...register("confirmPassword")}
                        />
                        <div className="flex gap-2 px-4">
                            <input
                                type="checkbox"
                                name="Show password"
                                id=""
                                className="cursor-pointer"
                                onChange={toggelVisibility}
                            />
                            <p className="text-[12px] text-gray-500">
                                {" "}
                                Show password
                            </p>
                        </div>
                        <div className="w-full flex justify-end">
                            <Button disabled={isSubmitting}>
                                {isSubmitting ? "Updating..." : "Update"}
                            </Button>
                        </div>
                    </Form>
                </div>
            </div>
        </div>
    ) : (
        <div className="min-h-screen flex items-center justify-center bg-white p-4 sm:p-8">
            {/* Main Card Container */}
            <div className="w-full max-w-[98%] md:max-w-[40%] bg-gradient-to-b from-[#BFE7FF] via-[#e4f6fb] to-[#FEFFE8] rounded-[2.5rem] p-6 md:p-10 shadow-sm flex flex-col gap-6 md:gap-8">
                {/* Logo */}
                <div className="text-3xl font-extrabold text-gray-900 tracking-tight">
                    At<span className="text-red-500">.</span>Hand
                </div>

                {/* Content Section */}
                <div className="flex flex-col items-center text-center mt-2 mb-4">
                    {/* Expired/Clock Icon Illustration */}
                    <div className="w-20 h-20 bg-white/80 rounded-full flex items-center justify-center shadow-sm mb-6">
                        <svg
                            className="w-10 h-10 text-gray-800"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                    </div>

                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                        Link Expired
                    </h2>

                    <p className="text-gray-600 font-medium text-[1.05rem] leading-relaxed max-w-sm">
                        For your security, this link has expired or is no longer
                        valid. Please request a new one to continue.
                    </p>
                </div>

                {/* Action Button */}
                <div className="flex justify-center pb-2">
                    <Link
                        to={"/forgot-password"}
                        className="w-full sm:w-auto px-10 py-3 rounded-xl font-medium transition-colors duration-200 text-sm bg-[#2A2A2A] hover:bg-black text-white shadow-md text-center"
                    >
                        Request new link
                    </Link>
                </div>

                {/* Secondary Navigation */}
                <div className="flex justify-center mt-[-10px]">
                    <Link
                        to={"/login"}
                        className="text-sm font-semibold text-gray-500 hover:text-gray-900 underline decoration-2 underline-offset-4 transition-colors"
                    >
                        Return to login
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
