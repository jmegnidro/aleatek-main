import React, { Component } from 'react'
import axios from 'axios';
import LabelInput from '../../utils/LabelInput/LabelInput';
import LabelSelect from '../../utils/LabelSelect/LabelSelect';

class Etape5 extends Component {

  constructor(){
    super();

    this.state = {
      collaborateurs : [],
      medias : [],
      load : true
    }
  }

  componentDidMount(){
    axios.get(process.env.REACT_APP_STARTURIBACK + '/admin/collaborateurs/',
    { withCredentials: true}).then(response=>{
      let data = response.data.results;
      this.props.modifyField("charge_id", this.props.dataAffaire.charge_id || data[0].id);
      this.props.modifyField("assistant_id", this.props.dataAffaire.assistant_id || data[0].id);
      this.props.modifyField("chef_id", this.props.dataAffaire.chef_id || data[0].id);
      this.setState({collaborateurs : data, load: false});
    });
  }

  render(){
    return (
      <div>
        <div className='border border-gray-400 p-2 mb-2'>
  
          <div className='flex gap-6'>
            <LabelInput  label="N° Contrat" value={this.props.dataAffaire.numero_contrat} disabled/>
            <LabelInput label="N Plan" disabled value={1}/>
          </div>

          <LabelInput label="Libelle Affaire" value={this.props.dataAffaire.libelle} disabled/>
          <LabelInput label="Libelle Plan" value={this.props.dataPlan.libelle} disabled/>
 
        </div>
  
        <div className='border border-gray-400 p-2 mb-2'>
          {!this.state.load ? <LabelSelect label="Charge Affaire" onChange={(e)=>{
            this.props.modifyField("charge_id", e.target.value);
          }}  options={
            this.state.collaborateurs.reduce((prev, curr)=>{
              let key = curr.first_name + " " + curr.last_name;
              prev[key] = curr.id;
              return prev
            }, {})
          } value={this.props.dataAffaire.charge_id}/>
          : <span className='text-green-600'>Donnees en cours de chargement</span>}
        </div> 
  
        <div className='border border-gray-400 p-2 mb-2'>
          {!this.state.load ? <LabelSelect label="Assistante" onChange={(e)=>{
            this.props.modifyField("assistant_id", e.target.value);
          }}  options={
            this.state.collaborateurs.reduce((prev, curr)=>{
              let key = curr.first_name + " " + curr.last_name;
              prev[key] = curr.id;
              return prev
            }, {})
          } value={this.props.dataAffaire.assistant_id}/>
          : <span className='text-green-600'>Donnees en cours de chargement</span>}
        </div> 
  
        <div className='border border-gray-400 p-2 mb-2'>
        {!this.state.load ? <LabelSelect label="Chef de projet" onChange={(e)=>{
            this.props.modifyField("chef_id", e.target.value);
          }}  options={
            this.state.collaborateurs.reduce((prev, curr)=>{
              let key = curr.first_name + " " + curr.last_name;
              prev[key] = curr.id;
              return prev
            }, {})
          } value={this.props.dataAffaire.chef_id}/>
          : <span className='text-green-600'>Donnees en cours de chargement</span>}
        </div> 
  
      </div>
    )
  }
  
}

export default Etape5