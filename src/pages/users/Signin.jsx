import * as Yup from "yup";
import {AppNavbarLogo} from "../../components/Navbar";
import {AppLink, AppText, AppTitle} from "../../components/Texts";
import {AppCard} from "../../components/Cards";
import {ErrorMessage, Field, Form, Formik} from "formik";
import "../../styles/Login.css";
import {AppButton} from "../../components/Buttons";

const SignupSchema = Yup.object().shape({
    email: Yup.string().email("L'adresse mail est invalide").required('Champs obligatoire'),
    username: Yup.string().required("Champs obligatoire").min(3, "3 caractères minimum"),
    password: Yup.string().required("Champs obligatoire").matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/, 'Mot de passe invalide'),
    confirmPassword: Yup.string().oneOf([Yup.ref('password'), null], 'Les mots de passe doivent correspondre').required("Champs obligatoire")
})

export function Signin() {
    return (
        <>
            <AppNavbarLogo />

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
                        onSubmit={(values) => {
                            alert(JSON.stringify(values, null, 2));
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