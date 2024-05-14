import "../../styles/Login.css";
import {AppLink, AppText, AppTitle} from "../../components/Texts";
import {AppCard} from "../../components/Cards";
import {ErrorMessage, Field, Form, Formik} from "formik";
import {AppButton} from "../../components/Buttons";
import * as Yup from "yup";

const FgtPwdSchema = Yup.object().shape({
    email: Yup.string().email("L'adresse mail est invalide").required("Champs obligatoire")
})

export function ForgottenPwd() {
    return (
        <>
            <div className="login-container">
                <AppTitle title="Mot de passe oublié" style={{marginBottom: 0}} />
                <AppText text="Il est temps de modifier votre mot de passe !" style={{marginBottom: "50px"}} />
                <AppCard>
                    <Formik
                        initialValues={{
                            email: '',
                        }}
                        validationSchema={FgtPwdSchema}
                        onSubmit={(values) => {
                            alert(JSON.stringify(values, null, 2));
                        }}
                    >
                        {() => (
                            <Form>
                                <div className="input-container forgotten-container">
                                    <label htmlFor="email" className="input-label">Adresse mail</label>
                                    <Field type="email" name="email" className="input" placeholder="Adresse mail" />
                                    <ErrorMessage name="email" component="small" className="error" />
                                </div>

                                <AppButton type="submit" text="Envoyer" />
                            </Form>
                        )}
                    </Formik>

                    <div className="signup">
                        <AppLink text="Retour à la connexion !" link="/login" />
                    </div>
                </AppCard>
            </div>
        </>
    )
}