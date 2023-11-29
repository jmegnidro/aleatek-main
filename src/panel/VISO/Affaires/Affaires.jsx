import React, { Component } from 'react'
import oilPump from '../../../assets/icon/oil-pump.png';
import MainModal from '../../../component/CreateAffaire.jsx/MainModal';
import LabelInput from '../../../component/utils/LabelInput/LabelInput';
import Button from '../../../component/utils/Button/Button';
import Table from '../../../component/utils/Table/Table';
import axios from 'axios';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setPlanAffaire } from '../../../planAffaireSlice';
import LabelSelect from '../../../component/utils/LabelSelect/LabelSelect';

function mapStateToProps(state) {
  const {planAffaire} = state
  return {
    affaireSelect : planAffaire.planAffaire
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      setPlanAffaire: (id_plan)=>dispatch(setPlanAffaire(id_plan)),
    },
    dispatch
  );
}

class Affaires extends Component {

  constructor(){
    super();
    this.state = {
      plan : [],
      plan_for_table : [],
      showModal : false,
      load : true
    }
  }

  async componentDidMount(){
    let {data} = await axios.get(process.env.REACT_APP_STARTURIBACK + '/detail_plan_affaire/');
    let table = data.map(dt => {
      return {
        "id" : dt.id,
        "Numero Affaire" : dt.affaire.numero,
        "Plan" : dt.numero,
        "Type" : dt.type,
        "Visites" : dt.visite,
        "Docs" : dt.doc,
        "Libelle Affaire" : dt.affaire.libelle,
        "Libelle Plan" : dt.libelle,
        "Ville" : dt.ville,
        "Nom CA" : dt.charge_affaire.nom,
        "Client" : dt.client,
        "Destination" : dt.batiment,
        "Risque" : dt.risque,
        "Montant tvx" : dt.prix,
        "Contrat du" : dt.affaire.date_contrat,
        "N Offre" : dt.affaire.numero_offre,
      }
    });

    this.setState({
      plan : data,
      plan_for_table : table,
      load : false
    })
  }

  render(){
    return (
      <>
        <div>
        {this.state.showModal && <MainModal handleClose={()=>{this.setState({showModal : false})}}/>}
        </div>
        <div className='w-full h-full'>
          <h1 className='border-t border-gray-400 p-1 bg-green-200 font-bold'>ALEATEK</h1>
          <nav className='flex justify-between border-t border-gray-400 p-1 bg-green-200'>
            <h2 className='text-blue-800 flex items-center'>
              <img src={oilPump} alt="OilPump" className='w-[2rem]'/>
              Affaires
            </h2>
          </nav>
  
          <div className='border-r-2 border-gray-500 p-1 font-thin m-1 shadow flex justify-between'>
            <h2>Listes des affaires</h2>
            <div className='flex gap-4'>
              <Button>Reset Filter</Button>
              <Button>Filtrer</Button>
              <Button action={()=>{this.setState({showModal : true})}}>Creer une affaire</Button>
            </div>
          </div>
  
          <div className='bg-gray-400 border-4 border-green-400 text-white text-sm'>
            <div className='flex'>
              <LabelInput label="N° Affaire" col/>
              <LabelInput label="Libelle Afaire" col/>
              <LabelInput label="Ville" col/>

            </div>
            <div className='flex gap-12'>
              <LabelSelect label="Type d'affaire"col options={{
                "CTC" : "CTC",
                "VT" : "VT"
              }}/>

              <LabelSelect label="Client" col/>

              <LabelSelect label="Destination" col/>

            </div>
          </div>
          <div className='text-sm mt-6'>
            { !this.state.load ?

              (this.state.plan_for_table.length!==0 ? <Table datas={this.state.plan_for_table} actionOnLine={(id)=>{
                localStorage.setItem("planAffaire", id)
              }}/> : "Aucun plan d'affaire")
            
              :

              <span>Donnee en cours de chargement</span>
            }
          </div>
        </div>
      </>
    )
  }
}

Affaires = connect(mapStateToProps, mapDispatchToProps)(Affaires)

export default Affaires