import {Route, Routes, BrowserRouter} from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import HomePage from './Components/HomePage';
import LoginPage from './Components/LoginPage';
import RequireAuth from './Components/RequireAuth';
import { AuthProvider } from './context/AuthProvider';
import Navbar from './Components/Navbar';
import CustomerForm from './Components/CustomerForm';
import CustomerList from './Components/CustomerList';
import Unauthorized from './Components/Unauthorized';
import Register from './Components/Register';
import BookTicket from "./Components/BookTicket";
import TicketsReport from "./Components/TicketsReport";

import { ThemeProvider, createTheme } from '@mui/material/styles';
import './App.css';

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
    },
});

function App() {

    const [auth, setAuth] = useState(() => {
        const storedAuth = localStorage.getItem("auth");
        return storedAuth ? JSON.parse(storedAuth) : {};
    });

    useEffect(() => {
        localStorage.setItem("auth", JSON.stringify(auth));
    }, [auth]);

    return (
      <ThemeProvider theme={darkTheme}>
          <Navbar />
          <header className="App-header">
              <AuthProvider auth={auth} setAuth={setAuth}>
              <BrowserRouter>
                  <Routes>
                      {/* public */}
                      <Route path="/" element={<HomePage/>}/>
                      <Route path="/login" element={<LoginPage/>}/>
                      <Route path="/unauthorized" element={<Unauthorized/>}/>
                      <Route path="/register" element={<Register/>}/>

                      {/* private | need authentication to access */}
                      <Route element={<RequireAuth allowedRoles={['admin']}/>}>
                          <Route path="/customers" element={<CustomerList/>}/>
                          <Route path="/addCustomer" element={<CustomerForm/>}/>
                          <Route path="/ticketsreport" element={<TicketsReport/>}/>
                      </Route>

                      <Route element={<RequireAuth allowedRoles={['admin', 'customer']}/>}>
                          <Route path="/bookticket" element={<BookTicket/>}/>
                      </Route>
                  </Routes>
              </BrowserRouter>
              </AuthProvider>
          </header>
      </ThemeProvider>
    );
}

export default App;
