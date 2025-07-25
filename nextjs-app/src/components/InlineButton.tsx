"use client";

// React Native StyleSheet과 동일한 방식으로 스타일 객체 정의
const styles = {
  button: {
    backgroundColor: "#007bff",
    color: "white",
    padding: "10px 20px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "16px",
    transition: "background-color 0.2s",
  },
  primary: {
    backgroundColor: "#28a745",
  },
  disabled: {
    backgroundColor: "#6c757d",
    cursor: "not-allowed",
  },
} as const;

interface ButtonProps {
  children: React.ReactNode;
  variant?: "default" | "primary";
  disabled?: boolean;
  onClick?: () => void;
}

export default function InlineButton({
  children,
  variant = "default",
  disabled = false,
  onClick,
}: ButtonProps) {
  const buttonStyle = {
    ...styles.button,
    ...(variant === "primary" ? styles.primary : {}),
    ...(disabled ? styles.disabled : {}),
  };

  return (
    <button style={buttonStyle} disabled={disabled} onClick={onClick}>
      {children}
    </button>
  );
}
