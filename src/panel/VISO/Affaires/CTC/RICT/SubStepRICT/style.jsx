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

    codificationRMQ:{
        color : '#F00'
    },

    codificationF:{
        color : '#0F0'
    },

    codification:{
        color : '#000'
    },

    collaboratuer_to_send : {
        marginHorizontal : '50px',
        fontSize : '10px',
        marginVertical : '100px' 
    },
	dateRICT:{
		width: '100%',
		textAlign: 'center',
		marginTop: '20px',
		fontSize: '16px'
	},
	sommaire:{
		fontWeight: 'bold',
		fontSize: '16px',
		marginHorizontal: '50px',
		marginVertical: '10px'
	},
	sommaireAlign:{
		display: 'flex',
		flexDirection: 'column',
		marginHorizontal: '50px',
		fontSize: '12px',
	},
	allMission:{
		display: 'flex',
		flexDirection: 'column',
		marginHorizontal: '50px',
		fontSize: '12px',
		marginTop: '20px'
	},

	renseignementGeneraux:{
		marginHorizontal: '50px',
		fontSize: '12px',
		marginTop: '20px',
	},

    descriptionUnit:{
        marginVertical: '10px',
    },

    documentExamine:{
        marginHorizontal: '50px',
        fontSize: '12px',
        marginTop: '20px',
    },

    remarqueGenerale:{
        marginHorizontal: '50px',
        fontSize: '12px',
        marginTop: '20px',
    },

    headMission:{
        marginVertical: '20px',
        backgroundColor: '#888',
        color: '#fff',
    },

    bgGray:{
        backgroundColor: '#333',
        color: '#fff',
    },

    splitBoard:{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        // marginVertical: '10px',
    },

    splitBoardRowArticle:{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderTop: '1px #000 solid',
        // marginVertical: '10px',
    },

    width50:{
        width: '50%',
    },

    pointsExam:{
        marginHorizontal: '50px',
        fontSize: '12px',
        marginTop: '20px',
    },

    detailleMissionInfoScetion:{
        marginTop: '20px',
    },

    articleSpace:{
        marginTop: '10px',
    },

    marginVertical10:{
        marginVertical: '10px',
    },
});

export default styles;