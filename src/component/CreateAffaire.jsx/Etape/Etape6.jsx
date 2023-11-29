import React, { Component } from 'react'
import axios from 'axios';

class Etape6 extends Component {

  constructor(){
    super()

    this.state = {
      constructeurs : [],
      constructeurs_select : []
    }
  }

  componentDidMount(){
    axios.get(process.env.REACT_APP_STARTURIBACK + '/admin/entreprise/registration/',
    { withCredentials: true}).then(response=>{
      let data = response.data.results;
      this.setState({constructeurs : data});
    });
  }

  componentDidUpdate(){
    this.props.modifyField("constructeurs", this.state.constructeurs_select);
  }

  render(){
    return (
      <div>
          <h2 className='text-sm font-bold text-center mb-4'>Retenir ici les constructeurs a recopier ou a selectionner</h2>

          <table className='text-sm border border-gray-600 w-full'>
            <thead>
              <tr>
                <td>Sel</td>
                <td>Raison Sociale</td>
              </tr>
            </thead>
            <tbody>
              {this.state.constructeurs.map((constructeur, index)=>{
                return (
                  <tr key={index}>
                    <td>
                      <input type="checkbox" name="" id="" onClick={e=>{
                        if(e.target.checked){
                          if(!this.state.constructeurs_select.includes(constructeur.id)){
                            this.setState({constructeurs_select: [...this.state.constructeurs_select, constructeur.id]});
                          }
                        }else{
                          if(this.state.constructeurs_select.includes(constructeur.id)){
                            this.setState({constructeurs_select: this.state.constructeurs_select.filter(dt=>dt!==constructeur.id)});
                          }
                        }
                      }}/>
                    </td>
                    <td>
                      {constructeur.raison_social}
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

export default Etape6