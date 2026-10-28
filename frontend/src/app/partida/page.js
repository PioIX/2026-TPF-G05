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
    const [inicio, setInicio]= useState(undefined)
    const [final, setFinal]= useState(undefined)
    const [barcos, setBarcos]= useState([])
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

function confirmar() {
    if (!inicio || !final) {
        setInicio(undefined)
        setFinal(undefined)
        alert("posicion no es valida")
        return 

    }

    let posiciones = [];

    if (inicio.fila == final.fila) {

        if (final.columna > inicio.columna) {
            posiciones = dimensionar(inicio, final, "horizontal");

        } else {
            posiciones = dimensionar(final, inicio, "horizontal");
        }
    } else if (inicio.columna == final.columna) {

        if (final.fila > inicio.fila) {

            posiciones = dimensionar(inicio, final, "vertical");
        } else {
            posiciones = dimensionar(final, inicio, "vertical");
        }
    } else {
        setInicio(undefined)
        setFinal(undefined)
        alert("posicion no es valida")
        return 
    }

    console.log(posiciones);
    let copia = [];

    
    tablero.forEach((c) => copia.push(c));
    
    for (const posicion of posiciones) {
        if(tablero[posicion.fila][posicion.columna]==1){    
            setInicio(undefined)
            setFinal(undefined)
            alert("posicion no es valida")
            return
        }    
    }
    
    for (const posicion of posiciones) {
        copia[posicion.fila][posicion.columna]=1;
        
    }

    setInicio(undefined)
    setFinal(undefined)
    
}

function dimensionar(puntoA, puntoB, orientacion) {
    const posiciones = [];

    if (orientacion === "horizontal") {
        for (let i = 0; i <= puntoB.columna-puntoA.columna; i++) {
            posiciones.push({ fila: puntoA.fila, columna: puntoA.columna + i });
        }
    } else {
        for (let i = 0; i <= puntoB.fila-puntoA.fila; i++) {
            posiciones.push({ fila: puntoA.fila + i, columna: puntoA.columna });
        }
    }

    return posiciones;
}
    










    useEffect(() => {
        
        


        fetch(`http://localhost:4000/traerBarcos?id_partida=${id_partida}&&id_jugador=${id_jugador}`)
        .then(response => response.json())
        .then(data =>{ 
            
            setBarcos(data)
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
        

            <Boton funcion={confirmar} text="Confirmar"></Boton>  
 

        
        </>
    );
}



