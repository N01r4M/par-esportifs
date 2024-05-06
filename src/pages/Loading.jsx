import { TailSpin } from "react-loader-spinner";
import "../styles/Loading.scss";

export function Loading() {
    return (
        <div className="loader-container">
            <div className="loader-child">
                <TailSpin
                    height="100"
                    width="100"
                    color="grey"
                    ariaLabel="Chargement ..."
                />
                <p>Chargement ...</p>
            </div>
        </div>
    );
}