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
import {List} from "./pages/leagues/List";
import {League} from "./pages/leagues/League";
import {Serie} from "./pages/leagues/Serie";
import {Match} from "./pages/matches/Match";
import {Team} from "./pages/teams/Team";
import {Player} from "./pages/players/Player";
import {BetsRecord} from "./pages/matches/BetsRecord";

function App() {
    const token = sessionStorage.getItem('token');
    const coins = sessionStorage.getItem('coins');
    const [email, setEmail] = useState('');
    const login = token !== null;

    useEffect(() => {
        if (login) {
            const decodedToken = jwtDecode(token);
            setEmail(decodedToken.email);
        }
    }, []);

    return (
        <>
            {login ? <AppNavbar coins={coins}/> : <AppNavbarLogo />}

            <Routes>
                <Route path="/leagues/:page" element={<List email={email} login={login} coins={coins} />} />
                <Route path="/favorites/:page" element={<List email={email} login={login} coins={coins} />} />
                <Route path="/:idLeague" element={<League email={email} login={login} coins={coins} />} />
                <Route path="/:idLeague/:idSerie" element={<Serie email={email} login={login} coins={coins} />} />
                <Route path="/:idLeague/:idSerie/:idMatch" element={<Match email={email} login={login} coins={coins} />} />
                <Route path="/:idLeague/:idSerie/:idMatch/:idTeam" element={<Team email={email} login={login} coins={coins} />} />
                <Route path="/:idLeague/:idSerie/:idMatch/:idTeam/:idPlayer" element={<Player email={email} login={login} coins={coins} />} />

                <Route path="/bets" element={<BetsRecord email={email} login={login} coins={coins} />} />

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
