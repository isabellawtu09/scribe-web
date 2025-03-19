
import React, {useState} from 'react';
import Transcription from './Transcription.jsx';
import Translation from './Translation.jsx';
export default function Information(){

const [tab, setTab] = useState('transcription')
return( 

<main className = ' items-center flex-1 p-4 flex flex-col gap-3 text-center sm:gap-4  whitespace-nowrap justify-center pb-10 max-w-prose-full mx-auto'>
<h1 className = 'font-semibold text-4xl sm:text-5xl md:text-6xl'>Your <span className = 'text-blue-400 bold' >Transcription </span> </h1>

<div className = 'grid grid-cols-2 flex mx-auto bg-white border-2 border-solid border-blue-400 shadow rounded-full items-center overflow-hidden'> 
<button onClick = {() => setTab('transcription')} className = {'px-4 py-1 duration-200 font-medium text-blue-400' + (tab === 'transcription' ? ' bg-blue-400  text-white': 'text-blue-400 hover:text-blue-600') }>Transcription</button>
<button onClick = {() => setTab('translation')} className = {'px-4 py-1 duration-200 font-medium text-blue-400' + (tab === 'translation' ? ' bg-blue-400  text-white': 'text-blue-400 hover:text-blue-600') }>Translation</button>
</div>

{tab === "transcription" ?
    (<Transcription/> ) :
    ( <Translation/>)

}





</main>



);


}