import {AppTitle} from "../../components/Texts";
import {AppCard} from "../../components/Cards";
import {ErrorMessage, Field, Form, Formik} from "formik";
import * as Yup from "yup";
import paresportifsApi from "../../paresportifsApi";
import {AppButton} from "../../components/Buttons";
import "../../styles/Profile.scss";
import {useEffect, useState} from "react";

const ProfileSchema = Yup.object().shape({
    email: Yup.string().email("L'adresse mail est invalide").required('Champs obligatoire'),
    username: Yup.string().required("Champs obligatoire").min(3, "3 caractères minimum"),
})

const PasswordSchema = Yup.object().shape({
    password: Yup.string().required("Champs obligatoire").matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/, 'Mot de passe invalide'),
    confirmPassword: Yup.string().oneOf([Yup.ref('password'), null], 'Les mots de passe doivent correspondre').required("Champs obligatoire")
})

export function Profile(props) {
    const [user, setUser] = useState("");
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const uuid = sessionStorage.getItem("uuid");

    const getUserData = () => {
        paresportifsApi.get(`users/${uuid}`)
            .then((res) => {
                const status = JSON.stringify(res.status);

                if (status === "200") {
                    const email = res.data.email;
                    const username = res.data.username;
                    const user = res.data;

                    setEmail(email);
                    setUsername(username);
                    setUser(user);
                } else {
                    console.log(`Status HTTP: ${status}`);
                }
            })
    }

    useEffect(() => {
        getUserData()
    }, [])

    //TODO: mettre en place la modification
    return (
        <>
            <AppTitle title="Mon profil" />

            <div className="profile-container">
                <AppCard>
                    <Formik
                        initialValues={{
                            email: email,
                            username: username
                        }}
                        enableReinitialize={true}
                        validationSchema={ProfileSchema}
                        onSubmit={values => {
                            const data = {
                                "username": values.username,
                                "email": values.email
                            }

                            paresportifsApi.patch(`users/${props.uuid}`, data)
                                .then(res => {
                                    const status = JSON.stringify(res.status);

                                    if (status === "200") {
                                        window.location.reload();
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
                                    <Field name="email" type="email" className="input" placeholder="Adresse email" />
                                    <ErrorMessage name="email" component="small" className="error" />
                                </div>

                                <div className="input-container">
                                    <label htmlFor="username" className="input-label">Pseudo</label>
                                    <Field name="username" className="input" placeholder="Pseudo" />
                                    <ErrorMessage name="username" component="small" className="error" />
                                </div>

                                <AppButton type="submit" text="Modifier" />
                            </Form>
                        )}
                    </Formik>
                </AppCard>


                <AppCard>
                    <Formik
                        initialValues={{
                            password: '',
                            confirmPassword: ''
                        }}
                        validationSchema={PasswordSchema}
                        onSubmit={values => {
                            const data = {
                              "password": values.password
                            }

                            paresportifsApi.patch(`users/${props.uuid}`, data)
                                .then(res => {
                                    const status = JSON.stringify(res.status);

                                    if (status === "200") {
                                        window.location.reload();
                                    } else {
                                        console.log(`Status HTTP: ${status}`);
                                    }
                                })
                        }}
                    >
                        <Form>
                            <div className="input-container">
                                <label htmlFor="password" className="input-label">Mot de passe</label>
                                <Field name="password" type="password" className="input" placeholder="Mot de passe" />
                                <ErrorMessage name="password" component="small" className="error" />
                            </div>

                            <div className="input-container">
                                <label htmlFor="confirmPassword" className="input-label">Confirmation</label>
                                <Field name="confirmPassword" type="password" className="input" placeholder="Confirmation" />
                                <ErrorMessage name="confirmPassword" component="small" className="error" />
                            </div>

                            <AppButton type="submit" text="Modifier" />
                        </Form>
                    </Formik>
                </AppCard>
            </div>
        </>
    )
}