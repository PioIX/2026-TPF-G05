"use client"
import { useSearchParams } from "next/navigation";
import { useState, useEffect} from 'react';
import { useSocket } from "../hooks/useSocket";



import Boton from '../components/Boton';
import TablaPropio from "../components/TablaPropio";
import TablaDeAtaque from "../components/TablaDeAtaque";

import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";

export default function ChatPageInterno() {

    const { socket } = useSocket();

    const searchParams = useSearchParams();
    const id_jugador = Number(searchParams.get("id_jugador"))
    const id_partida = Number(searchParams.get("id_partida"))
    
    
    const [inicio, setInicio]= useState(undefined)
    const [final, setFinal]= useState(undefined)
    const [barcos, setBarcos]= useState([])
    
    
    
    
    
    const [preparado, setPreparado]= useState(undefined)
    const [turno, setTurno]= useState(false)
    const [terminar, setTerminar]= useState(false)
    const [popupCerrado, setPopupCerrado] = useState(false)
    const [ganaste, setGanaste] = useState(false)
    

    const [posicionAtaque, setPosicionAtaque]= useState(undefined)
    const [ataqueRival, setAtaqueRival]= useState(undefined)
    const [posicion, setPosicion] = useState(undefined)





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

    useEffect(() => {  
        fetch(`http://localhost:4000/traerBarcos?id_partida=${id_partida}&id_jugador=${id_jugador}`)
        .then(response => response.json())
        .then(data =>{ 
            const copia = tablero.map((fila) => [...fila]);

            for (const barco of data) {
                const posiciones =dimensionar(pasarANum(barco.posicion), barco.longitud, barco.orientacion)

                for (const posicion of posiciones) {
                    copia[posicion.fila][posicion.columna] = 1;
                }
            
            }            

            setTablero(copia)
            setBarcos(data)
          })

    }, []);

    useEffect(() => {
        
        if(socket){
            socket.emit("joinRoom", { room: id_partida })

            socket.on("listo", (data) => {
                if (data.id != id_jugador) {
                    
                    if (data.idA<id_jugador || data.idB<id_jugador) {
                        setTurno(false)
                    } else {
                        setTurno(true)
                    }

                }

            });

            socket.on("terminar", (data) => {
                if (data.id != id_jugador) {
                    setGanaste(true)
                    setTerminar(true)

                    fetch("http://localhost:4000/terminarPartida", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            id_partida: id_partida, 
                            id_ganador: id_jugador 
                        })
                    })
                }
            });

            socket.on("ataqueRta", (data) => {
                if (data.id!=id_jugador) {

                    setAtaqueRival(data)
                    console.log("rta:", data.acierto)
                }
                
            })

            socket.on("ataque", (data) => {

                if (data.id != id_jugador) {
                    setPosicion(data.posicion)
                    
                    console.log("ataque recibido")
                }




            })


        }
    }, [socket]);


    useEffect(()=>{

        if (ataqueRival) {
            if(ataqueRival.acierto){
                let copia = tableroAtaques.map((fila) => [...fila]);
                copia[ataqueRival.posicion.fila][ataqueRival.posicion.columna]=1
                setTableroAtaques(copia)
            }else{
                let copia = tableroAtaques.map((fila) => [...fila]);
                copia[ataqueRival.posicion.fila][ataqueRival.posicion.columna]=2

                setTableroAtaques(copia)
                setTurno(false)
            }
        }

    }, [ataqueRival])
    useEffect(()=>{
        if (posicion) {
            let copia = tablero.map((fila) => [...fila]);
            console.log(copia)
            if (copia[posicion.fila][posicion.columna]== 1){
                socket.emit("ataqueRta", { id: id_jugador, acierto: true, posicion: posicion})
                copia[posicion.fila][posicion.columna]=2
                console.log("acerto :(")

            }else{

                socket.emit("ataqueRta", { id: id_jugador, acierto: false, posicion: posicion})
                copia[posicion.fila][posicion.columna]=3
                
                console.log("fallo :)")
                setTurno(true)

            }
            setTablero(copia)
            let quedanBarcos=false
            for (let y = 0; y < 10; y++) {
                for (let x = 0; x < 10; x++) {
                    if(copia[y][x]==1){
                        quedanBarcos=true
                    }
                    
                }
            }
            if (!quedanBarcos) {
                socket.emit("terminar", { id: id_jugador })
                console.log("NO QUEDAN BARCOS")
                setTerminar(true)
                setPreparado(false)


            }

        }
    }, [posicion])

    useEffect(() => {
        
        if(barcos.length==5 && socket){
            setPreparado(true)
            socket.emit("listo", { id:id_jugador })


        }
    }, [barcos, socket]);

    useEffect(() => {
        if (final) {
            validarBarco()
        }
    }, [final]);
    



    function validarBarco() {
        // verifica que los puntos no esten vacios
        if (!inicio || !final) { 
            setInicio(undefined)
            setFinal(undefined)
            alert("no hay posiciones guardadas")
            return 

        }

        const barco = construirBarco()
    
        if (!barco || barco.longitud>5 || barco.longitud<2) {
            setInicio(undefined)
            setFinal(undefined)
            alert("la forma del barcon no es posible")
            return 
        }
        
        const copia = tablero.map((fila) => [...fila]);
    

        const existe=verificarSiExiste(barco.longitud)



        if (!existe.existe) { //si no existe lo añade
            
            for (const posicion of barco.posiciones) {// verifica que ninguna de las posiciones este ocupada
                if(tablero[posicion.fila][posicion.columna]==1){    
                    setInicio(undefined)
                    setFinal(undefined)
                    alert("posicion no es valida")
                    return
                }    
            }
    
            for (const posicion of barco.posiciones) {// las añade
                copia[posicion.fila][posicion.columna]=1;
                
            }
        }else{
            setInicio(undefined)
            setFinal(undefined)
            alert("el barco ya existe")
            return 
        }
        
        // agrega el baco a la lista
        let copiaBarcos = [];
        barcos.forEach((c) => copiaBarcos.push(c));
        
        copiaBarcos.push({
            orientacion: barco.orientacion,
            posicion: barco.punto,
            longitud: barco.longitud, 
            id_barco: existe.idBarco 
        })
        subirBarco({
            orientacion: barco.orientacion,
            posicion: barco.punto,
            id_barco: existe.idBarco,
            id_jugador: id_jugador,
            id_partida: id_partida
        })

        setBarcos(copiaBarcos)
        setTablero(copia)
        
        setInicio(undefined)
        setFinal(undefined)
    }


    function confirmar(){

        if(tableroAtaques[posicionAtaque.fila][posicionAtaque.columna] == 0){
            socket.emit("ataque", { id:id_jugador, posicion: posicionAtaque })
            setPosicionAtaque(undefined)
            console.log("ataque enviado")
        }else{
            alert("ya atacaste esa posicion")
        }
    }


    function verificarSiExiste(longitud) {
        let existe=barcos.some(barco => barco.longitud == longitud) // si hay algun barco de la misma longitud existe sera TRUE 

        //caso especial
        if (longitud==3) {
            // busca  si es las bastos segun id
            const destructor=barcos.some(barco => barco.id_barco == 3)
            const submarino=barcos.some(barco => barco.id_barco == 4)

            if(destructor && submarino){ // verifica si estan los 2
                existe=true

            }else{
                existe=false

            }

        }
        // saca el id seun las longitud
        let idBarco
        switch (longitud) { 
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

        return {existe: existe, idBarco: idBarco}
    }

    function construirBarco() {
        // variables dode se gurdan los datos del barco
        let coordenadas
        let orientacion

        // array de las posiciones que va a ocupar el barco en la matriz 
        let posiciones = [];

        let longitud


        // verificacion de la orientacion segun la coinidencia de filas y columnas

        if (inicio.fila == final.fila) {
            orientacion="horizontal"
            if (final.columna > inicio.columna) { // averigua que punto es esta mas en la esqina superior izquierda (este sera el punto de referencia del  barco)

                longitud=final.columna - inicio.columna + 1
                posiciones = dimensionar(inicio, longitud, "horizontal");
                coordenadas=pasarALetra(inicio)
            } else {
                longitud=inicio.columna - final.columna  + 1
                posiciones = dimensionar(final, longitud, "horizontal");
                coordenadas=pasarALetra(final)
                

            }
        } else if (inicio.columna == final.columna) {

            orientacion="vertical"
            if (final.fila > inicio.fila) {

                longitud=final.fila - inicio.fila + 1
                posiciones = dimensionar(inicio, longitud, "vertical");
                coordenadas=pasarALetra(inicio)
            } else {

                longitud=inicio.fila - final.fila  + 1
                posiciones = dimensionar(final, longitud, "vertical");
                coordenadas=pasarALetra(final)
            }
        } else { // caso de digonal   
            return false
        }
        return {punto: coordenadas, orientacion: orientacion, longitud: longitud, posiciones: posiciones}
    }

 
    function dimensionar(puntoA, longitud, orientacion) {

        
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
        console.log("posiciones del bacro:", posiciones)
        return posiciones;
    }    
    
    function pasarANum(posicion) {
        const letras = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"]
        const fila = Number(posicion.slice(1)) - 1
        const letra = posicion[0].toUpperCase()
        const columna= letras.indexOf(letra)

        return {fila: fila, columna: columna}
    }
    function pasarALetra(posicion) {
        const letras = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"]
        const columna = letras[posicion.columna]
        return `${columna}${posicion.fila+1}` // "A1"
    }    
    
    function subirBarco(barco) {

        fetch('http://localhost:4000/subirBarco', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(barco)
        })

    }    









    

    return (
    <>
        <Popup
            open={terminar && !popupCerrado}
            onClose={() => setPopupCerrado(true)}
            modal
        >
            <div>
                <h2>{ganaste ? "¡Ganaste!" : "Perdiste"}</h2>
                <button onClick={() => setPopupCerrado(true)}>Cerrar</button>
            </div>
        </Popup>

        {!preparado && !terminar && (
            <div>
                <p>pone tus barcos</p>
                <TablaPropio
                    tablero={tablero}
                    setFinal={setFinal}
                    setInicio={setInicio}
                    final={final}
                    inicio={inicio}
                    deshabilitar={preparado}
                ></TablaPropio>
            </div>
        )}

        {preparado && turno && !terminar && (
            <div>
                <p>tu turno</p>
                <TablaDeAtaque
                    tablero={tableroAtaques}
                    setPosicionAtaque={setPosicionAtaque}
                ></TablaDeAtaque>

                <Boton
                    funcion={confirmar}
                    text="Atacar"
                    deshabilitar={!posicionAtaque}
                ></Boton>
            </div>
        )}

        {preparado && !turno && !terminar && (
            <div>
                <p>turno del rival</p>
                <TablaPropio
                    tablero={tablero}
                    setFinal={setFinal}
                    setInicio={setInicio}
                    final={final}
                    inicio={inicio}
                    deshabilitar={true}
                ></TablaPropio>
            </div>
        )}

        {terminar && (
            <div>

                <TablaPropio
                    tablero={tablero}
                    setFinal={setFinal}
                    setInicio={setInicio}
                    final={final}
                    inicio={inicio}
                    deshabilitar={true}
                ></TablaPropio>
            </div>
        )}
    </>
    )
}



