// src/components/ToastNotification.tsx
import React, { useEffect, useState } from "react";

type ToastProps = {
  message: string;
  type: "success" | "error" | "info";
  duration?: number;
  onClose: () => void;
  isVisible: boolean;
};

const ToastNotification: React.FC<ToastProps> = ({
  message,
  type,
  duration = 3000,
  onClose,
  isVisible,
}) => {
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        setIsClosing(true);
        setTimeout(() => {
          setIsClosing(false);
          onClose();
        }, 300); // Animation duration
      }, duration);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [isVisible, duration, onClose]);

  if (!isVisible) return null;

  const getTypeStyles = () => {
    switch (type) {
      case "success":
        return "bg-green-600";
      case "error":
        return "bg-red-600";
      case "info":
      default:
        return "bg-blue-600";
    }
  };

  const getIcon = () => {
    switch (type) {
      case "success":
        return (
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 13l4 4L19 7"
            ></path>
          </svg>
        );
      case "error":
        return (
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            ></path>
          </svg>
        );
      case "info":
      default:
        return (
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
        );
    }
  };

  return (
    <div
      className={`fixed bottom-4 right-4 flex items-center p-4 rounded-lg text-white shadow-lg transition-all duration-300 ${getTypeStyles()} ${
        isClosing ? "opacity-0 translate-y-2" : "opacity-100"
      }`}
    >
      <div className="mr-3">{getIcon()}</div>
      <div className="mr-6">{message}</div>
      <button
        onClick={() => {
          setIsClosing(true);
          setTimeout(onClose, 300);
        }}
        className="text-white hover:text-gray-200"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M6 18L18 6M6 6l12 12"
          ></path>
        </svg>
      </button>
    </div>
  );
};

export default ToastNotification;
