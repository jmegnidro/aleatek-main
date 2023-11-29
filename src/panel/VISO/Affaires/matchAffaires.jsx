import FicheAffaire from "./FicheAffaire/FicheAffaire";
import MissionPrestation  from "./MissionPrestation/MissionPrestation";
import IT from "./IT/IT";
import Constructeur from "./Constructeurs/Constructeur";
import CTCRouter from "./CTC/CTCRouter";
import OuvrageDiffusion from "./OuvrageDiffusion/OuvrageDiffusion";

export let matchAffaires = {
    "CTC" : <CTCRouter/>,
    "Fiche Affaire": <FicheAffaire/>,
    "Missions": <MissionPrestation/>,
    "IT": <IT/>,
    "Constructeurs" : <Constructeur/>,
    "Ouvrages Diffusion" : <OuvrageDiffusion/>,
}