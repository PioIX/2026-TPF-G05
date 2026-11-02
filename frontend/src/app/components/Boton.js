

export default function Boton({funcion, text, deshabilitar}) {


    return(
        <button onClick={funcion} disabled={deshabilitar}>{text}</button>

    );
}