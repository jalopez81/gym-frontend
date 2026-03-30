'use client';

import { Box, TextField, Button, Stack } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useBreakpoints } from '@/utils/useMediaQuery';

interface SearchClaseProps {
  onSearch: (query: string) => void;
}

export default function SearchClase({ onSearch }: SearchClaseProps) {
  const [query, setQuery] = useState('');
  const t = useTranslations('Classes');
  const { isMobile } = useBreakpoints();

  const handleSearch = () => {
    onSearch(query.trim());
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSearch();
  };

  return (
    <Box sx={{ p: 2, my: 2, background: "#ffffff" }}>
      <Stack 
        direction={isMobile ? "column" : "row"} 
        spacing={2} 
        alignItems={isMobile ? "stretch" : "center"}
      >
        <TextField
          label={t('searchPlaceholder')}
          variant="outlined"
          size="small"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyPress}
          sx={{ 
            background: "#ffffff",
            flexGrow: 1 // Takes up remaining space on desktop
          }}
        />
        <Button
          variant="contained"
          color="primary"
          fullWidth={isMobile}
          startIcon={<SearchIcon />}
          onClick={handleSearch}
        >
          {t('searchButton')}
        </Button>
        <Button
          variant="outlined"
          color="primary"
          fullWidth={isMobile}
          onClick={() => {
            setQuery(''); // Optional: clear input when showing all
            onSearch('');
          }}
        >
          {t('showAll')}
        </Button>
      </Stack>
    </Box>
  );
}