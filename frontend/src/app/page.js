"use client"
import { useState } from 'react';
import Input from "./components/Input"
import Boton from './components/Boton';
import { useRouter } from "next/navigation";
const ipBack="192.168.56.1"
export default function Home() {
    const [correo, setCorreo] = useState("");
    const [usuario, setUsuario] = useState("");
    const [contra, setContra] = useState("");
    const [mostrarRegistro, setMostrarRegistro] = useState(false);
    const router = useRouter();
    function logear() {
        fetch(`http://${ipBack}:4000/login?correo=${correo}&contra=${contra}`)
        .then(response => response.json())
        .then(data => {
            if(data.ok){
                router.push(`/menuDePartidas?id_jugador=${data.respuesta[0].id_jugador}&&correoJugador=${data.respuesta[0].correo}`)
            }else{
                alert("El usuario no existe")
            }
        });
    }
    function registrar(){
        if(correo=="" || contra == "" || usuario == ""){
            alert("Datos invalidos")
            return
        }
        const user ={
            usuario: usuario,
            correo: correo,
            contra: contra,
        }
        fetch(`http://${ipBack}:4000/registrar`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        })
        .then(response => response.json())
        .then(data => {
            if(!data.ok){
                alert("El usuario ya existe")
            }else{
                logear()
            }
        });
    }
    function mostrar(){
        setMostrarRegistro(true)
    }
    function volver(){
        setMostrarRegistro(false)
    }
    return (
        <main className="pantallaAuth">
            <header className="barraSuperior">
                <p className="marcaBarra">Batalla Naval</p>
                <Boton funcion={volver} text="Volver" clase="botonVolver"></Boton>
            </header>
            <div className="zonaAuth">
                <div className="container">
                    <h2 className="tituloAuth">{mostrarRegistro ? "Registrarse" : "Iniciar sesion"}</h2>
                    {!mostrarRegistro &&
                        <>
                            <div className="campo">
                                <label className="etiqueta">Correo</label>
                                <Input tipo="text" funcion={setCorreo} text="Ingrese su correo"></Input>
                            </div>
                            <div className="campo">
                                <label className="etiqueta">Contraseña</label>
                                <Input tipo="password" funcion={setContra} text="Ingrese su contraseña"></Input>
                            </div>
                            <Boton funcion={logear} text="Iniciar" clase="botonAzul botonAncho"></Boton>
                            <p className="pregunta">¿No tenés cuenta?</p>
                            <Boton funcion={mostrar} text="Registrate" clase="botonAzul botonAncho"></Boton>
                        </>
                    }
                    {mostrarRegistro &&
                        <div className="registro">
                            <div className="campo">
                                <label className="etiqueta">Usuario</label>
                                <Input tipo="text" funcion={setUsuario} text="Ingrese su usuario"></Input>
                            </div>
                            <div className="campo">
                                <label className="etiqueta">Correo</label>
                                <Input tipo="text" funcion={setCorreo} text="Ingrese su mail"></Input>
                            </div>
                            <div className="campo">
                                <label className="etiqueta">Contraseña</label>
                                <Input tipo="password" funcion={setContra} text="Ingrese su contraseña"></Input>
                            </div>
                            <Boton funcion={registrar} text="Registrar" clase="botonAzul botonAncho"></Boton>
                        </div>
                    }
                </div>
            </div>
        </main>
    );
}