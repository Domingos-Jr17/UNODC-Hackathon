import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Container } from '@mui/material';

import Dashboard from './components/Dashboard.tsx';
import ActivateUser from './components/ActivateUser.tsx';
import MonitorProgress from './components/MonitorProgress.tsx';
import Login from './components/login.tsx';

// Extend the Material-UI theme interface
declare module '@mui/material/styles' {
  interface Theme {
    custom?: {
      // Add custom theme properties if needed
    };
  }
  interface ThemeOptions {
    custom?: {
      // Add custom theme options if needed
    };
  }
}

const theme = createTheme({
  palette: {
    primary: {
      main: '#1E3A8A',
    },
    secondary: {
      main: '#4CAF50',
    },
    background: {
      default: '#F5F5F5',
    },
  },
});

function App() {
  return (

    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/active" element={<ActivateUser />} />
            <Route path="/monitor" element={<MonitorProgress />} />
          </Routes>
  
      </Router>
    </ThemeProvider>
  
  );
}

export default App;
