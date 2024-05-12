import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import pandaScoreApi from "../../pandaScoreApi";
import {Loading} from "../Loading";
import {AppBreadcrumb, AppText} from "../../components/Texts";
import {AppCardInfo} from "../../components/Cards";
import "../../styles/Player.scss";

export function Player() {
    const [player, setPlayer] = useState({});
    const [match, setMatch] = useState({});
    const [loading, setLoading] = useState(true);
    const idPlayer = useParams().idPlayer;
    const idMatch = useParams().idMatch;

    const getPlayer = () => {
        pandaScoreApi.get(`players/${idPlayer}`)
            .then((res) => {
                const status = res.status;

                if (status === 200) {
                    setPlayer(res.data)
                } else {
                    console.log(`HTTP status ${status}`);
                }
            })
    }

    const getMatch = () => {
        pandaScoreApi.get(`matches/${idMatch}`)
            .then((res) => {
                const status = res.status;

                if (status === 200) {
                    setMatch(res.data)
                } else {
                    console.log(`HTTP status: ${status}`);
                }
            })
    }

    useEffect(() => {
        getPlayer();
        getMatch();
        setLoading(false);
    }, [idPlayer])

    if (!loading && Object.keys(player).length !== 0 && Object.keys(match).length !== 0) {
        return (
            <>
                <AppBreadcrumb links={[{ text: "Accueil", link: "/home"}, { text: "Ligues", link: "/leagues/1" }, { text: `${match.league.name}`, link: `/${match.league.id}` }, { text: `${match.serie.full_name}`, link: `/${match.league.id}/${match.serie.id}` }, { text: `${match.name}`, link: `/${match.league.id}/${match.serie.id}/${match.id}` }, { text: `${player.current_team.name}`, link: `/${match.league.id}/${match.serie.id}/${match.id}/${player.current_team.id}` }, { text: `${player.name}`, link: `/${match.league.id}/${match.serie.id}/${match.id}/${player.current_team.id}/${player.id}` }]} />

                <div className="container">
                    <AppCardInfo className="card player">
                        <div className="img-player">
                            <img src={player.image_url} alt="Image joueur"/>
                        </div>

                        <div>
                            <AppText text={`${player.first_name} "${player.name}" ${player.last_name}`} />
                            {
                                player.age && <AppText text={`${player.age}`} />
                            }
                            <AppText text={`${player.current_team.name}`} />
                            <AppText text={`Nationalité : ${player.nationality}`} />
                            <AppText text={`Role : ${player.role}`} />
                        </div>
                    </AppCardInfo>
                </div>
            </>
        )
    } else {
        return (
            <Loading/>
        )
    }
}