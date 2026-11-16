export default function CeldaDeAtaque({fila, columna, setPosicionAtaque, estado}) {

    function guardarPosicion(){
        
        setPosicionAtaque({fila: fila, columna: columna})

    }

    let clase
    switch (estado) {
        case 0:
            clase=""
            break;
        case 1:

            clase="barcoUndido"
            
            break;
        case 2:
            clase="agua"
            
            break;

        default:
            break;
    }
    return (
        <> 
            <button onClick={guardarPosicion} disabled={estado!=0} className={clase}></button>
        </>
        
    )
};
