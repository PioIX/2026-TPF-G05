"use client"
import { useSearchParams } from "next/navigation";
import { useState, useEffect, useRef, Suspense } from 'react';
import { useSocket } from "../hooks/useSocket";



import Boton from '../components/Boton';
import Tabla from "../components/Tabla";


export default function ChatPageInterno() {
    const searchParams = useSearchParams();
    const id_jugador = searchParams.get("id_jugador")
    const id_partida = searchParams.get("id_partida")
    const [inicio, setInicio]= useState({})
    const [final, setFinal]= useState({})
    const [tablero, setTablero]= useState(


        [
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



    )

    
    const { socket } = useSocket();
            
    
    const finRef = useRef(null);

    function confirnar() {
        if(inicio.fila!=final.fila && inicio.columna!=final.columna){
            return false
        }
        if (inicio.fila!=final.fila) {
            
        } else {
            
        }
}
function tradicir(inicio, final, orientacion,) {

    let posicionesEnLaTabla = []
    if(letras.includes(letra) == true && fila >= 0 && fila <= 9){

        if (orientacion=="vertical"){
            // corregir
                for (let i = inicio.columnaddddddddd; i <= final.columna; i++) {
                    posicionesEnLaTabla.push({y: inicio.fila + i, x: inicio.columna})
                }


        }

        return posicionesEnLaTabla

    }else{
        return false
    }

}


    










    useEffect(() => {
        
        


        fetch(`http://localhost:4000/mensajes?id_partida=${id_partida}`)
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
            <Tabla
            tablero={tablero}
            setFinal={setFinal}
            setInicio={setInicio}
            final={final}
            inicio={inicio}
            ></Tabla>
            

        </div>
        

            <Boton funcion={confirnar} text="Confirmar"></Boton>  
 

        
        </>
    );
}



