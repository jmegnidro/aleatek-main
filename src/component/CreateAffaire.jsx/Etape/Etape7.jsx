import React, { Component } from 'react'
import axios from 'axios';

class Etape7 extends Component {

  constructor(){
    super()

    this.state = {
      interventions : [],
      interventions_select : []
    }
  }

  componentDidMount(){
    axios.get(process.env.REACT_APP_STARTURIBACK + '/admin/intervention/technique',
    { withCredentials: true}).then(response=>{
      let data = response.data.results;
      this.setState({interventions : data});
    });
  }

  componentDidUpdate(){
    this.props.modifyField("intervention_technique", this.state.interventions_select);
  }

  render(){
    return (
      <div>
          <h2 className='text-sm font-bold text-center mb-4'>Retenir ici les intervention technique a recopier ou a selectionner</h2>

          <table className='text-sm border border-gray-600 w-full'>
            <thead>
              <tr>
                <td>Sel</td>
                <td>Libelle intervention technique</td>
              </tr>
            </thead>
            <tbody>
              {this.state.interventions.map((intervention, index)=>{
                return (
                  <tr key={index}>
                    <td>
                      <input type="checkbox" name="" id="" onClick={e=>{
                        if(e.target.checked){
                          if(!this.state.interventions_select.includes(intervention.id)){
                            this.setState({interventions_select: [...this.state.interventions_select, intervention.id]});
                          }
                        }else{
                          if(this.state.interventions_select.includes(intervention.id)){
                            this.setState({interventions_select: this.state.interventions_select.filter(dt=>dt!==intervention.id)});
                          }
                        }
                      }}/>
                    </td>
                    <td>
                      {intervention.libelle_it}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
      </div>
    )  
  }
}

export default Etape7