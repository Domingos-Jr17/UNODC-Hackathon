import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Container } from '@mui/material';

import Dashboard from './components/Dashboard.tsx';
import ActivateUser from './components/ActivateUser.tsx';
import MonitorProgress from './components/MonitorProgress.tsx';
import LoginPage from './components/loginPage.tsx';


function App() {
  return (
      <Router>
        
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/active" element={<ActivateUser />} />
            <Route path="/monitor" element={<MonitorProgress />} />
          </Routes>
  
      </Router>

  );
}

export default App;
