 
import { useState } from "react";
import { Link, useSearchParams } from "react-router";
import { EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import AuthAPI from "../../apis/AuthAPI";
import { useAlert } from "../ui/alert/AlertContext";
import { useNavigate } from "react-router";

export default function ResetPasswordForm() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isReset, setIsReset] = useState(false);
  const [loading, setLoading] = useState(false);
  const { showAlert } = useAlert();
  const navigate = useNavigate();

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setLoading(true);

    //check if token and email are valid
    if (!token || !email) {
      showAlert({
        variant: "error",
        title: "Error",
        message: "Invalid token or email.",
      });
      return;
    }

    if (password !== confirmPassword) {
      showAlert({
        variant: "error",
        title: "Error",
        message: "Passwords do not match.",
      });
      return;
    }
    // Call the API to reset the password
AuthAPI.resetPassword({
  email: email,
  token: token,
  password: password,
  password_confirmation: confirmPassword,
})
  .then((response) => {
    if (response.status === 200) {
      setIsReset(true);
      showAlert({
        variant: "success",
        title: "Success",
        message: "Password has been reset successfully, navigating to login page.",
      });
      setIsReset(true);
      setTimeout(() => {
        setLoading(false);
        navigate("/");
      }, 3000);
    } else {
      let errorMessage = response?.error?.message?.toString() || "An unknown error occurred.";
      
      switch (response.status) {
        case 422:
          errorMessage = "Invalid input. Please check your details.";
          break;
        case 401:
          errorMessage = "Invalid token or email.";
          break;
        case 403:
          errorMessage = "Token expired.";
          break;
      }

      showAlert({
        variant: "error",
        title: "Error",
        message: errorMessage,
      });
    }
  })
  .catch((error) => {
    showAlert({
      variant: "error",
      title: "Error",
      message: error?.message?.toString() || "A network error occurred. Please try again.",
    });
  })
  .finally(() => {
    setLoading(false);
  });
  };

  return (
    <div className="flex flex-col flex-1">
      <div className="w-full max-w-md pt-10 mx-auto"></div>

      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          {isReset ? (
            <div>
              <div className="mb-5 sm:mb-8">
                <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
                  Password Updated
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Your password has been successfully reset.
                </p>
              </div>
              <div className="mt-8">
              </div>
            </div>
          ) : (
            <div>
              <div className="mb-5 sm:mb-8">
                <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
                  Reset Password
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Enter a new password for your account.
                </p>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="space-y-6">
                  <div>
                    <Label>
                      New Password <span className="text-error-500">*   (The password must be at least 6 characters.)</span>
                    </Label>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter new password"
                        required
                        min="8"
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

                  <div>
                    <Label>
                      Confirm Password <span className="text-error-500">*   (The password must be at least 6 characters.)</span>
                    </Label>
                    <div className="relative">
                      <Input
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm new password"
                        required
                        min="8"
                      />
                      <span
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                      >
                        {showConfirmPassword ? (
                          <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                        ) : (
                          <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                        )}
                      </span>
                    </div>
                  </div>
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
                    "Reset Password"
                  )}
                </button>
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
