import {AppTitle, AppText, AppLink} from "../../components/Texts";
import {AppCard} from "../../components/Cards";
import {AppButton} from "../../components/Buttons";
import "../../styles/Login.css";
import {ErrorMessage, Field, Form, Formik} from "formik";
import * as Yup from "yup";
import {Navigate} from "react-router-dom";
import paresportifsApi from "../../paresportifsApi";
import paresportifsAuth from "../../paresportifsAuth";
import {jwtDecode} from "jwt-decode";
import isSameDay from "../../functions/isSameDay";

const LoginSchema = Yup.object().shape({
    email: Yup.string().email("L'adresse mail est invalide").required("Champs obligatoire"),
    password: Yup.string().required("Champs obligatoire")
})

export function Login(props) {
    if (props.login) {
        return <Navigate to={"/bets"} state={{ coins: props.coins, email: props.email }} replace={true} />;
    }

    /**
     * Donne les 20 coins quotidien à l'utilisateur si c'est sa première connexion de la journée
     *
     * @param email
     * @param idUser
     */
    const giveCoins = (email, idUser) => {
        paresportifsApi.get(`users?email=${email}`)
            .then((res) => {
                const status = JSON.stringify(res.status);

                if (status === "200") {
                    const id = res.data['hydra:member'][0]['id'];
                    let coins = res.data['hydra:member'][0]['coins'];

                    paresportifsApi.patch(`users/${id}`, {
                        "coins": parseInt(coins) + 20,
                        "lastConnection": new Date()
                    }, {
                        headers: {
                            'content-type': 'application/merge-patch+json'
                        }
                    })
                        .then((res) => {
                            const status = JSON.stringify(res.status);

                            if (status === "200") {
                                coins += 20;
                                sessionStorage.setItem('coins', coins.toString());
                                window.location.reload();
                                // checkBets(idUser, coins);
                            } else {
                                console.log(`Status HTTP: ${status}`)
                            }
                        })
                } else {
                    console.log(`Status HTTP: ${status}`)
                }
            })
    }

    /**
     * Connecte l'utilisateyr
     *
     * @param email
     * @param idUser
     */
    const login = (email, idUser) => {
        paresportifsApi.get(`users?email=${email}`)
            .then((res) => {
                const status = JSON.stringify(res.status);

                if (status === "200") {
                    const coins = res.data['hydra:member'][0]['coins'];
                    sessionStorage.setItem('coins', coins.toString());
                    window.location.reload();
                    // checkBets(idUser, coins);
                } else {
                    console.log(`Status HTTP: ${status}`)
                }
            })
    }

    return (
        <>
            <div className="login-container">
                <AppTitle title="Connexion" style={{marginBottom: 0}} />
                <AppText text="Connectez-vous à la communauté des e-parieurs" style={{marginBottom: "50px"}} />
                <AppCard>
                    <Formik
                        initialValues={{
                            email: '',
                            password: ''
                        }}
                        validationSchema={LoginSchema}
                        onSubmit={(values) => {
                            paresportifsAuth.post('authentication_token', {
                                "email": values.email,
                                "password": values.password
                            })
                            .then((response) => {
                                const status = JSON.stringify(response.status);

                                if (status === "200") {
                                    const token = JSON.stringify(response.data.token);

                                    sessionStorage.setItem('token', token);

                                    const decodedToken = jwtDecode(token);
                                    const idUser = decodedToken['id'];
                                    const lastConnection = decodedToken['lastConnection'];
                                    const email = decodedToken['email'];
                                    const dateTime = new Date(lastConnection['date']);

                                    if (!isSameDay(dateTime, new Date())) {
                                        giveCoins(email, idUser);
                                    } else {
                                        login(email, idUser);
                                    }
                                } else {
                                    console.log(`Status HTTP: ${status}`);
                                }
                            })
                        }}
                    >
                        {() => (
                            <Form>
                                <div className="input-container">
                                    <label htmlFor="email" className="input-label">Adresse mail</label>
                                    <Field type="email" name="email" className="input" placeholder="Adresse mail" />
                                    <ErrorMessage name="email" component="small" className="error" />
                                </div>

                                <div className="input-container password-container">
                                    <div className="texts-container">
                                        <label htmlFor="password" className="input-label">Mot de passe</label>
                                        <AppLink text="Mot de passe oublié ?" link={"/forgotten-password"}/>
                                    </div>

                                    <Field type="password" name="password" className="input" placeholder="Mot de passe"/>
                                    <ErrorMessage name="password" component="small" className="error"/>
                                </div>

                                <AppButton type="submit" text="Se connecter"/>
                            </Form>
                        )}
                    </Formik>

                    <div className="signup">
                        <AppText text="Pas de compte ?" />
                        <AppLink text="Inscrivez-vous !" link="/signin"/>
                    </div>
                </AppCard>
            </div>
        </>
    )
}