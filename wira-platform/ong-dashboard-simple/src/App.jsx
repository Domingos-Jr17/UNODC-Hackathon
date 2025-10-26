import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Container } from '@mui/material';

import Dashboard from './components/Dashboard';
import ActivateUser from './components/ActivateUser';
import MonitorProgress from './components/MonitorProgress';

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
        <Container maxWidth="xl">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/activate" element={<ActivateUser />} />
            <Route path="/monitor" element={<MonitorProgress />} />
          </Routes>
        </Container>
      </Router>
    </ThemeProvider>
  );
}

export default App;
