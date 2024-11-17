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
import Product from "./Components/Product";
import DonationsReport from "./Components/DonationsReport";
import GiftShopItemsReport from "./Components/GiftShopItemsReport";
import ExhibitionList from "./Components/ExhibitionList";
import LoanList from "./Components/LoanList";
import DepartmentList from './Components/DepartmentList';
import Cart from "./Components/Cart";
import MyTickets from './Components/MyTickets';
import CustomerDonation from './Components/CustomerDonation';
import StaffHome from './Components/StaffHome';
import ManagerHome from './Components/ManagerHome';
import InventoryManagerHome from "./Components/InventoryManagerHome";
import CuratorHome from "./Components/CuratorHome";
import CollectionManagerHome from "./Components/CollectionManagerHome";
import ArtifactList from "./Components/ArtifactList";
import GiftShopItemList from "./Components/GiftShopItemList";
import PurchaseHistory from "./Components/PurchaseHistory";
import CustomerExhibition from './Components/CustomerExhibition';
import VisitorsReport from "./Components/VisitorsReport";
import MembershipSignup from "./Components/MembershipSignup";
import MembershipExpiryNotification from './Components/MemberShipExpiryNotification';
import Ticketing from "./Components/Ticketing";





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

    // cart
    const [cartItems, setCartItems] = useState(() => {
        // Initialize cartItems from localStorage if it exists
        const savedCartItems = localStorage.getItem('cartItems');
        return savedCartItems ? JSON.parse(savedCartItems) : [];
    });

    const addToCart = (product, quantity = 1) => {
        setCartItems((prevItems) => {
            // Check if the product already exists in the cart
            const existingItem = prevItems.find(item => item.giftShopItemID === product.giftShopItemID);

            if (existingItem) {
                // If the item exists, increase the quantity
                return prevItems.map(item =>
                    item.giftShopItemID === product.giftShopItemID
                        ? { ...item, quantity: item.quantity + quantity } // Increase quantity
                        : item
                );
            } else {
                // If the item doesn't exist, add it with the specified quantity
                return [...prevItems, { ...product, quantity }];
            }
        });
    };

    const updateCartQuantity = (itemId, action) => {
        setCartItems((prevItems) => {
            return prevItems.map((item) => {
                if (item.giftShopItemID === itemId) {
                    if (action === 'increase') {
                        return { ...item, quantity: item.quantity + 1 };
                    } else if (action === 'decrease' && item.quantity > 1) {
                        return { ...item, quantity: item.quantity - 1 };
                    }
                }
                return item;
            });
        });
    };

    const removeFromCart = (itemId) => {
        setCartItems((prevItems) => prevItems.filter((item) => item.giftShopItemID !== itemId));
    };

    // Automatically save cartItems to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }, [cartItems]);


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
                            <Route path="/products" element={<Product addToCart={addToCart} />} />
                            <Route path="/cart" element={<Cart cartItems={cartItems} removeFromCart={removeFromCart}
                                                               updateCartQuantity={updateCartQuantity} setCartItems={setCartItems}/>} />

                            {/* private | need authentication to access */}
                            <Route element={<RequireAuth allowedRoles={['admin']}/>}>
                                <Route path="/adminhome" element={<AdminHome/>}/>
                                <Route path="/customers" element={<CustomerList/>}/>
                                <Route path="/ticketsreport" element={<TicketsReport/>}/>
                                <Route path="/donationsreport" element={<DonationsReport/>}/>
                                <Route path="/departments" element={<DepartmentList/>}/>
                                <Route path="/visitorsreport" element={<VisitorsReport/>}/>
                            </Route>

                            <Route element={<RequireAuth allowedRoles={['admin', 'customer']}/>}>
                                <Route path="/" element={<HomePage/>}/>
                                <Route path="/customerhome" element={<CustomerHome/>}/>
                                <Route path="/bookticket" element={<BookTicket/>}/>
                                <Route path="/customerdonation" element={<CustomerDonation/>}/>
                                <Route path="/mytickets" element={<MyTickets userID={auth.userId} />} />
                                <Route path="/purchasehistory" element={<PurchaseHistory/>} />
                                <Route path="/membershipsignup" element={<MembershipSignup/>} />
                               
                                <Route path="/membershipexpirynotification" element={<MembershipExpiryNotification/>} />
                                <Route path="/customerexhibition" element={<CustomerExhibition/>} />
                            </Route>

                             {/* private routes for admins and staff */}
                            <Route element={<RequireAuth allowedRoles={['admin', 'staff']} />}>
                                <Route path="/staffhome" element={<StaffHome />} />
                                <Route path="/ticketing" element={<Ticketing/>}/>
                            </Route>

                            {/* private routes for admins and manager */}
                            <Route element={<RequireAuth allowedRoles={['admin', 'manager']} />}>
                                <Route path="/managerhome" element={<ManagerHome />} />
                                <Route path="/employeeHours" element={<EmployeeSearch/>}/>
                                <Route path="/employees" element={<EmployeeList/>}/>
                                <Route path="/ticketing" element={<Ticketing/>}/>
                            </Route>

                            <Route element={<RequireAuth allowedRoles={['admin', 'curator']} />}>
                                <Route path="/curatorhome" element={<CuratorHome/>}/>
                                <Route path="/exhibitions" element={<ExhibitionList/>}/>
                            </Route>

                            <Route element={<RequireAuth allowedRoles={['admin', 'collectionManager']} />}>
                                <Route path="/collectionhome" element={<CollectionManagerHome/>}/>
                                <Route path="/artifacts" element={<ArtifactList/>}/>
                                <Route path="/loans" element={<LoanList/>}/>
                            </Route>

                            <Route element={<RequireAuth allowedRoles={['admin', 'inventoryManager']} />}>
                                <Route path="/inventoryhome" element={<InventoryManagerHome/>}/>
                                <Route path="/giftshopitemreport" element={<GiftShopItemsReport/>}/>
                                <Route path="/giftShopItems" element={<GiftShopItemList/>}/>
                            </Route>

                        </Routes>
                    </header>
                </BrowserRouter>
            </AuthProvider>
        </ThemeProvider>
    );
}

export default App;
