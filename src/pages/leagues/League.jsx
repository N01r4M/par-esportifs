import {useParams} from "react-router-dom";
import pandaScoreApi from "../../pandaScoreApi";
import {useEffect, useState} from "react";
import {Loading} from "../Loading";
import {AppBreadcrumb} from "../../components/Texts";
import {AppCardSerie} from "../../components/Cards";

export function League(props) {
    const [league, setLeague] = useState({});
    const [series, setSeries] = useState([]);
    const [loading, setLoading] = useState(true);
    const slug = useParams().slug;

    const getLeague = () => {
        pandaScoreApi.get(`leagues/${slug}`)
        .then(res => {
            const status = res.status;

            if (status === 200) {
                setLeague(res.data);
                setSeries(res.data.series)
            } else {
                console.log(`HTTP status: ${status}`);
            }
        })
    }

    useEffect(() => {
        getLeague();
        setLoading(false);
    }, [slug])

    if (!loading && league.name !== undefined) {
        return (
            <>
                <AppBreadcrumb links={[{ text: "Accueil", link: "/home"}, { text: "Ligues", link: "/leagues/1" }, { text: `${league.name}`, link: `/league/${slug}` }]} />

                <div className="leagues-list-container">
                    {
                        [...series].reverse().map(serie => (
                            <AppCardSerie slug={serie.slug} name={serie.full_name} league={league.slug} image_url={league.image_url} key={serie.slug} />
                        ))
                    }
                </div>
            </>
        )
    } else {
        return (
            <Loading />
        )
    }
}