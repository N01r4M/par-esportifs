import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import pandaScoreApi from "../../pandaScoreApi";
import {Loading} from "../Loading";
import {AppBreadcrumb, AppText} from "../../components/Texts";
import {AppCardInfo, AppCardMatches} from "../../components/Cards";
import moment from "moment";
import "moment/locale/fr";
import "../../styles/Serie.scss";

export function Serie() {
    const [serie, setSerie] = useState({});
    const [winner, setWinner] = useState({});
    const [pastMatches, setPastMatches] = useState([]);
    const [runningMatches, setRunningMatches] = useState([]);
    const [upcomingMatches, setUpcomingMatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const slug = useParams().serie;

    moment.locale("fr");

    const getSerie = () => {
        pandaScoreApi.get(`series/${slug}`)
            .then(res => {
                const status = res.status;

                if (status === 200) {
                    setSerie(res.data)
                    getPastMatches();
                    getRunningMatches();
                    getUpcomingMatches();

                    if (res.data.winner_id !== null) {
                        getWinner(res.data.winner_id);
                    }
                } else {
                    console.log(`HTTP status: ${status}`);
                }
            })
    }

    const getWinner = (id) => {
        pandaScoreApi.get(`teams/${id}`)
            .then(res => {
                const status = res.status;

                if (status === 200) {
                    setWinner(res.data)
                } else {
                    console.log(`HTTP status: ${status}`);
                }
            })
    }

    const getPastMatches = () => {
        pandaScoreApi.get(`series/${slug}/matches/past`)
            .then(res => {
                const status = res.status;

                if (status === 200) {
                    setPastMatches(res.data)
                } else {
                    console.log(`HTTP status: ${status}`);
                }
            })
    }

    const getRunningMatches = () => {
        pandaScoreApi.get(`series/${slug}/matches/running`)
            .then(res => {
                const status = res.status;

                if (status === 200) {
                    setRunningMatches(res.data)
                } else {
                    console.log(`HTTP status: ${status}`);
                }
            })
    }

    const getUpcomingMatches = () => {
        pandaScoreApi.get(`series/${slug}/matches/upcoming`)
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
        getSerie()
        setLoading(false);
    }, [slug])

    if (!loading && Object.keys(serie).length !== 0) {
        return (
            <>
                <AppBreadcrumb links={[{ text: "Accueil", link: "/home"}, { text: "Ligues", link: "/leagues/1" }, { text: `${serie.league.name}`, link: `/league/${serie.league.slug}` }, { text: `${serie.full_name}`, link: `/league/${serie.league.slug}/${serie.slug}` }]} />

                <AppCardInfo className="card info">
                    <AppText text={`Débute le ${moment.utc(serie.begin_at).local().format("dddd D MMMM YYYY [à] HH[h]mm")}`} />
                    <AppText text={`Fini le ${moment.utc(serie.end_at).local().format("dddd D MMMM YYYY [à] HH[h]mm")}`} />
                    {
                        Object.keys(winner).length !== 0 && <AppText text={`Gagnant : ${winner.name}`} />
                    }
                </AppCardInfo>

                <div className="matches-container">
                    <AppCardMatches matches={pastMatches} title={'Terminés'} />
                    <AppCardMatches matches={runningMatches} title={'En cours'} />
                    <AppCardMatches matches={upcomingMatches} title={'A venir'} />
                </div>
            </>
        )
    } else {
        return (
            <Loading />
        )
    }
}