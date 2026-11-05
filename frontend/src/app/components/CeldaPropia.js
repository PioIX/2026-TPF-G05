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

    return (
        <>
            <button onClick={guardarPosicion} disabled={deshabilitar} className="">{estado}</button>
        </>
        
    )
};
