import {BrowserRouter, Route, Routes} from 'react-router-dom';
import HomePage from './Components/HomePage';
import AdminView from './Components/views/AdminView';
import CustomerView from './Components/views/CustomerView';
import LoginPage from './Components/LoginPage';
import RequireAuth from './Components/RequireAuth';
import Navbar from './Components/Navbar';
import CustomerList from './Components/CustomerList';
import Unauthorized from './Components/Unauthorized';
import Register from './Components/Register';
import EmployeeList from './Components/EmployeeList';

import {ThemeProvider, createTheme} from '@mui/material/styles';
import './App.css';
import EmployeeSearch from "./Components/EmployeeSearch";

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
    },
});


function App() {
    return (
        <ThemeProvider theme={darkTheme}>
            <Navbar/>
            <header className="App-header">
                <BrowserRouter>
                    <Routes>
                        {/* public */}
                        <Route path="/" element={<HomePage/>}/>
                        <Route path="/login" element={<LoginPage/>}/>
                        <Route path="/unauthorized" element={<Unauthorized/>}/>
                        <Route path="/register" element={<Register/>}/>
                        {/* private | made public to test */}
                        <Route path="/customers" element={<CustomerList/>}/>
                        <Route path="/employees" element={<EmployeeList/>}/>
                        <Route path="/employeeHours" element={<EmployeeSearch/>}/>
                        {/* private | need authentication to access */}
                        <Route element={<RequireAuth allowedRoles={['admin']}/>}>
                            <Route path="/admin" element={<AdminView/>}/>
                            {/*<Route path="/customers" element={<CustomerList/>}/>*/}
                            {/*<Route path="/employees" element={<EmployeeList/>}/>*/}
                        </Route>

                        <Route element={<RequireAuth allowedRoles={['admin', 'customer']}/>}>
                            <Route path="/customer" element={<CustomerView/>}/>
                        </Route>

                    </Routes>
                </BrowserRouter>
            </header>
        </ThemeProvider>
    );
}

export default App;
