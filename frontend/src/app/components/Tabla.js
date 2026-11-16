// src/app/components/Tabla.js
export default function Tabla({barcos}) {
    // Placeholder visual listo para cuando implementes la lógica de grilla
    return (
        <div className="tablero-marco" data-inactivo={true}>
            <div className="tablero">
                <div className="tablero-columnas">
                    {["A","B","C","D","E","F","G","H","I","J"].map(l => <span key={l} className="coord coord-columna">{l}</span>)}
                </div>
                <div className="tablero-filas">
                    {[1,2,3,4,5,6,7,8,9,10].map(n => <span key={n} className="coord coord-fila">{n}</span>)}
                </div>
                <div className="tablero-celdas">
                    {Array.from({length: 100}).map((_, i) => <button key={i} className="celda" disabled />)}
                </div>
            </div>
        </div>
    )
}
