"use client"
import { useSearchParams } from "next/navigation";
import { useState } from 'react';
import { useRouter } from "next/navigation";
import Input from "../components/Input"
import Boton from '../components/Boton';
export default function adminPage() {
    const searchParams = useSearchParams();
    const id_jugador = searchParams.get("id_jugador")
    const correoJugador = searchParams.get("correoJugador")
    const router = useRouter();
    const [clave, setClave] = useState("");
    const [usuarios, setUsuarios] = useState([]);
    const [entrado, setEntrado] = useState(false);
    function entrar() {
        fetch(`http://localhost:4000/adminUsuarios?clave=${clave}`)
        .then(response => response.json())
        .then(data => {
            if(data.ok){
                setUsuarios(data.respuesta)
                setEntrado(true)
            }else{
                alert("Clave incorrecta")
            }
        })
    }
    function borrarUsuario(id) {
        fetch('http://localhost:4000/adminBorrarUsuario', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ clave: clave, id_jugador: id })
        })
        .then(response => response.json())
        .then(data => {
            if(data.ok){
                let copia = []
                usuarios.forEach((u) => {
                    if(u.id_jugador != id){
                        copia.push(u)
                    }
                })
                setUsuarios(copia)
            }else{
                alert("No se pudo borrar")
            }
        })
    }
    function renderizarUsuarios() {
        let items = []
        for (let i = 0; i < usuarios.length; i++) {
            const element = usuarios[i];
            items.push(
                <tr key={i}>
                    <td>{element.id_jugador}</td>
                    <td>{element.usuario}</td>
                    <td>{element.correo}</td>
                    <td><Boton funcion={() => borrarUsuario(element.id_jugador)} text="Eliminar" clase="botonRojo botonChico"></Boton></td>
                </tr>
            )
        }
        return items
    }
    function volver() {
        if(id_jugador){
            router.push(`/menuDePartidas?id_jugador=${id_jugador}&correoJugador=${correoJugador}`)
        }else{
            router.push("/")
        }
    }
    return (
        <main className="pantallaAdmin">
            <header className="barraSuperior">
                <p className="marcaBarra">Batalla Naval</p>
                <Boton funcion={volver} text="Volver" clase="botonVolver"></Boton>
            </header>
            <div className="contenidoAdmin">
                <h2 className="tituloVista">Administración</h2>
                {!entrado && (
                    <div className="cardAdmin">
                        <div className="campo">
                            <label className="etiqueta">Clave de administrador</label>
                            <Input tipo="password" funcion={setClave} text="Ingrese la clave"></Input>
                        </div>
                        <Boton funcion={entrar} text="Entrar" clase="botonAzul botonAncho"></Boton>
                    </div>
                )}
                {entrado && (
                    <div className="marcoTablaAdmin">
                        <table className="tablaAdmin">
                            <thead>
                                <tr>
                                    <th>Id</th>
                                    <th>Usuario</th>
                                    <th>Correo</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {renderizarUsuarios()}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </main>
    );
}