import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AdminView from './views/AdminView';
import CustomerView from './views/CustomerView';
import LoginPage from './LoginPage';
import './App.css';
import { ThemeProvider, createTheme } from '@mui/material/styles';

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
                      <Route path="/" element={<LoginPage/>}/>
                      <Route path="/admin" element={<AdminView/>}/>
                      <Route path="/customer" element={<CustomerView/>}/>
                  </Routes>
              </Router>
          </header>
      </ThemeProvider>
  );
}

export default App;
