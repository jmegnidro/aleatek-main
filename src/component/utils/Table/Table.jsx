import { faCaretRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react'

function Table(props) {
    const [cursor, setCursor] = useState(0);
    
    return (
        <table className='table-auto w-full'>
            <thead>
                <tr className='bg-gray-600 text-white'>
                    <th className='shadow-lg w-[1rem] p-1 border-r border-white'></th>
                    {Object.keys(props.datas[0]).map((head, index)=>{
                        return <th key={index} className='p-1 border-r border-white'>{head}</th>
                    })}
                </tr>
            </thead>
            <tbody>
                {props.datas.map((data, index)=>{
                    return (
                        <tr key={index} className={'cursor-pointer border-b border-gray-400 ' + (cursor===index && 'bg-cyan-200')} onClick={()=>{
                            setCursor(index)
                            if(props.actionOnLine){
                                props.actionOnLine(data.id)
                            }
                        }}>
                            <td className='shadow-lg w-[1rem] border-r border-gray-400'>
                                {cursor === index && <FontAwesomeIcon icon={faCaretRight}/>}
                            </td>
                            {
                                Object.values(data).map((dt, index)=>{
                                    return <td key={index} className='border-r border-gray-400'>{dt}</td>
                                })
                            }
                        </tr>
                    )
                })}
            </tbody>
        </table>
    )
}

export default Table