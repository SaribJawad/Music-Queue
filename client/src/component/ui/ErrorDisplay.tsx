import { toast } from "react-toastify";
import { useStreamContext } from "../../contexts/streamContext";
import { useEffect, memo } from "react";

const ErrorDisplay = memo(function ErrorDisplay() {
  const { error, setError } = useStreamContext();

  useEffect(() => {
    if (error) {
      toast.error(error, {
        // Also changed this to use the actual error message
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        onClose: () => setError(null),
      });
    }
  }, [error, setError]); // Added setError to dependencies

  return null;
});

export default ErrorDisplay;
