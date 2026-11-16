// src/app/components/Celda.js
export default function Celda({estado = "vacia", etiqueta, deshabilitada, alDisparar}) {
    const clases = ["celda", estado !== "vacia" && `celda-${estado}`].filter(Boolean).join(" ");
    return (
        <button className={clases} onClick={alDisparar} disabled={deshabilitada} title={etiqueta} />
    )
}