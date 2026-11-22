declare global {
    interface Window {
        Razorpay: any;
    }
}

let razorpayScriptLoadingPromise: Promise<boolean> | null = null;

export const loadRazorpayScript = (): Promise<boolean> => {
    if (typeof window === "undefined") {
        return Promise.resolve(false);
    }

    if (window.Razorpay) {
        return Promise.resolve(true);
    }

    if (razorpayScriptLoadingPromise) {
        return razorpayScriptLoadingPromise;
    }

    razorpayScriptLoadingPromise = new Promise<boolean>((resolve) => {
        const existingScript = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
        if (existingScript) {
            existingScript.addEventListener("load", () => resolve(true));
            existingScript.addEventListener("error", () => resolve(false));
            return;
        }

        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;
        script.onload = () => resolve(true);
        script.onerror = () => {
            console.error("Failed to load Razorpay Checkout SDK");
            resolve(false);
        };
        document.body.appendChild(script);
    });

    return razorpayScriptLoadingPromise;
};
