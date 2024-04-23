export default function Logout() {
    sessionStorage.clear()
    window.location.replace("http://localhost:3000/login")
}