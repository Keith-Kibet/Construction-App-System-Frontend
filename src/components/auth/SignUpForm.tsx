
import { useState, useEffect } from 'react';
import AuthAPI from '../../apis/AuthAPI'; // Adjust the import path as necessary
import { useNavigate } from 'react-router';
import { Link } from "react-router";
import { EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Checkbox from "../form/input/Checkbox";
import { useAlert } from "../ui/alert/AlertContext"; // Adjust the import path as necessary


const SignUpForm = () => {
  const [formData, setFormData] = useState({
    fname: "",
    lname: "",
    email: "",
    password: "",
    termsAccepted: false,
  });
  const { showAlert } = useAlert(); // Use the alert context
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [apiSuccess, setApiSuccess] = useState(false);
  const navigate = useNavigate();
  const [errors, setErrors] = useState({
    fname: "",
    lname: "",
    email: "",
    password: "",
    termsAccepted: "",
  });

  // Handle input change
  const handleChange = (e: { target: { name: unknown; value: unknown; }; }) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name as string]: value,
    }));
  };

  // Update terms accepted when checkbox changes
  useEffect(() => {
    setFormData((prev) => ({ ...prev, termsAccepted: isChecked }));
  }, [isChecked]);

  // Form Validation
  const validateForm = () => {
    const newErrors = {
      fname: !formData.fname.trim() ? "First name is required" : "",
      lname: !formData.lname.trim() ? "Last name is required" : "",
      email: !formData.email.trim() ? "Email is required" : "",
      password: !formData.password.trim() ? "Password is required" : "",
      termsAccepted: !isChecked ? "You must accept the terms" : "",
    };

    setErrors(newErrors);
    return Object.values(newErrors).every((error) => error === "");
  };

  // Handle Form Submission
  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    setApiError(null);
    setApiSuccess(false);

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Prepare data for API
      const registrationData = {
        name: `${formData.fname} ${formData.lname}`,
        email: formData.email,
        password: formData.password,
        password_confirmation: formData.password
      };

      // Make API call
      AuthAPI.register(registrationData)
        .then(({ data, error }) => {
          if (error) {
            throw new Error(error.message || 'Registration failed');
          }

          if (data) {
            showAlert({
              variant: 'success',
              title: 'Registration Successful',
              message: 'Registration successful!, you will be navigated to the login page.',
            });

            // Reset form on success
            setFormData({
              fname: "",
              lname: "",
              email: "",
              password: "",
              termsAccepted: false,
            });
            setIsChecked(false);
            setErrors({
              fname: "",
              lname: "",
              email: "",
              password: "",
              termsAccepted: "",
            });
            //use timeout to delay navigation
            setTimeout(() => {
              navigate("/");
            }, 2000);
          }
        })
        .catch((error) => {
          showAlert({
            variant: 'error',
            title: 'Error',
            message: 'Failed to complete action.'
          }
          );
          console.error('Registration error:', error);
        })
        .finally(() => {
          setIsSubmitting(false);
        });
    } catch (error) {
      setApiError("An unexpected error occurred. Please try again.");
      console.error("Unexpected error:", error);
    }
  };


  return (
    <div className="flex flex-col flex-1 w-full overflow-y-auto lg:w-1/2 no-scrollbar">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Sign Up
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enter your email and password to sign up!
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="space-y-5">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                {/* First Name */}
                <div className="sm:col-span-1">
                  <Label>First Name<span className="text-error-500">*</span></Label>
                  <Input
                    type="text"
                    name="fname"
                    placeholder="Enter your first name"
                    value={formData.fname}
                    onChange={handleChange}
                  />
                  {errors.fname && <p className="text-red-500 text-xs">{errors.fname}</p>}
                </div>

                {/* Last Name */}
                <div className="sm:col-span-1">
                  <Label>Last Name<span className="text-error-500">*</span></Label>
                  <Input
                    type="text"
                    name="lname"
                    placeholder="Enter your last name"
                    value={formData.lname}
                    onChange={handleChange}
                  />
                  {errors.lname && <p className="text-red-500 text-xs">{errors.lname}</p>}
                </div>
              </div>

              {/* Email */}
              <div>
                <Label>Email<span className="text-error-500">*</span></Label>
                <Input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                />
                {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
              </div>

              {/* Password */}
              <div>
                <Label>Password<span className="text-error-500">*</span>  (The password must be at least 6 characters.)</Label>
                <div className="relative">
                  <Input
                    name="password"
                    placeholder="Enter your password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
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
                {errors.password && <p className="text-red-500 text-xs">{errors.password}</p>}
              </div>

              {/* Terms and Conditions */}
              <div className="flex items-center gap-3">
                <Checkbox
                  className="w-5 h-5"
                  checked={formData.termsAccepted}
                  onChange={setIsChecked}
                />
                <p className="inline-block font-normal text-gray-500 dark:text-gray-400">
                  By creating an account, you agree to the{" "}
                  <span className="text-gray-800 dark:text-white/90">Terms and Conditions</span>, and our{" "}
                  <span className="text-gray-800 dark:text-white">Privacy Policy</span>.
                </p>
              </div>
              {errors.termsAccepted && <p className="text-red-500 text-xs">{errors.termsAccepted}</p>}
              {/* API Error Message */}
              {apiError && (
                <div className="api-error">
                  {apiError}
                </div>
              )}

              {/* Success Message */}
              {apiSuccess && (
                <div className="success-message">
                  Registration successful! Please check your email to verify your account.
                </div>
              )}

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-7 w-7 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      ...
                    </>
                  ) : (
                    "Register"
                  )}
                </button>
              </div>
            </div>
          </form>

          {/* Sign In Link */}
          <div className="mt-5">
            <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
              Already have an account?{" "}
              <Link
                to="/"
                className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpForm;