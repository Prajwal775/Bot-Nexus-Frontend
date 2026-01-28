import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  SyntheticEvent,
} from "react";
import { Snackbar, Alert, AlertColor } from "@mui/material";
import type { SnackbarCloseReason } from "@mui/material/Snackbar";

/**
 * -----------------------------------------
 * Global Toast Handler (for Axios, utils)
 * -----------------------------------------
 */
type ToastHandler = (message: string, severity?: AlertColor) => void;

let toastHandler: ToastHandler | null = null;

export const registerToast = (fn: ToastHandler) => {
  toastHandler = fn;
};

export const showGlobalToast = (
  message: string,
  severity: AlertColor = "info"
) => {
  if (toastHandler) {
    toastHandler(message, severity);
  } else {
    console.warn("Toast handler not registered yet:", message);
  }
};

/**
 * -----------------------------------------
 * Toast Context
 * -----------------------------------------
 */
interface ToastContextType {
  showToast: (message: string, severity?: AlertColor) => void;
}

export const ToastContext = createContext<ToastContextType | null>(null);

interface ToastState {
  open: boolean;
  message: string;
  severity: AlertColor;
}

interface ToastProviderProps {
  children: ReactNode;
}

export const ToastProvider = ({ children }: ToastProviderProps) => {
  const [toast, setToast] = useState<ToastState>({
    open: false,
    message: "",
    severity: "info",
  });

  const showToast = (
    message: string,
    severity: AlertColor = "info"
  ) => {
    setToast({
      open: true,
      message,
      severity,
    });
  };

  /**
   * Snackbar close handler (has reason)
   */
  const handleSnackbarClose = (
    _: SyntheticEvent | Event,
    reason?: SnackbarCloseReason
  ) => {
    if (reason === "clickaway") return;
    setToast((prev) => ({ ...prev, open: false }));
  };

  /**
   * Alert close handler (NO reason param)
   */
  const handleAlertClose = (_: SyntheticEvent) => {
    setToast((prev) => ({ ...prev, open: false }));
  };

  /**
   * Register toast handler for global usage (Axios etc.)
   */
  useEffect(() => {
    registerToast(showToast);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      <Snackbar
        open={toast.open}
        autoHideDuration={8000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleAlertClose}
          severity={toast.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </ToastContext.Provider>
  );
};

/**
 * -----------------------------------------
 * Hook for React Components
 * -----------------------------------------
 */
export const useToastContext = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToastContext must be used inside ToastProvider");
  }
  return ctx;
};
