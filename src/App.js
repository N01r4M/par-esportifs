import React, {useEffect, useState} from "react";
import {Routes, Route} from "react-router-dom";
import './App.css';
import {Login} from "./pages/users/Login";
import {Signup} from "./pages/users/Signup";
import {ForgottenPwd} from "./pages/users/ForgottenPwd";
import paresportifsApi from "./paresportifsApi";
import {AppNavbar, AppNavbarLogo} from "./components/Navbar";
import Logout from "./pages/users/Logout";

function App() {
    const token = sessionStorage.getItem('token');
    const uuid = sessionStorage.getItem('uuid');
    const login = token !== null;
    const [coins, setCoins] = useState();

    useEffect(() => {
        login && paresportifsApi.get(`users/${uuid}`)
            .then(res => {
                setCoins(res.data.coins)
            })
            .catch(err => console.log(err));
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
                <Route path="/login" element={<Login uuid={uuid} login={login} coins={coins} />} />
                <Route path="/logout" element={<Logout />} />
                <Route path="/signin" element={<Signup uuid={uuid} login={login} coins={coins} />} />
                <Route path="/forgotten-password" element={<ForgottenPwd />} />
            </Routes>
        </>
    );
}

export default App;
