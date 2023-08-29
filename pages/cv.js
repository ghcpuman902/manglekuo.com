import Head from 'next/head';
import cvS from '../styles/cv.module.css';

export default function CV() {
  const bodyStyle = {
    background: 'rgb(204, 204, 204)',
    color: '#000',
  };

  const pageStyle = {
    fontFamily: 'Noto Sans',
    background: 'white',
    display: 'block',
    margin: '0 auto',
    marginBottom: '0.5cm',
    boxShadow: '0 0 0.5cm rgba(0, 0, 0, 0.5)',
    color: '#222222',
  };

  const sizeA4 = {
    width: '21cm',
    height: '29.7cm',
    paddingTop: '1.9cm',
    paddingRight: '1.32cm', 
    paddingBottom: '3.67cm', 
    paddingLeft: '1.9cm', 
  };

  const pt = [
    6,
    7,
    8,
    9,
    10,
    11,
    12,
    13,
    14,
    15,
    16,
    17,
    18,
    // 19,
    // 20,
    // 21,
    // 22,
    // 23,
    // 24,
    // 25,
    // 26,
    // 27,
    // 28,
    // 29,
    // 30,
    // 31,
    // 32,
    // 33,
    // 34,
    // 35,
    // 36,	
  ];

  const px = [
    8,
    9,
    10,
    11,
    12,
    13,
    14,
    15,
    16,
    17,
    18,
    19,
    20,
    // 21,
    // 22,
    // 23,
    // 24,
    // 25,
    // 26,
    // 27,
    // 28,
    // 29,
    // 30,
    // 31,
    // 32,
    // 33,
    // 34,
    // 35,
    // 36,
    // 37,
    // 38,
    // 39,
    // 40,
    // 41,
    // 42,
    // 43,
    // 44,
    // 45,
    // 46,
    // 47,
    // 48,
  ];

  let scale = [];
  for(var i=0.64;i<=0.75;i+=0.005){
    scale.push(i);
  }
//   console.log(scale);

  return (
    <>
      <Head>
        <title>CV</title>
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans:wght@100;300;400;500;600;700&family=Noto+Serif:wght@100;300;500;700&display=swap" rel="stylesheet" />
        <style>{`
          @media print {
            body, .page {
              margin: 0;
              box-shadow: 0;
            }
          }
        `}</style>
      </Head>
      <body style={bodyStyle}>
        <div className="page" size="A4" style={{ ...pageStyle, ...sizeA4 }}>
          {pt.reverse().map((ptv)=>{return (<div style={{fontSize: ptv+'pt', lineHeight: '1.5em'}}>Dynamic professional specialising in AR/XR technologies, with a history of managing and developing successful applications. {ptv}pt</div>);})}

        </div>
        <div className="page" size="A4" style={{ ...pageStyle, ...sizeA4 }}>
          {px.reverse().map((pxv)=>{return (<div style={{fontSize: pxv+'px', lineHeight: '1.5em'}}>Dynamic professional specialising in AR/XR technologies, with a history of managing and developing successful applications. {pxv}px</div>);})}
        </div>
        <div className="page" size="A4" style={{ ...pageStyle, ...sizeA4 }}>
          {scale.reverse().map((s)=>{return (<div style={{fontSize: (s*16)+'px', lineHeight: (s*24)+'px'}}>Dynamic professional specialising in AR/XR technologies, with a history of managing and developing successful applications. scale {s.toFixed(3)}, {(16*s).toFixed(3)}px</div>);})}
        </div>
        <br />
        <br />
        <br />
      </body>
    </>
  );
}