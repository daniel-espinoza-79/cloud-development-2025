import { X } from "lucide-react";
import React from "react";

type PopupProps = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

const Dialog = ({ isOpen, onClose, children }: PopupProps) => {
  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50`}
      onClick={onClose}
    >
      <div
        className={`bg-tertiary rounded-lg shadow-lg max-w-md w-full max-h-screen overflow-y-auto p-6 relative`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-white cursor-pointer"
        >
          <X size={24} />
        </button>

        {children}
      </div>
    </div>
  );
};

export default Dialog;
