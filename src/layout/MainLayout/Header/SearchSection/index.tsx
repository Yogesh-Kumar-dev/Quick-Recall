'use client';

import { KeyboardEvent, ReactNode, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

// material-ui
import { useTheme } from '@mui/material/styles';
import Avatar, { AvatarProps } from '@mui/material/Avatar';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Grid from '@mui/material/Grid';
import InputAdornment from '@mui/material/InputAdornment';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import OutlinedInput from '@mui/material/OutlinedInput';
import Popper from '@mui/material/Popper';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// third party
import PopupState, { bindPopper, bindToggle } from 'material-ui-popup-state';

// project imports
import { ThemeMode } from 'config';
import Transitions from 'ui-component/extended/Transitions';
import { createSearchFuse, SearchItem } from 'data/search-index';

// assets
import { IconSearch, IconX } from '@tabler/icons-react';

interface HeaderAvatarProps extends AvatarProps {
  children: ReactNode;
}

function HeaderAvatar({ children, ref, ...others }: HeaderAvatarProps) {
  const theme = useTheme();

  return (
    <Avatar
      ref={ref}
      variant="rounded"
      sx={{
        ...theme.typography.commonAvatar,
        ...theme.typography.mediumAvatar,
        bgcolor: theme.palette.mode === ThemeMode.DARK ? 'dark.main' : 'secondary.light',
        color: theme.palette.mode === ThemeMode.DARK ? 'secondary.main' : 'secondary.dark',
        '&:hover': {
          bgcolor: theme.palette.mode === ThemeMode.DARK ? 'secondary.main' : 'secondary.dark',
          color: theme.palette.mode === ThemeMode.DARK ? 'secondary.light' : 'secondary.light'
        }
      }}
      {...others}
    >
      {children}
    </Avatar>
  );
}

const MAX_RESULTS = 8;

const difficultyColor: Record<string, 'success' | 'warning' | 'error' | 'default'> = {
  easy: 'success',
  basic: 'success',
  medium: 'warning',
  intermediate: 'warning',
  hard: 'error',
  advanced: 'error'
};

// ==============================|| SEARCH RESULTS DROPDOWN ||============================== //

interface ResultsProps {
  results: SearchItem[];
  activeIndex: number;
  query: string;
  onSelect: (item: SearchItem) => void;
}

function SearchResults({ results, activeIndex, query, onSelect }: ResultsProps) {
  if (!query.trim()) return null;

  if (results.length === 0) {
    return (
      <Card sx={{ p: 2, boxShadow: (theme) => theme.shadows[8] }}>
        <Typography variant="body2" color="text.secondary">
          No results for &ldquo;{query}&rdquo;
        </Typography>
      </Card>
    );
  }

  // group by section, preserving overall ranked order
  const sections = results.reduce<Record<string, SearchItem[]>>((acc, item) => {
    (acc[item.section] ??= []).push(item);
    return acc;
  }, {});

  return (
    <Card sx={{ boxShadow: (theme) => theme.shadows[8], maxHeight: 420, overflowY: 'auto' }}>
      <List dense disablePadding>
        {Object.entries(sections).map(([section, items]) => (
          <Box key={section}>
            <ListSubheader disableSticky sx={{ bgcolor: 'transparent', lineHeight: '32px', fontWeight: 600 }}>
              {section}
            </ListSubheader>
            {items.map((item) => {
              const isActive = results[activeIndex]?.id === item.id;
              return (
                <ListItemButton
                  key={item.id}
                  selected={isActive}
                  onMouseDown={(e) => {
                    // prevent input blur before navigation
                    e.preventDefault();
                    onSelect(item);
                  }}
                  sx={{ px: 2 }}
                >
                  <ListItemText
                    primary={item.label}
                    secondary={item.description}
                    slotProps={{
                      primary: { variant: 'subtitle2', noWrap: true },
                      secondary: { variant: 'caption', noWrap: true }
                    }}
                  />
                  <Box sx={{ display: 'flex', gap: 0.5, ml: 1, flexShrink: 0 }}>
                    {item.difficulty && (
                      <Chip size="small" label={item.difficulty} color={difficultyColor[item.difficulty] ?? 'default'} variant="outlined" />
                    )}
                    <Chip size="small" label={item.kind} variant="outlined" />
                  </Box>
                </ListItemButton>
              );
            })}
          </Box>
        ))}
      </List>
    </Card>
  );
}

// ==============================|| SEARCH INPUT (shared logic) ||============================== //

interface SearchInputProps {
  fullWidth?: boolean;
  endAdornment?: ReactNode;
  onNavigate?: () => void;
}

function SearchInput({ fullWidth, endAdornment, onNavigate }: SearchInputProps) {
  const router = useRouter();
  const anchorRef = useRef<HTMLDivElement>(null);
  const fuse = useMemo(() => createSearchFuse(), []);

  const [value, setValue] = useState('');
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const results = useMemo(() => {
    if (!value.trim()) return [];
    return fuse
      .search(value)
      .slice(0, MAX_RESULTS)
      .map((r) => r.item);
  }, [fuse, value]);

  const navigate = (item: SearchItem) => {
    router.push(item.url);
    setValue('');
    setOpen(false);
    setActiveIndex(0);
    onNavigate?.();
  };

  const handleChange = (next: string) => {
    setValue(next);
    setOpen(true);
    setActiveIndex(0);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (!open && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
      setOpen(true);
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => (results.length ? (i + 1) % results.length : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => (results.length ? (i - 1 + results.length) % results.length : 0));
    } else if (e.key === 'Enter') {
      const item = results[activeIndex] ?? results[0];
      if (item) {
        e.preventDefault();
        navigate(item);
      }
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  };

  return (
    <ClickAwayListener onClickAway={() => setOpen(false)}>
      <Box ref={anchorRef} sx={{ position: 'relative', width: fullWidth ? '100%' : undefined }}>
        <OutlinedInput
          id="input-search-header"
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          onFocus={() => value.trim() && setOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search problems, hooks, pages…"
          autoComplete="off"
          startAdornment={
            <InputAdornment position="start">
              <IconSearch stroke={1.5} size="16px" />
            </InputAdornment>
          }
          endAdornment={endAdornment}
          aria-describedby="search-helper-text"
          slotProps={{ input: { 'aria-label': 'search', sx: { bgcolor: 'transparent', pl: 0.5 } } }}
          sx={{
            width: fullWidth ? '100%' : { md: 250, lg: 434 },
            ...(fullWidth ? { ml: 0.5, bgcolor: 'background.paper' } : {}),
            px: 2
          }}
        />
        <Popper
          open={open && !!value.trim()}
          anchorEl={anchorRef.current}
          placement="bottom-start"
          transition
          style={{ zIndex: 1300, width: anchorRef.current?.clientWidth }}
        >
          {({ TransitionProps }) => (
            <Transitions type="fade" {...TransitionProps}>
              <Box sx={{ mt: 1 }}>
                <SearchResults results={results} activeIndex={activeIndex} query={value} onSelect={navigate} />
              </Box>
            </Transitions>
          )}
        </Popper>
      </Box>
    </ClickAwayListener>
  );
}

// ==============================|| SEARCH SECTION ||============================== //

export default function SearchSection() {
  const theme = useTheme();

  return (
    <>
      {/* mobile: search icon opens a full-width search popper */}
      <Box sx={{ display: { xs: 'block', md: 'none' } }}>
        <PopupState variant="popper" popupId="search-popup-popper">
          {(popupState) => (
            <>
              <Box sx={{ ml: 2 }}>
                <HeaderAvatar {...bindToggle(popupState)}>
                  <IconSearch stroke={1.5} size="19.2px" />
                </HeaderAvatar>
              </Box>
              <Popper
                {...bindPopper(popupState)}
                transition
                sx={{ zIndex: 1100, width: '99%', top: '-55px !important', px: { xs: 1.25, sm: 1.5 } }}
              >
                {({ TransitionProps }) => (
                  <Transitions type="zoom" {...TransitionProps} sx={{ transformOrigin: 'center left' }}>
                    <Card sx={{ bgcolor: 'background.default', border: 0, boxShadow: 'none' }}>
                      <Box sx={{ p: 2 }}>
                        <Grid container sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
                          <Grid size="grow">
                            <SearchInput
                              fullWidth
                              onNavigate={popupState.close}
                              endAdornment={
                                <InputAdornment position="end">
                                  <Avatar
                                    variant="rounded"
                                    sx={{
                                      ...theme.typography.commonAvatar,
                                      ...theme.typography.mediumAvatar,
                                      bgcolor: theme.palette.mode === ThemeMode.DARK ? 'dark.main' : 'orange.light',
                                      color: 'orange.dark',
                                      '&:hover': { bgcolor: 'orange.dark', color: 'orange.light' }
                                    }}
                                    {...bindToggle(popupState)}
                                  >
                                    <IconX stroke={1.5} size="20px" />
                                  </Avatar>
                                </InputAdornment>
                              }
                            />
                          </Grid>
                        </Grid>
                      </Box>
                    </Card>
                  </Transitions>
                )}
              </Popper>
            </>
          )}
        </PopupState>
      </Box>

      {/* desktop: always-visible inline search */}
      <Box sx={{ display: { xs: 'none', md: 'block' } }}>
        <SearchInput />
      </Box>
    </>
  );
}
