"use client"
import { useSearchParams } from "next/navigation";
import { useState, useEffect, useRef, Suspense } from 'react';
// import { useSocket } from "../hooks/useSocket"; // Descomenta cuando lo uses

import Message from "../components/Message";
import Input from "../components/Input"
import Boton from '../components/Boton';

function ChatPageInterno() {
    const searchParams = useSearchParams();
    const id_jugador = searchParams.get("id_jugador")
    const id_partida = searchParams.get("id_partida")
    
    // const { socket } = useSocket(); 
            
    const [mensaje, setMensaje] = useState("");
    const [mensajes, setMensajes] = useState([]);
    const finRef = useRef(null);

    // --- TU LÓGICA ORIGINAL SE MANTIENE INTACTA AQUÍ ---
    function tradicir(posicion, orientacion, longitud) {
        const letras = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"]
        const fila = Number(posicion[1])
        const letra = posicion[0].toUpperCase()
        const columna= letras.indexOf(letra)
        let posicionesEnLaTabla = []
        if(letras.includes(letra) == true && fila >= 0 && fila <= 9){
            switch (orientacion) {
                case "este":
                    if (fila+longitud < 0 && fila+longitud > 9) return false;
                    for (let i = 0; i < longitud; i++) posicionesEnLaTabla.push({y: fila + i, x: columna});
                    break;
                case "sur":
                    if (columna+longitud >= 0 && columna+longitud <= 9) return false;
                    for (let i = 0; i < longitud;i++) posicionesEnLaTabla.push({y: fila, x: columna + i});            
                    break;
                case "oeste":
                    if (fila-longitud < 0 && fila-longitud > 9) return false;
                    for (let i = 0; i < longitud; i++) posicionesEnLaTabla.push({y: fila - i, x: columna});
                    break;          
                case "norte":
                    if (columna-longitud >= 0 && columna-longitud <= 9) return false;
                    for (let i = 0; i < longitud;i++) posicionesEnLaTabla.push({y: fila, x: columna - i});          
                    break;
                default: break;
            }
            return posicionesEnLaTabla
        } else {
            return false
        }
    }

    useEffect(() => {
        // fetch(`http://localhost:4000/mensajes?id_chat=${id_partida}`)
        // .then(response => response.json())
        // .then(data => { setMensajes(data) })
    }, []);
    // ----------------------------------------------------

    return (
        <main className="pantalla pantalla-juego pantalla-partida">
            <div className="contenido-partida">
                <header className="encabezado-partida">
                    <div>
                        <p className="antetitulo">Batalla Naval</p>
                        <h2 className="titulo-partida">Partida en curso</h2>
                    </div>
                    <span className="chip-sala">SALA #{id_partida}</span>
                </header>

                <div className="layout-partida">
                    {/* Columna Izquierda: Tablero (Placeholder visual listo) */}
                    <section className="columna-tablero">
                        <p className="etiqueta-tablero">Radar enemigo</p>
                        <div className="tablero-marco" data-inactivo={true}>
                            <div className="tablero">
                                <div className="tablero-columnas">
                                    {["A","B","C","D","E","F","G","H","I","J"].map(l => <span key={l} className="coord coord-columna">{l}</span>)}
                                </div>
                                <div className="tablero-filas">
                                    {[1,2,3,4,5,6,7,8,9,10].map(n => <span key={n} className="coord coord-fila">{n}</span>)}
                                </div>
                                <div className="tablero-celdas">
                                    {Array.from({length: 100}).map((_, i) => <button key={i} className="celda" disabled />)}
                                </div>
                            </div>
                        </div>
                        <div className="leyenda-tablero">
                            <span className="leyenda-item"><span className="leyenda-muestra celda" />Sin explorar</span>
                            <span className="leyenda-item"><span className="leyenda-muestra celda celda-agua" />Agua</span>
                            <span className="leyenda-item"><span className="leyenda-muestra celda celda-tocado" />Tocado</span>
                            <span className="leyenda-item"><span className="leyenda-muestra celda celda-hundido" />Hundido</span>
                        </div>
                    </section>

                    {/* Columna Derecha: Panel + Chat (Tu lógica) */}
                    <aside className="columna-lateral">
                        <div className="turno turno--mio">TU TURNO</div>

                        <section className="panel-estado">
                            <h3>Encuentra los barcos</h3>
                            <p>Dispará a una casilla del rival.</p>
                        </section>

                        <section className="chat-partida">
                            <div className="chat-encabezado">
                                <h3 className="titulo-chat">Chat de la partida</h3>
                                <span className="chat-estado">EN LÍNEA</span>
                            </div>

                            <div className="mensajes">
                                {/* Si renderizarMsg existe en tu código real, se usará. Si no, usa el map de mensajes */}
                                {typeof renderizarMsg === 'function' ? renderizarMsg() : mensajes.map((m, i) => <Message key={i} {...m} id_user_Logeado={id_jugador} />)}
                                <div ref={finRef}></div>
                            </div>
                            
                            <div className="barraEntrada">
                                <Input tipo="text" funcion={setMensaje} text="Mensaje" teclado={typeof manejarTecla === 'function' ? manejarTecla : undefined} valor={mensaje}></Input>          
                                <Boton funcion={typeof enviar === 'function' ? enviar : undefined} text="Enviar" className="boton-enviar"></Boton>  
                            </div>
                        </section>
                    </aside>
                </div>
            </div>
        </main>
    );
}

export default function chatPageWrapped() {
    return (
        <Suspense fallback={<p className="nota-partida">Cargando partida...</p>}>
            <ChatPageInterno />
        </Suspense>
    );
}