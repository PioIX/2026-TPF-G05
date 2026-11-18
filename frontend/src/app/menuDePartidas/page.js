"use client"
import { useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from 'react';
import { useRouter } from "next/navigation";
import PartidasList from "../components/PartidasList"
import Input from "../components/Input"
import Boton from '../components/Boton';
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
export default function menuDePartidasPage() {
    const searchParams = useSearchParams();
    const id_jugador = searchParams.get("id_jugador")
    const correoJugador = searchParams.get("correoJugador")
    const router = useRouter();
    const [partidas, setPartidas] = useState([]);
    const [mostrarPopup, setMostrarPopup] = useState(false);
    const [nombre, setNombre] = useState("");
    const [correo, setCorreo] = useState("");
    useEffect(() => {
        fetch(`http://localhost:4000/partidas?id_jugador=${id_jugador}`)
            .then(response => response.json())
            .then(data =>{
                setPartidas(data)
                console.log(data)
            })
    }, [ ]);
    function crearPartida() {
        const partida = {
            nombre: nombre,
            correos: [correoJugador, correo]
        }
        fetch('http://localhost:4000/crearPartida', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(partida)
        })
        .then(response => response.json())
        .then(data => {
            if (data.ok) {
                setPartidas((actuales) => [...actuales, data.partida]);
                setMostrarPopup(false);
            }else{
                alert("El correo no es valido")
                setMostrarPopup(false);
            }
        })
    }
    function volver() {
        router.push("/")
    }
    return (
        <main className="pantallaMenu">
            <header className="barraSuperior">
                <p className="marcaBarra">Batalla Naval</p>
                <Boton funcion={volver} text="Volver" clase="botonVolver"></Boton>
            </header>
            <div className="contenidoMenu">
                <h2 className="tituloVista">Partidas</h2>
                <div className="accionesMenu">
                    <Boton funcion={() => setMostrarPopup(true)} text="Crear sala" clase="botonAzul"></Boton>
                </div>
                <PartidasList partidas={partidas} id_jugador={id_jugador} correoJugador={correoJugador}></PartidasList>
            </div>
            <Popup
            open={mostrarPopup}
            onClose={() => setMostrarPopup(false)}
            modal
            contentClassName="modalSala"
            >
                <div className="contenidoModal">
                    <h3 className="tituloModal">Crear sala</h3>
                    <div className="campo">
                        <label className="etiqueta">Nombre</label>
                        <Input tipo="text" funcion={setNombre} text="Nombre de la sala"></Input>
                    </div>
                    <div className="campo">
                        <label className="etiqueta">Correo Electrónico</label>
                        <Input tipo="text" funcion={setCorreo} text="Ingrese su mail"></Input>
                    </div>
                    <Boton funcion={crearPartida} text="¡CREAR!" clase="botonClaro botonAncho"></Boton>
                </div>
            </Popup>
        </main>
    );
}