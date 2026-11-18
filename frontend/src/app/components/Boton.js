export default function Boton({funcion, text, deshabilitar, clase}) {
    return(
        <button onClick={funcion} disabled={deshabilitar} className={clase ? "boton " + clase : "boton"}>{text}</button>
    );
}