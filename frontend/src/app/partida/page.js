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
        console.log(inicio)
        console.log(final)


        let posiciones =[]
  
        if (inicio.fila!=final.fila) {
            
            if (final.fila>inicio.fila) {
                posiciones=dimensionar(inicio, final, "horizontal")
                
            } else {
                posiciones=dimensionar(final, inicio, "horizontal")
                
            }
        } else {
            if (final.fila>inicio.fila) {
                posiciones=dimensionar(inicio, final, "vertical")
                
            } else {
                posiciones=dimensionar(final, inicio, "vertical")
                            
            }
        }

      console.log(posiciones)
      
        // for (let i = 0; i < posiciones.length; i++) {
        //     const posicion = posiciones[i];
        //     if(tablero[posicion.fila][posicion.columna]!=1){
                
        //         let copia = tablero
          
        //         copia[posicion.fila][posicion.columna]=1;
        //         setTablero(copia);
            
        //     }
        // }
        // for (const posicion of posiciones) {
        //     if(tablero[posicion.fila][posicion.columna]!=1){
        //         const agregarNota = (nota) => {
        //         const copia = [];
        //         tablero.forEach((n) => copia.push(n));
        //         copia[posicion.fila][posicion.columna]=1;
        //         setTablero(copia);
        //         };
        //     }
        // }
    
    }
function dimensionar(inicio, final, orientacion) {

    let posicionesEnLaTabla = []


    if (orientacion=="vertical"){

        for (let i = 0; i = final.columna-inicio.columna; i++) {
            posicionesEnLaTabla.push({y: inicio.fila + i, x: inicio.columna})
        }

    
    }else{
        for (let i = 0; i = final.fila-inicio.fila; i++) {
            posicionesEnLaTabla.push({y: inicio.fila, x: inicio.columna + i})
        }
    }

    return posicionesEnLaTabla


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
        

            <Boton funcion={confirmar} text="Confirmar"></Boton>  
 

        
        </>
    );
}



