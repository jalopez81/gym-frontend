'use client';

import { Box, TextField, Button, Stack } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useState } from 'react';

interface SearchClaseProps {
  onSearch: (query: string) => void;
}

export default function SearchClase({ onSearch }: SearchClaseProps) {
  const [query, setQuery] = useState('');

  const handleSearch = () => {
    onSearch(query.trim());
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSearch();
  };

  return (
    <Box sx={{ p: 2, my: 2, background: "#ffffff" }}>
      <Stack direction="row" spacing={2} alignItems="center">
        <TextField
          label="Buscar clase"
          variant="outlined"
          size="small"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyPress}
          sx={{background: "#ffffff"}}
        />
        <Button
          variant="contained"
          color="primary"
          startIcon={<SearchIcon />}
          onClick={handleSearch}
        >
          Buscar
        </Button>
        <Button
          variant="outlined"
          color="primary"
          onClick={()=>onSearch('')}
        >
          Mostrar todo
        </Button>
      </Stack>
    </Box>
  );
}
