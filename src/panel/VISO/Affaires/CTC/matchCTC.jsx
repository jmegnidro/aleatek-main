import ASO from "./ASO/ASO";
import Document from "./Document/Document";
import GestionCommentaire from "./GestionCommentaire/GestionCommentaire";
import RICT from "./RICT/RICT";
import RapportVisite from "./RapportVisite/RapportVisite";
import Synthese from "./Synthese/Synthese";
import SyntheAvis from "./SyntheseAvis/SyntheAvis";

export let matchCTC = {
    "Synthese des avis" : <Synthese/>,
    "ASO" : <ASO/>,
    "Documents" : <Document/>,
    "Rapports Visites" : <RapportVisite/>,
    "RICT" : <RICT/>,
    "Synthese des avis" : <SyntheAvis/>,
    "Gestion Commentaire" : <GestionCommentaire/>,
}