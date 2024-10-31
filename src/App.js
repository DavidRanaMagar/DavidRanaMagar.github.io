import {Route, Routes, BrowserRouter} from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import HomePage from './Components/HomePage';
import LoginPage from './Components/LoginPage';
import RequireAuth from './Components/RequireAuth';
import Navbar from './Components/Navbar';
import CustomerList from './Components/CustomerList';
import Unauthorized from './Components/Unauthorized';
import Register from './Components/Register';
import BookTicket from "./Components/BookTicket";
import TicketsReport from "./Components/TicketsReport";
import EmployeeList from './Components/EmployeeList';
import CustomerHome from "./Components/CustomerHome";
import {ThemeProvider, createTheme} from '@mui/material/styles';
import './App.css';
import EmployeeSearch from "./Components/EmployeeSearch";
import {AuthProvider} from "./context/AuthProvider";
import AdminHome from "./Components/AdminHome";
import ExhibitionForm from "./Components/ExhibitionForm";
import Product from "./Components/Product";
import DonationsReport from "./Components/DonationsReport";
import GiftShopItemsReport from "./Components/GiftShopItemsReport";
import LoanForm from "./Components/LoanForm";

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
            <AuthProvider auth={auth} setAuth={setAuth}>
                <BrowserRouter>
                    <Navbar/>
                    <header className="App-header">
                        <Routes>
                            {/* public */}
                            <Route path="/" element={<HomePage/>}/>
                            <Route path="/login" element={<LoginPage/>}/>
                            <Route path="/unauthorized" element={<Unauthorized/>}/>
                            <Route path="/register" element={<Register/>}/>
                            <Route path="/products" element={<Product/>}/>

                            {/* private | need authentication to access */}
                            <Route element={<RequireAuth allowedRoles={['admin']}/>}>
                                <Route path="/adminhome" element={<AdminHome/>}/>
                                <Route path="/customers" element={<CustomerList/>}/>
                                <Route path="/employees" element={<EmployeeList/>}/>
                                <Route path="/employeeHours" element={<EmployeeSearch/>}/>
                                <Route path="/ticketsreport" element={<TicketsReport/>}/>
                                <Route path="/giftshopitemreport" element={<GiftShopItemsReport/>}/>
                                <Route path="/donationsreport" element={<DonationsReport/>}/>
                                <Route path="/exhibition" element={<ExhibitionForm/>}/>
                                <Route path="/loanform" element={<LoanForm/>}/>
                            </Route>

                            <Route element={<RequireAuth allowedRoles={['admin', 'customer']}/>}>
                                <Route path="/customerhome" element={<CustomerHome/>}/>
                                <Route path="/bookticket" element={<BookTicket/>}/>
                            </Route>

                        </Routes>
                    </header>
                </BrowserRouter>
            </AuthProvider>
        </ThemeProvider>
    );
}

export default App;
