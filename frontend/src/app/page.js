"use client"
import { useState } from 'react';
import Input from "./components/Input"
import Boton from './components/Boton';
import { useRouter } from "next/navigation";

export default function Home() {
  const [correo, setCorreo] = useState("");
  const [usuario, setUsuario] = useState("");
  const [contra, setContra] = useState("");
  const [mostrarRegistro, setMostrarRegistro] = useState(false);
  const router = useRouter();

  function logear() {
    fetch(`http://localhost:4000/login?correo=${correo}&contra=${contra}`)
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
    const user = { usuario, correo, contra }
    fetch('http://localhost:4000/registrar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
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

  return (
    <main className="pantalla pantalla-auth">
      <div className="container entrada-escalonada">
        <h2 className="titulo-juego">Bienvenido</h2>
        
        <Input tipo="text" funcion={setCorreo} text="Ingrese su correo" />
        <Input tipo="password" funcion={setContra} text="Ingrese su contraseña" />

        <Boton funcion={logear} text="Iniciar sesion" className="boton-primario" />

        {!mostrarRegistro &&
          <Boton funcion={() => setMostrarRegistro(true)} text="Crear cuenta" className="boton-primario" />
        }

        {mostrarRegistro &&
          <div className="bloque-registro">
            <Input tipo="text" funcion={setUsuario} text="Ingrese su usuario" />
            <Boton funcion={registrar} text="Registrarse" className="boton-primario" />
            <Boton funcion={() => setMostrarRegistro(false)} text="Volver" className="boton-enlace" />
          </div>
        }
      </div>
    </main>
  );
}