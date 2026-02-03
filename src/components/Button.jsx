import { useTheme } from "../context/ThemeContext";

const Button = ({ 
  children, 
  type = "button", 
  onClick, 
  className = "",
  ...props 
}) => {
  const { isDark } = useTheme();

  return (
    <button
      type={type}
      onClick={onClick}
      className={`w-full max-w-[460px] py-[12px] px-[4px] rounded-[20px] font-semibold text-[18px] lg:text-[19px] transition-all ${
        isDark
          ? "bg-white text-black hover:bg-gray-200"
          : "bg-black text-white hover:bg-gray-800"
      } ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;


