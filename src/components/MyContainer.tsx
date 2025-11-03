import { Box, BoxProps } from "@mui/material";
import AuthGuard from "./AuthGuard";

type MyContainerProps = BoxProps & {
  children: React.ReactNode;
  isAuthGuard?: boolean;
};

export default function MyContainer({
  children,
  sx,
  isAuthGuard = false,
  ...rest
}: MyContainerProps) {
  
  const content = (
    <Box sx={{ padding: "2rem", ...sx }} {...rest}>
      {children}
    </Box>
  );

  console.log('isAuthGuard::', isAuthGuard)
  return isAuthGuard ? <AuthGuard>{content}</AuthGuard> : content;
}
