"use client"
import { useRouter } from "next/navigation";

export default function PartidaItem({nombre, id_partida, id_jugador, id_ganador}) {
    const router = useRouter();

    function irAPartida(){
        router.push(`/partida?id_partida=${id_partida}&&id_jugador=${id_jugador}`)
    }

    const estado = id_ganador == null ? "en-curso" : id_ganador == id_jugador ? "ganaste" : "perdiste";

    return (
        <button onClick={irAPartida} className={`chat chat--${estado}`}>
            <div className="chatPre">
                <h3>{nombre}</h3>
                {id_ganador == id_jugador && <p>Ganaste</p>}
                {id_ganador != id_jugador && id_ganador != null && <p>Perdiste</p>}
                {id_ganador == null && <p>En curso</p>}
            </div>
        </button>
    )
}