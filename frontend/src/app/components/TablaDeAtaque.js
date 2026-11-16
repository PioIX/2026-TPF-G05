import CeldaDeAtaque from "./CeldaDeAtaque"

export default function TablaDeAtaque({tablero, setPosicionAtaque}) {

    function renderizarCeldas(){
        let celdas= []
        let i=1
        for (let y = 0; y < 10; y++) {
            for (let x = 0; x < 10; x++) {
                i++
                celdas.push(
                <CeldaDeAtaque
                key={i}
                fila={y}
                columna={x}
                setPosicionAtaque={setPosicionAtaque}
                estado={tablero[y][x]}
                ></CeldaDeAtaque>)
                
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


            