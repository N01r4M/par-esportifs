import React, {useEffect, useState} from "react";
import pandaScoreApi from "../../pandaScoreApi";
import {useLocation, useParams} from "react-router-dom";
import {AppBreadcrumb} from "../../components/Texts";
import {AppCardLeague} from "../../components/Cards";
import {Loading} from "../Loading";
import "../../styles/Leagues.scss";
import {Pagination} from "../../components/Pagination";
import ParesportifsApi from "../../paresportifsApi";
import paresportifsApi from "../../paresportifsApi";
import {ErrorMessage, Field, Form, Formik} from "formik";
import "../../styles/List.scss";

export function List(props) {
    const [leagues, setLeagues] = useState([]);
    // const [fav, setFav] = useState([]);
    const [loading, setLoading] = useState(true);
    const pathname = useLocation().pathname;
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

    // const getFav = () => {
    //     paresportifsApi.get(`users?email=${props.email}`)
    //         .then(res => {
    //             const status = res.status;
    //
    //             if (status === 200) {
    //                 const data = res.data['hydra:member'][0]['leaguesFav'];
    //                 const arrayFav = [];
    //
    //                 for (let i = 0; i < data.length; i++) {
    //                     const fav = data[i];
    //                     const id = fav.split('/')[3];
    //
    //
    //                     arrayFav.push(parseInt(id));
    //                 }
    //
    //                 console.log(arrayFav);
    //                 pathname.startsWith('/leagues/') ? setFav(data) : setLeagues(data);
    //             } else {
    //                 console.log(`HTTP status: ${status}`)
    //             }
    //         })
    // }

    useEffect(() => {
        setLeagues([]);
        // setFav([]);
        pathname.startsWith('/leagues/') && getLeagues();
        // getFav();
        setLoading(false);
    }, [page, pathname]);

    if (!loading) {
        return (
            <>
                <div className="header-list-leagues-container">
                    {
                        pathname.startsWith('/leagues/') ?
                            <AppBreadcrumb links={[{ text: "Accueil", link: "/home"}, { text: "Ligues", link: "/leagues/1" }]} />
                            :
                            <AppBreadcrumb links={[{ text: "Accueil", link: "/home"}, { text: "Ligues favorites", link: "/favorites/1" }]} />
                    }

                    <Formik
                        initialValues={{
                            name: ''
                        }}
                        onSubmit={(values) => {
                            if (values.name === '') {
                                getLeagues();
                            } else {
                                pandaScoreApi.get(`lol/leagues?sort=name&page=${page}&search[name]=${values.name}`)
                                    .then(res => {
                                        const status = res.status;

                                        if (status === 200) {
                                            setLeagues(res.data)
                                        } else {
                                            console.log(`HTTP status: ${status}`);
                                        }
                                    })
                            }
                        }}
                    >
                        {() => (
                            <Form className="form-container">
                                <div className="input-container">
                                    <Field type="text" name="name" label="Name" placeholder="Recherche par nom" className="input"/>
                                </div>

                                <button type="submit" className="button bet">Rechercher</button>
                            </Form>
                        )}
                    </Formik>
                </div>


                <div className="leagues-list-container">
                    {
                        leagues.map((league) => (
                            pathname.startsWith('/leagues/') ?
                                <AppCardLeague id={league.id} name={league.name} image_url={league.image_url}
                                               slug={league.slug}/>
                                // <AppCardLeague id={league.id} name={league.name} image_url={league.image_url} slug={league.slug} isFav={fav.includes(league.id)} />
                            :
                                <AppCardLeague id={league.id} name={league.name} image_url={league.image_url} slug={league.slug} isFav={true} />
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