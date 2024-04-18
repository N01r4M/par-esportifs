import {Link} from "react-router-dom";
import "../styles/Texts.scss";

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
        <Link to={props.link} className={props.class}>{props.text}</Link>
    )
}

export function AppBreadcrumb(props) {
    return (
        <nav aria-label="Breadcrumb" className="breadcrumb">
            <ul className="breadcrumb">
                {
                    // eslint-disable-next-line array-callback-return
                    props.links.map(function (value, index) {
                        return <li className="breadcrumb-item" key={index}>
                            <AppLink link={value.link} text={value.text}/>
                        </li>
                    })
                }
            </ul>
        </nav>
    )
}
