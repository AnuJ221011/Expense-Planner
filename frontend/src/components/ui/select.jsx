import { useState } from "react";

const Select = ({ children, value, onValueChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleItemClick = (val) => {
    onValueChange(val);
    setIsOpen(false); 
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/20 text-white text-left focus:outline-none focus:ring-2 focus:ring-blue-400/50 transition-all duration-200"
      >
        {value || "Select category"}
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-gray-800/95 backdrop-blur-md border border-white/20 rounded-xl shadow-xl z-10">
          {children.map((child) =>
            child.type === SelectContent
              ? (
                  <SelectContent>
                    {child.props.children.map((item) =>
                      <SelectItem
                        key={item.props.value}
                        value={item.props.value}
                        onClick={() => handleItemClick(item.props.value)}
                      >
                        {item.props.children}
                      </SelectItem>
                    )}
                  </SelectContent>
                )
              : child
          )}
        </div>
      )}
    </div>
  );
};


const SelectTrigger = ({ children }) => children;
const SelectValue = ({ placeholder }) => <span>{placeholder}</span>;
const SelectContent = ({ children }) => children;
const SelectItem = ({ children, onClick }) => (
  <div
    onClick={onClick}
    className="px-4 py-2 text-white hover:bg-white/10 cursor-pointer transition-colors duration-150"
  >
    {children}
  </div>
);

export {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
};