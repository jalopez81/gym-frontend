import { useMediaQuery } from '@mui/material';

export function useBreakpoints() {
    const isMobile = useMediaQuery('(max-width: 600px)');
    const isTablet = useMediaQuery('(max-width: 900px)');

    return {
        isMobile,
        isTablet,
        isDesktop: !isMobile && !isTablet,
    };
}