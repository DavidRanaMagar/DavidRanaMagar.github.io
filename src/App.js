import { BrowserRouter, Route, Routes } from 'react-router-dom';
import HomePage from './Components/HomePage';
import AdminView from './Components/views/AdminView';
import CustomerView from './Components/views/CustomerView';
import LoginPage from './Components/LoginPage';
import RequireAuth from './Components/RequireAuth';
import Address from './Components/Address';
import Navbar from './Components/Navbar';
import CustomerForm from './Components/CustomerForm';

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
                  <Route path="/" element={<HomePage/>}/>
                  <Route path="/addAddress" element={<Address/>}/>
                  <Route path="/addCustomer" element={<CustomerForm/>}/>
                      {/* public */}
                      <Route path="/login" element={<LoginPage/>}/>

                      {/* private | need authentication to access */}
                      <Route element={<RequireAuth />}>
                          <Route path="/admin" element={<AdminView/>}/>
                          <Route path="/customer" element={<CustomerView/>}/>
                      </Route>
                  </Routes>
              </BrowserRouter>
          </header>
      </ThemeProvider>
  );
}

export default App;
