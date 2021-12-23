import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import {useEffect, useState, useRef} from 'react';
import { SVG, extend as SVGextend, Element as SVGElement } from '@svgdotjs/svg.js'


function SaveLink({svgStr}){
    const [downloadLink, setDownloadLink] = useState('');
    useEffect(()=>{
        if(typeof window !== 'undefined' && typeof svgStr !== 'undefined' && typeof svgStr !== 'null'){
            try {
                const data = new Blob([svgStr], { type: 'text/plain' });
                
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
    const [w, setW] = useState(100);
    const [h, setH] = useState(100);
    const [res, setRes] = useState(3);
    // might change if fancy button is used
    const wRef = useRef(null);
    const hRef = useRef(null);
    const resRef = useRef(null);

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

    // For saving
    const [svgDlStr, setSvgDlStr] = useState('');


    useEffect(()=>{
        if(typeof window !== 'undefined'){
            setWinSize({w:window.innerWidth-500, h:window.innerHeight});
            let shorterEdge = (window.innerWidth-500)<window.innerHeight?(window.innerWidth-500):window.innerHeight;
            setW(shorterEdge*0.618 >> 1);
            setH(shorterEdge*0.618 >> 1);
            window.addEventListener('resize', ()=>{setWinSize({w:window.innerWidth-500, h:window.innerHeight})});
        }
    },[]);


    // useEffect(()=>{
    //     let shorterEdge = winSize.w<winSize.h?winSize.w:winSize.h;
    //     setW(shorterEdge*0.618 >> 1);
    //     setH(shorterEdge*0.618 >> 1);
    // },[winSize]);

    useEffect(()=>{

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



        let bg = c.rect(winSize.w, winSize.h).fill('#151515');


        let rc_path =  c.path(CoorArr2svgPath(RoundedCornerCoorArr())).attr('id', 'rounded-corner')
                        .fill('#e91e63')
                        // .stroke({width:2, color: '#f00'})
                        .css('mix-blend-mode', 'difference');

        let se_path =  c.path(CoorArr2svgPath(SuperellipseCoorArr())).attr('id', 'superellipse')
                        .fill('#e91e63')
                        // .stroke({width:2, color: '#0f0'})
                        .css('mix-blend-mode', 'difference');

        let bc_path =  c.path(CoorArr2svgPath(BezierCurveCoorArr())).attr('id', 'bezier-curve')
                        .fill('#e91e63')
                        // .stroke({width:2, color: '#00f'})
                        .css('mix-blend-mode', 'difference');

                        // .fill('none')
                        // .stroke({width:2, color: '#f00'})
                        // .css('mix-blend-mode', 'screen');


        setSvgDlStr(c.svg());

        return ()=>{
            se_path.remove();
            c.remove()
        };

    },[winSize,w,h,res,rc_r,se_n,bc_r,bc_o]);

    function handleChange(e){

        switch (e.target.name) {
            case 'a-value':
                setW(wRef.current.value);
                break;
            case 'b-value':
                setH(hRef.current.value);
                break;
            case 'res-value':
                setRes(resRef.current.value);
                break;
            case 'rc_r-value':
                setRc_r(rc_rRef.current.value);
                break;
            case 'se_n-value':
                setSe_n(se_nRef.current.value);
                break;
            case 'bc_r-value':
                setBc_r([bc_rRef.current.value]);
                break;
            default:
                break;
        }
    }

  return (
    <>
        <div id="svgCanvas" style={{width:winSize.w+"px", height:winSize.h+"px"}}>
        </div>
        <div style={{position: 'fixed',width: '500px',height: '100%',backgroundColor: '#e91e63',right: '0',bottom: '0',padding: '20px'}}>
        <h3>Overall</h3>
            <input name='a-value' style={{width:'100%'}} type='range' min={1} max={2000} step={1} defaultValue={w} ref={wRef} onChange={handleChange}/>
            <label htmlFor='a-value'>a: {w/2}</label>

            <input name='b-value' style={{width:'100%'}} type='range' min={1} max={2000} step={1} defaultValue={h} ref={hRef} onChange={handleChange}/>
            <label htmlFor='b-value'>b: {h/2}</label>

            <input name='res-value' style={{width:'100%'}} type='range' min={1} max={4} step={1} defaultValue={res} ref={resRef} onChange={handleChange}/>
            <label htmlFor='res-value'>res: {1/Math.pow(10,res)}</label>
        <h3>Rounded Corner</h3>
            <input name='rc_r-value' style={{width:'100%'}} type='range' min={1} max={1000} step={1} defaultValue={rc_r} ref={rc_rRef} onChange={handleChange}/>
            <label htmlFor='rc_r-value'>r: {rc_r}</label>
        <h3>Superellipse</h3>
            <input name='se_n-value' style={{width:'100%'}} type='range' min={0.01} max={10} step={0.01} defaultValue={se_n} ref={se_nRef} onChange={handleChange}/>
            <label htmlFor='se_n-value'>n: {se_n}</label>
        <h3>Bezier Curve</h3>
            <input name='bc_r-value' style={{width:'100%'}} type='range' min={0.001} max={1} step={0.001} defaultValue={bc_r[0]} ref={bc_rRef} onChange={handleChange}/>
            <label htmlFor='bc_r-value'>r: {bc_r[0]}</label>

            <br />
            <SaveLink svgStr={svgDlStr} />
            <div style={{position:'absolute',right:10,bottom:5}}>© Mangle Kuo</div>
        </div>
    </>
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


