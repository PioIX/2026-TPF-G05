"use client"
import { useSearchParams } from "next/navigation";
import { useState, useEffect} from 'react';
import { useRouter } from "next/navigation";
import { useSocket } from "../hooks/useSocket";
import Boton from '../components/Boton';
import TablaPropio from "../components/TablaPropio";
import TablaDeAtaque from "../components/TablaDeAtaque";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
const flota = [
    {id_barco: 1, nombre: "Portaaviones", longitud: 5},
    {id_barco: 2, nombre: "Acorazado", longitud: 4},
    {id_barco: 3, nombre: "Destructor", longitud: 3},
    {id_barco: 4, nombre: "Submarino", longitud: 3},
    {id_barco: 5, nombre: "Lancha", longitud: 2}
]
export default function ChatPageInterno() {
    const { socket } = useSocket();
    const searchParams = useSearchParams();
    const router = useRouter();
    const id_jugador = Number(searchParams.get("id_jugador"))
    const id_partida = Number(searchParams.get("id_partida"))
    const correoJugador = searchParams.get("correoJugador")
    const [inicio, setInicio]= useState(undefined)
    const [final, setFinal]= useState(undefined)
    const [barcos, setBarcos]= useState([])
    const [preparado, setPreparado]= useState(undefined)
    const [turno, setTurno]= useState(false)
    const [terminar, setTerminar]= useState(false)
    const [popupCerrado, setPopupCerrado] = useState(false)
    const [ganaste, setGanaste] = useState(false)
    const [razon, setRazon] = useState("")
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
                    if (data.razon == "rendicion") {
                        setRazon("rendicion")
                    } else {
                        setRazon("barcos")
                    }
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
                setRazon("barcos")
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
        if (!existe.existe) {
            for (const posicion of barco.posiciones) {
                if(tablero[posicion.fila][posicion.columna]==1){
                    setInicio(undefined)
                    setFinal(undefined)
                    alert("posicion no es valida")
                    return
                }
            }
            for (const posicion of barco.posiciones) {
                copia[posicion.fila][posicion.columna]=1;
            }
        }else{
            setInicio(undefined)
            setFinal(undefined)
            alert("el barco ya existe")
            return
        }
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
    function rendirse(){
        socket.emit("terminar", { id: id_jugador, razon: "rendicion" })
        setRazon("rendicion")
        setTerminar(true)
        console.log("rendicion enviada")
    }
    function volver(){
        router.push(`/menuDePartidas?id_jugador=${id_jugador}&correoJugador=${correoJugador}`)
    }
    function verificarSiExiste(longitud) {
        let existe=barcos.some(barco => barco.longitud == longitud)
        if (longitud==3) {
            const destructor=barcos.some(barco => barco.id_barco == 3)
            const submarino=barcos.some(barco => barco.id_barco == 4)
            if(destructor && submarino){
                existe=true
            }else{
                existe=false
            }
        }
        let idBarco
        switch (longitud) {
            case 2:
                idBarco=5
                break;
            case 3:
                if(barcos.some(barco => barco.id_barco == 3)){
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
        let coordenadas
        let orientacion
        let posiciones = [];
        let longitud
        if (inicio.fila == final.fila) {
            orientacion="horizontal"
            if (final.columna > inicio.columna) {
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
        } else {
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
        return `${columna}${posicion.fila+1}`
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
    function renderizarBarcos() {
        let items = []
        for (const barco of flota) {
            let colocado = barcos.some((b) => b.id_barco == barco.id_barco)
            let casillas = []
            for (let i = 0; i < barco.longitud; i++) {
                casillas.push(<span key={i} className="casillaBarco"></span>)
            }
            items.push(
                <div key={barco.id_barco} className={colocado ? "barcoLista colocado" : "barcoLista"}>
                    <div className="barcoFila">{casillas}</div>
                    <p className="barcoNombre">{barco.nombre}</p>
                </div>
            )
        }
        return items
    }
    function contarFlota() {
        let quedan = 0
        for (const barco of barcos) {
            const posiciones = dimensionar(pasarANum(barco.posicion), barco.longitud, barco.orientacion)
            for (const posicion of posiciones) {
                if (tablero[posicion.fila][posicion.columna] == 1) {
                    quedan++
                    break
                }
            }
        }
        return quedan
    }
    function contarImpactos() {
        let impactos = 0
        for (let y = 0; y < 10; y++) {
            for (let x = 0; x < 10; x++) {
                if (tableroAtaques[y][x] == 1) {
                    impactos++
                }
            }
        }
        return impactos
    }
    return (
        <main className="pantallaPartida">
            <header className="barraSuperior">
                <p className="marcaBarra">Batalla Naval</p>
                <Boton funcion={volver} text="Volver" clase="botonVolver"></Boton>
            </header>
            <Popup
                open={terminar && !popupCerrado}
                onClose={() => setPopupCerrado(true)}
                modal
                contentClassName="modalFinal"
            >
                <div className={ganaste ? "finalGanaste" : "finalPerdiste"}>
                    <h2>{ganaste ? "¡Ganaste!" : "Perdiste..."}</h2>
                    <p className="razonFinal">{ganaste ? (razon == "rendicion" ? "Ganaste por rendición del enemigo" : "Ganaste por barcos hundidos") : (razon == "rendicion" ? "Perdiste por rendición" : "Perdiste por barcos hundidos")}</p>
                    <p>{ganaste ? "¡Hundiste toda la flota enemiga! ¡Sos el mejor capitán de los mares!" : "Esta vez el enemigo fue más fuerte, pero todo capitán merece una revancha. ¡Volvé a intentarlo!"}</p>
                    <Boton funcion={volver} text="Volver" clase="botonAzul botonAncho"></Boton>
                </div>
            </Popup>
            <div className="contenidoPartida">
                <div className="encabezadoPartida">
                    <h2 className="tituloPartida">Sala {id_partida}</h2>
                    <div className="mandoDerecha">
                        <span className="chipSala">CAPITÁN {id_jugador}</span>
                        {!terminar &&
                            <Boton funcion={rendirse} text="Rendirse" clase="botonRojo"></Boton>
                        }
                    </div>
                </div>
                {!preparado && !terminar && (
                    <div className="zonaBatalla">
                        <section className="zonaTabla">
                            <h2 className="tituloZona">Pone tus barcos</h2>
                            <p className="ayudaZona">Elegí el inicio y el final de cada barco sobre el mapa.</p>
                            <div className="marcoTabla">
                                <TablaPropio
                                    tablero={tablero}
                                    setFinal={setFinal}
                                    setInicio={setInicio}
                                    final={final}
                                    inicio={inicio}
                                    deshabilitar={preparado}
                                ></TablaPropio>
                            </div>
                        </section>
                        <aside className="panelFlota">
                            <h3>Tu flota</h3>
                            {renderizarBarcos()}
                            <p className="ayudaFlota">{barcos.length}/5 barcos desplegados</p>
                        </aside>
                    </div>
                )}
                {preparado && turno && !terminar && (
                    <div className="zonaBatalla">
                        <section className="zonaTabla">
                            <div className="turnoVos">Tu turno</div>
                            <div className="marcoTabla">
                                <TablaDeAtaque
                                    tablero={tableroAtaques}
                                    setPosicionAtaque={setPosicionAtaque}
                                ></TablaDeAtaque>
                            </div>
                            <Boton
                                funcion={confirmar}
                                text="Atacar"
                                deshabilitar={!posicionAtaque}
                                clase="botonAzul botonAncho"
                            ></Boton>
                        </section>
                        <aside className="panelOrdenes">
                            <h3>Encontrá los barcos</h3>
                            <p>Turno: <strong>Vos</strong></p>
                            <p>Impactos al enemigo: <strong>{contarImpactos()}</strong></p>
                            <p>Tu flota operativa: <strong>{contarFlota()}/5</strong></p>
                            <p>Dispará a una casilla del rival.</p>
                        </aside>
                    </div>
                )}
                {preparado && !turno && !terminar && (
                    <div className="zonaBatalla">
                        <section className="zonaTabla">
                            <div className="turnoRival">Turno enemigo</div>
                            <div className="marcoTabla">
                                <TablaPropio
                                    tablero={tablero}
                                    setFinal={setFinal}
                                    setInicio={setInicio}
                                    final={final}
                                    inicio={inicio}
                                    deshabilitar={true}
                                ></TablaPropio>
                            </div>
                        </section>
                        <aside className="panelOrdenes">
                            <h3>Encontrá los barcos</h3>
                            <p>Turno: <strong>Rival</strong></p>
                            <p>Tu flota operativa: <strong>{contarFlota()}/5</strong></p>
                            <p>El enemigo está eligiendo su objetivo.</p>
                        </aside>
                    </div>
                )}
                {terminar && (
                    <div className="zonaBatalla">
                        <section className="zonaTabla">
                            <div className="marcoTabla">
                                <TablaPropio
                                    tablero={tablero}
                                    setFinal={setFinal}
                                    setInicio={setInicio}
                                    final={final}
                                    inicio={inicio}
                                    deshabilitar={true}
                                ></TablaPropio>
                            </div>
                        </section>
                        <aside className="panelOrdenes">
                            <h3>{ganaste ? "Victoria" : "Derrota"}</h3>
                            <p>{ganaste ? (razon == "rendicion" ? "El enemigo se rindió." : "Hundiste toda la flota enemiga.") : (razon == "rendicion" ? "Te rendiste." : "Hundieron toda tu flota.")}</p>
                            <p>Informe de batalla de la sala {id_partida}.</p>
                        </aside>
                    </div>
                )}
            </div>
        </main>
    )
}