import Celda from "./Celda"

export default function Tabla({tablero, setFinal, setInicio, final, inicio}) {

    function renderizarCeldas(){
        let celdas= []
        let i=1
        for (let y = 0; y < 10; y++) {
            for (let x = 0; x < 10; x++) {
                i++
                celdas.push(
                <Celda
                key={i}
                fila={y}
                columna={x}
                inicio={inicio}
                final={final}
                setInicio={setInicio}
                setFinal={setFinal}
                estado={tablero[y][x]}
                ></Celda>)
                
            }
            
        }
        return celdas
    }

    return (
        <div className="tabla">
            {renderizarCeldas()}
        </div>
        
    )
};


            