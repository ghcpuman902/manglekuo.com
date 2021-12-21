import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import {useEffect, useState, useRef} from 'react';
import { SVG, extend as SVGextend, Element as SVGElement } from '@svgdotjs/svg.js'


const genRanHex = size => [...Array(size)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');

function SaveLink({svgStr}){
    const data = new Blob([svgStr], { type: 'text/plain' })
    const downloadLink = window.URL.createObjectURL(data)
    return (
      <>
        <a download={`Superellipse-${genRanHex(12)}.svg`} href={downloadLink}>Download SVG</a>
      </>
    );
}

function RenderSVG() {
    const [winSize, setWinSize] = useState({w:500,h:500});
    const [w, setW] = useState(100);
    const [h, setH] = useState(100);

    // Superellipse
    const [n, setN] = useState(2);

    const [svgDlStr, setSvgDlStr] = useState('');

    const nRef = useRef(null);
    const wRef = useRef(null);
    const hRef = useRef(null);

    useEffect(()=>{
        if(typeof window !== 'undefined'){
            setWinSize({w:window.innerWidth??1000, h:window.innerHeight??500});
        }
    },[]);


    useEffect(()=>{
        let shorterEdge = winSize.w<winSize.h?winSize.w:winSize.h;
        setW(shorterEdge*0.618 >> 1);
        setH(shorterEdge*0.618 >> 1);
    },[winSize]);

    useEffect(()=>{
        let coorArr = [];

        const c = SVG().addTo('#svgCanvas').size(winSize.w, winSize.h);
            
        function point( x, y ) {
            coorArr.push({x:x,y:y});
        }

        function svgPathStrFromCoorArr(arr){
            let svgPathStr = "";
            svgPathStr += `M ${arr[0].x},${arr[0].y} L`;
            for(var i=1;i<arr.length;i++){
                svgPathStr += ` ${arr[i].x},${arr[i].y}`;
            }
            svgPathStr += ` Z`;

            return svgPathStr;
        }
            
        
        for( let t = 0; t < Math.PI*2; t += .001 ) {
            let x = Math.pow( Math.abs( Math.cos( t ) ), 2 / n ) * w * Math.sign( Math.cos( t ) );
            let y = Math.pow( Math.abs( Math.sin( t ) ), 2 / n ) * h * Math.sign( Math.sin( t ) );
        
            point( x + ( winSize.w >> 1 ), y + ( winSize.h >> 1 ) );
        }
        let svgPath = svgPathStrFromCoorArr(coorArr);
        let path = c.path(svgPath).fill('none').stroke({width:2, color: '#fff'});

        setSvgDlStr(c.svg());

        return ()=>{
            path.remove();
            c.remove()
        };

    },[w,h,n]);

    function handleChange(e){
        console.log(e.target.name);
        if(e.target.name == 'n-value'){
        }

        switch (e.target.name) {
            case 'n-value':
                setN(nRef.current.value);
                break;
            case 'a-value':
                setW(wRef.current.value);
                break;
            case 'b-value':
                setH(hRef.current.value);
                break;
            default:
                break;
        }
    }

  return (
    <>
        <div id="svgCanvas" style={{backgroundColor: "#111", width:winSize.w+"px", height:winSize.h+"px"}}>
        </div>
        <div style={{position: 'fixed',width: '500px',height: '100%',backgroundColor: '#e91e63',right: '0',bottom: '0',padding: '20px'}}>
            <input name='n-value' style={{width:'100%'}} type='range' min={0.01} max={10} step={0.01} defaultValue={n} ref={nRef} onChange={handleChange}/>
            <lable htmlFor='n-value'>n: {n}</lable>

            <input name='a-value' style={{width:'100%'}} type='range' min={1} max={2000} step={1} defaultValue={w} ref={wRef} onChange={handleChange}/>
            <lable htmlFor='a-value'>a: {w}</lable>

            <input name='b-value' style={{width:'100%'}} type='range' min={1} max={2000} step={1} defaultValue={h} ref={hRef} onChange={handleChange}/>
            <lable htmlFor='b-value'>b: {h}</lable>

            <br />
            <SaveLink svgStr={svgDlStr} />
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


