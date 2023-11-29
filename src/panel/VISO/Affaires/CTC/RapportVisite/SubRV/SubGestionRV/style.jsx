import {StyleSheet} from '@react-pdf/renderer'

const styles = StyleSheet.create({
    body : {
        width : '100%'
    },

    sectionImage:{
        alignItems: 'center',
    },

    image: {
      marginBottom: 20,
      width: 200,
      objectFit: 'cover',
    },

    sectionTextCoordonne : {
        fontSize : '10px',
        width : '50%',
        borderRight : '2px #888 solid'
    },

    sectionAffaireInfo : {
        fontSize : '12px',
        width : '50%'
    },

    marginLeftTab : {
        marginLeft : '14px'
    },

    headSectionFirst : {
        marginHorizontal : '50px',
        display : 'flex',
        flexDirection : 'row',
        gap : 4
    },

    asoTitleFirstSection : {
        marginTop : '10px',
        marginHorizontal : '50px',
        fontSize : '13px'
    },

    miniHead : {
        marginVertical : '4px'
    },

    blockAdress : {
        width : '150px'
    },

    blockMail : {
        marginVertical : '10px'
    },

    flexcol:{
        display: 'flex',
        flexDirection : 'col',
        marginVertical : '10px'
    },

    affaireBlock : {
        backgroundColor : '#888',
        padding : 8,
        marginBottom : 20
    },

    destinataireBlock : {
        padding : 8,
        marginBottom : 20
    },

    ouvrageBlock : {
        backgroundColor : '#888',
        padding : 8,
        marginBottom : 20
    },

    constanteMiniSection : {
        fontSize : '10px'
    },

    titleAso : {
        textAlign : 'center',
        padding : 6,
        backgroundColor : '#888'
    },

    secondSousEnTete : {
        backgroundColor : '#999',
        display  : 'flex',
        justifyContent : 'space-between',
        marginHorizontal : '50px',
        fontSize : '10px',
        flexDirection : 'row',
        padding : '8px',
        marginVertical : '40px'
    },

    avisMain : {
        marginHorizontal : '50px',
        fontSize : '10px',
        // flexDirection : 'row',
        // padding : '8px',
        marginVertical : '20px' 
    },

    avisMainEnd : {
        marginHorizontal : '50px',
        fontSize : '10px',
        flexDirection : 'row',
        // padding : '8px',
        display : 'flex',
        justifyContent : 'space-between'
    },

    codification:{
        color : '#F00'
    },

    collaboratuer_to_send : {
        marginHorizontal : '50px',
        fontSize : '10px',
        marginVertical : '100px' 
    },


    ouvrageTitleSection : {
        marginTop : '10px',
        marginHorizontal : '50px',
        fontSize : '13px',
        backgroundColor : '#888'
    },

    espaceVertical : {
        marginVertical : '50px'
    },

    marginH : {
        marginHorizontal : '50px'
    },

    objet : {
        fontSize : '11px',
        marginVertical : '5px'
    }

});

export default styles;