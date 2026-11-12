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
            clase=""
            break;
        case 1:
            clase="barco"
            
            break;
        case 2:
            clase="barcoUndido"
            
            break;
        case 3:
            clase="agua"
            
            break;
    
        default:
            break;
    }
    
    return (
        <>
            <button onClick={guardarPosicion} disabled={deshabilitar} className={clase}></button>
        </>
        
    )
};
