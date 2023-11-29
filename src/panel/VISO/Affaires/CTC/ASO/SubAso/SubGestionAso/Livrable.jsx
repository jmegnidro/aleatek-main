import { Document, PDFViewer, Page, View, Image, Text } from '@react-pdf/renderer'
import React, { useEffect, useState } from 'react';
import logo from '../../../../../../../assets/images/aleatek.jpeg';
import axios from 'axios';
import Button from '../../../../../../../component/utils/Button/Button';

import styles from './style';

import mailjet from 'node-mailjet';

const matchAvis = {
    "F" : "Favorable",
    "RMQ" : "Remarque",
    "HM" : "Hors Mission",
    "VI" : "Vu pour Info"
}

function Livrable(props) {

    let [aso, setAso] = useState({});

    useEffect(()=>{
        (async () =>{
            let {data} = await axios.get(process.env.REACT_APP_STARTURIBACK + `/data_for_aso/${props.id}/`)

            setAso(data)

        })();
    }, [props.id])


    const ASO = (asos)=>{
        let {adresse} = asos.charge;
        let {charge} = asos
        let {codification} = asos
        let styleCodif;

        if(codification === 'F' || codification === 'RMQ'){
            styleCodif = codification === 'F' ? styles.codificationF : styles.codificationRMQ
        }else{
            styleCodif = styles.codification
        }

        console.log(styleCodif);

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
                                    ASO N{asos.aso.order_in_affaire}
                                </Text>
                                <Text>
                                    N° affaire : {asos.affaire.numero}
                                </Text>
                                <Text style={styles.blockAdress}>
                                    Mission(s) signée(s) : {asos.mission.reduce((prev, curr, index, arr)=>{
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
                                        Affaire : {asos.affaire.libelle}
                                    </Text>
                                </View>
                                <View style={styles.destinataireBlock}>
                                    <Text>
                                        Destinataire : {asos.client.raison_sociale}
                                    </Text>
                                </View>
                                <View style={styles.ouvrageBlock}>
                                    <Text>
                                        Ouvrage examnie : {asos.ouvrage.libelle}
                                    </Text>
                                    <Text style={styleCodif}>{matchAvis[codification]}</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                    {/* sous entete */}
                    <View style={styles.asoTitleFirstSection}>
                        <Text style={styles.titleAso}>ASO n°{asos.aso.order_in_affaire} | Avis sur Ouvrage| du {asos.aso.date}</Text>
                        <Text style={styles.constanteMiniSection}>
                            Dans le cadre de la mission qui nous a été confiée, veuillez trouver l'avis formulé sur l'ouvrage ou élément d'équipement faisant suite à
                            l'examen des documents d'exécution référencés ci-dessous.
                            Nous vous remercions de bien vouloir nous indiquer les suites qui seront données à nos observations. Les observations restées sans
                            suite seront reprises dans le rapport final.
                        </Text>
                    </View>

                    {/* Mapper les avis */}

                    {asos.documents.map((doc, index)=>{
                        return (
                            <View style={styles.avisMain} key={index}>
                                <View>
                                    <Text> {">"} Plan N {doc.document.nature} {doc.document.titre} {doc.document.numero_externe} {doc.document.numero_indice}</Text>
                                    {doc.avis.map((a,index)=>{
                                        return (
                                            <Text key={index}>{index+1}) {a.commentaire}</Text>
                                        )
                                    })}
                                    <Text>-------------------------------------------------------------------------------------------------------------------------------------------------------</Text>
                                </View>
                            </View>
                        )
                    })}
                    
                    {/* Fin Map */}

                    {/* Deuxieme sous en tete */}
                    <View style={styles.secondSousEnTete}>
                        <Text>
                            Document examine relatifs a l'ouvrage
                        </Text>
                        <Text>Examen</Text>
                    </View>

                    {asos.documents.map((doc, index)=>{
                        return (
                            <View style={styles.avisMainEnd} key={index}>
                                <View>
                                    <Text> {">"} Plan N {doc.document.nature} {doc.document.titre} {doc.document.numero_externe} {doc.document.numero_indice}</Text>
                                </View>
                                <View>
                                    <Text>{doc.codification}</Text>
                                </View>
                            </View>
                        )
                    })}

                    <View style={styles.collaboratuer_to_send}>
                            <View>
                                <Text>Envoye a </Text>
                            </View>
                        {
                            asos.collaborateurs.map((collab, index)=>{
                                return (
                                    <View >
                                        <Text>{collab.raison_sociale}</Text>
                                    </View>
                                )
                            })
                        }
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
                    {Object.keys(aso).length > 0 && ASO(aso)}
                </PDFViewer>
            </div>
        </div>
    )
}

export default Livrable