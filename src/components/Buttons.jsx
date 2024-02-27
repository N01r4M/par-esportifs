import "../styles/Buttons.css";
import {Link} from "react-router-dom";

export function AppButton(props) {
    return (
        <button type={props.type} className="button classic">{props.text}</button>
    )
}

export function AppButtonLink(props) {
    return (
        <Link to={props.link} className="button link"><p>{props.text}</p></Link>
    )
}