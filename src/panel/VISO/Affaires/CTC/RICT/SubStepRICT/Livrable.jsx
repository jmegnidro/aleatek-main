import { Document, PDFViewer, Page, View, Image, Text } from '@react-pdf/renderer'
import React, { useEffect, useState } from 'react';
import logo from '../../../../../../assets/images/aleatek.jpeg';
import axios from 'axios';
import Button from '../../../../../../component/utils/Button/Button';
import styles from './style.jsx';

import mailjet from 'node-mailjet';

function checkAvis(article) {

    if (article.data.avis && article.data.avis.commentaires && article.data.avis.commentaires.length > 0) {
        // Si des commentaires existent, vérifie s'il y en a un à suivre (a_suivre === true)
        return article.data.avis.commentaires.some((commentaire) => commentaire.a_suivre === true);
    }

    // Parcourez les enfants récursivement
    for (let i = 0; article.childs && (i < article.childs.length); i++) {
        if (checkAvis(article.childs[i])) {
            return true; // Si un enfant a un commentaire à suivre, renvoie true
        }
        // return checkAvis(article.childs[i]);
    }

    return false; // Si aucun commentaire à suivre n'est trouvé, renvoie false
}

function checkAvisLow(article) {

    console.log(article);

    // if (article.parent.id==15053) {
    //     console.log("fond avis");
    // }
    if (article.data.avis) {
        // il y a un avis
        // console.log("fond");
        return true;
    }

    // Parcourez les enfants récursivement
    for (let i = 0; article.childs && (i < article.childs.length); i++) {
        // console.log("child process");
        // console.log(article.childs[i]);
        if (checkAvisLow(article.childs[i])) {
            return true; // Si un enfant a un avis, renvoie true
        }
        // return checkAvis(article.childs[i]);
    }

    return false; // Si aucun avis n'est trouvé, renvoie false
}



