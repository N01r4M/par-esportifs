import React from "react";
import {Routes, Route} from "react-router-dom";
import './App.css';
import {Login} from "./pages/users/Login";
import {Signin} from "./pages/users/Signin";
import {ForgottenPwd} from "./pages/users/ForgottenPwd";

function App() {
    return (
        <>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/signin" element={<Signin />} />
                <Route path="/forgotten-password" element={<ForgottenPwd />} />
            </Routes>
        </>
    );
}

export default App;
