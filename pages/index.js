import Head from 'next/head'
import Link from 'next/link'
import aS from '../styles/alt.module.css'
import { useEffect, useState, useRef, useReducer } from 'react'
import copy from 'copy-to-clipboard';

// DESCRIPTION CAN BE THIS LONG DESCRIPTION CAN BE THIS LONG DESCRIPTION CAN BE THIS LONG DESCRIPTION CAN BE THIS LONG ///////////
const description = "I'm Mangle Kuo, a web developer who has strong interest in design, photography, beer and city. Looking for a new job.";

function AnimationVideoPlayer({replay}) {
    const e = useRef();
    // const isVideoPlaying = (v) => (!v.paused && !v.ended && v.readyState > 2);
    // const isVideoPlaying = (v) => (!v.paused);

    function handleClick() {
        e.current.currentTime = 0;
        if(e.current.paused){
            e.current.play();
        }
    }

    useEffect(()=>{
        e.current.currentTime = 0;
        if(e.current.paused){
            e.current.play();
        }
    },[replay]);

    return (
        <>
            <video ref={e} onClick={handleClick} className={aS.video} src="/images/Output6.mp4" width="820" height="880" autoPlay={true} muted={true} playsInline={true}>
            </video>
        </>
    );
}


function SocialLink({ type, link }) {
    const [isShowEmailCopied, setIsShowemailCopied] = useState(false);
    let typeChars = type.split("").map(
        (char) =>
            <span key={char + Math.random()}>
                {char}
            </span>
    );

    let copyEmail = (e) => {
        e.preventDefault();
        copy(link);
        setIsShowemailCopied(true);
        setTimeout(() => {
            setIsShowemailCopied(false);
        }, 6000);
    }
    if (type == "Email") {
        return (<a target="_blank" id="email" rel="noopener" href="#" onClick={(e) => { copyEmail(e) }}>
            <span className={aS.type}>{isShowEmailCopied ? (<>Email copied ✓</>) : (<>Copy Email</>)}</span>
        </a>);
    }
    return (<a target="_blank" rel="noopener" href={link}>
        <span className={aS.type}>{typeChars}</span>
    </a>);
}





// ========================================================================



const findMeeTextList = [
    "⇱ Find mee",
    "⇲ Go babe",
    "⇲ Go bass",
    "⇲ Go base",
    "⇲ Go bake",
    "⇲ Go back"
];
const findMeeTextListRev = [
    "⇱ Find mee",
    "⇱ Funk mee",
    "⇱ Find sea",
    "⇱ Fcuk mee",
    "⇱ Find wee",
    "⇲ Go back"
];

const initialState = {
    fMText: "⇱ Find mee",
    zIdx: [
        'FindmeeCover',
        'Findmee',
        'ThingsIdidCover',
        'ThingsIdid',
        'ThingsIwroteCover',
        'ThingsIwrote',
        'MangleKuo',
    ],
    isOpen: {
        ThingsIdidCover: false,
        ThingsIwroteCover: false,
        FindmeeCover: false,
    },

};

function reducer(state, action) {
    console.log(action);
    switch (action.type) {
        case 'setFMText':
            return { fMText: action.val, zIdx: state.zIdx, isOpen: state.isOpen };
        case 'showOverlay':
            let new_zIdx = [...state.zIdx];
            let i1, i2;
            switch (action.val) {
                case 'ThingsIdidCover':
                    i1 = new_zIdx.indexOf('ThingsIdid');
                    i2 = new_zIdx.indexOf('ThingsIdidCover');
                    if (i1 > -1) { new_zIdx.splice(i1, 1); }
                    if (i2 > -1) { new_zIdx.splice(i2, 1); }
                    new_zIdx.push('ThingsIdidCover');
                    new_zIdx.push('ThingsIdid');
                    return {
                        fMText: state.fMText,
                        zIdx: new_zIdx,
                        isOpen: {
                            ThingsIdidCover: true,
                            ThingsIwroteCover: false,
                            FindmeeCover: false,
                        }
                    };
                case 'ThingsIwroteCover':
                    i1 = new_zIdx.indexOf('ThingsIwrote');
                    i2 = new_zIdx.indexOf('ThingsIwroteCover');
                    if (i1 > -1) { new_zIdx.splice(i1, 1); }
                    if (i2 > -1) { new_zIdx.splice(i2, 1); }
                    new_zIdx.push('ThingsIwroteCover');
                    new_zIdx.push('ThingsIwrote');
                    return {
                        fMText: state.fMText,
                        zIdx: new_zIdx,
                        isOpen: {
                            ThingsIdidCover: false,
                            ThingsIwroteCover: true,
                            FindmeeCover: false,
                        }
                    };
                case 'FindmeeCover':
                    i1 = new_zIdx.indexOf('Findmee');
                    i2 = new_zIdx.indexOf('FindmeeCover');
                    if (i1 > -1) { new_zIdx.splice(i1, 1); }
                    if (i2 > -1) { new_zIdx.splice(i2, 1); }
                    new_zIdx.push('FindmeeCover');
                    new_zIdx.push('Findmee');
                    console.log(new_zIdx);
                    return {
                        fMText: state.fMText,
                        zIdx: new_zIdx,
                        isOpen: {
                            ThingsIdidCover: false,
                            ThingsIwroteCover: false,
                            FindmeeCover: true,
                        }
                    };
                case 'HideAll':
                    return {
                        fMText: state.fMText, zIdx: state.zIdx, isOpen: {
                            ThingsIdidCover: false,
                            ThingsIwroteCover: false,
                            FindmeeCover: false,
                        }
                    };
                default:
                    throw new Error();
            }
            return
        default:
            throw new Error();
    }
}



