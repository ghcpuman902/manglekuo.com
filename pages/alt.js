import Head from 'next/head'
import Link from 'next/link'
import altStyles from '../styles/alt.module.css'
import {useEffect, useState, useRef} from 'react'

                    // DESCRIPTION CAN BE THIS LONG DESCRIPTION CAN BE THIS LONG DESCRIPTION CAN BE THIS LONG DESCRIPTION CAN BE THIS LONG ///////////
const description = "I'm Mangle Kuo, a web developer who has strong interest in design, photography, beer and city. Looking for a new job.";

function Animation() {
    const [showButtons, setShowButtons] = useState(false);

    useEffect(()=>{
        setTimeout(()=>{
            setShowButtons(true);
        },4000);
    },[]);

    function handleClick(e){
        console.log(e);
        e.target.currentTime = 0;
        e.target.play();
    }

    return (
        <>
            <video onClick={handleClick} className={altStyles.video} src="/images/Output6.mp4" width="820" height="880" autoPlay={true} muted={true} playsInline={true}>
            </video>
            {/* {showButtons && <a className={altStyles.replay}>Replay</a>} */}
        </>
    );
}

export default function alt() {

    const findMeeTextList = [
        "→ Find mee",
        "→ Gind mek",
        "→ Gond mck",
        "← Go d ack",
        "← Go dack",
        "← Go back"
    ];

    let fMInx = useRef(0);
    let [fMText, setFMText] = useState(findMeeTextList[fMInx.current]);

    function changeFindMeText(inc){
        let last = 0; // timestamp of the last render() call
        function render(now) {
            // console.log(now,fMInx+inc);
            if(fMInx.current+inc < 0 || fMInx.current+inc > findMeeTextList.length-1){

            }else{
                // console.log("inside",(now - last));
                if(!last || (now - last) >= 100) {
                    console.log("inside inside",(now - last),fMInx.current+inc);
                    last = now;
                    fMInx.current = fMInx.current+inc;
                    setFMText(findMeeTextList[fMInx.current]);
                }
                requestAnimationFrame(render);
            }
        }
        requestAnimationFrame(render);
    }

    function handleFindMeeClick(){

        if(fMInx.current == 0){
            changeFindMeText(1);
        }
        if(fMInx.current == findMeeTextList.length-1){
            changeFindMeText(-1);
        }
        
    }

  return (
    <>
        <Head>
            <title>Mangle Kuo</title>
            <meta name="Description" CONTENT={description} />
            <link rel="stylesheet" href="https://use.typekit.net/yor5kzq.css"></link>
        </Head>
        <div className={altStyles.whiteBG}>
            <section className={altStyles.main}>
                <Animation />
            </section>
            <section>
                <div className={altStyles.topLeft}>Mangle Kuo</div>
                <div className={altStyles.topRight}>Things I did</div>
                <div className={altStyles.bottomLeft}>Things I wrote</div>
                <div className={altStyles.bottomRight} onClick={handleFindMeeClick}>{fMText}</div>
            </section>
        </div>
    </>
  );
}

