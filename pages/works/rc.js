import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import {useEffect, useState, useRef} from 'react';
import { SVG, extend as SVGextend, Element as SVGElement } from '@svgdotjs/svg.js'

import rS from '../../styles/rc.module.css'

function InputBox(){
    const [down,setDown] = useState(false);
    const [moved,setMoved] = useState(false);
    let handlePointer = (e,o) => {
        e.preventDefault();
        switch (o) {
            case 0:
                console.log("DOWN");
                setDown(true);
            break;
            case 1:
                if(down){
                    e.target.value="MOVED";
                    console.log(e);
                    setMoved(true);
                }
            break;
            case 2:
                console.log("UPED");
                setDown(false);
                if(moved){
                    console.log("DRAGGED");
                }else{
                    console.log("CLICKED");
                }
                setMoved(false);
            break;
            case 3:
                console.log(e.target.value=500);
            break;
            case 4:
                console.log(e.target.value=600);
            break;
            
        
            default:
                break;
        }
    };
    return (
        <input className={rS.InputBox} onPointerDown={(e)=>{handlePointer(e,0)}} onPointerMove={(e)=>{handlePointer(e,1)}} onPointerUp={(e)=>{handlePointer(e,2)}} type="text" value="150" readOnly={true} />
    );
}


function SaveLink({svgStr}){
    const [downloadLink, setDownloadLink] = useState('');
    useEffect(()=>{
        if(typeof window !== 'undefined' && typeof svgStr !== 'undefined'){
            let data;
            try {
                data = new Blob([svgStr], { type: 'text/plain' });
                
            } catch (error) {
                console.log('svgStr',svgStr);
                console.error(error);
            }
            setDownloadLink(window.URL.createObjectURL(data));
        }
    },[svgStr]);
    return (
      <div style={{textAlign: 'center'}}>
        <a download='your-funky-shape.svg' href={downloadLink}>Save as SVG</a>
      </div>
    );

}

