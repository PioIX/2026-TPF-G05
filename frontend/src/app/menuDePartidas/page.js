"use client"
import { useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from 'react';
import PartidasList from "../components/PartidasList"
import Input from "../components/Input"
import Boton from '../components/Boton';
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";

function MenuDePartidasInterno() {
    const searchParams = useSearchParams();
    const id_jugador = searchParams.get("id_jugador")
    const correoJugador = searchParams.get("correoJugador")
    
    const [partidas, setPartidas] = useState([]);
    const [mostrarPopup, setMostrarPopup] = useState(false);
    const [nombre, setNombre] = useState("");
    const [correo, setCorreo] = useState("");

    useEffect(() => {
        fetch(`http://localhost:4000/partidas?id_jugador=${id_jugador}`)
            .then(response => response.json())
            .then(data => { setPartidas(data) })
    }, [id_jugador]);

    function crearPartida() {
        const partida = { nombre: nombre, correos: [correoJugador, correo] }
        fetch('http://localhost:4000/crearPartida', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(partida)
        })
        .then(response => response.json())
        .then(data => {
            if (data.ok) {
                setPartidas((actuales) => [...actuales, data.partida]);
                setMostrarPopup(false);
            } else {
                alert("El correo no es valido")
                setMostrarPopup(false);
            }
        })
    }

    return (
        <main className="pantalla pantalla-juego pantalla-menu">
            <div className="contenido-menu">
                <h2 className="titulo-vista">Mis chats</h2>
                <PartidasList partidas={partidas} id_jugador={id_jugador} />
                <div style={{ textAlign: "center", marginTop: "24px" }}>
                    <Boton funcion={() => setMostrarPopup(true)} text="Crear" className="boton-crear" />  
                </div>
            </div>

            <Popup
                open={mostrarPopup}
                onClose={() => setMostrarPopup(false)}
                modal
                contentClassName="modal-crear-sala"
            >
                <div className="contenido-modal">
                    <h3 className="titulo-modal">Crear sala</h3>
                    <Input tipo="text" funcion={setNombre} text="Nombre" className="input-modal" />          
                    <Input tipo="text" funcion={setCorreo} text="Correo" className="input-modal" />
                    <Boton funcion={crearPartida} text="Crear" className="boton-confirmar" />  
                </div>
            </Popup>
        </main>
    );
}

export default function menuDePartidasPage() {
    return (
        <Suspense fallback={<p className="nota-partida">Cargando...</p>}>
            <MenuDePartidasInterno />
        </Suspense>
    );
}