import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0',
    },
    background: {
      default: '#f8f9fa',
      paper: '#ffffff',
    },
    grey: {
      50: '#fafafa',
      100: '#f5f5f5',
      200: '#eeeeee',
      300: '#e0e0e0',
    },
  },
  shape: {
    borderRadius: 16,
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          boxShadow: '2px 4px 16px rgba(0,0,0,0.08)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 24,
          boxShadow: '2px 4px 16px rgba(0,0,0,0.08)',
          overflow: 'hidden',
          '&:hover': {
            transform: 'translateY(-1px)',
            boxShadow: '3px 6px 20px rgba(0,0,0,0.1)',
            transition: 'all 0.2s ease-in-out'
          }
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          textTransform: 'none',
          minWidth: 'unset',
          padding: '8px',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 16,
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          borderRadius: '0 0 24px 24px',
          boxShadow: '2px 4px 16px rgba(0,0,0,0.08)',
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '2px 4px 16px rgba(0,0,0,0.08)',
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 24,
          boxShadow: '2px 4px 16px rgba(0,0,0,0.08)',
        },
      },
    },
    MuiFab: {
      styleOverrides: {
        root: {
          borderRadius: '50%',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: '999px',
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          borderRadius: 16,
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
    MuiAccordion: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          '&:first-of-type': {
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
          },
          '&:last-of-type': {
            borderBottomLeftRadius: 20,
            borderBottomRightRadius: 20,
          },
        },
      },
    },
  },
});

export default theme; 