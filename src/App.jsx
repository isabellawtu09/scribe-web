import { useState, useRef, useEffect } from 'react';
import Landingpage from './components/Landingpage.jsx';
import Header from './components/Header.jsx';
import FileDisplay from './components/Filedisplay.jsx'
import Transcribe from './components/Transcribe.jsx'
import Information from './components/Information.jsx'

function App() {

const [file , setFile] = useState(null);
const [audio , setAudio] = useState(null);

const isthereAudio = file || audio

const [output, setOutput] = useState(null);
const [loading,setLoading] = useState(false);
const [finished, setFinished] = useState(false);
const[downloading, setDownloading] = useState(false);

function handleAudioReset(){

  setFile(null);
  setAudio(null);
}



const worker =  useRef(null)
useEffect(() => {
  if(!worker.current) { worker.current = new Worker(new URL('./utils/whisper.worker.js', import.meta.url), {type: 'module'})}




  const onMessageRecieved = async(e) => {

    switch(e.data.type) {
      case "DOWNLOADING":
        setDownloading(true)
        console.log("DOWNLOADING")
        break;
  
    
      case "LOADING":
        setLoading(true)
        console.log("LOADING")
        break;
  
      case "RESULT":
        setOutput(e.data.results)
        console.log("RESULT")
        console.log(e.data.results)
        break;
  
      case "INFERENCE_DONE":
        setFinished(true)
        console.log("INFERENCE DONE")
        break;
  
    }
  }



  worker.current.addEventListener('message' , onMessageRecieved)

  return() => worker.current.removeEventListener('message', onMessageRecieved)


}, [])

async function readAudioFrom(file) {
  const sample_rate = 16000
  const audioCTX = new AudioContex({samplerate: sample_rate }) 
  const response = await file.arrayBuffer()
  const decoded = await audioCTX.decodeAudioData(response)
  const audio = decoded.getChannelData(0)
  return audio
}


async function handleFormSubmission(){


if(!file && !audio){ return}

let audio = await readAudioFrom(file ? file : audio)
const model_name = `openai/whisper-tiny.en`
worker.current.postMessage({
  type: MessageTypes.INFERENCE_REQUEST,
  audio,
  model_name
})
}

 return(
  <div className = 'flex flex-col p-4 max-w-[1000px] mx-auto w-full'> 
      {/* 100% visible height = screen, mopves root bg to entire page 
      positioning flex items vertically with = flex-col */}
    <section className = 'min-h-screen flex flex-col'>
      <Header/>
      { output ?  ( <Information/> ) : loading ? (<Transcribe/>) : isthereAudio ? (
        
        <FileDisplay handleAudioReset = {handleAudioReset} file = {file} audio = {setAudio} />

      ) : 

      (<Landingpage setFile = {setFile} setAudio = {setAudio} /> )}
      {/* conditional rendering of the landingpage */}
      {/* if there is an audio stream render the filedisplay component if not
      return the landing page component to allow incoming audio stream */}
  
    </section>
 
  <footer> 
  </footer>
  </div>
  
  );
}

export default App
