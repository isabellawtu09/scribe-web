
import React from 'react';
import { useState, useRef, useEffect } from 'react';



export default function Landingpage(props){


    const {setAudio, setFile} = props
    const [recordingstatus, setRecordingstatus ] = useState("inactive")
    const [audioChunks, setAudiochunks] = useState([])
    const [duration, setDuration] = useState(0)


    const audioRecorder = useRef(null)

    const mimeType = "audio/webm"

    async function startRecording () { 

        let tempstream
        console.log("started recording")

        try{ // do this ( get access to the user's microphone ), else
            const streamdata = await navigator.mediaDevices.getUserMedia({
                audio : true,
                video: false // don't want the users videos
            })

            tempstream = streamdata
        }
        catch(err){ // do this, in case of error
            console.log("Couldn't succesfully record audio")
            return
        }
        // changing variable status
        
        setRecordingstatus("recording")

        // media recorder instance using the given stream of audio
        const media =  new MediaRecorder(tempstream, {type: mimeType})
        audioRecorder.current = media
        // start recording
        audioRecorder.current.start()
        let localAudiochunks = []
        audioRecorder.current.ondataavailable = (event) => {
            // no audio
            if(typeof event.data === 'undefined') {return}
            if(typeof event.size === 0) {return}
            // otherwise push local audio chunks into event array 
            localAudiochunks.push(event.data)
        }
        setAudiochunks(localAudiochunks)
    }


    async function stopRecording() {
        setRecordingstatus("inactive")

        console.log("Stop recording")

       audioRecorder.current.stop()

       audioRecorder.current.onstop = () =>  {
        const mediaBlob =  new Blob(audioChunks, {type: mimeType})
        setAudio(mediaBlob)
        // reseting audio chunks to default
        setAudiochunks([])
        setDuration(0)
       }
    }

    // recording count for users , to display clock
    useEffect(() => {
        if(recordingstatus === "inactive") { return}
        const interval = setInterval(() => {
            // incrementing curr value 
            setDuration(curr => curr + 1)
        }, 1000) // incremented every 1k milliseconds


        return () => clearInterval(interval)
    }, [recordingstatus]

)



return(

    <main className = 'flex-1 p-4 flex flex-col gap-3 text-center sm:gap-4  justify-center pb-10'>

    <h1 className = 'font-semibold text-5xl sm:text-6xl md:text-7xl'>Speech<span className = 'text-blue-400 bold'>Scribe</span></h1>
    <h3 className ='font-medium md:text-lg'>Record<span className = 'text-blue-400'> &rarr; </span>
    Transcribe<span className = 'text-blue-400'> &rarr; </span>
    Translate
    </h3>
    {/* aligns icone with text ,
    mx-auto = horizontal auto spacing of margin */}
    <button onClick ={recordingstatus === 'recording' ? stopRecording : startRecording} className = 'flex items-center text-base justify-between gap-2 mx-auto w-72 max-w-full my-4 spcialbutton px-4 py-2 rounded-lg'>
        <p className = 'text-blue-400'> {recordingstatus === "inactive"  ? "Record" : "Stop Recording" }</p>
        <div className = 'flex items-center gap-2'>
        {duration &&  ( // displaying seconds next to recording status displayed
            <p className = "text-sm"> {duration}s</p>
        )}
        <i className ={"fa-solid fa-microphone" + (recordingstatus === 'recording' ? 'text-rose-400' : "")}></i>
        </div>
    </button>
    {/* making sure text size stays relatively the same */}
    <p className = 'text-base'>Or <label className = 'lowercase text-blue-400 cursor-pointer hover:text-blue-600 duration-200'>Upload <input className = 'hidden' type ='file' accept='.mp3,.wave' onChange = {(e) => {
     const tempfile = e.target.files[0]
     setFile(tempfile)} }/>
    </label> an mp3 file</p>
    
    </main>
);



}