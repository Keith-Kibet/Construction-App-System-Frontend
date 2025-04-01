import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import SignInForm from "../../components/auth/SignInForm";

export default function SignIn() {
  return (
    <>
      <PageMeta
      title="Construction Management App | Sign In"
      description="Sign in to access the Construction Management App and streamline your project workflows."
      />
      <AuthLayout>
        <SignInForm />
      </AuthLayout>
    </>
  );
}
