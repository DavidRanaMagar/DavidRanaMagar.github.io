import { BrowserRouter, Route, Routes } from 'react-router-dom';
import HomePage from './Components/HomePage';
import AdminView from './Components/views/AdminView';
import CustomerView from './Components/views/CustomerView';
import LoginPage from './Components/LoginPage';
import RequireAuth from './Components/RequireAuth';
import Navbar from './Components/Navbar';
import CustomerForm from './Components/CustomerForm';
import CustomerList from './Components/CustomerList';

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
          <Navbar />
          <header className="App-header">
              <BrowserRouter>
                  <Routes>
                      {/* public */}
                      <Route path="/" element={<HomePage/>}/>
                      <Route path="/addCustomer" element={<CustomerForm/>}/>
                      <Route path="/login" element={<LoginPage/>}/>

                      {/* private | need authentication to access */}
                      <Route element={<RequireAuth />}>
                          <Route path="/admin" element={<AdminView/>}/>
                          <Route path="/customer" element={<CustomerView/>}/>
                          <Route path="/customers" element={<CustomerList/>}/>
                      </Route>
                  </Routes>
              </BrowserRouter>
          </header>
      </ThemeProvider>
  );
}

export default App;
