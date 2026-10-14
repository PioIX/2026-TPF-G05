export default function Input({funcion, text, tipo, teclado, valor}) {

    const update = (event) => {
        console.log(event)
        funcion(event.target.value)
    }

    return(
        <input
            type={tipo}
            onChange={update}
            placeholder={text}
        ></input>

    );
}
