import "../styles/Navbars.css"
import {AppLink} from "./Texts";
import {Coins} from "./Coins";
import {AppButtonLink} from "./Buttons";
import {useLocation} from "react-router-dom";

export function AppNavbarLogo() {
    return (
        <div className="navbar navbar-logo">
            <img src={require("../assets/logo_navbar.png")} alt="logo" />
        </div>
    )
}

export function AppNavbar(props) {
    const location = useLocation();

    return (
        <div className="navbar navbar-links">
            <img src={require("../assets/logo_navbar.png")} alt="logo" />

            <div className="links">
                <AppLink text="Ligues" link={"/leagues/1"} class={`link ${location.pathname.startsWith("/leagues") ? "active" : ""}`} />
                <AppLink text="Favoris" link={"/favorites/1"} class={`link ${location.pathname === "/favorites" ? "active" : ""}`} />
                <AppLink text="Paris" link={"/bets"} class={`link ${location.pathname === "/bets" || location.pathname === "/" ? "active" : ""}`} />
                <AppLink text="Classement" link={"/ranking"} class={`link ${location.pathname === "/ranking" ? "active" : ""}`} />
                <AppLink text="Profil" link={"/profile"} class={`link ${location.pathname === "/profile" ? "active" : ""}`} />
            </div>

            <div className="logout">
                <div className="coins">
                    <p>{props.coins}</p>
                    <Coins size="20" />
                </div>

                <AppButtonLink text="Déconnexion" link={"/logout"} />
            </div>
        </div>
    )
}