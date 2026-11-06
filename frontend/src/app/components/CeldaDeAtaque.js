export default function CeldaDeAtaque({fila, columna, setPosicionAtaque, estado}) {

    function guardarPosicion(){
        
        setPosicionAtaque({fila: fila, columna: columna})

    }
    return (
        <>
            <button onClick={guardarPosicion} className="">{estado}</button>
        </>
        
    )
};
