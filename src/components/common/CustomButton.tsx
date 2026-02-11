import type { FC, ReactNode } from "react";
import { Button as MuiButton } from "@mui/material";
import type { ButtonProps } from "@mui/material";

interface CustomButtonProps extends ButtonProps {
  label?: string;
  loading?: boolean;
  loadingText?: string;
  children?: ReactNode;
}

const CustomButton: FC<CustomButtonProps> = ({
  label,
  loading = false,
  loadingText,
  disabled,
  children,
  sx,
  variant = "contained",
  ...rest
}) => {
  const content = label || children || "Submit";

  return (
    <MuiButton
      variant={variant}
      disabled={disabled || loading}
      {...rest}
      sx={{
        textTransform: "none",
        borderRadius: "10px",
        py: 1.5,
        fontWeight: 600,
        minHeight: "48px",
        boxShadow: "none",
        "&:hover": {
          boxShadow: "none",
        },
        ...sx,
      }}
    >
      {loading ? loadingText || "Loading..." : content}
    </MuiButton>
  );
};

export default CustomButton;
