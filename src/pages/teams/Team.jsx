import { useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import pandaScoreApi from "../../pandaScoreApi";
import {Loading} from "../Loading";
import {AppBreadcrumb, AppText} from "../../components/Texts";
import {AppCardInfo, AppCardMatches} from "../../components/Cards";
import '../../styles/Team.scss';

export function Team() {
    const [team, setTeam] = useState({});
    const [match, setMatch] = useState({});
    const [pastMatches, setPastMatches] = useState([]);
    const [runningMatches, setRunningMatches] = useState([]);
    const [upcomingMatches, setUpcomingMatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const idTeam = useParams().idTeam;
    const idMatch = useParams().idMatch;
    const navigate = useNavigate();

    /**
     * Récupère les données sur l'équipe
     */
    const getTeam = () => {
        pandaScoreApi.get(`teams/${idTeam}`)
            .then((res) => {
                const status = res.status;

                if (status === 200) {
                    setTeam(res.data);

                    getPastMatches();
                    getUpcomingMatches();
                    getRunningMatches();
                } else {
                    console.log(`HTTP status: ${status}`);
                }
            })
    }

    /**
     * Récupère les données sur le match pour le fil d'ariane
     */
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

    /**
     * Récupère les matchs terminés de l'équipe
     */
    const getPastMatches = () => {
        pandaScoreApi.get(`teams/${idTeam}/matches?filter[status]=finished&sort=-begin_at&per_page=10`)
            .then(res => {
                const status = res.status;

                if (status === 200) {
                    setPastMatches(res.data)
                } else {
                    console.log(`HTTP status: ${status}`);
                }
            })
    }

    /**
     * Récupère les matchs en cours de l'équipe
     */
    const getRunningMatches = () => {
        pandaScoreApi.get(`teams/${idTeam}/matches?filter[status]=running&sort=-begin_at&per_page=10`)
            .then(res => {
                const status = res.status;

                if (status === 200) {
                    setRunningMatches(res.data)
                } else {
                    console.log(`HTTP status: ${status}`);
                }
            })
    }

    /**
     * Récupère les matchs à venir de l'équipe
     */
    const getUpcomingMatches = () => {
        pandaScoreApi.get(`teams/${idTeam}/matches?filter[status]=not_started&sort=-begin_at&per_page=10`)
            .then(res => {
                const status = res.status;

                if (status === 200) {
                    setUpcomingMatches(res.data)
                } else {
                    console.log(`HTTP status: ${status}`);
                }
            })
    }

    useEffect(() => {
        getTeam();
        getMatch();
        setLoading(false);
    }, [idTeam])

    if (!loading && Object.keys(team).length !== 0 && Object.keys(match).length !== 0) {
        return (
            <div>
                <AppBreadcrumb links={[{ text: "Accueil", link: "/home"}, { text: "Ligues", link: "/leagues/1" }, { text: `${match.league.name}`, link: `/${match.league.id}` }, { text: `${match.serie.full_name}`, link: `/${match.league.id}/${match.serie.id}` }, { text: `${match.name}`, link: `/${match.league.id}/${match.serie.id}/${match.id}` }, { text: `${team.name}`, link: `/${match.league.id}/${match.serie.id}/${match.id}/${idTeam}` }]} />

                <div className="team-container">
                    <div className="infos-container">
                        <AppCardInfo className="card infos">
                            <AppText text={`Abréviation : ${team.acronym}`} />
                            <AppText text={`Localisation : ${team.location}`} />
                            <AppText text={`Jeu de prédilection : ${team.current_videogame.name}`} />
                        </AppCardInfo>

                        <AppCardInfo className="card players">
                            {
                                team.players.sort((a, b) => a.role.localeCompare(b.role)).map((player) => {
                                    return <div onClick={() => navigate(`/${match.league.id}/${match.serie.id}/${match.id}/${idTeam}/${player.id}`)}>{player.role} - {player.name}</div>
                                })
                            }
                        </AppCardInfo>
                    </div>

                    <div className="matches-container">
                        <AppCardMatches matches={pastMatches} title={'Terminés'} league={match.league.id} serie={match.serie.id} />
                        <AppCardMatches matches={runningMatches} title={'En cours'} league={match.league.id} serie={match.serie.id} />
                        <AppCardMatches matches={upcomingMatches} title={'A venir'} league={match.league.id} serie={match.serie.id} />
                    </div>
                </div>

                {/*<div className="bg-logo large" style={{ backgroundImage: `url(${team.image_url})`}}></div>*/}

            </div>
        )
    } else {
        return (
            <Loading/>
        )
    }
}