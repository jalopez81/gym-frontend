import { Box, BoxProps } from "@mui/material";

type MyContainerProps = BoxProps & { children: React.ReactNode };

export default function MyContainer({ children, sx, ...rest }: MyContainerProps) {
  return (
    <Box sx={{ padding: "2rem", flexGrow: 2, ...sx }} {...rest}>
      {children}
    </Box>
  );
}
