"use client"
import { useSearchParams } from "next/navigation";
import { useState, useEffect, useRef, Suspense } from 'react';
import { useSocket } from "../hooks/useSocket";



import Boton from '../components/Boton';
import TablaPropio from "../components/TablaPropio";
import TablaDeAtaque from "../components/TablaDeAtaque";
import { CONFIG_FILES } from "next/dist/shared/lib/constants";


export default function ChatPageInterno() {

    const { socket } = useSocket();
    const searchParams = useSearchParams();
    const id_jugador = searchParams.get("id_jugador")
    const id_partida = searchParams.get("id_partida")
    const [inicio, setInicio]= useState(undefined)
    const [final, setFinal]= useState(undefined)
    const [barcos, setBarcos]= useState([])
    const [turno, setTurno]= useState(true)
    
    


    const [posicionAtaque, setPosicionAtaque]= useState(undefined)
    const [preparado, setPreparado]= useState(undefined)




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
    const [tableroAtaques, setTableroAtaques]= useState(
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

    const finRef = useRef(null);

    useEffect(() => {
        
        if(socket){
            socket.emit("joinRoom", { room: id_partida })

            socket.on("listo", (data) => {
                if (data.id != id_jugador) {
                    
                    if (data.id>id_jugador) {
                        setTurno(false)
                    } else {
                        setTurno(true)
                    }

                }

            });

            socket.on("ataqueRta", (data) => {
                if (data.id!=id_jugador) {
                    if(data.acierto){
                        const copia = tableroAtaques.map((fila) => [...fila]);
                        copia[data.posicion.fila][data.posicion.columna]=1
                        setTableroAtaques(copia)
                    }else{
                        const copia = tableroAtaques.map((fila) => [...fila]);
                        copia[data.posicion.fila][data.posicion.columna]=2

                        setTableroAtaques(copia)
                        setTurno(false)
                    }

                }
                
            })

            socket.on("ataque", (data) => {
                if (data.id!=id_jugador) {
                    if (tablero[data.posicion.fila][data.posicion.columna]== 1 ){
                        socket.emit("ataqueRta", { id: id_jugador, acierto: true, posicion: data.posicion})
                    }else{
                        socket.emit("ataqueRta", { id: id_jugador, acierto: false, posicion: data.posicion})
                        setTurno(true)

                    }
                }
            })
        }
    }, [socket]);


    useEffect(() => {
        
        if(barcos.length==5){
            setPreparado(true)
            socket.emit("listo", { id:id_jugador })


        }
    }, [barcos]);


    useEffect(() => {
        if (final) {
            
            validarBarco()
        }
    }, [final]);

    useEffect(() => {
        
    
        fetch(`http://localhost:4000/traerBarcos?id_partida=${id_partida}&&id_jugador=${id_jugador}`)
        .then(response => response.json())
        .then(data =>{ 

            const copia = tablero.map((fila) => [...fila]);

            for (const barco of data) {
                const posiciones =dimensionar(pasarANum(barco.posicion), barco.longitud, barco.orientacion)

                console.log("posiciones",posiciones)
 
                for (const posicion of posiciones) {
                    copia[posicion.fila][posicion.columna] = 1;
                }
            
            }            

            setTablero(copia)
            setBarcos(data)

        })


    }, []);

    function confirmar(){
        socket.emit("ataque", { id:id_jugador, posicion: posicionAtaque })
    }



    function validarBarco() {
        // verifica que los puntos no esten vacios
        if (!inicio || !final) { 
            setInicio(undefined)
            setFinal(undefined)
            alert("posicion no es valida")
            return 

        }

        
        // variables dode se gurdan los datos del barco
        let coordenadas
        let orientacion

        // array de las posiciones que va a ocupar el barco en la matriz 
        let posiciones = [];

        // verificacion de la orientacion segun la coinidencia de filas y columnas

        if (inicio.fila == final.fila) {
            orientacion="horizontal"
            if (final.columna > inicio.columna) { // averigua que punto es esta mas en la esqina superior izquierda (este sera el punto de referencia del  barco)
                posiciones = dimensionar(inicio, final.columna - inicio.columna + 1, "horizontal");
                coordenadas=pasarALetra(inicio)
            } else {
                posiciones = dimensionar(final, inicio.columna - final.columna  + 1, "horizontal");
                coordenadas=pasarALetra(final)
                

            }
        } else if (inicio.columna == final.columna) {

            orientacion="vertical"
            if (final.fila > inicio.fila) {

                posiciones = dimensionar(inicio, final.fila - inicio.fila + 1, "vertical");
                coordenadas=pasarALetra(inicio)
            } else {

                posiciones = dimensionar(final, inicio.fila - final.fila  + 1, "vertical");
                coordenadas=pasarALetra(final)
            }
        } else { // caso de digonal   
            setInicio(undefined)
            setFinal(undefined)
            alert("posicion no es valida")
            return 
        }

        
        console.log(posiciones);
        
        
        const copia = tablero.map((fila) => [...fila]);
    

        let existe=barcos.some(barco => barco.longitud == posiciones.length) // si hay algun barco de la misma longitud existe sera TRUE 
        if (posiciones.length>5 || posiciones.length<2) { // valida las min y max longitudes
            setInicio(undefined)
            setFinal(undefined)
            alert("el barco no el valido")
            return 
        }
        //caso especial
        if (posiciones.length==3) {
            // busca  si es las bastos segun id
            const destructor=barcos.some(barco => barco.id_barco == 3)
            const submarino=barcos.some(barco => barco.id_barco == 4)

            if(destructor && submarino){ // verifica si estan los 2
                existe=true

            }else{
                existe=false

            }

        }


        if (!existe) { //el no existe lo añade
            
            for (const posicion of posiciones) {// verifica que ninguna de las posiciones este ocupada
                if(tablero[posicion.fila][posicion.columna]==1){    
                    setInicio(undefined)
                    setFinal(undefined)
                    alert("posicion no es valida")
                    return
                }    
            }
    
            for (const posicion of posiciones) {// las añade
                copia[posicion.fila][posicion.columna]=1;
                
            }
        }else{
            setInicio(undefined)
            setFinal(undefined)
            alert("el barco ya existe")
            return 
        }
        
        setInicio(undefined)
        setFinal(undefined)
        // saca el id seun las longitud
        let idBarco
        switch (posiciones.length) { 
            case 2:
                idBarco=5
                break;
            case 3: // cass especial 
                if(barcos.some(barco => barco.id_barco == 3)){// verifica cual es que ya esta y añade el otro
                    idBarco=4
                }else{
                    idBarco=3
                }
                break;
            case 4:
                idBarco=2
                break;
            case 5:

                idBarco=1
                break;
            default:
                break;
        }
        // agrega el baco a la lista
        let copiaBarcos = [];
        barcos.forEach((c) => copiaBarcos.push(c));
        copiaBarcos.push({
            orientacion: orientacion,
            posicion: coordenadas,
            longitud: posiciones.length, 
            id_barco: idBarco 
        })
        setBarcos(copiaBarcos)
        setTablero(copia)
        subirBarco({
            orientacion: orientacion,
            posicion: coordenadas, 
            id_barco: idBarco 
        })
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
    
    function pasarANum(posicion) {
        const letras = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"]
        const fila = Number(posicion.slice(1)) - 1
        const letra = posicion[0].toUpperCase()
        const columna= letras.indexOf(letra)
        console.log(fila)
        console.log({fila: fila, columna: columna})
        return {fila: fila, columna: columna}
    }
    function pasarALetra(posicion) {
        const letras = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"]
        const columna = letras[posicion.columna]
        return `${columna}${posicion.fila+1}` // "A1"
    }    
    
    function subirBarco(barco) {
        const data={
            posicion: barco.posicion,
            orientacion: barco.orientacion,
            id_barco: barco.id_barco,
            id_jugador: id_jugador,
            id_partida: id_partida

        }
        fetch('http://localhost:4000/subirBarco', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
        })

    }    









    
    



    


    return (
        <>

                {turno ? 
                    
                    <div>

                        <p>tus barcos</p>

                        <div className="mensajes">
                            <TablaPropio
                            tablero={tablero}
                            setFinal={setFinal}
                            setInicio={setInicio}
                            final={final}
                            inicio={inicio}
                            deshabilitar={preparado}
                            ></TablaPropio>
                            
    
                        </div>
                    
                    </div>
                
                
                
                :
                    <div className="mensajes">
                    
                        <TablaDeAtaque
                        tablero={tableroAtaques}
                        setPosicionAtaque={setPosicionAtaque}
                        ></TablaDeAtaque>

                    </div>

                }



            <Boton funcion={confirmar} text="Confirmar" deshabilitar={barcos.length<5}></Boton>   


        
        </>
    );
}



