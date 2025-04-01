/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react";
import { Link } from "react-router";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import { useAlert } from "../ui/alert/AlertContext";
import AuthAPI from "../../apis/AuthAPI";
import { useNavigate } from "react-router";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { showAlert } = useAlert();
  //hide the email parts in the middle when submitted
  const [hideEmail, setHideEmail] = useState(false);
  const[loading, setLoading] = useState(false);


 const handleSubmit = (e: { preventDefault: () => void }) => {
  e.preventDefault();
  setLoading(true);

  // Check if email is valid
  if (!email) {
    showAlert({
      variant: "error",
      title: "Error",
      message: "Please enter a valid email address.",
    });
    setLoading(false);
    console.log("Loading state after validation failure:", loading);
    return;
  }

  // Call the API to request a password reset link
  AuthAPI.requestPasswordReset({ email })
    .then((response) => {
      console.log("API response:", response);
      if (response?.status === 200) {
        setIsSubmitted(true);
        setHideEmail(true);
        showAlert({
          variant: "success",
          title: "Success",
          message: "Password reset link sent to your email.",
        });
      } else {
        let errorMessage = response?.error?.message?.toString() || "An unknown error occurred.";
        if (response?.status === 404) {
          errorMessage = "Email not found. Please check and try again.";
        } else if (response?.status === 429) {
          errorMessage = "Too many attempts. Please try again later.";
        }
        showAlert({
          variant: "error",
          title: "Error",
          message: errorMessage,
        });
      }
    })
    .catch((error) => {
      console.error("API error:", error);
      showAlert({
        variant: "error",
        title: "Error",
        message: error?.message?.toString() || "A network error occurred. Please try again.",
      });
    })
    .finally(() => {
      setLoading(false);
      console.log("Loading state after API call:", loading);
    });
};



  return (
    <div className="flex flex-col flex-1">
      <div className="w-full max-w-md pt-10 mx-auto"></div>

      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          {isSubmitted ? (
            <div>
              <div className="mb-5 sm:mb-8">
                <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
                  Check Your Email
                </h1>
                <p className="text-sm text-green-500 dark:text-gray-400">
                  We've sent a password reset link to {hideEmail ? `${email.slice(0, 3)}...@${email.split("@")[1]}` : email}. Please check your inbox and follow the instructions to reset your password.
                </p>
              </div>
              <div className="mt-8">
                <Link
                  to="/"
                  className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400"
                >
                  Return to Sign In
                </Link>
              </div>
            </div>
          ) : (
            <div>
              <div className="mb-5 sm:mb-8">
                <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
                  Forgot Password?
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Enter your email and we'll send you a link to reset your password.
                </p>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="space-y-6">
                  <div>
                    <Label>
                      Email <span className="text-error-500">*</span>
                    </Label>
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      required
                    />
                  </div>

                  {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-7 w-7 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      ...
                    </>
                  ) : (
                    "Send Reset Link"
                  )}
                </button>
              </div>
                </div>
              </form>

              <div className="mt-5">
                <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                  Remember your password?{" "}
                  <Link
                    to="/"
                    className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
                  >
                    Sign In
                  </Link>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
