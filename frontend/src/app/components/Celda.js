export default function Celda({fila, columna, inicio, final, setInicio, setFinal, estado}) {

    function guardarPosicion(){
        if(inicio=={}){
            setInicio({fila: fila, columna: columna})
            
        }else{
            setFinal({fila: fila, columna: columna})
        }


    }

    return (
        <>
            <button onClick={guardarPosicion} className="">{estado}</button>
        </>
        
    )
};
