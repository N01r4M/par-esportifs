import {AppText} from "./Texts";
import "../styles/Inputs.css";

export function AppInput(props) {
    return (
        <div className="app-input" style={props.style}>
            <div className="texts-container">
                <AppText text={props.text}/>
            </div>
            <input type={props.type} required={props.isRequired} placeholder={props.placeholder} minLength={props.minLength}/>
        </div>
    )
}