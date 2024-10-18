import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AdminView from './Components/views/AdminView';
import CustomerView from './Components/views/CustomerView';
import LoginPage from './Components/LoginPage';
import RequireAuth from './Components/RequireAuth';

import { ThemeProvider, createTheme } from '@mui/material/styles';
import './App.css';

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
    },
});


function App() {
  return (
      <ThemeProvider theme={darkTheme}>
          <header className="App-header">
              <Router>
                  <Routes>
                      {/* public */}
                      <Route path="/" element={<LoginPage/>}/>

                      {/* private | need authentication to access */}
                      <Route element={<RequireAuth />}>
                          <Route path="/admin" element={<AdminView/>}/>
                          <Route path="/customer" element={<CustomerView/>}/>
                      </Route>
                  </Routes>
              </Router>
          </header>
      </ThemeProvider>
  );
}

export default App;
