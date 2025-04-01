/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react";
import { Link } from "react-router";
import { EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import { useNavigate } from "react-router";
import AuthAPI from "../../apis/AuthAPI";
import { useAlert } from "../ui/alert/AlertContext";

export default function SignInForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { showAlert } = useAlert();

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    // Basic validation
    if (!email || !password) {
      showAlert({
        variant: "error",
        title: "Error",
        message: "Email and password are required.",
      });
      return;
    }

    // Call the API to sign in
   AuthAPI.login({ email, password })
  .then((response) => {
    if (response?.status === 200) {
      //get the user data from the response
      const userData = (response.data as any)?.user ?? null;
      showAlert({
        variant: "success",
        title: "Sign in successful",
        message: `Welcome back,  ${userData?.name}!`,
      });
      //clear the error message and the form fields
      setError("");
      setEmail("");
      setPassword("");

      setTimeout(() => {
         navigate("/home"); 
      }, 3000);


     
    } else {
      // Handle unexpected status codes
      let errorMessage = "Sign in failed.";
      if (response?.status === 400) {
        errorMessage = "Invalid email or password. Please try again.";
      } else if (response?.status === 401) {
        errorMessage = "Unauthorized access. Check your credentials.";
      } else if (response?.status === 403) {
        errorMessage = "Your account has been restricted. Contact support.";
      } else if (response?.status === 404) {
        errorMessage = "User not found. Please check your email.";
      }
      else if (response?.status === 500) {
        errorMessage = "Server error. Please try again later.";
      }

      setError(errorMessage);
      showAlert({
        variant: "error",
        title: "Error",
        message: errorMessage,
      });
    }
  })
  .catch((error) => {
    console.error("Login error:", error);

    let errorMessage = "An error occurred. Please try again.";
    if (error.response) {
      // API responded with an error status code
      errorMessage = error.response.data?.message || errorMessage;
    } else if (error.request) {
      // Request was made but no response received
      errorMessage = "Network error. Please check your internet connection.";
    } else {
      // Something else went wrong
      errorMessage = error.message || errorMessage;
    }

    setError(errorMessage);
    showAlert({
      variant: "error",
      title: "Error",
      message: errorMessage,
    });
  })
  .finally(() => {
    setLoading(false);
  });
    

  };

  return (
    <div className="flex flex-col flex-1">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div className="mb-5 sm:mb-8">
          <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
            Sign In
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Enter your email and password to sign in!
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            {/* Email Input */}
            <div>
              <Label>Email <span className="text-error-500">*</span></Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="info@gmail.com"
                required
              />
            </div>

            {/* Password Input */}
            <div>
              <Label>Password <span className="text-error-500">*</span></Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                >
                  {showPassword ? (
                    <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                  ) : (
                    <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                  )}
                </span>
              </div>
            </div>

            {/* Error Message */}
            {error && <p className="text-sm text-error-500">{error}</p>}

            {/* Forgot Password */}
            <div className="flex items-center justify-between">
              <Link
                to="/forgotpassword"
                className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400"
              >
                Forgot password?
              </Link>
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
                    "Sign In"
                  )}
                </button>
            </div>
          </div>
        </form>

        {/* Sign Up Link */}
        <div className="mt-5">
          <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
            Don&apos;t have an account?{" "}
            <Link to="/signup" className="text-brand-500 hover:text-brand-600 dark:text-brand-400">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
