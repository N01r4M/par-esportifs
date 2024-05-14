import {useEffect, useState} from "react";
import {Loading} from "../Loading";
import {AppBreadcrumb} from "../../components/Texts";
import paresportifsApi from "../../paresportifsApi";
import {AppCardRank} from "../../components/Cards";
import "../../styles/Ranking.scss";

export function Ranking() {
    const [topUsers, setTopUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    /**
     * Récupère les 10 premiers utilisateurs, selon le nombre de coins qu'ils possèdent
     */
    const getTopUsers = () => {
        paresportifsApi.get(`users?order[coins]`)
            .then((res) => {
                const status = res.status;

                if (status === 200) {
                    const data = res.data['hydra:member'];
                    const top = data.slice(0, 10);

                    setTopUsers(top);
                } else {
                    console.log(`Status HTTP: ${status}`);
                }
            })
    }

    useEffect(() => {
        getTopUsers();
        setLoading(false);
    }, []);


    if (!loading && topUsers.length !== 0) {
        return (
            <>
                <AppBreadcrumb links={[{ text: 'Accueil', link:"/home" }, {  text: 'Classement des e-parieurs', link: "/ranking"}]} />

                <div className="ranking-container">
                    {
                        topUsers.map((user, index) => {
                            return <AppCardRank rank={index + 1} user={user} />
                        })
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