/**
 * Make Panel Struture
 * @param {Object} structures
 * @returns {String}
 */

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretRight } from "@fortawesome/free-solid-svg-icons";
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";
import {matchIcon} from './matchIcon';

export let panelMaker = (structures, ancestor)=>{
    if(Object.keys(structures).length === 0)
        return "";

    return (
        <ul className={ancestor ? "px-8" : ""}>
            {Object.keys(structures).map((structure, index)=>{
                let path = `${ancestor ? '/'+ancestor : ''}${'/'+structure}`;
                let pathBefore = `${ancestor ? '/'+ancestor : ''}`;
                let reelPath = window.location.pathname.replace('%', ' ');
                // let blocPathEnd = reelPath.split('/')[reelPath.split('/').length - 1];
                
                return (
                    <li key={index} className={reelPath.includes(pathBefore) ? 'my-1' : 'my-1 hidden'}>
                        <a href={path} className="whitespace-nowrap flex" >
                            {Object.keys(structures[structure]).length === 0 ? '' : 
                                (reelPath.includes(structure) ? <FontAwesomeIcon icon={faCaretDown}/> : <FontAwesomeIcon icon={faCaretRight} />)
                            }
                            {structure in matchIcon ? (<img src={matchIcon[structure]} className="w-6" alt='i'/>) : ''}
                            {structure}
                        </a>
                        {panelMaker(structures[structure], ancestor ? ancestor+'/'+structure : structure)}
                    </li>
                )
            })}
        </ul>
    )
};