function Livrable(props) {

    let [rict, setRict] = useState({});

    useEffect(()=>{
        (async () =>{
			let id = localStorage.getItem("planAffaire");

			let {data} = await axios.get(process.env.REACT_APP_STARTURIBACK + `/data_for_rict/${props.rict.id}/${id}/`)
			setRict(data);
        })();
    }, [props.id])

    const Articles = ({article})=>{

        if(checkAvis(article))
            return (
                <View>
                    <View style={styles.splitBoardRowArticle}>
                        <Text style={styles.width50}>{article && article.parent.titre}</Text>
                        <Text style={styles.width50}>{article && article?.data?.avis?.commentaires.reduce((prev, curr)=>{
                            prev += "- " + curr.commentaire + "\n"
                            return prev;
                        }, "")}</Text>
                    </View>
                    {
                        article && article.childs.map((curr, index)=>{
                            return (
                                <Articles article={curr}/>
                            )
                        })
                    }
                </View>
            )
        return <></>
    }

    const ArticlesAvisDispo=({article})=>{

    
        if(checkAvisLow(article))
        return (
            <View style={styles.articleSpace}>
                <View>
                    <Text>Article : {article.parent.titre}</Text>
                    <Text>Dispositions Prevus : {article.data && article.data.disposition && article.data.disposition.commentaire}</Text>
                    <Text>Avis : {article.data && article.data.avis && article.data.avis.codification}</Text>
                    {
                        article.data && article.data.avis && article.data.avis.commentaires.map(comment=>{
                            return (
                                <Text> - {comment.commentaire}</Text>
                            )
                        })
                    }
                </View>
                {
                    article && article.childs.map((curr, index)=>{
                        return (
                            <ArticlesAvisDispo article={curr}/>
                        )
                    })
                }
            </View>
        )
        return <></>
    
    }


    const RICT = (rict)=>{

		let {adresse} = rict.charge;
        let {charge, affaire, plan, descriptions, missions} = rict;
        let {codification} = "F";

        return (
            <Document>
                <Page size="A4" >
                    {/* En tete */}
                    <View>
                        {/* Logo section */}
                        <View  style={styles.sectionImage}>
                            <Image src={logo} style={styles.image}/>
                        </View>

                        {/* Head Section */}
                        <View style={styles.headSectionFirst}>
                            {/* Coordonne and data affaire */}
                            <View style={styles.sectionTextCoordonne}>
                                <Text style={styles.miniHead}>
                                    Coordonnees du responsable d'affaire
                                </Text>
                                <Text style={styles.blockAdress}>
                                    {
                                    adresse && (adresse.cplt_geo + " " + adresse.numero_voie +
                                    " " + adresse.lieu_dit + " " + adresse.code_postal + " " +
                                    adresse.ville + " " + adresse.pays + " " + adresse.departement 
                                    + " " + adresse.province)
                                    }
                                </Text>
                                <Text style={styles.blockMail}>
                                    {
                                        charge.email
                                    }
                                </Text>
                                <Text>
                                    Adresse postale :
                                </Text>
                                <Text style={styles.blockAdress}>
                                    
                                </Text>
                                <Text>
                                    RICT N : {rict.rict.id}
                                </Text>
                                <Text>
                                    N° affaire : {rict.rict.affaire}
                                </Text>
                                <Text style={styles.blockAdress}>
                                    Mission(s) signée(s) : 
									{rict.mission.reduce((prev, curr, index, arr)=>{
                                        prev += curr.code_mission
                                        if(index !== arr.length - 1)
                                        prev += ' - '
                                        return prev;
                                    }, '')}
                                </Text>
                                <View style={styles.flexcol}>
                                    <Text>
                                        Chargé d'affaire : {charge.email}
                                    </Text>
                                    <Text>
                                        Diffusé par : {charge.first_name + " " + charge.last_name}
                                    </Text>
                                    <Text>
                                        Intervenant technique : 
                                    </Text>
                                </View>
                            
                            </View>
                            {/* Affaire - Client - Ouvrage */}
                            <View style={styles.sectionAffaireInfo}>
                                <View style={styles.affaireBlock}>
                                    <Text>
                                        Affaire : {rict.affaire.libelle}
                                    </Text>
                                </View>
                                <View style={styles.destinataireBlock}>
                                    <Text>
                                        Destinataire : {rict.client.raison_sociale}
                                    </Text>
                                </View>
                            </View>
                        </View>
                        {/* Define RICT title and number */}
                        <View>
                            <View style={styles.dateRICT}>
                                <Text>
                                    Rapport Initial de Contrôle Technique
                                </Text>
                                <Text>
                                    En date du {rict.rict.date}
                                </Text>
                            </View>
                        </View>
                        {/* Sommaire */}
                        <View>
                            <Text style={styles.sommaire}>Sommaire</Text>
                            <View style={styles.sommaireAlign}>
                                <Text>1. Renseignement generaux</Text>
                                <Text>2. Description sommaire de l'ouvrage</Text>
                                <Text>3. Documents examines</Text>
                                <Text>4. Remarques genereales et synthese des avis formules sur le porjet</Text>
                                <Text>5. Liste des points examines par chapitre</Text>
                            </View>
                        </View>
                        {/* All Mission */}
                        <View style={styles.allMission}>
                            {rict.mission.map((curr, index)=>{
                                return <Text>{curr.code_mission} - {curr.libelle}</Text>;
                            })}
                        </View>
                        
                        {/* Renseignements generaux */}
                        <View style={styles.renseignementGeneraux}>
                            <Text>1. Renseignements generaux</Text>
                            <View>
                                <Text>Designation de l'opération : {affaire.libelle}</Text>
                                <Text>Debut des travaux : {plan.debut_chantier}</Text>
                                <Text>Valeur previsionnelle des travaux : {plan.prix} {plan.devise}</Text>
                            </View>
                        </View>

                        {/* Description sommaire de l'ouvrage */}
                        <View style={styles.renseignementGeneraux}>
                            <Text>2. Description sommaire de l'ouvrage</Text>
                            <View>
                                {descriptions.map((curr, index)=>{
                                    return (
                                        <View style={styles.descriptionUnit}>
                                            <Text style={styles.bgGray}>{curr.type}</Text>
                                            <Text>{curr.content}</Text>
                                        </View>
                                    )
                                })}
                            </View>
                        </View>

                        {/* Documents examines */}
                        <View style={styles.documentExamine}>
                            <Text>3. Documents examine</Text>
                        </View>

                        {/* REMARQUES GÉNÉRALES ET SYNTHÈSE DES AVIS FORMULÉS SUR LE PROJET */}

                        <View style={styles.remarqueGenerale}>
                            <Text>4. Remarques genereales et synthese des avis formules sur le projet</Text>
                            <View>
                                {
                                    missions.map((missionData, index)=>{
                                        const {mission, chapitre, articles} = missionData;
                                        return (
                                            <View>
                                                <View style={styles.headMission}>
                                                    <View style={styles.bgGray}>
                                                        <Text>{mission.code_mission} - {mission.libelle}</Text>
                                                    </View>                                                
                                                    <View>
                                                        <Text>{chapitre.code_mission} - {chapitre.libelle}</Text>
                                                    </View>
                                                </View>
                                                
                                                <View style={styles.splitBoard}>
                                                    <Text>Objet / article de référence</Text>
                                                    <Text>Avis</Text>
                                                </View>
                                                
                                                <View>
                                                    {
                                                        articles.map((article, index)=>{
                                                            return (
                                                                <Articles key={index} article={article}/>
                                                            )
                                                        })
                                                    }
                                                </View>
                                            </View>
                                        )
                                    })
                                }
                            </View>
                        </View>

                        {/* 5 - LISTE DES POINTS EXAMINÉS PAR CHAPITRE */}

                        <View style={styles.pointsExam}>

                            <Text> 5 - LISTE DES POINTS EXAMINÉS PAR CHAPITRE</Text>
                            <Text> Codes utilisés associés à nos avis</Text>
                            <Text> La signification des codes utilisés dans nos missions est la suivante :</Text>

                            <View style={styles.marginVertical10}>
                                <Text>F : Favorable</Text>
                                <Text>Les dispositions prévues dans les documents examinés n'appellent pas de remarque. Cet avis, formulé dans la limite des
                                        précisions fournies par ces documents, ne préjuge pas des avis qui pourront être émis lors des phases ultérieures.</Text>
                            </View> 

                            <View style={styles.marginVertical10}>
                                <Text>RMQ : Remarque</Text>
                            </View> 

                            <View style={styles.marginVertical10}>
                                <Text>SO : Sans Objet</Text>
                                <Text>L'indication Sans Objet s'applique aux articles réglementaires qui ne sont pas concernés par certaines dispositions ou
                                        lorsqu'ils ne comprennent pas d'installations techniques mentionnées dans le règlement de sécurité.</Text>
                            </View>

                            <View style={styles.marginVertical10}>
                                <Text>HM : Hors mission</Text>
                                <Text>L'examen des dispositions prévues dans les documents ne relève pas des missions qui nous ont été confiées. Cet examen
                                        peut, le cas échéant, faire l'objet de prestations complémentaires.</Text>
                            </View>                           

                            <View style={styles.marginVertical10}>
                                <Text>IM : Information manquante</Text>
                            </View>
                            
                            <View style={styles.detailleMissionInfoScetion}>
                                {
                                    missions.map((missionData, index)=>{
                                        return (
                                            <View>
                                                <Text  style={styles.headMission}>Mission : {missionData.mission.code_mission} {missionData.mission.libelle}</Text>
                                                <Text>Chapitre : {missionData.chapitre.code_mission} {missionData.chapitre.libelle}</Text>
                                                {
                                                    missionData.articles.map((article, index)=>{
                                                        return (
                                                            <ArticlesAvisDispo article={article}/>
                                                        )
                                                    })
                                                }
                                            </View>
                                        )
                                    })
                                }
                            </View>
                        </View>
                        

                    </View>
                </Page>
            </Document>
        )

    };

    let sendMail = ()=>{
        const apiKeyPublic = '79e11e01de3f49e101e4260e07f9dec4';
        const apiKeyPrivate = 'f7641ba38bc091b6be3f1f93cf3ac5f1';
        const senderEmail = 'anlyounesis@gmail.com';
        const recipientEmail = 'anlyounesis@gmail.com';

        const url = 'https://api.mailjet.com/v3.1/send';

        const data = {
            Messages: [
                {
                From: {
                    Email: senderEmail,
                    Name: 'Me',
                },
                To: [
                    {
                    Email: recipientEmail,
                    Name: 'You',
                    },
                ],
                Subject: 'My first Mailjet Email!',
                TextPart: 'Greetings from Mailjet!',
                HTMLPart: '<h3>Dear passenger 1, welcome to <a href="https://www.mailjet.com/">Mailjet</a>!</h3><br />May the delivery force be with you!',
                },
            ],
        };

        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Basic ${btoa(apiKeyPublic + ':' + apiKeyPrivate)}`,
            },
            body: JSON.stringify(data),
        })
        .then((response) => response.json())
        .then((result) => {
            console.log(result);
            // Traitez ici la réponse de la requête
        })
        .catch((error) => {
            console.error(error);
            // Traitez ici les erreurs de la requête
        }); 
    }

    
    return (
        <div>
            <h2 className='my-4 text-center font-bold text-lg'>Previsualisation du pdf</h2>

            <div className='h-[42rem]'>
                <PDFViewer style={{ height: '100%', width: '100%' }}>
                    {Object.keys(rict).length > 0 && RICT(rict)}
                </PDFViewer>
            </div>
        </div>
    )
}

export default Livrable