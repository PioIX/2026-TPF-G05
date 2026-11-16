export default function Boton({funcion, text, className=""}) {
    return(
        <button onClick={funcion} className={`boton ${className}`.trim()}>{text}</button>
    );
}