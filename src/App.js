import React, {useEffect, useState} from "react";
import {Routes, Route} from "react-router-dom";
import './App.css';
import {Login} from "./pages/users/Login";
import {Signup} from "./pages/users/Signup";
import {ForgottenPwd} from "./pages/users/ForgottenPwd";
import {AppNavbar, AppNavbarLogo} from "./components/Navbar";
import Logout from "./pages/users/Logout";
import {Profile} from "./pages/users/Profile";
import {jwtDecode} from "jwt-decode";

function App() {
    const token = sessionStorage.getItem('token');
    const [email, setEmail] = useState('');
    const [coins, setCoins] = useState(null);
    const login = token !== null;

    useEffect(() => {
        if (login) {
            const decodedToken = jwtDecode(token);
            setEmail(decodedToken.email);
            setCoins(decodedToken.coins);
        }
    }, []);

    return (
        <>
            {
                login ?
                    <AppNavbar coins={coins} />
                    :
                    <AppNavbarLogo />
            }

            <Routes>
                <Route path="/profile" element={<Profile email={email} login={login} coins={coins} />} />
                <Route path="/login" element={<Login email={email} login={login} coins={coins} />} />
                <Route path="/logout" element={<Logout />} />
                <Route path="/signin" element={<Signup email={email} login={login} coins={coins} />} />
                <Route path="/forgotten-password" element={<ForgottenPwd />} />
            </Routes>
        </>
    );
}

export default App;
