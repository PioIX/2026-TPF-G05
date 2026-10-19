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


    function tradicir(posicion, orientacion, longitud) {
        const letras = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"]
        const fila = Number(posicion[1])
        const letra = posicion[0].toUpperCase()
        const columna= letras.indexOf(letra)
        let posicionesEnLaTabla = []
        if(letras.includes(letra) == true && fila >= 0 && fila <= 9){
            
            if(orientacion == "vertical"){
                if (fila+longitud < 0 && fila+longitud > 9) {
                    return false
                }

                for (let i = 0; i < longitud; i++) {
                    posicionesEnLaTabla.push({y: fila + i, x: columna})
                }
            }else{

                if (columna+longitud >= 0 && columna+longitud <= 9) {
                    return false
                }
                for (let i = 0; i < longitud;i++) {
                    posicionesEnLaTabla.push({y: fila, x: columna + i})
                }
            } 
            return posicionesEnLaTabla

        }else{
            return false
        }

    }










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
