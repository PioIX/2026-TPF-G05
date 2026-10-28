"use client"
import { useSearchParams } from "next/navigation";
import { useState, useEffect, useRef, Suspense } from 'react';
import { useSocket } from "../hooks/useSocket";



import Boton from '../components/Boton';
import Tabla from "../components/Tabla";
import { CONFIG_FILES } from "next/dist/shared/lib/constants";


export default function ChatPageInterno() {
    const searchParams = useSearchParams();
    const id_jugador = searchParams.get("id_jugador")
    const id_partida = searchParams.get("id_partida")
    const [inicio, setInicio]= useState(undefined)
    const [final, setFinal]= useState(undefined)
    const [barcos, setBarcos]= useState([])
    let portaavionesCont=0
    let acorazadoCont=0
    let destructorCont=0
    let submarinoCont=0
    let lanchaCont=0
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
    console.log(inicio)
    console.log(final)
    if (inicio.fila == final.fila) {

        if (final.columna > inicio.columna) {
            posiciones = dimensionar(inicio, final.columna - inicio.columna + 1, "horizontal");
        } else {
            posiciones = dimensionar(final, inicio.columna - final.columna  + 1, "horizontal");
        }
    } else if (inicio.columna == final.columna) {
        if (final.fila > inicio.fila) {

            posiciones = dimensionar(inicio, final.fila - inicio.fila + 1, "vertical");
        } else {
            posiciones = dimensionar(final, inicio.fila - final.fila  + 1, "vertical");npm 
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

function dimensionar(puntoA, longitud, orientacion) {
    console.log(longitud)

    const posiciones = [];

    if (orientacion === "horizontal") {
        for (let i = 0; i < longitud ; i++) {
            posiciones.push({ fila: puntoA.fila, columna: puntoA.columna + i });
        }
    } else {
        for (let i = 0; i < longitud; i++) {
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
        
        for (const barco of barcos) {
            
            switch (barco.nombre) {
                case "Portaaviones":
                    portaavionesCont=portaavionesCont+1
                    break;
                case "Acorazado":
                    acorazadoCont=acorazadoCont+1
                    break;
                case "Destructor":
                    destructorCont=destructorCont+1
                    break;
                case "Submarino":
                    submarinoCont=submarinoCont+1
                    break;
                case "Lancha":
                    lanchaCont=lanchaCont+1
                    break;
                default:
                    break;
            }
        }
        
        for (const barco of barcos) {
            const posiciones =dimensionar(traducir(barco.posicion), barco.longitud, barco.orientacion)
            let copia=[]
            
            tablero.forEach((c) => copia.push(c));
    

            
            for (const posicion of posiciones) {
                copia[posicion.fila][posicion.columna]=1;
                
            }
            setTablero(copia)

            
        }

    }, [barcos]);

    
    function traducir(posicion) {
        const letras = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"]
        const fila = Number(posicion[1])
        const letra = posicion[0].toUpperCase()
        const columna= letras.indexOf(letra)
        return {fila: fila, columna: columna}
    }
    

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



