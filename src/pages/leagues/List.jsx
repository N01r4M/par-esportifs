import React, {useEffect, useState} from "react";
import pandaScoreApi from "../../pandaScoreApi";
import {useParams} from "react-router-dom";
import {AppBreadcrumb} from "../../components/Texts";
import {AppCardLeague} from "../../components/Cards";
import {Loading} from "../Loading";
import "../../styles/Leagues.scss";
import {Pagination} from "../../components/Pagination";

export function List() {
    const [leagues, setLeagues] = useState([]);
    const [loading, setLoading] = useState(true);
    const pathname = window.location.pathname;
    const page = useParams().page;
    const previousPage = page === '1' ? 1 : parseInt(page) - 1;
    const nextPage = parseInt(page) + 1;

    const getLeagues = () => {
        pandaScoreApi.get(`lol/leagues?sort=name&page=${page}&per_page=15`)
            .then(res => {
                const status = res.status;

                if (status === 200) {
                    setLeagues(res.data);
                } else {
                    console.log(`HTTP status: ${status}`);
                }
            });
    }

   useEffect(() => {
        getLeagues();
        setLoading(false)
    }, [page]);

    if (!loading) {
        console.log(leagues)
        return (
            <>
                <AppBreadcrumb links={[{ text: "Accueil", link: "/home"}, { text: "Ligues", link: "/leagues/1" }]} />

                <div className="leagues-list-container">
                    {
                        leagues.map((league) => (
                            <AppCardLeague league={league} />
                        ))
                    }
                </div>

                <Pagination links={[{ text: "<< Page précédente", link: `/leagues/${previousPage}`}, { text: "Page suivante >>", link: `/leagues/${nextPage}`}]} />
            </>
        )
    } else {
        return (
            <Loading />
        )
    }
}