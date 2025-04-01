import React from 'react';
import PageMeta from '../../components/common/PageMeta';
import AuthLayout from './AuthPageLayout';
import ResetPasswordForm from '../../components/auth/ResetPasswordForm';

const ResetPassword: React.FC = () => {


  return (
       <>
      <PageMeta
        title="Construction Management App | Reset Password"
        
        description="Reset your password to regain access to the Construction Management App."
      />
      <AuthLayout>
        <ResetPasswordForm />
      </AuthLayout>
    </>
  );
};

export default ResetPassword;