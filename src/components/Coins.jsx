import React, {useState} from "react";
import "../styles/Coins.scss"
import paresportifsApi from "../paresportifsApi";
import {jwtDecode} from "jwt-decode";

export function Coins(props) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={props.size} height={props.size} fill="currentColor" className="bi bi-coin icoins" viewBox="0 0 16 16">
            <path d="M5.5 9.511c.076.954.83 1.697 2.182 1.785V12h.6v-.709c1.4-.098 2.218-.846 2.218-1.932 0-.987-.626-1.496-1.745-1.76l-.473-.112V5.57c.6.068.982.396 1.074.85h1.052c-.076-.919-.864-1.638-2.126-1.716V4h-.6v.719c-1.195.117-2.01.836-2.01 1.853 0 .9.606 1.472 1.613 1.707l.397.098v2.034c-.615-.093-1.022-.43-1.114-.9H5.5zm2.177-2.166c-.59-.137-.91-.416-.91-.836 0-.47.345-.822.915-.925v1.76h-.005zm.692 1.193c.717.166 1.048.435 1.048.91 0 .542-.412.914-1.135.982V8.518l.087.02z" />
            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
            <path d="M8 13.5a5.5 5.5 0 1 1 0-11 5.5 5.5 0 0 1 0 11zm0 .5A6 6 0 1 0 8 2a6 6 0 0 0 0 12z" />
        </svg>
    );
}

export function FavHeart(props) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-heart-fill" viewBox="0 0 16 16">
            <path fill-rule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314"/>
        </svg>
    );
}

export function FavHeartEmpty(props) {
    const [leagues, setLeagues] = useState([]);
    const decodedToken = jwtDecode(sessionStorage.getItem("token"));
    const id = decodedToken['id'];

    const getLeagues = () => {
        paresportifsApi.get(`users/${id}`)
            .then((res) => {
                const status = res.status;

                if (status === 200) {
                    const data = res.data['leaguesFav'];

                    setLeagues(data);
                } else {
                    console.log(`HTTP status: ${status}`)
                }
            })
    }

    const patch = () => {
        paresportifsApi.patch(`users/${id}`, {
            "leaguesFav": `/api/leagues/${props.idLeague}`
        }, {
            headers: {
                'content-type': 'application/merge-patch+json'
            }
        })
            .then((res) => {
                const status = res.status;

                console.log(status)
            })
    }

    const addLeague = () => {
        paresportifsApi.post(`leagues`, {
            "idLeague": props.idLeague,
            "name": props.name,
            "slug": props.slug,
            "imageUrl": props.image_url,
            "users": [`/api/users/${id}`]
        })
            .then((res) => {
                const status = res.status;

                if (status === 201) {
                    console.log(res)
                } else {
                    console.log(`Status HTTP: ${status}`)
                }
            })
    }

    const addToFav = () => {
        getLeagues();

        console.log(props.image_url)

        if (leagues.includes(props.idLeague)) {
            patch();
        } else {
            addLeague();
        }

    }

    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-heart" viewBox="0 0 16 16" onClick={addToFav}>
            <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143q.09.083.176.171a3 3 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15"/>
        </svg>
    )
}

export function FavHeartBroken(props) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-heartbreak-fill" viewBox="0 0 16 16">
            <path d="M8.931.586 7 3l1.5 4-2 3L8 15C22.534 5.396 13.757-2.21 8.931.586M7.358.77 5.5 3 7 7l-1.5 3 1.815 4.537C-6.533 4.96 2.685-2.467 7.358.77"/>
        </svg>
    )
}