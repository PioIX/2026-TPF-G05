"use client"
import {  useState } from 'react';
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

        router.push(`/menuDePartidas?id_user=${data.respuesta[0].id_user}&&correo=${data.respuesta[0].correo}`)

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


    fetch('http://localhost:4000/registrar', {
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


  const fotoValida = typeof foto === "string" && foto.trim() !== "";

  return (
    <div className="container">
      <h2>Bienvenido</h2>
      <Input tipo="text" funcion={setCorreo} valor={correo} text="Ingrese su correo"></Input>
      <Input tipo="password" funcion={setContra} valor={contra} text="Ingrese su contraseña"></Input>

      <Boton funcion={logear} text="Iniciar sesion"></Boton>

      <div>

        {!mostrarRegistro &&
          <Boton funcion={mostrar} text="Crear cuenta"></Boton>

        }

        {mostrarRegistro &&

          <div className="container">

            <Input tipo="text" funcion={setUsuario} valor={usuario} text="Ingrese su usuario"></Input>
            
            <Boton o={registrar} text="Registrarse"></Boton>

          </div>
        }
      </div>


    </div>
  );
}
