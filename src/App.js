import React, {useEffect, useState} from "react";
import {Routes, Route} from "react-router-dom";
import './App.css';
import {Login} from "./pages/users/Login";
import {Signup} from "./pages/users/Signup";
import {ForgottenPwd} from "./pages/users/ForgottenPwd";
import paresportifsApi from "./paresportifsApi";

function App() {
    const parseJWT = token => {
        if (!token) { return; }
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace('-', '+').replace('_', '/');
        return JSON.parse(window.atob(base64)).sub;
    }
    const idUser = parseJWT(localStorage.getItem('token'));
    const login = sessionStorage.getItem('token') !== null;
    const [coins, setCoins] = useState();

    useEffect(() => {
        login && paresportifsApi.get(`users/${idUser}`)
            .then(res => {
                setCoins(res.data.coins)
            })
            .catch(err => console.log(err));
    }, []);

    return (
        <>
            <Routes>
                <Route path="/login" element={<Login idUser={idUser} login={login} coins={coins} />} />
                <Route path="/signin" element={<Signup idUser={idUser} login={login} coins={coins} />} />
                <Route path="/forgotten-password" element={<ForgottenPwd />} />
            </Routes>
        </>
    );
}

export default App;