export default function Alt() {
    let fMInx = useRef(0);

    function changeFindMeText(inc) {
        let last = 0; // timestamp of the last render() call
        function render(now) {
            // console.log(now,fMInx+inc);
            if (fMInx.current + inc < 0 || fMInx.current + inc > findMeeTextList.length - 1) {

            } else {
                // console.log("inside",(now - last));
                if (!last || (now - last) >= (inc > 0 ? 120 : 200)) {
                    console.log("inside inside", (now - last), fMInx.current + inc);
                    last = now;
                    fMInx.current = fMInx.current + inc;
                    dispatch({ type: 'setFMText', val: inc > 0 ? findMeeTextList[fMInx.current] : findMeeTextListRev[fMInx.current] })
                }
                requestAnimationFrame(render);
            }
        }
        requestAnimationFrame(render);
    }

    const [state, dispatch] = useReducer(reducer, initialState);
    const [replayTrigger, setReplayTrigger] = useState(0);

    function handleMangleKuoClick() {
        setReplayTrigger(replayTrigger+1);
    }

    function handleThingsIdidClick() {
        if (state.isOpen.ThingsIdidCover) {
            dispatch({ type: 'showOverlay', val: 'HideAll' });
        }else{
            dispatch({ type: 'showOverlay', val: 'ThingsIdidCover' });
        }
    }

    function handleThingsIwroteClick() {
        setReplayTrigger(replayTrigger+1);
    }

    function handleFindmeeClick() {

        if (fMInx.current == 0) {
            changeFindMeText(1);
            dispatch({ type: 'showOverlay', val: 'FindmeeCover' });
        }
        if (fMInx.current == findMeeTextList.length - 1) {
            changeFindMeText(-1);
            dispatch({ type: 'showOverlay', val: 'HideAll' });
        }

    }

    let zIdx = (page) => {
        // get the z index of a fixed text, or a cover, for the css
        return state.zIdx.indexOf(page);
    }

    return (
        <>
            <Head>
                <title>Mangle Kuo</title>
                <meta name="Description" content={description} />
                <link rel="stylesheet" href="https://use.typekit.net/yor5kzq.css"></link>
                <meta key="theme-color-light" name="theme-color"
                    content="#ffffff"
                    media="(prefers-color-scheme: light)" />
                <meta key="theme-color-dark" name="theme-color"
                    content="#000000"
                    media="(prefers-color-scheme: dark)" />
            </Head>
            <main className={aS.main}>
                <section className={aS.videoSection}>
                    <AnimationVideoPlayer replay={replayTrigger} />
                </section>
                <section>
                    <div className={`${aS.MangleKuo} ${aS['z-' + zIdx('MangleKuo')]}`} onClick={handleMangleKuoClick}>
                        Mangle Kuo
                        <div className={aS.moon} />
                    </div>

                    <div className={`${aS.ThingsIdid} ${aS['z-' + zIdx('ThingsIdid')]}`} onClick={handleThingsIdidClick}>About me</div>
                    <div className={`${aS.ThingsIdidCover} ${aS['z-' + zIdx('ThingsIdidCover')]} ${state.isOpen.ThingsIdidCover ? aS.open : aS.closed}`}>
                        <div className={aS.ThingsIdidWrapper}>
                        {/* {
                            [
                                {slug:'ten-facts',title:'Ten Facts',url:''},
                                {slug:'who-is-that-person',title:'Who is that person',url:''},
                                {slug:'two-a-one-b',title:'2A1B',url:''},
                                {slug:'projectile',title:'Projectile',url:''},
                                {slug:'slay-the-queen',title:'Slay the Queen',url:''},
                            ].map((val,idx) => {
                                return (<div key={val.slug} className={aS.ThingsIdidBox}><h1>{val.title}</h1><div>IMAGE</div><figcaption>CAPTION</figcaption></div>);
                            })
                        } */}
                        Greetings, my name is Mangle Kuo, and I am a skilled full-stack developer with experience in project management and a passion for photography. In my free time, I enjoy exploring the city, listening to music, and savoring craft beer.
<br /><br />
After completing my studies in the UK, I returned to Taiwan and began working as a project manager for an AR glasses start-up. This company was later acquired by Foxconn, a global electronics manufacturer famous for assembling the iPhone. Through this experience, I gained valuable knowledge about hardware design and manufacturing.
<br /><br />
One of my greatest strengths is my broad knowledge of various fields and my ability to communicate effectively with people from different professional backgrounds. This skill was essential in my previous job, where we customized hardware and software solutions for a diverse range of clients, including fire-fighting departments and museums.
<br /><br />
As a people-oriented individual, I am seeking a full-stack developer role in a small company or start-up where I can put my coding skills to professional use. I believe that end-user feedback is crucial, and working in an environment that encourages open communication between the engineering team and end-users is essential for success.
<br /><br />
For my photos, please see my <a target="_blank" rel="noopener" href="https://www.instagram.com/ghcpuman902/">Instagram</a>, for my Photoshop/Illustrator works, please see my <a target="_blank" rel="noopener" href="https://www.behance.net/mangle-kuo">Behance</a>, for my coding work please see my <a target="_blank" rel="noopener" href="https://github.com/ghcpuman902">GitHub</a>. I also write on <a target="_blank" rel="noopener" href="https://manglekuo.medium.com">Medium</a>.
                        </div>
                    </div>

                    <div className={`${aS.ThingsIwrote} ${aS['z-' + zIdx('ThingsIwrote')]}`} onClick={handleThingsIwroteClick}>Re-animate</div>
                    {/* <div className={`${aS.ThingsIwroteCover} ${aS['z-' + zIdx('ThingsIwroteCover')]}`}></div> */}

                    <div className={`${aS.Findmee} ${aS['z-' + zIdx('Findmee')]}`} onClick={handleFindmeeClick}>{state.fMText}</div>
                    <div className={`${aS.FindmeeCover} ${aS['z-' + zIdx('FindmeeCover')]} ${state.isOpen.FindmeeCover ? aS.open : aS.closed}`}>
                        <div className={aS.findMeContentWrapper}>
                            <div className={aS.findMeContent}>
                                <SocialLink link="https://github.com/ghcpuman902" type="GitHub" tag="ghcpuman902" />
                                <SocialLink link="https://www.linkedin.com/in/manglekuo" type="LinkedIn" tag="Mangle Kuo" />
                                <SocialLink link="https://www.behance.net/mangle-kuo" type="Behance" tag="mangle-kuo" />
                                <SocialLink link="https://www.flickr.com/photos/65271177@N06/albums" type="Flickr" tag="Mangle Kuo" />
                                <SocialLink link="https://twitter.com/manglekuo" type="Twitter" tag="@MangleKuo" />
                                <SocialLink link="https://www.instagram.com/ghcpuman902/" type="Instagram" tag="@ghcpuman902" />
                                <SocialLink link="manglekuo@gmail.com" type="Email" tag="MangleKuo@gmail.com" />
                            </div>
                        </div>
                        {/* <img
                            className={aS.imgBG}
                            srcSet="elva-fairy-480w.jpg 480w,
                                    elva-fairy-800w.jpg 800w"
                            sizes="(max-width: 600px) 480px,
                                    800px"
                            src="elva-fairy-800w.jpg"
                            alt="Elva dressed as a fairy" /> */}
                    </div>

                </section>
            </main>
        </>
    );
}

