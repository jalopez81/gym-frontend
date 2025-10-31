import { Box, CircularProgress } from "@mui/material";

export default function LoadingAnimation(){
    return(
        <Box sx={{
            margin: '200px 0 0 0',
            display: 'flex', 
            justifyContent: 'center',
            width: '100%'
        }}>
            <CircularProgress />
        </Box>
    )

}