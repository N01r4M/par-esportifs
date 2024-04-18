import "../styles/Cards.css"
import {FavHeartEmpty} from "./Coins";
import {useNavigate} from "react-router-dom";

export function AppCard({children}) {
    return (
        <div className="card">
            {children}
        </div>
    )
}

export function AppCardLeague(props) {
    const league = props.league;
    const navigate = useNavigate();

    return (
        <div className="card leagues" onClick={() => navigate(`/league/${league.slug}`)}>
            <div className="title-container">
                <h5 className="title">{league.name}</h5>
                <FavHeartEmpty />
            </div>
            <img alt="Logo ligue" src={league.image_url} />
        </div>
    )
}