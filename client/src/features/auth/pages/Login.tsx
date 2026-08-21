import React, { useEffect } from "react";
import { Divider } from "../../../components/common/Divider";
import { Button } from "../../../components/common/Button";
import { InputField } from "../../../components/common/InputField";
import { useForm } from "react-hook-form";
import { loginSchema, type LoginFormData } from "../validation/loginSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { authService } from "../services/authService";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../hooks/storeHook";
import { loginSuccess } from "../store/authSlice";
import { Form } from "../../../components/common/Form";
import GoogleAuthButton from "../../../components/auth/GoogleAuthButton";

const Login = () => {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        mode: "onSubmit",
    });
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const user = useAppSelector((state) => state.auth.user);

    useEffect(() => {
        if (user) navigate("/");
    }, [user, navigate]);

    const onSubmit = async (data: LoginFormData) => {
        try {
            const loginData = {
                ...data,
                context:"USER" as const
            }
            const res = await authService.login(loginData);
            dispatch(loginSuccess(res.data.data.user));
        } catch (error: any) {
            console.log(error.response);
            toast.error(error.response?.data.message || "Something went wrong");
        }
    };
    return (
        <div className="min-h-screen flex items-center justify-center bg-white p-4 sm:p-8">
            {/* Main Card Container (Reusing the same gradient and structure) */}
            <div className="w-full max-w-[1100px] bg-gradient-to-b from-[#BFE7FF] via-[#e4f6fb] to-[#FEFFE8] rounded-[2.5rem] p-10 md:p-16 lg:p-20 shadow-sm flex flex-col md:flex-row gap-12 md:gap-8">
                {/* Left Section: Branding & Copy */}
                <div className="flex-1 flex flex-col justify-between">
                    <div>
                        {/* Logo */}
                        <div className="text-3xl font-extrabold text-gray-900 tracking-tight">
                            At<span className="text-red-500">.</span>Hand
                        </div>

                        {/* Hero Copy */}
                        <div className="mt-16 md:mt-24 max-w-md">
                            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-[1.2]">
                                Reliable Services
                                <span className="text-red-500">.</span>
                                <br />
                                Fair Pricing
                                <span className="text-red-500">.</span>
                                <br />
                                Trusted Experts
                                <span className="text-red-500">.</span>
                            </h1>
                            <p className="mt-6 text-[1.1rem] text-gray-600 leading-relaxed font-medium">
                                Log in to continue booking trusted professionals
                                near you.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right Section: Login Form */}
                <div className="flex-1 flex flex-col justify-center items-center md:items-end">
                    <div className="w-full max-w-md">
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900">
                                Welcome back
                            </h2>
                            <p className="text-gray-500 mt-1">
                                Your trusted service network is waiting.
                            </p>
                        </div>

                        <Form onSubmit={handleSubmit(onSubmit)}>
                            <InputField
                                type="email"
                                placeholder="Email"
                                {...register("email")}
                                label={errors.email?.message}
                            />

                            <div>
                                <InputField
                                    type="password"
                                    placeholder="Password"
                                    {...register("password")}
                                    label={errors.password?.message}
                                />
                                <div className="flex justify-end mt-1.5">
                                    <a
                                        href="/forgot-password"
                                        className="text-xs text-gray-400 hover:text-gray-600 underline transition-colors"
                                    >
                                        Forgot Password
                                    </a>
                                </div>
                            </div>

                            <div className="flex justify-center pt-2">
                                <Button type="submit" disabled={isSubmitting}>
                                    {isSubmitting
                                        ? "Logging in..."
                                        : "Login to account"}
                                </Button>
                            </div>
                        </Form>

                        <Divider />

                        {/* Social Login & Redirect */}
                        <div className="flex flex-col items-center space-y-6">
                <GoogleAuthButton/>

                            <a
                                href="/signup"
                                className="text-gray-900 font-semibold underline decoration-2 underline-offset-4 hover:text-black transition-colors"
                            >
                                Don't have an account?
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
