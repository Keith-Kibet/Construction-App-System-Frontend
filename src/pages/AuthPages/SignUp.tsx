import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import SignUpForm from "../../components/auth/SignUpForm";

export default function SignUp() {
  return (
    <>
      <PageMeta
      title="Construction Management App | Sign Up"
      description="Sign up to access the Construction Management App and streamline your project workflows."
      />
      <AuthLayout>
      <SignUpForm />
      </AuthLayout>
    </>
  );
}
