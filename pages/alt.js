import Head from 'next/head'
import Link from 'next/link'
import altStyles from '../styles/alt.module.css'
import {useEffect, useState, useRef, useReducer} from 'react'

                    // DESCRIPTION CAN BE THIS LONG DESCRIPTION CAN BE THIS LONG DESCRIPTION CAN BE THIS LONG DESCRIPTION CAN BE THIS LONG ///////////
const description = "I'm Mangle Kuo, a web developer who has strong interest in design, photography, beer and city. Looking for a new job.";

function AnimationVideoPlayer() {

    function handleClick(e){
        console.log(e);
        e.target.currentTime = 0;
        e.target.play();
    }

    return (
        <>
            <video onClick={handleClick} className={altStyles.video} src="/images/Output6.mp4" width="820" height="880" autoPlay={true} muted={true} playsInline={true}>
            </video>
        </>
    );
}


function SocialLink(props) {
    return (<a target="_blank" rel="noopener" href={props.link}>
        <span className={altStyles.type}>{props.type}</span>
        {/* <span className={altStyles.dot}></span>
        <span className={altStyles.tag}>{props.tag}</span> */}
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
    zOrder: [
            'FindmeeCover',
            'Findmee',
            'ThingsIdidCover',
            'ThingsIdid',
            'ThingsIwroteCover',
            'ThingsIwrote',
            'MangleKuo',
        ],
    isOpen:{
        ThingsIdidCover: false,
        ThingsIwroteCover: false,
        FindmeeCover: false,
    },

};

function reducer(state, action) {
    console.log(action);
    switch (action.type) {
        case 'setFMText':
        return {fMText: action.val,zOrder:state.zOrder,isOpen:state.isOpen};
        case 'showOverlay':
            let new_zOrder = [...state.zOrder];
            let i1,i2;
            switch (action.val) {
                case 'ThingsIdidCover':
                    i1 = new_zOrder.indexOf('ThingsIdid');
                    i2 = new_zOrder.indexOf('ThingsIdidCover');
                    if (i1 > -1) {new_zOrder.splice(i1, 1);}
                    if (i2 > -1) {new_zOrder.splice(i2, 1);}
                    new_zOrder.push('ThingsIdidCover');
                    new_zOrder.push('ThingsIdid');
                    return {
                        fMText:state.fMText,
                        zOrder:new_zOrder,
                        isOpen:{
                            ThingsIdidCover: true,
                            ThingsIwroteCover: false,
                            FindmeeCover: false,
                        }
                    };
                case 'ThingsIwroteCover':
                    i1 = new_zOrder.indexOf('ThingsIwrote');
                    i2 = new_zOrder.indexOf('ThingsIwroteCover');
                    if (i1 > -1) {new_zOrder.splice(i1, 1);}
                    if (i2 > -1) {new_zOrder.splice(i2, 1);}
                    new_zOrder.push('ThingsIwroteCover');
                    new_zOrder.push('ThingsIwrote');
                    return {
                        fMText:state.fMText,
                        zOrder:new_zOrder,
                        isOpen:{
                            ThingsIdidCover: false,
                            ThingsIwroteCover: true,
                            FindmeeCover: false,
                        }
                    };
                case 'FindmeeCover':
                    i1 = new_zOrder.indexOf('Findmee');
                    i2 = new_zOrder.indexOf('FindmeeCover');
                    if (i1 > -1) {new_zOrder.splice(i1, 1);}
                    if (i2 > -1) {new_zOrder.splice(i2, 1);}
                    new_zOrder.push('FindmeeCover');
                    new_zOrder.push('Findmee');
                    console.log(new_zOrder);
                    return {
                        fMText:state.fMText,
                        zOrder:new_zOrder,
                        isOpen:{
                            ThingsIdidCover: false,
                            ThingsIwroteCover: false,
                            FindmeeCover: true,
                        }
                    };
                case 'HideAll':
                    return {fMText:state.fMText,zOrder:state.zOrder,isOpen:{
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

    function changeFindMeText(inc){
        let last = 0; // timestamp of the last render() call
        function render(now) {
            // console.log(now,fMInx+inc);
            if(fMInx.current+inc < 0 || fMInx.current+inc > findMeeTextList.length-1){
    
            }else{
                // console.log("inside",(now - last));
                if(!last || (now - last) >= (inc>0?120:200)) {
                    console.log("inside inside",(now - last),fMInx.current+inc);
                    last = now;
                    fMInx.current = fMInx.current+inc;
                    dispatch({type: 'setFMText', val: inc>0?findMeeTextList[fMInx.current]:findMeeTextListRev[fMInx.current]})
                }
                requestAnimationFrame(render);
            }
        }
        requestAnimationFrame(render);
    }

    const [state, dispatch] = useReducer(reducer, initialState);

    function handleFindmeeClick(){

        if(fMInx.current == 0){
            changeFindMeText(1);
            dispatch({type: 'showOverlay', val: 'FindmeeCover'});
        }
        if(fMInx.current == findMeeTextList.length-1){
            changeFindMeText(-1);
            dispatch({type: 'showOverlay', val: 'HideAll'});
        }
        
    }

  return (
    <>
        <Head>
            <title>Mangle Kuo</title>
            <meta name="Description" content={description} />
            <link rel="stylesheet" href="https://use.typekit.net/yor5kzq.css"></link>
        </Head>
        <main className={altStyles.main}>
            <section className={altStyles.videoSection}>
                <AnimationVideoPlayer />
            </section>
            <section className={altStyles.fixedTexts}>                
                <div className={`${altStyles.MangleKuo} ${altStyles['z-'+state.zOrder.indexOf('MangleKuo')]}`}>Mangle Kuo</div>

                <div className={`${altStyles.ThingsIdid} ${altStyles['z-'+state.zOrder.indexOf('ThingsIdid')]}`}>Things I did</div>
                <div className={`${altStyles.ThingsIdidCover} ${altStyles['z-'+state.zOrder.indexOf('ThingsIdidCover')]}`}></div>

                <div className={`${altStyles.ThingsIwrote} ${altStyles['z-'+state.zOrder.indexOf('ThingsIwrote')]}`}>Things I wrote</div>
                <div className={`${altStyles.ThingsIwroteCover} ${altStyles['z-'+state.zOrder.indexOf('ThingsIwroteCover')]}`}></div>

                <div className={`${altStyles.Findmee} ${altStyles['z-'+state.zOrder.indexOf('Findmee')]}`} onClick={handleFindmeeClick}>{state.fMText}</div>
                <div className={`${altStyles.FindmeeCover} ${altStyles['z-'+state.zOrder.indexOf('FindmeeCover')]} ${state.isOpen.FindmeeCover?altStyles.open:altStyles.closed}`}>
                    <div className={altStyles.findMeContentWrapper}>
                        <div className={altStyles.findMeContent}>
                            <SocialLink link="https://twitter.com/manglekuo" type="Twitter" tag="@MangleKuo" />
                            <SocialLink link="https://github.com/ghcpuman902" type="GitHub" tag="ghcpuman902" />
                            <SocialLink link="https://www.instagram.com/ghcpuman902/" type="Instagram" tag="@ghcpuman902" />
                            <SocialLink link="https://www.instagram.com/manglekuo/" type="Instagram" tag="@manglekuo" />
                            <SocialLink link="https://www.behance.net/gallery/65814819/Collection-of-works" type="Behance" tag="mangle-kuo" />
                            <SocialLink link="https://www.flickr.com/photos/65271177@N06/albums" type="Flickr" tag="Mangle Kuo" />
                            <SocialLink link="https://www.linkedin.com/in/mangle-k-84198691/" type="LinkedIn" tag="Mangle Kuo" />
                            <SocialLink link="mailto:manglekuo@gmail.com" type="Email" tag="MangleKuo@gmail.com" />
                        </div>
                    </div>
                </div>

            </section>
        </main>
    </>
  );
}

