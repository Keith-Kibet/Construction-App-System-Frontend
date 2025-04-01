// AlertContext.tsx
import React, { createContext, useContext, useState } from 'react';
import Alert from './Alert';
import type { AlertProps } from './Alert';

interface AlertContextType {
  showAlert: (config: AlertProps) => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const AlertProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [alert, setAlert] = useState<AlertProps | null>(null);
  const [visible, setVisible] = useState(false);

  const showAlert = (config: AlertProps) => {
    setAlert(config);
    setVisible(true);
  };

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}
      {visible && alert && (
        <div className="fixed top-4 right-4 z-50 w-96">
          <Alert {...alert} onClose={() => setVisible(false)} />
        </div>
      )}
    </AlertContext.Provider>
  );
};

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlert must be used within an AlertProvider');
  }
  return context;
};