"use client"
import { useRouter } from "next/navigation";




export default function ChatItem({nombre, id_partida,id_jugador,id_ganador }) {

    const router = useRouter();

    function irAPartida(){

        router.push(`/partida?id_partida=${id_partida}&&id_jugador=${id_jugador}&&`)

    }


    return (
        <>
            <button onClick={irAPartida} className="chat">

                
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


            