import React from 'react';
import PageMeta from '../../components/common/PageMeta';
import AuthLayout from './AuthPageLayout';
import ForgotPasswordForm from '../../components/auth/ForgotPasswordForm';

const ForgotPassword: React.FC = () => {


  return (
       <>
      <PageMeta
        title="Construction Management App | Forgot Password"
        description="Reset your password to regain access to the Construction Management App."
      />
      <AuthLayout>
        <ForgotPasswordForm />
      </AuthLayout>
    </>
  );
};

export default ForgotPassword;