import Celda from "./Celda"

export default function Tabla({barcos}) {

    function renderizarCeldas(){
        let celdas= []
        for (let y = 0; y < 10; y++) {
            for (let x = 0; x < 10; x++) {
                celdas.push(
                <Celda
                
                ></Celda>)
                
            }
            
        }
    }

    return (
        <>
            {renderizarCeldas()}
        </>
        
    )
};


            