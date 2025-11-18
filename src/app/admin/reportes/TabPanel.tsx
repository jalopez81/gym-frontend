import { Box } from "@mui/material";

interface TabPanelProps {
  children?: React.ReactNode;
  index: string;
  value: string;
}

export default function TabPanel({ children, value, index }: TabPanelProps) {
  return (
    <Box role="tabpanel" hidden={value !== index}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </Box>
  );
}