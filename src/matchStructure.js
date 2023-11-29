import Geographie from "./panel/Geographie/Geographie";
import Personel from "./panel/Personel/Personel";
import StatGene from "./panel/StatGene/StatGene";
import VISORouter from "./panel/VISO/VISORouter";

export let matchStructure  = {
    "Aleatek" : <VISORouter/>,
    "Statistiques Generales" : <StatGene/>,
    "Personel" : <Personel/>,
    "Geographie" : <Geographie/>,
};