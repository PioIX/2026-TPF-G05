export default function Input({funcion, text, tipo, teclado, valor, className=""}) {
    const update = (event) => {
        funcion(event.target.value)
    }

    // Si 'valor' existe, usamos 'value' (controlado). Si no, usamos 'defaultValue' (no controlado).
    const propsInput = valor !== undefined 
        ? { value: valor } 
        : { defaultValue: "" };

    return(
        <input
            type={tipo}
            onChange={update}
            onKeyDown={teclado}
            placeholder={text}
            className={`input ${className}`.trim()}
            {...propsInput}
        />
    );
}