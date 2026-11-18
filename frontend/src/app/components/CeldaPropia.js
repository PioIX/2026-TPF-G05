export default function CeldaPropia({fila, columna, inicio, final, setInicio, setFinal, estado, deshabilitar}) {
    function guardarPosicion(){
        if(!inicio){
            setInicio({fila: fila, columna: columna})
            console.log("inicio guardado")
        }else{
            setFinal({fila: fila, columna: columna})
            console.log("final guardado")
        }
    }
    let clase
    switch (estado) {
        case 0:
            clase="celda"
            break;
        case 1:
            clase="celda barco"
            break;
        case 2:
            clase="celda barcoUndido"
            break;
        case 3:
            clase="celda agua"
            break;
        default:
            break;
    }
    if (inicio && inicio.fila == fila && inicio.columna == columna) {
        clase = clase + " seleccionada"
    }
    return (
        <>
            <button onClick={guardarPosicion} disabled={deshabilitar} className={clase}></button>
        </>
    )
};