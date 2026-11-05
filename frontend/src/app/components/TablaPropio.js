import CeldaPropia from "./CeldaPropia"

export default function TablaPropio({tablero, setFinal, setInicio, final, inicio, deshabilitar}) {

    function renderizarCeldas(){
        let celdas= []
        let i=1
        for (let y = 0; y < 10; y++) {
            for (let x = 0; x < 10; x++) {
                i++
                celdas.push(
                <CeldaPropia
                key={i}
                fila={y}
                columna={x}
                inicio={inicio}
                final={final}
                setInicio={setInicio}
                setFinal={setFinal}
                estado={tablero[y][x]}
                deshabilitar={deshabilitar}
                ></CeldaPropia>)
                
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


            