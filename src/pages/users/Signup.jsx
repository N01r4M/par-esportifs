import * as Yup from "yup";
import {AppLink, AppText, AppTitle} from "../../components/Texts";
import {AppCard} from "../../components/Cards";
import {ErrorMessage, Field, Form, Formik} from "formik";
import "../../styles/Login.css";
import {AppButton} from "../../components/Buttons";
import {Navigate} from "react-router-dom";
import paresportifsApi from "../../paresportifsApi";
import paresportifsAuth from "../../paresportifsAuth";
import {jwtDecode} from "jwt-decode";

const SignupSchema = Yup.object().shape({
    email: Yup.string().email("L'adresse mail est invalide").required('Champs obligatoire'),
    username: Yup.string().required("Champs obligatoire").min(3, "3 caractères minimum"),
    password: Yup.string().required("Champs obligatoire").matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/, 'Mot de passe invalide'),
    confirmPassword: Yup.string().oneOf([Yup.ref('password'), null], 'Les mots de passe doivent correspondre').required("Champs obligatoire")
})

export function Signup(props) {
    if (props.login) {
        return <Navigate to={"/"} state={{ coins: props.coins, uuid: props.uuid }} replace={true} />
    }

    return (
        <>
            <div className="login-container">
                <AppTitle title="Inscription" style={{marginBottom: 0}}/>
                <AppText text="Rejoignez la communauté des e-parieurs" style={{marginBottom: "50px"}}/>

                <AppCard>
                    <Formik
                        initialValues={{
                            email: '',
                            username: '',
                            password: '',
                            confirmPassword: ''
                        }}
                        validationSchema={SignupSchema}
                        onSubmit={values => {
                            const data = {
                                'username': values.username,
                                'email': values.email,
                                'plainPassword': values.password,
                                'coins': 100,
                                'lastConnection': new Date()
                            }

                            paresportifsApi.post("users", data)
                                .then(res => {
                                    const status = JSON.stringify(res.status);
                                    const dataAuth = {
                                        "email": values.email,
                                        "password": values.password
                                    };

                                    if (status === '201') {
                                        paresportifsAuth.post("auth", dataAuth)
                                            .then(res => {
                                                const status = JSON.stringify(res.status);

                                                if (status === '200') {
                                                    const token = JSON.stringify(res.data.token);
                                                    const decodedToken = jwtDecode(token);
                                                    const uuid = decodedToken.uuid;

                                                    sessionStorage.setItem('uuid', uuid)
                                                    sessionStorage.setItem('token', token);
                                                    window.location.reload();
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
                                <div className="form-group">
                                    <div className="row">
                                        <div className="input-container left">
                                            <label htmlFor="username" className="input-label">Pseudo</label>
                                            <Field name="username" className="input" placeholder="Pseudo"/>
                                            <ErrorMessage name="username" component="small" className="error"/>
                                        </div>

                                        <div className="input-container right">
                                            <label htmlFor="email" className="input-label">Adresse mail</label>
                                            <Field type="email" name="email" className="input"
                                                   placeholder="Adresse mail"/>
                                            <ErrorMessage name="email" component="small" className="error"/>
                                        </div>
                                    </div>

                                    <div className="row password">
                                        <div className="input-container left">
                                            <label htmlFor="password" className="input-label">Mot de passe</label>
                                            <Field type="password" name="password" className="input"
                                                   placeholder="Mot de passe"/>
                                            <ErrorMessage name="password" component="small" className="error"/>
                                        </div>

                                        <div className="input-container right">
                                            <label htmlFor="confirmPassword"
                                                   className="input-label">Confirmation</label>
                                            <Field type="password" name="confirmPassword" className="input"
                                                   placeholder="Mot de passe"/>
                                            <ErrorMessage name="confirmPassword" component="small" className="error"/>
                                        </div>
                                    </div>
                                </div>

                                <AppButton type="submit" text="S'inscrire" />
                            </Form>
                        )}
                    </Formik>

                    <div className="signup">
                        <AppText text="Déjà un compte ?"/>
                        <AppLink text="Connectez-vous !" link="/login"/>
                    </div>
                </AppCard>
            </div>
        </>
    )
}