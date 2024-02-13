import {Link} from "react-router-dom";

export function AppTitle(props) {
    return (
        <h1 style={props.style}>{props.title}</h1>
    )
}

export function AppText(props) {
    return (
        <p style={props.style}>{props.text}</p>
    )
}

export function AppLink(props) {
    return (
        <Link to={props.link}>{props.text}</Link>
    )
}



