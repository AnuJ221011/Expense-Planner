function Label({ className = "", ...props }) {
  return (
    <label
      className={`block text-sm font-medium mb-2 ${className}`}
      {...props}
    />
  );
}

export { Label };
  
