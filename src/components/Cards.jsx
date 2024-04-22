import "../styles/Cards.css"
import {FavHeartEmpty} from "./Coins";
import {useNavigate} from "react-router-dom";
import {AppText} from "./Texts";
import moment from "moment";
import "moment/locale/fr";

export function AppCard({children}) {
    return (
        <div className="card">
            {children}
        </div>
    )
}

export function AppCardLeague(props) {
    const navigate = useNavigate();

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

export function AppCardSerie(props) {
    const navigate = useNavigate();

    return (
        <div className="card leagues" onClick={() => navigate(`/league/${props.league}/${props.slug}`)}>
            <div className="title-container">
                <h5 className="title">{props.name}</h5>
                <FavHeartEmpty />
            </div>
            <img alt="Logo ligue" src={props.image_url} />
        </div>
    )
}

export function AppCardInfo({children}) {
    return (
        <div className="card info">
            {children}
        </div>
    )
}

export function AppCardMatches(props) {
    return (
        <div className="card matches">
            <h4>{props.title}</h4>
            <hr/>

            {
                props.matches.map(match => {
                    return match.opponents.length > 1 && <AppCardMatchInfo key={match.slug} match={match} />
                })
            }
        </div>
    )
}

export function AppCardMatchInfo(props) {
    const navigate = useNavigate();

    moment.locale("fr");

    return (
        <div className="card match-info" onClick={() => navigate(`/matches/${props.match.slug}`)}>
            <div className="team one">
                <img src={props.match.opponents[0].opponent.image_url} alt="Logo équipe"/>
                <AppText text={props.match.opponents[0].opponent.name} />
            </div>

            {
                props.match.status !== 'finished' ? (
                        <div className="score">
                            <AppText text={`${moment.utc(props.match.scheduled_at).local().format("DD/MM/YYYY")}`} />
                            <AppText text={`${moment.utc(props.match.scheduled_at).local().format("HH[h]mm")}`} />
                        </div>
                    )
                    :
                    <div className="score">
                        <AppText text={`${props.match.results[0].score} - ${props.match.results[1].score}`} />
                    </div>
            }

            <div className="team two">
                <img src={props.match.opponents[1].opponent.image_url} alt="Logo équipe"/>
                <AppText text={props.match.opponents[1].opponent.name}/>
            </div>
        </div>
    )
}