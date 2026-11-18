"use client"
import { useRouter } from "next/navigation";
export default function PartidaItem({nombre, id_partida, id_jugador, id_ganador, correoJugador}) {
    const router = useRouter();
    function irAPartida(){
        router.push(`/partida?id_partida=${id_partida}&id_jugador=${id_jugador}&correoJugador=${correoJugador}`)
    }
    let clase = "chat enCurso"
    if (id_ganador == id_jugador && id_ganador != null) {
        clase = "chat ganaste"
    }
    if (id_ganador != id_jugador && id_ganador != null) {
        clase = "chat perdiste"
    }
    return (
        <>
            <button onClick={irAPartida} className={clase} disabled={id_ganador!=null}>
                <div className="chatPre">
                    <h3>{nombre}</h3>
                    {id_ganador==id_jugador && <p>Ganaste</p>}
                    {id_ganador!= id_jugador && id_ganador != null && <p>Perdiste</p>}
                    {id_ganador == null && <p>En curso</p>}
                </div>
            </button>
        </>
    )
};