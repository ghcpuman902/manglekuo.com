import Head from 'next/head'
import Link from 'next/link'
import altStyles from '../styles/alt.module.css'
import {useEffect, useState} from 'react'

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
            <video onClick={handleClick} className={altStyles.video} src="/images/Output5_1.mp4" width="820" height="880" autoPlay={true} muted={true} playsInline={true}>
            </video>
            {/* {showButtons && <a className={altStyles.replay}>Replay</a>} */}
        </>
    );
}

export default function alt() {
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
                <div className={altStyles.topRight}>Projects</div>
                <div className={altStyles.bottomLeft}>List of blogs</div>
                <div className={altStyles.bottomRight}>→ Ways to find me</div>
            </section>
        </div>
    </>
  );
}