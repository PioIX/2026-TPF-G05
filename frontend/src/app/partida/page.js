"use client"
import { useSearchParams } from "next/navigation";
import { useState, useEffect, useRef, Suspense } from 'react';
import { useSocket } from "../hooks/useSocket";


import Message from "../components/Message";
import Input from "../components/Input"
import Boton from '../components/Boton';


function ChatPageInterno() {
    const searchParams = useSearchParams();
    const id_jugador = searchParams.get("id_jugador")
    const id_partida = searchParams.get("id_partida")

    
    const { socket } = useSocket();
    let tableroPropio=[
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
    ]
            
    const [mensaje, setMensaje] = useState("");
    const [mensajes, setMensajes] = useState([]);
    const [usuario, setUsuario] = useState({});
    const finRef = useRef(null);











    useEffect(() => {
        
        


        fetch(`http://localhost:4000/mensajes?id_chat=${id_chat}`)
        .then(response => response.json())
        .then(data =>{ 
            
            setMensajes(data)
            console.log(data)
        })
            
    }, []);



    useEffect(() => {
        
        if(socket){

            socket.emit("joinRoom", { room: id_partida })


        }

    }, [socket]);



    


    return (
        <>

            <div className="mensajes">
                {renderizarMsg()}
                <div ref={finRef}></div>

            </div>
            
            <div className="barraEntrada">
                <Input tipo="text" funcion={setMensaje} text="Mensaje" teclado={manejarTecla} valor={mensaje}></Input>          
                <Boton funcion={enviar} text="Enviar"></Boton>  
            </div>
 
        
        </>
    );
}

export default function chatPageWrapped() {
    return (
        <Suspense fallback={<p style={{ textAlign: "center", marginTop: "24px" }}>Cargando...</p>}>
            <ChatPageInterno />
        </Suspense>
    );
}
