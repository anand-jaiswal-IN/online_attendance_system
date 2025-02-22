import { useState } from 'react';

const useAlert = () => {
  const [alert, setAlert] = useState({
    show: false,
    message: '',
    type: 'info'
  });

  const showAlert = (message, type = 'info', duration = 5000) => {
    setAlert({ show: true, message, type });
    setTimeout(() => {
      setAlert(prev => ({ ...prev, show: false }));
    }, duration);
  };

  const hideAlert = () => {
    setAlert(prev => ({ ...prev, show: false }));
  };

  return { alert, showAlert, hideAlert };
};

export default useAlert;