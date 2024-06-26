'use client';
import aS from './index.module.css'
import { useEffect, useState, useRef, useReducer, Suspense } from 'react'
import copy from 'copy-to-clipboard';
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

function AnimationVideoPlayer({ replay }) {
    const e = useRef();
    // const isVideoPlaying = (v) => (!v.paused && !v.ended && v.readyState > 2);
    // const isVideoPlaying = (v) => (!v.paused);

    function handleClick() {
        e.current.currentTime = 0;
        if (e.current.paused) {
            e.current.play();
        }
    }

    useEffect(() => {
        e.current.currentTime = 0;
        if (e.current.paused) {
            e.current.play();
        }
    }, [replay]);

    return (
        <>
            <video ref={e} onClick={handleClick} className={aS.video} src="/images/Output6.mp4" width="820" height="880" autoPlay={true} playsInline={true} muted={true}>
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

function SearchParamsHandler() {
    const searchParams = useSearchParams()

    useEffect(() => {
        if (searchParams.has('findme')) {
            handleFindmeeClick()
        }
    }, [])

    return (<></>);
}

export default function Page() {


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

    // function handleMangleKuoClick() {
    //     setReplayTrigger(replayTrigger+1);
    // }

    // function handleThingsIdidClick() {
    //     if (state.isOpen.ThingsIdidCover) {
    //         dispatch({ type: 'showOverlay', val: 'HideAll' });
    //     }else{
    //         dispatch({ type: 'showOverlay', val: 'ThingsIdidCover' });
    //     }
    // }

    function handleThingsIwroteClick() {
        setReplayTrigger(replayTrigger + 1);
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
            <section className={aS.videoSection}>
                <AnimationVideoPlayer replay={replayTrigger} />
            </section>
            <section>

                <Link href="/aboutme"><div className={`${aS.ThingsIdid} ${aS['z-' + zIdx('ThingsIdid')]}`}>About me</div></Link>
                <div className={`${aS.ThingsIdidCover} ${aS['z-' + zIdx('ThingsIdidCover')]} ${state.isOpen.ThingsIdidCover ? aS.open : aS.closed}`}>
                    <div className={aS.ThingsIdidWrapper}>
                        <div className={aS.AboutMeTextWrapper}>
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
                            Greetings! My name is Mangle Kuo, and I am a versatile full-stack developer with a strong background in project management and a passion for AR/XR technologies. In my leisure time, I enjoy urban exploration, photography, music, and indulging in craft beer.
                            <br /><br />
                            After completing my studies in the UK, I returned to Taiwan and took on a project management role at an AR glasses start-up, which was later acquired by Foxconn, a global electronics manufacturer renowned for assembling the iPhone. This experience provided me with invaluable insights into hardware design and manufacturing.
                            <br /><br />
                            One of my key strengths is my comprehensive knowledge across various domains and my ability to communicate effectively with professionals from diverse backgrounds. This skill proved vital in my previous role, where we tailored hardware and software solutions for a wide array of clients, including fire-fighting departments and museums.
                            <br /><br />
                            As a people-oriented individual, I am seeking opportunities in AR/XR project management or full-stack/front-end web development roles within innovative companies that value open communication and end-user feedback. I believe that fostering a strong connection between the engineering team and end-users is crucial for success.
                            <br /><br />
                            Please explore my <a target="_blank" rel="noopener" href="https://www.instagram.com/manglekuo/">Instagram</a> for photography, my <a target="_blank" rel="noopener" href="https://www.behance.net/manglekuo">Behance</a> for Photoshop/Illustrator works, my <a target="_blank" rel="noopener" href="https://github.com/ghcpuman902">GitHub</a> for coding projects, and my <a target="_blank" rel="noopener" href="https://manglekuo.medium.com">Medium</a> for written articles.
                            <br /><br />
                            I am currently seeking job opportunities, so if you are interested, please feel free to get in touch here: <SocialLink link="manglekuo@gmail.com" type="Email" tag="MangleKuo@gmail.com" />. Thank you in advance!
                        </div>
                    </div>
                    {/* https://manglekuo.com/androidlangxmlsearch/index.html */}
                </div>

                <div className={`${aS.ThingsIwrote} ${aS['z-' + zIdx('ThingsIwrote')]}`} onClick={handleThingsIwroteClick}>Re-animate</div>
                {/* <div className={`${aS.ThingsIwroteCover} ${aS['z-' + zIdx('ThingsIwroteCover')]}`}></div> */}

                <div className={`${aS.Findmee} ${aS['z-' + zIdx('Findmee')]}`} onClick={handleFindmeeClick}>{state.fMText}</div>
                <div className={`${aS.FindmeeCover} ${aS['z-' + zIdx('FindmeeCover')]} ${state.isOpen.FindmeeCover ? aS.open : aS.closed}`}>
                    <div className={aS.findMeContentWrapper}>
                        <div className={aS.findMeContent}>
                            <SocialLink link="https://github.com/ghcpuman902" type="GitHub" tag="ghcpuman902" />
                            <SocialLink link="https://www.linkedin.com/in/htkuo" type="LinkedIn" tag="Mangle Kuo" />
                            <SocialLink link="https://www.behance.net/manglekuo" type="Behance" tag="manglekuo" />
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
            <Suspense>
                <SearchParamsHandler />
            </Suspense>
        </>
    );
}

