
function Input({ className = "", type = "text", ...props }) {
  return (
    <input
      type={type}
      className={`w-full px-4 py-3 rounded-xl bg-white/5 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-transparent transition-all duration-200 ${className}`}
      {...props}
    />
  );
}

export { Input };

