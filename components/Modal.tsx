"use client";

import { ReactNode, useEffect } from "react";
import { createPortal } from "react-dom";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

export default function Modal({ isOpen, onClose, children }: ModalProps) {
  // Create a portal root dynamically when mounted
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-900 rounded-lg shadow-xl p-6 pt-12 relative w-full max-w-lg mx-4 animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        <span
          onClick={onClose}
          className="absolute top-0 right-2 cursor-pointer p-2 text-gray-400 hover:text-gray-900"
        >
          ✕
        </span>
        {children}
      </div>
    </div>,
    document.body,
  );
}
