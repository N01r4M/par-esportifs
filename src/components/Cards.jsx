import "../styles/Cards.css"

export function AppCard({children}) {
    return (
        <div className="card">
            {children}
        </div>
    )
}