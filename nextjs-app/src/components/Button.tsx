"use client";

import styles from "./Button.module.css";

interface ButtonProps {
  children: React.ReactNode;
  variant?: "default" | "primary";
  disabled?: boolean;
  onClick?: () => void;
}

export default function Button({
  children,
  variant = "default",
  disabled = false,
  onClick,
}: ButtonProps) {
  const buttonClass = `${styles.button} ${
    variant === "primary" ? styles.primary : ""
  }`;

  return (
    <button className={buttonClass} disabled={disabled} onClick={onClick}>
      {children}
    </button>
  );
}
