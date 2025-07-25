"use client";

import styled from "styled-components";

// React Native StyleSheet과 매우 유사한 방식
const StyledButton = styled.button<{ variant?: "default" | "primary" }>`
  background-color: ${(props) =>
    props.variant === "primary" ? "#28a745" : "#007bff"};
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${(props) =>
      props.variant === "primary" ? "#1e7e34" : "#0056b3"};
  }

  &:disabled {
    background-color: #6c757d;
    cursor: not-allowed;
  }
`;

interface ButtonProps {
  children: React.ReactNode;
  variant?: "default" | "primary";
  disabled?: boolean;
  onClick?: () => void;
}

export default function StyledButtonComponent({
  children,
  variant = "default",
  disabled = false,
  onClick,
}: ButtonProps) {
  return (
    <StyledButton variant={variant} disabled={disabled} onClick={onClick}>
      {children}
    </StyledButton>
  );
}
