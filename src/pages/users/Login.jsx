import {AppTitle, AppText, AppLink} from "../../components/Texts";
import {AppCard} from "../../components/Cards";
import {AppButton} from "../../components/Buttons";
import "../../styles/Login.css";
import {AppNavbarLogo} from "../../components/Navbar";
import {ErrorMessage, Field, Form, Formik} from "formik";
import * as Yup from "yup";

const LoginSchema = Yup.object().shape({
    email: Yup.string().email("L'adresse mail est invalide").required("Champs obligatoire"),
    password: Yup.string().required("Champs obligatoire")
})

export function Login() {
    return (
        <>
            <AppNavbarLogo />

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
                            alert(JSON.stringify(values, null, 2));
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