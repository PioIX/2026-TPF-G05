
import PartidaItem from "./PartidaItem"


export default function PartidasList({partidas, id_jugador}) {


    let items = []
    
    for (let i = 0; i < partidas.length; i++) {
        const element = partidas[i];
        

        items.push(

            <PartidaItem key={i} 
            nombre={element.nombre}
            id_partida={element.id_partida}
            id_jugador={id_jugador}
            id_ganador={element.id_ganador}
            
            
             
            ></PartidaItem>
        );
    }

    console.log(items)



    return(
        <>
            {partidas.length!=0? 
            items : 
            <p>No hay partidas</p>
            }
        </>
        
    );
}
