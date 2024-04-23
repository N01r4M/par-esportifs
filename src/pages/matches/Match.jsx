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
    const slug = useParams().slug;
    const navigate = useNavigate();

    const getMatch = () => {
        pandaScoreApi.get(`matches/${slug}`)
            .then((res) => {
                const status = res.status;

                if (status === 200) {
                    const data = res.data;
                    setMatch(data);

                    setChannel(data.streams_list[0].embed_url.split("=")[1])

                    getTeam1(data.opponents[0].opponent.slug)
                    getTeam2(data.opponents[1].opponent.slug)
                } else {
                    console.log(`HTTP status: ${status}`);
                }
            })
    }

    const getTeam1 = (slug) => {
        pandaScoreApi.get(`teams/${slug}`)
            .then((res) => {
                const status = res.status;

                if (status === 200) {
                    setTeam1(res.data)
                } else {
                    console.log(`HTTP status: ${status}`);
                }
            })
    }

    const getTeam2 = (slug) => {
        pandaScoreApi.get(`teams/${slug}`)
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
    }, [slug]);

    if (!loading && Object.keys(match).length !== 0 && Object.keys(team1).length !== 0 && Object.keys(team2).length !== 0) {
        return (
            <>
                <AppBreadcrumb links={[{ text: "Accueil", link: "/home"}, { text: "Ligues", link: "/leagues/1" }, { text: `${match.league.name}`, link: `/league/${match.league.slug}` }, { text: `${match.serie.full_name}`, link: `/league/${match.league.slug}/${match.serie.slug}` }, { text: `${match.name}`, link: `/matches/${match.slug}` }]} />

                <AppCardInfo className="card match-header">
                    <div className="team" onClick={() => navigate(`/teams/${team1.slug}`)} >
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

                    <div className="team" onClick={() => navigate(`/teams/${team2.slug}`)}>
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

                    <AppCardInfo className="card team two" onCLick={() => navigate(`/teams/${team2.slug}`)}>
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