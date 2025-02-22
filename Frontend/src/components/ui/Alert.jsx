import { useEffect } from "react";
import { X } from "lucide-react";
import PropTypes from "prop-types";

const Alert = ({ message, type, onClose, duration = 5000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  const alertStyles = {
    success: "bg-green-100 border-green-400 text-green-700",
    error: "bg-red-100 border-red-400 text-red-700",
    warning: "bg-yellow-100 border-yellow-400 text-yellow-700",
    info: "bg-blue-100 border-blue-400 text-blue-700",
  };

  return (
    <div
      className={`fixed top-4 right-4 z-50 border rounded-lg shadow-lg px-4 py-3 flex items-center justify-between ${alertStyles[type]}`}
      role="alert"
      aria-live="assertive"
    >
      <div className="flex items-center gap-2">
        <span className="sr-only">{type}</span>
        <span className="font-medium">{message}</span>
      </div>
      <button
        onClick={onClose}
        className="ml-4 hover:opacity-75 transition-opacity"
        aria-label="Close alert"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  );
};

Alert.propTypes = {
  message: PropTypes.string.isRequired,
  type: PropTypes.oneOf(["success", "error", "warning", "info"]).isRequired,
  onClose: PropTypes.func.isRequired,
  duration: PropTypes.number,
};

export default Alert;
