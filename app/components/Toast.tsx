"use client";

import { useEffect } from "react";

type ToastProps = {
  message: string;
  type?: "success" | "error";
  onClose: () => void;
  duration?: number;
};

export default function Toast({
  message,
  type = "error",
  onClose,
  duration = 3000,
}: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div
      className={`toast toast--${type}`}
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
    >
      {message}
    </div>
  );
}
