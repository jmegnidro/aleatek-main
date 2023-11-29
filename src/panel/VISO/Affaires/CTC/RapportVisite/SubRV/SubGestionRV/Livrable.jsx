import { Document, PDFViewer, Page, View, Image, Text } from '@react-pdf/renderer'
import React, { useEffect, useState } from 'react';
import logo from '../../../../../../../assets/images/aleatek.jpeg';
import axios from 'axios';
import Button from '../../../../../../../component/utils/Button/Button';

import styles from './style';



function Livrable(props) {

    let [rv, setRv] = useState({});

    useEffect(()=>{
        (async () =>{
            if(props.id !== undefined){
                let {data} = await axios.get(process.env.REACT_APP_STARTURIBACK + `/data_for_rv/${props.id}/`)
                setRv(data)
            }
        })();
    }, [props.id])


    const RV = (rv)=>{
        let {adresse} = rv.charge;
        let {charge} = rv
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
                                    Rapport de visite N{rv.rv.order_in_affaire}
                                </Text>
                                <Text>
                                    N° affaire : {rv.affaire.numero}
                                </Text>
                                <Text style={styles.blockAdress}>
                                    Mission(s) signée(s) : {rv.mission.reduce((prev, curr, index, arr)=>{
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
                                        Affaire : {rv.affaire.libelle}
                                    </Text>
                                </View>
                                <View style={styles.destinataireBlock}>
                                    <Text>
                                        Destinataire : {rv.client.raison_sociale}
                                    </Text>
                                </View>

                            </View>
                        </View>
                    </View>
                    {/* sous entete */}
                    <View style={styles.asoTitleFirstSection}>
                        <Text style={styles.titleAso}>RV n°{rv.rv.order_in_affaire} | Rapport de visite | du {rv.rv.date}</Text>
                        <Text style={styles.constanteMiniSection}>
                        Veuillez trouver ci-après les avis formulés sur les ouvrages ou éléments d'équipement suite à nos examens
                         sur chantier de la réalisation
                        des ouvrages.
                        Nous vous remercions de bien vouloir nous indiquer les suites qui seront données à nos observations. Les observations restées sans
                        suite seront reprises dans le rapport final.
                        </Text>
                    </View>

                    {/* Ensemble des commentaires sur les ouvrages */}
                    <View>
                        {
                            rv.ouvrages.map((ouvrage, index)=>{
                                return (
                                    <View key={index} style={styles.espaceVertical}>
                                        <Text style={styles.ouvrageTitleSection}>{ouvrage.libelle}</Text>
                                        <View>
                                            {ouvrage.all_avis.map((avis, index)=>{
                                                return (
                                                    <View key={index} style={styles.marginH}>
                                                        <Text style={styles.objet}>{avis.objet}</Text>
                                                        <View>
                                                            {
                                                                avis.comments.map((comment, index)=>{
                                                                    return (
                                                                        <View key={index}>
                                                                            <Text>{comment.commentaire}</Text>
                                                                            {comment.image && <Image src={`${process.env.REACT_APP_URIBACK}${comment.image}`} style={styles.image}/>}
                                                                        </View>
                                                                    )
                                                                })
                                                            }
                                                        </View>
                                                    </View>
                                                )
                                            })}
                                        </View>
                                    </View>
                                )
                            })
                        }
                    </View>
                    <View style={styles.collaboratuer_to_send}>
                        {
                            rv.collaborateurs && rv.collaborateurs.map((collab, index)=>{
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
    
    return (
        <div>
            <h2 className='my-4 text-center font-bold text-lg'>Previsualisation du pdf</h2>

            <div className='h-[42rem]'>
                <PDFViewer style={{ height: '100%', width: '100%' }}>
                    {Object.keys(rv).length > 0 && RV(rv)}
                </PDFViewer>
            </div>
        </div>
    )
}

export default Livrable