function RenderSVG() {
    const [winSize, setWinSize] = useState({w:500,h:500});
    const [w, setW] = useState(200);
    const [h, setH] = useState(360);
    const [res, setRes] = useState(3);
    const controlW = 500;
    // might change if fancy button is used

    const wRef = useRef(null);
    const hRef = useRef(null);
    const resRef = useRef(null);

    // svg styles
    const [svgS, setSvgS] = useState({
        bg: '#000000',
        rc: '#ff0000',
        se: '#ffff00',
        bc: '#0fffff',
        fg: '#0000ff',
        mbm: 'screen',
    });
    const svgSbgRef = useRef(null);
    const svgSrcRef = useRef(null);
    const svgSseRef = useRef(null);
    const svgSbcRef = useRef(null);
    const svgSfgRef = useRef(null);
    const svgSmbmRef = useRef(null);

    // Rounded Corner
    const [rc_r, setRc_r] = useState(5);
    const rc_rRef = useRef(null);

    // Superellipse
    const [se_n, setSe_n] = useState(2.9);
    const se_nRef = useRef(null);

    // Bazier Curve
    const [bc_r, setBc_r] = useState([0.5]);
    const bc_rRef = useRef(null);
    const [bc_o, setBc_o] = useState(4);
    const bc_oRef = useRef(null);

    // FG-Squircle
    const [fg_s, setFg_s] = useState(0.2);
    const fg_sRef = useRef(null);

    // For saving
    const [svgDlStr, setSvgDlStr] = useState('');


    useEffect(()=>{
        if(typeof window !== 'undefined'){
            
            setWinSize({w:window.innerWidth-controlW<controlW?window.innerWidth:window.innerWidth-controlW, h:window.innerHeight});
            window.addEventListener('resize', ()=>{
                setWinSize({w:window.innerWidth-controlW<controlW?window.innerWidth:window.innerWidth-controlW, h:window.innerHeight});
            });
        }
    },[]);


    useEffect(()=>{
        let shorterEdge = window.innerWidth-controlW<controlW?
                            (window.innerWidth)<window.innerHeight?(window.innerWidth):window.innerHeight:
                            (window.innerWidth-controlW)<window.innerHeight?(window.innerWidth-controlW):window.innerHeight;
        shorterEdge*=0.618;
        let ratio = w/h;
        setW(shorterEdge >> 1);
        setH(shorterEdge/ratio >> 1);
    },[winSize]);

    useEffect(()=>{
        let start = performance.now();

        const c = SVG().addTo('#svgCanvas').size(winSize.w, winSize.h);
            
        function CoorArr2svgPath(arr){
            let svgPathStr = "";
            svgPathStr += `M ${arr[0].x},${arr[0].y} L`;
            for(var i=1;i<arr.length;i++){
                svgPathStr += ` ${arr[i].x},${arr[i].y}`;
            }
            svgPathStr += ` Z`;

            return svgPathStr;
        }
            
        let RoundedCornerCoorArr = () => {
            let coorArr = [];

            let Q1 = [];
            Q1.push({
                x: w/2 + ( winSize.w >> 1 ),
                y: 0 + ( winSize.h >> 1 )
            });

            
            let shorterEdge = w<h?w:h;
            let r = shorterEdge/2>rc_r?rc_r:shorterEdge/2;
            let resolution = 1/Math.pow(10,res);
            let setQ1 = [];
            let centerOfCircle = {x:w/2-r, y:h/2-r};
            for( let t = 0; t <= Math.PI/2; t += Math.PI/2/(res*8) ) {
                let x = centerOfCircle.x+Math.cos(t)*r;
                let y = centerOfCircle.y+Math.sin(t)*r;
                
                Q1.push({
                    x: x + ( winSize.w >> 1 ),
                    y: y + ( winSize.h >> 1 )
                });
            }

            let Q2 = Q1.map((val)=>{
                return {
                    x: -1*(val.x - (winSize.w >> 1)) + (winSize.w >> 1),
                    y: val.y
                };
            }).reverse();

            let Q34 = Q1.concat(Q2).map((val)=>{
                return {
                    x: val.x,
                    y: -1*(val.y - (winSize.h >> 1)) + (winSize.h >> 1),
                };
            }).reverse();

            coorArr = Q1.concat(Q2).concat(Q34);
            return coorArr;
        }
            
        let SuperellipseCoorArr = () => {
            let coorArr = [];
            let resolution = 1/Math.pow(10,res);
            for( let t = 0; t < Math.PI*2; t += resolution ) {
                let x = Math.pow( Math.abs( Math.cos( t ) ), 2 / se_n ) * w/2 * Math.sign( Math.cos( t ) );
                let y = Math.pow( Math.abs( Math.sin( t ) ), 2 / se_n ) * h/2 * Math.sign( Math.sin( t ) );
            
                coorArr.push({
                    x: x + ( winSize.w >> 1 ),
                    y: y + ( winSize.h >> 1 )
                });
            }
            return coorArr;
        }

        let BezierCurveCoorArr = () => {
            let coorArr = [];


            function de_casteljau(t, coefs){
                let beta = [...coefs];
                let n = beta.length;
                for(let j = 1; j < n; j++){
                    for(let k = 0; k < n-j; k++){
                        beta[k] = beta[k] * (1 - t) + beta[k + 1] * t;
                    }
                }
                return beta[0];
            }



            let points = [
                [w/2, 0],
                [w/2, h*bc_r[0]],
                [w/2, h/2],
                [w*bc_r[0], h/2],
                [0, h/2]
            ];

            let listOfX = points.map(val=>val[0]);
            let listOfY = points.map(val=>val[1]);

            let resolution = 1/Math.pow(10,res);


            let Q1 = [];
            for( let t = 0; t < 1; t += resolution ) {
                let x = de_casteljau(t,listOfX);
                let y = de_casteljau(t,listOfY);

                Q1.push({
                    x: x + ( winSize.w >> 1 ),
                    y: y + ( winSize.h >> 1 )
                });
            }

            let Q2 = Q1.map((val)=>{
                return {
                    x: -1*(val.x - (winSize.w >> 1)) + (winSize.w >> 1),
                    y: val.y
                };
            }).reverse();

            let Q34 = Q1.concat(Q2).map((val)=>{
                return {
                    x: val.x,
                    y: -1*(val.y - (winSize.h >> 1)) + (winSize.h >> 1),
                };
            }).reverse();

            coorArr = Q1.concat(Q2).concat(Q34);
            return coorArr;
        }
            
        let FGSquircleCoorArr = () => {
            const [r,s,cos,sin,sqrt,sq,abs,sgn] = [w<=h?w>>1:h>>1,fg_s,Math.cos,Math.sin,Math.sqrt,(n)=>(n*n),Math.abs,(n)=>(n>0?1:(n<0?-1:0))];
            let coorArr = [];
            let resolution = 1/Math.pow(10,res);
            for( let t = Math.PI*-1+resolution; t < Math.PI*1; t += resolution ) {

                // let sgncost = -1;
                // let sgnsint = -1;
                // let sqrt2 = 1.4142135624;

                // if(t>0){
                //     sgnsint = 1;
                // }else if(t==0){
                //     sgnsint = 0;
                // }

                // if(t<Math.PI/2 && t>-1*Math.PI/2){
                //     sgncost = 1;
                // }else if(t == Math.PI/2 || t == -1*Math.PI/2){
                //     sgncost = 0;
                // }
                // let x = r*sgncost / (s* sqrt2* abs(sin(t))) * sqrt(1 - sqrt(1 - sq(s)*sq(sin(2*t))));
                // let y = r*sgnsint / (s* sqrt2* abs(cos(t))) * sqrt(1 - sqrt(1 - sq(s)*sq(sin(2*t))));

                let x = r*sgn(cos(t)) / (s* sqrt(2)* abs(sin(t))) * sqrt(1 - sqrt(1 - sq(s)*sq(sin(2*t))));
                let y = r*sgn(sin(t)) / (s* sqrt(2)* abs(cos(t))) * sqrt(1 - sqrt(1 - sq(s)*sq(sin(2*t))));
                coorArr.push({
                    x: x + ( winSize.w >> 1 ),
                    y: y + ( winSize.h >> 1 )
                });
            }
            return coorArr;
        }


        // const [svgS, setSvgS] = useState({
        //     bg: '#000',
        //     rc:'#f00',
        //     se:'#ff0',
        //     bc:'#0ff',
        //     fg:'#00f',
        //     mbm:'screen',
        // });

        let bg = c.rect(winSize.w, winSize.h).fill(svgS.bg);


        let rc_path =  c.path(CoorArr2svgPath(RoundedCornerCoorArr())).attr('id', 'rounded-corner')
                        .fill('none')
                        .stroke({width:2, color: svgS.rc})
                        .css('mix-blend-mode', svgS.mbm);

        let se_path =  c.path(CoorArr2svgPath(SuperellipseCoorArr())).attr('id', 'superellipse')
                        .fill('none')
                        .stroke({width:2, color:  svgS.se})
                        .css('mix-blend-mode', svgS.mbm);

        let bc_path =  c.path(CoorArr2svgPath(BezierCurveCoorArr())).attr('id', 'bezier-curve')
                        .fill('none')
                        .stroke({width:2, color:  svgS.bc})
                        .css('mix-blend-mode', svgS.mbm);

        let fg_path =  c.path(CoorArr2svgPath(FGSquircleCoorArr())).attr('id', 'fg-squircle')
                        .fill('none')
                        .stroke({width:2, color:  svgS.fg})
                        .css('mix-blend-mode', svgS.mbm);

                        // .fill('none')
                        // .stroke({width:2, color: '#f00'})
                        // .css('mix-blend-mode', 'screen');

                        // .fill('#e91e63')
                        // .stroke({width:2, color: '#00f'})
                        // .css('mix-blend-mode', 'difference');


        setSvgDlStr(c.svg());

        console.log(`Effect time :     ${performance.now() - start}ms`);

        return ()=>{
            bg.remove();
            rc_path.remove();
            se_path.remove();
            bc_path.remove();
            fg_path.remove();
            c.remove()
        };

    },[svgS,winSize,w,h,res,rc_r,se_n,bc_r,bc_o,fg_s]);

    function handleChange(e){
        function updateSvgS(){
            // setSvgS({
            //         bg: svgSbgRef.current.value,
            //         rc: svgSrcRef.current.value,
            //         se: svgSseRef.current.value,
            //         bc: svgSbcRef.current.value,
            //         fg: svgSfgRef.current.value,
            //         mbm: svgSmbmRef.current.value,
            //     }
            // );
            setSvgS({
                    bg: svgS.bg,
                    rc: svgSrcRef.current.value,
                    se: svgSseRef.current.value,
                    bc: svgSbcRef.current.value,
                    fg: svgSfgRef.current.value,
                    mbm: svgS.mbm,
                }
            );
        }

        switch (e.target.name) {
            case 'a-value':
                setW(wRef.current.value*1.0);
                break;
            case 'b-value':
                setH(hRef.current.value*1.0);
                break;
            case 'res-value':
                setRes(resRef.current.value*1.0);
                break;
            case 'svgSrc-value':
                updateSvgS();
                break;
            case 'svgSse-value':
                updateSvgS();
                break;
            case 'svgSbc-value':
                updateSvgS();
                break;
            case 'svgSfg-value':
                updateSvgS();
                break;
            case 'rc_r-value':
                setRc_r(rc_rRef.current.value*1.0);
                break;
            case 'se_n-value':
                setSe_n(se_nRef.current.value*1.0);
                break;
            case 'bc_r-value':
                setBc_r([bc_rRef.current.value*1.0]);
                break;
            case 'fg_s-value':
                setFg_s(fg_sRef.current.value*1.0);
                break;
            default:
                break;
        }
    }

    // const svgSbgRef = useRef(null);
    // const svgSrcRef = useRef(null);
    // const svgSseRef = useRef(null);
    // const svgSbcRef = useRef(null);
    // const svgSfgRef = useRef(null);
    // const svgSmbmRef = useRef(null);



  return (
    <div className={rS.wrapper}>
        <div id="svgCanvas" className={rS.svgCanvas} style={{width:winSize.w+"px", height:winSize.h+"px"}}>
        </div>
        <div className={rS.control}>
        {/* <InputBox /> */}
        <h3>Overall</h3>
            <input name='a-value' className={rS.slider} type='range' min={1} max={2000} step={1} defaultValue={w} ref={wRef} onChange={handleChange}/>
            <label htmlFor='a-value'>a: {w/2}</label>

            <input name='b-value' className={rS.slider} type='range' min={1} max={2000} step={1} defaultValue={h} ref={hRef} onChange={handleChange}/>
            <label htmlFor='b-value'>b: {h/2}</label>

            <input name='res-value' className={rS.slider} type='range' min={1} max={4} step={1} defaultValue={res} ref={resRef} onChange={handleChange}/>
            <label htmlFor='res-value'>res: {1/Math.pow(10,res)}</label>
            
        <h3>
            <input name='svgSrc-value' className={rS.colorPicker} type='color' defaultValue={svgS.rc} ref={svgSrcRef} onChange={handleChange}/>
            Rounded Corner
        </h3>
            <input name='rc_r-value' className={rS.slider} type='range' min={1} max={1000} step={1} defaultValue={rc_r} ref={rc_rRef} onChange={handleChange}/>
            <label htmlFor='rc_r-value'>r: {rc_r}</label>
        <h3>
            <input name='svgSse-value' className={rS.colorPicker} type='color' defaultValue={svgS.se} ref={svgSseRef} onChange={handleChange}/>
            Superellipse
        </h3>
            <input name='se_n-value' className={rS.slider} type='range' min={0.01} max={10} step={0.01} defaultValue={se_n} ref={se_nRef} onChange={handleChange}/>
            <label htmlFor='se_n-value'>n: {se_n}</label>
        <h3>
            <input name='svgSbc-value' className={rS.colorPicker} type='color' defaultValue={svgS.bc} ref={svgSbcRef} onChange={handleChange}/>
            Bezier Curve
        </h3>
            <input name='bc_r-value' className={rS.slider} type='range' min={0.001} max={1} step={0.001} defaultValue={bc_r[0]} ref={bc_rRef} onChange={handleChange}/>
            <label htmlFor='bc_r-value'>r: {bc_r[0]}</label>
        <h3>
            <input name='svgSfg-value' className={rS.colorPicker} type='color' defaultValue={svgS.fg} ref={svgSfgRef} onChange={handleChange}/>
            FG Squircle
        </h3>
            <input name='fg_s-value' className={rS.slider} type='range' min={0.001} max={1} step={0.001} defaultValue={fg_s} ref={fg_sRef} onChange={handleChange}/>
            <label htmlFor='fg_s-value'>s: {fg_s}</label>

            <br />
            <SaveLink svgStr={svgDlStr} />
            <div style={{position:'absolute',right:10,bottom:5}}>© Mangle Kuo</div>
        </div>
    </div>
  );

}

export default function RC() {

  return (
    <>
        <Head>
            <title>Rounded Corners</title>
        </Head>
        <RenderSVG />
    </>
  );
}


