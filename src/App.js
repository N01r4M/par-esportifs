import React, {useEffect, useState} from "react";
import {Routes, Route} from "react-router-dom";
import './App.css';
import {Login} from "./pages/users/Login";
import {Signup} from "./pages/users/Signup";
import {ForgottenPwd} from "./pages/users/ForgottenPwd";
import paresportifsApi from "./paresportifsApi";
import {AppNavbar, AppNavbarLogo} from "./components/Navbar";
import Logout from "./pages/users/Logout";
import {Profile} from "./pages/users/Profile";
import {List} from "./pages/leagues/List";
import {League} from "./pages/leagues/League";

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
            <AppNavbar coins={100} />

            <Routes>
                <Route path="/leagues/:page" element={<List uuid={uuid} login={login} coins={coins} />} />
                <Route path="/favorites/:page" element={<List uuid={uuid} login={login} coins={coins} />} />
                <Route path="/league/:slug" element={<League uuid={uuid} login={login} coins={coins} />} />
                <Route path="/profile" element={<Profile uuid={uuid} login={login} coins={coins} />} />
                <Route path="/login" element={<Login uuid={uuid} login={login} coins={coins} />} />
                <Route path="/logout" element={<Logout />} />
                <Route path="/signin" element={<Signup uuid={uuid} login={login} coins={coins} />} />
                <Route path="/forgotten-password" element={<ForgottenPwd />} />
            </Routes>
        </>
    );
}

export default App;
