import {AppBreadcrumb, AppText} from "../../components/Texts";
import {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import pandaScoreApi from "../../pandaScoreApi";
import {Loading} from "../Loading";
import {AppCardInfo} from "../../components/Cards";
import moment from "moment/moment";
import "../../styles/Match.scss";
import "../../styles/Buttons.scss";
import Modal from 'react-modal';
import {ErrorMessage, Field, Form, Formik} from "formik";
import * as Yup from "yup";
import paresportifsApi from "../../paresportifsApi";
import {jwtDecode} from "jwt-decode";

export function Match(props) {
    const [match, setMatch] = useState({});
    const [team1, setTeam1] = useState({});
    const [team2, setTeam2] = useState({});
    const [channel, setChannel] = useState({});
    const [loading, setLoading] = useState(true);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const id = useParams().idMatch;
    const idLeague = useParams().idLeague;
    const idSerie = useParams().idSerie;
    const navigate = useNavigate();
    const decodeToken = jwtDecode(sessionStorage.getItem("token"));
    const idUser = decodeToken['id'];

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

    const openModal = () => {
        setModalIsOpen(true);
    }

    const closeModal = () => {
        setModalIsOpen(false);
    }

    useEffect(() => {
        getMatch();
        setLoading(false);
    }, [id]);

    if (!loading && Object.keys(match).length !== 0 && Object.keys(team1).length !== 0 && Object.keys(team2).length !== 0) {
        const BetSchema = Yup.object().shape({
            coins: Yup.number().integer("Il faut un nombre entier").min(1, "Vous devez parier au moins 1 coin").max(props.coins, `Vous ne pouvez pas parier plus de ${props.coins} coins`).required("Ce champs est obligatoire"),
            team: Yup.string().required().oneOf([team1.id.toString(), team2.id.toString()])
        })

        return (
            <>
                <div className="infos-container">
                    <AppBreadcrumb links={[{ text: "Accueil", link: "/home"}, { text: "Ligues", link: "/leagues/1" }, { text: `${match.league.name}`, link: `/${match.league.id}` }, { text: `${match.serie.full_name}`, link: `/${match.league.id}/${match.serie.id}` }, { text: `${match.name}`, link: `/${match.league.id}/${match.serie.id}/${match.id}` }]} />

                    {
                        match.status === "not_started" && <button className="button bet" onClick={openModal}>Parier</button>
                    }
                </div>

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
                        {/*<div className="bg-logo" style={{ backgroundImage: `url(${team1.image_url})` }}></div>*/}

                        {
                            team1.players.sort((a, b) => a.role.localeCompare(b.role)).map((player) => {
                                return <div onClick={() => navigate(`/${match.league.id}/${match.serie.id}/${match.id}/${team1.id}/${player.id}`)}>{player.role} - {player.name}</div>
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
                        {/*<div className="bg-logo" style={{ backgroundImage: `url(${team2.image_url})` }}></div>*/}

                        {
                            team2.players.sort((a, b) => a.role.localeCompare(b.role)).map((player) => {
                                return <div onClick={() => navigate(`/${match.league.id}/${match.serie.id}/${match.id}/${team2.id}/${player.id}`)}>{player.name} - {player.role}</div>
                            })
                        }
                    </AppCardInfo>

                    <Modal isOpen={modalIsOpen} onRequestClose={closeModal} className="modal">
                        <Formik
                            initialValues={{
                                coins: 0,
                                team: team1.id.toString()
                            }}
                            validationSchema={BetSchema}
                            onSubmit={(values) => {
                                const betCoins = parseInt(values.coins)

                                //Ajouter le pari dans la base de données
                                paresportifsApi.post('bets', {
                                    "user": `/api/users/${idUser}`,
                                    "idMatch": match.id.toString(),
                                    "startAt": match.scheduled_at,
                                    "teamId": parseInt(values.team),
                                    "nbCoins": betCoins,
                                    'status': 'not_checked'
                                })
                                .then((res) => {
                                    const status = res.status;

                                    if (status === 201) {
                                        //Modifier le nombre de coins de l'utilisateur
                                        const coins = props.coins - betCoins;
                                        sessionStorage.removeItem("coins")
                                        sessionStorage.setItem("coins", coins);

                                        paresportifsApi.patch(`users/${idUser}`, {
                                            "coins": coins
                                        }, {
                                            headers: {
                                                'content-type': 'application/merge-patch+json'
                                            }
                                        })
                                            .then((res) => {
                                                const status = res.status;

                                                if (status === 200) {
                                                    window.location.reload();
                                                } else {
                                                    console.log(`Status HTTP: ${status}`)
                                                }
                                            })
                                    } else {
                                        console.log(`Status HTTP: ${status}`)
                                    }
                                })
                            }}
                        >
                            {() => (
                                <Form>
                                    <div className="input-container coins">
                                        <label htmlFor="coins" className="input-label">Nombre de coins à parier</label>
                                        <Field type="int" name="coins" className="input" placeholder="Nombre de coins"/>
                                        <ErrorMessage name="coins" component="small" className="error"/>
                                    </div>

                                    <div className="input-container team">
                                        <label htmlFor="team" className="input-label">Equipe soutenue</label>
                                        <Field as="select" name="team" className="input">
                                            <option value={team1.id}>{team1.name}</option>
                                            <option value={team2.id}>{team2.name}</option>
                                        </Field>
                                        <ErrorMessage name="team" component="small" className="error"/>
                                    </div>

                                    <div className="button-container">
                                        <button onClick={closeModal} className="button bet close">Fermer</button>
                                        <button type="submit" className="button bet">Parier</button>
                                    </div>
                                </Form>
                            )}
                        </Formik>


                    </Modal>
                </div>
            </>
        )
    } else {
        return (
            <Loading/>
        )
    }
}