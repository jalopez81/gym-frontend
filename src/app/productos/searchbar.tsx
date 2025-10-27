import SearchIcon from '@mui/icons-material/Search';
import { Select, MenuItem, Typography, Button, AppBar, Box, InputBase, Toolbar } from '@mui/material';
import { alpha, styled } from '@mui/material/styles';
import { useRef } from 'react';
import { SelectChangeEvent } from '@mui/material/Select';
import { ProductPagination } from '@/types';

const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(3),
        width: 'auto',
    },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
            width: '20ch',
        },
    },
}));

type SearchBarProps = {
    pagination: ProductPagination;
    setPagination: (searchTerm: ProductPagination) => void;
}

export default function Searchbar({ pagination, setPagination }: SearchBarProps) {
    const searchInput = useRef<HTMLInputElement>(null);

    const updateItemsPerPage = (event: SelectChangeEvent<string>) => {
        const newValue = event.target.value;
        setPagination({
            ...pagination,
            limite: Number(newValue),
            pagina: 1,
        });
    };

    const updateSearchValue = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key !== "Enter") return;
        setPagination({
            ...pagination,
            busqueda: e.currentTarget.value,
        });
    };

    const searchButtonClick = () => {
        if (!searchInput.current) return;
        setPagination({
            ...pagination,
            busqueda: searchInput.current.value,
        });
    };

    return (
        <Box sx={{ flexGrow: 1, margin: "1rem 0", position: 'sticky', top: "56px", zIndex: 10 }}>
            <AppBar position="sticky" sx={{ top: 0, zIndex: 10 }}>
                <Toolbar>
                    <Search>
                        <SearchIconWrapper>
                            <SearchIcon />
                        </SearchIconWrapper>
                        <StyledInputBase
                            placeholder="Búsqueda"
                            inputProps={{ 'aria-label': 'search' }}
                            onKeyDown={updateSearchValue}
                            inputRef={searchInput}
                        />
                    </Search>
                    <Button
                        variant="text"
                        size="small"
                        color='secondary'
                        sx={{ mr: 2 }}
                        onClick={searchButtonClick}
                    >
                        Buscar
                    </Button>
                    <Typography variant="body2" mr={4}>{pagination.total} resultados encontrados</Typography>
                    <Select
                        value={pagination.limite.toString()}
                        onChange={updateItemsPerPage}
                        variant='standard'
                        sx={{
                            color: '#ffffff',
                            "&:before": { borderBottom: '1px solid white' },
                            "&:hover:not(.Mui-disabled):before": { borderBottom: '1px solid white' },
                            "& .MuiSelect-icon": { color: "#fff" },
                        }}
                    >
                        {[3, 5, 10, 15, 20, 30, 50].map((item) => (
                            <MenuItem key={item} value={item.toString()}>{item}</MenuItem>
                        ))}
                    </Select>
                    <Typography variant="body2" sx={{ ml: 1 }}>por página</Typography>
                    <Box sx={{ flexGrow: 1 }} />
                </Toolbar>
            </AppBar>
        </Box>
    );
}
