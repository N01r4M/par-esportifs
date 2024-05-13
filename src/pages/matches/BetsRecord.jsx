import {useEffect, useState} from "react";
import {Loading} from "../Loading";
import paresportifsApi from "../../paresportifsApi";
import {jwtDecode} from "jwt-decode";
import {AppBreadcrumb} from "../../components/Texts";
import pandaScoreApi from "../../pandaScoreApi";
import {isDatetimePassed} from "../../functions/isSameDay";
import {AppCardBets} from "../../components/Cards";

export function BetsRecord(props) {
    const [bets, setBets] = useState([]);
    const [matchesFinished, setMatchesFinished] = useState([]);
    const [matchesNotStarted, setMatchesNotStarted] = useState([]);
    const [loading, setLoading] = useState(true);
    const decodedToken = jwtDecode(sessionStorage.getItem("token"));
    const idUser = decodedToken['id'];

    /**
     * Récupère les paris de l'utilisateur
     */
    const checkBets = () => {
        paresportifsApi.get(`bets?user_id=${idUser}&status=not_checked`)
            .then((res) => {
                const status = res.status;

                if (status === 200) {
                    const bets = res.data['hydra:member'];

                    for (let i = 0; i < bets.length; i++) {
                        const bet = bets[i];

                        if (isDatetimePassed(bet.startAt)) {
                            checkResult(bet);
                        }
                    }
                } else {
                    console.log(`Status HTTP: ${status}`)
                }
            })
    }

    /**
     * Regarde si le match est fini et si le pari est correct
     *
     * @param bet
     */
    const checkResult = (bet) => {
        const teamChosen = bet.teamId;
        const betId = bet.id;
        const betMacthId = bet.idMatch;
        const betCoins = bet.coins;

        pandaScoreApi.get(`matches/${betMacthId}`)
            .then((res) => {
                const status = res.status;

                if (status === 200) {
                    const match = res.data;

                    if (match.status === "finished") {
                        const winner = match.winner_id;

                        if (teamChosen === winner) {
                            addCoinsToUser(betCoins, betId);
                        } else {
                            setBetCheck(betId);
                        }
                    }
                } else {
                    console.log(`Status HTTP: ${status}`)
                }
            })
    }

    /**
     * Ajoute les coins à l'utilisateur
     *
     * @param betCoins
     * @param betId
     */
    const addCoinsToUser = (betCoins, betId) => {
        const newNbCoins = props.coins + (betCoins * 2);

        sessionStorage.removeItem('coins');
        sessionStorage.setItem('coins', newNbCoins);

        paresportifsApi.patch(`user/${idUser}`, {
            'coins': newNbCoins
        }, {
            headers: {
                'content-type': 'application/merge-patch+json'
            }
        })
            .then((res) => {
                const status = res.status;

                if (status === 200) {
                    setBetCheck(betId);
                } else {
                    console.log(`Status HTTP: ${status}`);
                }
            })
    }

    /**
     * Change le statut du bet pour le passer en "checked"
     *
     * @param betId
     */
    const setBetCheck = (betId) => {
        paresportifsApi.patch(`bets/${betId}`, {
            status: "checked",
        }, {
            headers: {
                'content-type': 'application/merge-patch+json'
            }
        })
            .then((res) => {
                const status = res.status;

                if (status !== 200) {
                    console.log(`Status HTTP: ${status}`);
                }
            })
    }

    /**
     * Récupère tous les paris fait par l'utilisateur
     */
    const getBets = () => {
        paresportifsApi.get(`bets?user_id=${idUser}`)
            .then((res) => {
                const status = res.status;

                if (status === 200) {
                    const data = res.data['hydra:member'];

                    setBets(data);
                    data.length > 0 && getMatches(data);
                } else {
                    console.log(`Status HTTP: ${status}`);
                }
            })
    }

    /**
     * Récupère tous les matchs liés aux paris de l'utilisateur
     */
    const getMatches = (betsArray) => {
        const matchesFinishedArray = [];
        const matchesNotStartedArray = [];

        for (let i = 0; i < betsArray.length; i++) {
            const bet = betsArray[i];

            pandaScoreApi.get(`matches/${bet.idMatch}`)
                .then((res) => {
                    const status = res.status;

                    if (status === 200) {
                        const match = res.data;

                        if (match.status === "finished") {
                            matchesFinishedArray.push(match);
                        } else {
                            matchesNotStartedArray.push(match);
                        }

                        if (i + 1 === betsArray.length) {
                            setMatchesFinished(matchesFinishedArray);
                            setMatchesNotStarted(matchesNotStartedArray);
                        }
                    } else {
                        console.log(`Status HTTP: ${status}`);
                    }
                })
        }
    }


    useEffect(() => {
        checkBets();
        getBets();
        setLoading(false);
    }, [])

    if (!loading && bets.length !== 0 && (matchesFinished.length !== 0 || matchesNotStarted.length !== 0)) {
        return (
            <>
                <AppBreadcrumb links={[{ text: "Accueil", link: "/home"}, { text: "Historique des paris", link: "/bets" }]} />

                <div className="matches-container">
                    <AppCardBets matches={matchesFinished} bets={bets} title={"Matchs terminés"} />
                    <AppCardBets matches={matchesNotStarted} bets={bets} title={"Matchs à venir"} />
                </div>
            </>
        )
    } else {
        return (
            <Loading />
        )
    }
}