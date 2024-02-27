import {AppTitle, AppText, AppLink} from "../../components/Texts";
import {AppCard} from "../../components/Cards";
import {AppButton} from "../../components/Buttons";
import "../../styles/Login.css";
import {AppNavbarLogo} from "../../components/Navbar";
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
        return <Navigate to={"/"} state={{ coins: props.coins, uuid: props.uuid }} replace={true} />;
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
                            paresportifsAuth.post('auth', {
                                "email": values.email,
                                "password": values.password
                            })
                            .then((response) => {
                                const status = JSON.stringify(response.status);

                                if (status === "200") {
                                    const token = JSON.stringify(response.data.token);
                                    const decodedToken = jwtDecode(token);
                                    const uuid = decodedToken.uuid;

                                    sessionStorage.setItem('uuid', uuid);
                                    sessionStorage.setItem('token', token);

                                    paresportifsApi.get(`users/${uuid}`)
                                        .then((res) => {
                                            const status = JSON.stringify(res.status);

                                            if (status === "200") {
                                                const lastLog = JSON.stringify(res.data.lastConnection);
                                                const date = lastLog.substring(1, 11)
                                                const dateLastLog = new Date(date);
                                                const coins = JSON.stringify(res.data.coins);

                                                if (!isSameDay(dateLastLog, new Date())) {
                                                    paresportifsApi.patch(`users/${uuid}`, {
                                                        "coins": parseInt(coins) + 20,
                                                        "lastConnection": new Date()
                                                    })
                                                        .then((res) => {
                                                            const status = JSON.stringify(res.status);

                                                            if (status === "200") {
                                                                window.location.reload();
                                                            } else {
                                                                console.log(`Status HTTP: ${status}`);
                                                            }
                                                        })
                                                } else {
                                                    window.location.reload();
                                                }
                                            } else {
                                                console.log(`Status HTTP: ${status}`);
                                            }
                                        })
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