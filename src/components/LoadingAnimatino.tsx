import { Box, CircularProgress, Typography } from "@mui/material";

interface LoadingAnimationProps {
    caption?: string
}

export default function LoadingAnimation({ caption } : LoadingAnimationProps){
    return(
        <Box sx={{
            display: 'flex', 
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            height: '70vh'
        }}>
            <CircularProgress sx={{ margin: '0 auto'}} />
            {caption && <Typography variant="body1">{caption}</Typography>}
        </Box>
    )

}