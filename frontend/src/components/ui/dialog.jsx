import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

function Dialog({ open, onOpenChange, children }) {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") onOpenChange(false);
    };
    
    if (open) {
      document.addEventListener("keydown", handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = "hidden";
    } else {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    }
    
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [open, onOpenChange]);

  if (!open) return null;
  
  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <DialogOverlay onClick={() => onOpenChange(false)} />
      {children}
    </div>,
    document.body
  );
}

function DialogTrigger({ onClick, children, asChild }) {
  if (asChild) {
    return children;
  }
  return <div onClick={onClick}>{children}</div>;
}

function DialogOverlay({ onClick }) {
  return (
    <div
      onClick={onClick}
      className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-all duration-300 animate-in fade-in-0"
      style={{
        animation: "fadeIn 0.3s ease-out"
      }}
    />
  );
}

function DialogContent({ onClose, children, className = "" }) {
  const handleContentClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div 
      onClick={handleContentClick}
      className={`
        fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 
        bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 
        border border-white/20 rounded-2xl shadow-2xl backdrop-blur-xl
        p-0 overflow-hidden transition-all duration-300
        animate-in fade-in-0 zoom-in-95 slide-in-from-left-1/2 slide-in-from-top-[48%]
        ${className}
      `}
      style={{
        animation: "dialogIn 0.3s ease-out",
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 100px rgba(59, 130, 246, 0.1)"
      }}
    >
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-purple-500/5"></div>
      
      {/* Animated background elements */}
      <div className="absolute top-0 left-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
      
      {/* Close button */}
      {onClose && (
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-20 rounded-full p-2 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-slate-900 backdrop-blur-sm border border-white/10 hover:border-white/20"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>
      )}
      
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes dialogIn {
          from { 
            opacity: 0; 
            transform: translate(-50%, -50%) scale(0.95); 
          }
          to { 
            opacity: 1; 
            transform: translate(-50%, -50%) scale(1); 
          }
        }
      `}</style>
    </div>
  );
}

function DialogHeader({ children, className = "" }) {
  return (
    <div className={`flex flex-col space-y-2 text-center p-6 pb-4 ${className}`}>
      {children}
    </div>
  );
}

function DialogFooter({ children, className = "" }) {
  return (
    <div className={`flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 p-6 pt-4 border-t border-white/10 ${className}`}>
      {children}
    </div>
  );
}

function DialogTitle({ children, className = "" }) {
  return (
    <h2 className={`text-2xl font-bold leading-none tracking-tight bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent ${className}`}>
      {children}
    </h2>
  );
}

function DialogDescription({ children, className = "" }) {
  return (
    <p className={`text-sm text-gray-300 leading-relaxed ${className}`}>
      {children}
    </p>
  );
}

export {
  Dialog,
  DialogTrigger,
  DialogOverlay,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
};