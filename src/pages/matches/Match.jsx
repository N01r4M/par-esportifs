import {AppBreadcrumb, AppText} from "../../components/Texts";
import {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import pandaScoreApi from "../../pandaScoreApi";
import {Loading} from "../Loading";
import {AppCardInfo} from "../../components/Cards";
import moment from "moment/moment";
import "../../styles/Match.scss";

export function Match() {
    const [match, setMatch] = useState({});
    const [team1, setTeam1] = useState({});
    const [team2, setTeam2] = useState({});
    const [channel, setChannel] = useState({});
    const [loading, setLoading] = useState(true);
    const id = useParams().idMatch;
    const idLeague = useParams().idLeague;
    const idSerie = useParams().idSerie;
    const navigate = useNavigate();

    const getMatch = () => {
        pandaScoreApi.get(`matches/${id}`)
            .then((res) => {
                const status = res.status;

                if (status === 200) {
                    const data = res.data;
                    setMatch(data);

                    setChannel(data.streams_list[0].embed_url.split("=")[1])

                    getTeam1(data.opponents[0].opponent.id)
                    getTeam2(data.opponents[1].opponent.id)
                } else {
                    console.log(`HTTP status: ${status}`);
                }
            })
    }

    const getTeam1 = (id) => {
        pandaScoreApi.get(`teams/${id}`)
            .then((res) => {
                const status = res.status;

                if (status === 200) {
                    setTeam1(res.data)
                } else {
                    console.log(`HTTP status: ${status}`);
                }
            })
    }

    const getTeam2 = (id) => {
        pandaScoreApi.get(`teams/${id}`)
            .then((res) => {
                const status = res.status;

                if (status === 200) {
                    setTeam2(res.data)
                } else {
                    console.log(`HTTP status: ${status}`);
                }
            })
    }

    useEffect(() => {
        getMatch();
        setLoading(false);
    }, [id]);

    if (!loading && Object.keys(match).length !== 0 && Object.keys(team1).length !== 0 && Object.keys(team2).length !== 0) {
        return (
            <>
                <AppBreadcrumb links={[{ text: "Accueil", link: "/home"}, { text: "Ligues", link: "/leagues/1" }, { text: `${match.league.name}`, link: `/${match.league.id}` }, { text: `${match.serie.full_name}`, link: `/${match.league.id}/${match.serie.id}` }, { text: `${match.name}`, link: `/${match.league.id}/${match.serie.id}/${match.id}` }]} />

                <AppCardInfo className="card match-header">
                    <div className="team" onClick={() => navigate(`/${idLeague}/${idSerie}/${id}/${team1.id}`)} >
                        <img src={team1.image_url} alt="Logo équipe"/>
                        <AppText text={team1.name}/>
                    </div>

                    {
                        match.status === 'finished' &&
                        <div>
                            <AppText text={`${match.results[0].score} - ${match.results[1].score}`} />
                        </div>
                    }

                    {
                        match.status === 'not_started' &&
                        <div>
                            <AppText text={`${moment.utc(match.begin_at).local().format("dddd D MMMM YYYY [à] HH[h]mm")}`} />
                        </div>
                    }

                    <div className="team" onClick={() => navigate(`/${idLeague}/${idSerie}/${id}/${team2.id}`)}>
                        <AppText text={team2.name}/>
                        <img src={team2.image_url} alt="Logo équipe"/>
                    </div>
                </AppCardInfo>

                <div className="container-match">
                    <AppCardInfo className="card team one" >
                        <div className="bg-logo" style={{ backgroundImage: `url(${team1.image_url})` }}></div>

                        {
                            team1.players.sort((a, b) => a.role.localeCompare(b.role)).map((player) => {
                                return <AppText text={`${player.role} - ${player.name}`} />
                            })
                        }
                    </AppCardInfo>

                    <iframe
                        src={`https://player.twitch.tv/?channel=${channel}&parent=localhost&autoplay=false`}
                        height="360"
                        width="640"
                        allowFullScreen="true"
                    >
                    </iframe>

                    <AppCardInfo className="card team two" onCLick={() => navigate(`/teams/${team2.id}`)}>
                        <div className="bg-logo" style={{ backgroundImage: `url(${team2.image_url})` }}></div>

                        {
                            team2.players.sort((a, b) => a.role.localeCompare(b.role)).map((player) => {
                                return <AppText text={`${player.name} - ${player.role}`} />
                            })
                        }
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