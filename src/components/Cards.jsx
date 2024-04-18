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
    const navigate = useNavigate();
    console.log(props)

    return (
        <div className="card leagues" onClick={() => navigate(`/league/${props.slug}`)}>
            <div className="title-container">
                <h5 className="title">{props.name}</h5>
                <FavHeartEmpty />
            </div>
            <img alt="Logo ligue" src={props.image_url} />
        </div>
    )
}