import "../styles/Cards.css"
import {FavHeart, FavHeartEmpty} from "./Coins";
import {useNavigate} from "react-router-dom";
import {AppText} from "./Texts";
import moment from "moment";
import "moment/locale/fr";
import paresportifsApi from "../paresportifsApi";
import {jwtDecode} from "jwt-decode";
import {useState} from "react";

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
        <div className="card leagues">
            <div className="title-container">
                <h5 className="title">{props.name}</h5>

                {
                    props.isFav ? <FavHeart /> : <FavHeartEmpty idLeague={props.id} name={props.name} image_url={props.image_url} slug={props.slug} />
                }
            </div>
            <img alt="Logo ligue" src={props.image_url} onClick={() => navigate(`/${props.id}`)} />
        </div>
    )
}

export function AppCardSerie(props) {
    const navigate = useNavigate();

    return (
        <div className="card leagues" onClick={() => navigate(`/${props.league}/${props.id}`)}>
            <div className="title-container">
                <h5 className="title">{props.name}</h5>
                <FavHeartEmpty />
            </div>
            <img alt="Logo ligue" src={props.image_url} />
        </div>
    )
}

export function AppCardInfo({children, ...props}) {
    return (
        <div {...props}>
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
                    return match.opponents.length > 1 && <AppCardMatchInfo key={match.id} match={match} />
                })
            }
        </div>
    )
}

export function AppCardMatchInfo(props) {
    const navigate = useNavigate();

    moment.locale("fr");

    return (
        <div className="card match-info" onClick={() => navigate(`/${props.match.league_id}/${props.match.serie_id}/${props.match.id}`)}>
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

export function AppCardBets(props) {
    /**
     * Récupérer le pari en lien avec le match
     */
    const getBet = (matchId) => {
        return props.bets.find(bet => parseInt(bet.idMatch) === parseInt(matchId));
    }

    return (
        <div className="card bets">
            <h4>{props.title}</h4>
            <hr/>

            {
                props.matches.map(match => {
                    const bet = getBet(match.id);

                    return match.opponents.length > 1 && <AppCardBetInfo key={match.id} match={match} bet={bet} />
                })
            }
        </div>
    )
}

export function AppCardBetInfo(props) {
    const navigate = useNavigate();

    moment.locale("fr");

    /**
     * Récupérer le nom de l'équipe pour laquelle le joueur a parié
     */
    const getTeam = () => {
        return props.match.opponents.find(opponent => parseInt(props.bet.teamId) === parseInt(opponent.opponent.id));
    }

    const team = getTeam();

    return (
        <div className="card back-bet-info" onClick={() => navigate(`/${props.match.league_id}/${props.match.serie_id}/${props.match.id}`)}>
            <div className="match-bet-info">
                <div className="team one">
                    <img src={props.match.opponents[0].opponent.image_url} alt="Logo équipe"/>
                    <AppText text={props.match.opponents[0].opponent.name}/>
                </div>

                {
                    props.match.status !== 'finished' ? (
                            <div className="score">
                                <AppText text={`${moment.utc(props.match.scheduled_at).local().format("DD/MM/YYYY")}`}/>
                                <AppText text={`${moment.utc(props.match.scheduled_at).local().format("HH[h]mm")}`}/>
                            </div>
                        )
                        :
                        <div className="score">
                            <AppText text={`${props.match.results[0].score} - ${props.match.results[1].score}`}/>
                        </div>
                }

                <div className="team two">
                    <img src={props.match.opponents[1].opponent.image_url} alt="Logo équipe"/>
                    <AppText text={props.match.opponents[1].opponent.name}/>
                </div>
            </div>

            <div className="bet-info">
                {
                    // Si le match ne s'est pas encore déroulé
                    props.match.status !== "finished" && <p>Vous avez parié {props.bet.nbCoins} coins pour {team.opponent.name}</p>
                }
                {
                    // Si le match est terminé et que le pari est gagné
                    (props.match.status === "finished" && parseInt(props.bet.teamId) === parseInt(props.match.winner_id)) && <p>Vous avez gagné {props.bet.nbCoins * 2} coins en pariant pour {team.opponent.name} !</p>
                }
                {
                    // Si le match est terminé et que le pari est perdu
                    (props.match.status === "finished" && parseInt(props.bet.teamId) !== parseInt(props.match.winner_id)) && <p>Vous avez perdu {props.bet.nbCoins} coins en pariant pour {team.opponent.name}...</p>
                }
            </div>
        </div>
    )
}

export function AppCardRank(props) {
    return (
        <div className="card rank">
            <AppText text={props.rank}/>
            <AppText text={props.user.username}/>
            <AppText text={`${props.user.coins} coins`}/>
        </div>
    )
}