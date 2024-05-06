import {AppLink} from "./Texts";
import "../styles/Pagination.scss";

export function Pagination(props) {
    return (
        <nav className="pagination" aria-label="pagination">
            <ul>
                {
                    props.links.map((value, i) => {
                        return <li key={i}><AppLink link={value.link} text={value.text} /></li>
                    })
                }
            </ul>
        </nav>
    )
}