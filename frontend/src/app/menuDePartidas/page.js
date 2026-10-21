"use client"
import { useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from 'react';
import PartidasList from "../components/PartidasList"
import Input from "../components/Input"
import Boton from '../components/Boton';
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";

export default function menuDePartidasPage() {
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
            .then(data =>{ 
                
                
                setPartidas(data)
                console.log(data)
            })
                


    }, [ ]);



    



    function updateCorreos() {
        const copia = [];
        correos.forEach((c) => copia.push(c));
        copia.push(correo);
        setCorreos(copia);
    }





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


    return (
        <>
            <h2 style={{ textAlign: "center", margin: "20px 0" }}>Mis chats</h2>
            <PartidasList partidas={partidas} id_jugador={id_jugador}></PartidasList>

            <Boton funcion={() => setMostrarPopup(true)} text="Crear"></Boton>  
            <Popup
            open={mostrarPopup}
            onClose={() => setMostrarPopup(false)}
            modal
            >
                
                <Input tipo="text" funcion={setNombre} text="Nombre"></Input>          
                  
  

                <Input tipo="text" funcion={setCorreo} text="Correo"></Input>


                <Boton funcion={crearPartida} text="Crear"></Boton>  
            </Popup>
        </>
    );
}

