import "../styles/Buttons.css";

export function AppButton(props) {
    return (
        <button type={props.type} className="button classic">{props.text}</button>
    )
}

export function AppButtonLink() {
    return (
        <></>
    )
}