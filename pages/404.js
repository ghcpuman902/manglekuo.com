import { useEffect, useRef, forwardRef } from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
`;

const SvgLayerStyle = {
  position: 'fixed',
  width: '100vw',
  height: '100vh',
  left: '0%',
  top: '0%',
};

const svgFillColor = {fill:"#ffffff"};

export default function ParallaxPage() {
  const svgRefs = useRef([]);
  const wrapperRef = useRef([]);
  const parallaxCoeff = 0.2;
  const pXOffset = 0;
  const pYOffset = 0;
  const SvgLayer = forwardRef(({ children }, ref) => (
    <div ref={ref} style={SvgLayerStyle}>{children}</div>
  ));

  useEffect(() => {
    wrapperRef.current.style.height = `${window.innerHeight}px`;
    const handleMouseMove = (e) => {
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;

      const x = (e.clientX - windowWidth / 2 ) * parallaxCoeff - pXOffset;
      const y = (e.clientY - windowHeight / 2 ) * parallaxCoeff - pYOffset;

      svgRefs.current.forEach((svg, idx) => {
        const layerCoeff = (idx + 1) / svgRefs.current.length;
        const transform = `translate3d(${x * layerCoeff}px, ${y * layerCoeff}px, 0)`;
        svg.style.transform = transform;
      });
    };


    const handleTilt = (e) => {
      const { gamma, beta } = e.rotationRate;
      const x = -beta * parallaxCoeff;
      const y = gamma * parallaxCoeff;

      svgRefs.current.forEach((svg, idx) => {
        const layerCoeff = (idx + 1) / svgRefs.current.length;
        const transform = `translate3d(${x * layerCoeff}px, ${y * layerCoeff}px, 0)`;
        svg.style.transform = transform;
      });
    };

    const handlePermissionRequest = () => {
      if (typeof DeviceMotionEvent.requestPermission === 'function') {
        DeviceMotionEvent.requestPermission()
          .then(permissionState => {
            if (permissionState === 'granted') {
              window.addEventListener('devicemotion', handleTilt);
            }
          })
          .catch(console.error);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handlePermissionRequest);


    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('devicemotion', handleTilt);
    };
  }, []);


  return (
    <Wrapper ref={wrapperRef}>
      <SvgLayer ref={el => svgRefs.current[0] = el} key={0}>
      <svg id="b" data-name="Layer0" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" viewBox="0 0 2048 2048">
      <rect width="2048" height="2048"/>
      <rect x=".98486" y="1889.60509" width="154" height="154" style={svgFillColor}/>
      <rect x="235.93279" y="1588.60964" width="154" height="154" style={svgFillColor}/>
      <rect x=".98486" y="342.62616" width="154" height="154" style={svgFillColor}/>
      <rect x="1497.85837" y="1500.03244" width="154" height="154" style={svgFillColor}/>
      <rect x="937.57812" y="1413.17762" width="154" height="154" style={svgFillColor}/>
      <rect x="447.82276" y="602.87011" width="154" height="154" style={svgFillColor}/>
      <rect x="1665.05533" y="550.99921" width="154" height="154" style={svgFillColor}/>
      <rect x="1160.67188" y="935.466" width="154" height="154" style={svgFillColor}/>
      <rect x="1862.09834" y="1626.85667" width="154" height="154" style={svgFillColor}/>
      <circle cx="648.47746" cy="1626.85667" r="91.01447" style={svgFillColor}/>
      <circle cx="1352.17853" cy="1772.33863" r="91.01447" style={svgFillColor}/>
      <circle cx="1118.58048" cy="131.99541" r="91.01447" style={svgFillColor}/>
      <circle cx="1939.09834" cy="150.1004" r="91.01447" style={svgFillColor}/>
      <circle cx="1261.16406" cy="770.88457" r="91.01447" style={svgFillColor}/>
      <circle cx="1587.01764" cy="579.03463" r="91.01447" style={svgFillColor}/>
      <circle cx="1031.38281" cy="488.02017" r="91.01447" style={svgFillColor}/>
      <circle cx="235.93279" cy="981.7627" r="91.01447" style={svgFillColor}/>
      <circle cx="500.46311" cy="488.02017" r="91.01447" style={svgFillColor}/>
      <circle cx="961.27765" cy="1103.48047" r="91.01447" style={svgFillColor}/>
      <polygon points="1587.01764 1809.10731 1494.06681 1970.10287 1679.96848 1970.10287 1587.01764 1809.10731" style={svgFillColor}/>
      <polygon points="922.67969 1782.85532 829.72886 1943.85088 1015.63052 1943.85088 922.67969 1782.85532" style={svgFillColor}/>
      <polygon points="1955.04917 962.50222 1862.09834 1123.49778 2048 1123.49778 1955.04917 962.50222" style={svgFillColor}/>
      <polygon points="1651.85837 1252.18205 1558.90754 1413.17762 1744.8092 1413.17762 1651.85837 1252.18205" style={svgFillColor}/>
      <polygon points="552.47746 995.99943 459.52663 1156.99499 645.4283 1156.99499 552.47746 995.99943" style={svgFillColor}/>
      <polygon points="500.46311 29.64561 407.51228 190.64117 593.41394 190.64117 500.46311 29.64561" style={svgFillColor}/>
      <polygon points="1494.06681 223.00987 1401.11598 384.00544 1587.01764 384.00544 1494.06681 223.00987" style={svgFillColor}/>
      <polygon points="267.32388 1283.41614 174.37305 1444.4117 360.27471 1444.4117 267.32388 1283.41614" style={svgFillColor}/>
      <polygon points="881.03667 837.6321 788.08584 998.62766 973.98751 998.62766 881.03667 837.6321" style={svgFillColor}/>
      <polygon points="1342.02344 1076.49721 1249.07261 1237.49277 1434.97427 1237.49277 1342.02344 1076.49721" style={svgFillColor}/>
      </svg>
      </SvgLayer>
      <SvgLayer ref={el => svgRefs.current[1] = el} key={1}>
      <svg id="b" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" viewBox="0 0 2048 2048">
      <rect x="769.27765" y="1338.70237" width="192" height="192" style={svgFillColor}/>
      <rect x="112.93002" y="620.11043" width="192" height="192" style={svgFillColor}/>
      <rect x="1051.08203" y="1060.99499" width="192" height="192" style={svgFillColor}/>
      <rect x="552.47746" y="1824.14241" width="192" height="192" style={svgFillColor}/>
      <rect x="1728.85837" width="192" height="96" style={svgFillColor}/>
      <circle cx="1464.60299" cy="1769.39994" r="113.47258" style={svgFillColor}/>
      <circle cx="1074.69531" cy="901.74707" r="113.47258" style={svgFillColor}/>
      <circle cx="191.45744" cy="1233.47258" r="113.47258" style={svgFillColor}/>
      <circle cx="1744.8092" cy="925.58301" r="113.47258" style={svgFillColor}/>
      <polygon points="1809.65231 1256.1703 1691.84812 1460.21314 1927.4565 1460.21314 1809.65231 1256.1703" style={svgFillColor}/>
      <polygon points="1327.39913 552.82727 1209.59495 756.87011 1445.20332 756.87011 1327.39913 552.82727" style={svgFillColor}/>
      <polygon points="1769.66256 179.9626 1651.85837 384.00544 1887.46675 384.00544 1769.66256 179.9626" style={svgFillColor}/>
      <polygon points="729.93448 240.60474 612.13029 444.64758 847.73866 444.64758 729.93448 240.60474" style={svgFillColor}/>
      <polygon points="763.23249 1027.93171 645.4283 1231.97454 881.03667 1231.97454 763.23249 1027.93171" style={svgFillColor}/> 
      </svg>
      </SvgLayer>
      <SvgLayer ref={el => svgRefs.current[2] = el} key={2}>
      <svg id="b" data-name="Layer 2" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" viewBox="0 0 2048 2048">
      <path d="m967.1875,979.86426h-29.25v-22.00781h-39.44531v-22.92188l32.76562-63.63281h35.92969v63.21094h9.28125v23.34375h-9.28125v22.00781Zm-27.91406-45.35156v-20.32031c0-.93652.05859-2.43652.17578-4.5.11621-2.06152.29199-4.71094.52734-7.94531l-4.35938,9.28125c-2.15625,4.54785-4.31348,8.77832-6.46875,12.69141-2.15625,3.91504-4.31348,7.5127-6.46875,10.79297h16.59375Z"/>
      <path d="m1062.46094,926.28613c0,16.96973-3.375,30.46973-10.125,40.5-6.75,9.98438-15.82031,14.97656-27.21094,14.97656-12.3291,0-21.98438-5.03809-28.96875-15.11719-6.9375-10.03027-10.40625-24.04688-10.40625-42.04688,0-17.01562,3.46875-30.46777,10.40625-40.35938,6.98438-9.93652,16.40625-14.90625,28.26562-14.90625,11.95312,0,21.28027,5.04004,27.98438,15.11719,6.70312,10.0791,10.05469,24.02441,10.05469,41.83594Zm-28.96875-.21094c0-20.95312-3.16406-31.42969-9.49219-31.42969-6.28223,0-9.42188,9.37598-9.42188,28.125,0,22.40723,3.06934,33.60938,9.21094,33.60938,3.32812,0,5.77637-2.44824,7.34766-7.34766,1.57031-4.89746,2.35547-12.55078,2.35547-22.95703Z"/>
      <path d="m1140.29688,979.86426h-29.25v-22.00781h-39.44531v-22.92188l32.76562-63.63281h35.92969v63.21094h9.28125v23.34375h-9.28125v22.00781Zm-27.91406-45.35156v-20.32031c0-.93652.05859-2.43652.17578-4.5.11621-2.06152.29199-4.71094.52734-7.94531l-4.35938,9.28125c-2.15625,4.54785-4.31348,8.77832-6.46875,12.69141-2.15625,3.91504-4.31348,7.5127-6.46875,10.79297h16.59375Z"/>
      <path d="m707.10156,1152.66406v-108.5625h27.98438l14.69531,38.10938c.79688,2.25,1.69824,4.8291,2.70703,7.73438,1.00781,2.90723,2.12012,6.25781,3.33984,10.05469l3.02344,9.5625c-1.0791-9.42188-1.89844-17.4834-2.46094-24.1875-.5625-6.70215-.84375-12.32715-.84375-16.875v-24.39844h27.98438v108.5625h-27.98438l-14.76562-39.9375c-1.54688-4.26465-2.94238-8.26172-4.18359-11.98828-1.24219-3.72656-2.33203-7.27734-3.26953-10.65234.6084,7.6416,1.05469,14.29785,1.33594,19.96875.28125,5.67285.42188,10.6416.42188,14.90625v27.70312h-27.98438Z"/>
      <path d="m867.27344,1115.82031c0,11.71973-3.23438,21.04785-9.70312,27.98438-6.46875,6.93848-15.1416,10.40625-26.01562,10.40625-10.6875,0-19.19531-3.53809-25.52344-10.61719-6.28223-7.12402-9.42188-16.68652-9.42188-28.6875,0-11.99902,3.20996-21.63184,9.63281-28.89844,6.37402-7.3125,14.83594-10.96875,25.38281-10.96875,11.10938,0,19.82812,3.63379,26.15625,10.89844,6.32812,7.2666,9.49219,17.22656,9.49219,29.88281Zm-27.35156-.91406c0-2.8125-.1875-5.35449-.5625-7.62891-.37598-2.27246-.91406-4.21875-1.61719-5.83594s-1.54688-2.87012-2.53125-3.76172c-.98438-.88965-2.08594-1.33594-3.30469-1.33594-2.39062,0-4.31348,1.6875-5.76562,5.0625-1.45312,2.95312-2.17969,7.38281-2.17969,13.28906,0,5.81348.72656,10.24316,2.17969,13.28906,1.45215,3.375,3.39844,5.0625,5.83594,5.0625,2.2959,0,4.19434-1.66309,5.69531-4.99219,1.5-3.70215,2.25-8.08594,2.25-13.14844Z"/>
      <path d="m910.375,1152.66406h-28.26562v-53.29688h-8.01562v-22.71094h8.01562v-22.35938h28.26562v22.35938h9.35156v22.71094h-9.35156v53.29688Z"/>
      <path d="m1001.00781,1152.66406h-29.32031v-108.5625h51.82031v25.52344h-22.5v15.82031h20.95312v24.53906h-20.95312v42.67969Z"/>
      <path d="m1102.04688,1115.82031c0,11.71973-3.23438,21.04785-9.70312,27.98438-6.46875,6.93848-15.1416,10.40625-26.01562,10.40625-10.6875,0-19.19531-3.53809-25.52344-10.61719-6.28223-7.12402-9.42188-16.68652-9.42188-28.6875,0-11.99902,3.20996-21.63184,9.63281-28.89844,6.37402-7.3125,14.83594-10.96875,25.38281-10.96875,11.10938,0,19.82812,3.63379,26.15625,10.89844,6.32812,7.2666,9.49219,17.22656,9.49219,29.88281Zm-27.35156-.91406c0-2.8125-.1875-5.35449-.5625-7.62891-.37598-2.27246-.91406-4.21875-1.61719-5.83594s-1.54688-2.87012-2.53125-3.76172c-.98438-.88965-2.08594-1.33594-3.30469-1.33594-2.39062,0-4.31348,1.6875-5.76562,5.0625-1.45312,2.95312-2.17969,7.38281-2.17969,13.28906,0,5.81348.72656,10.24316,2.17969,13.28906,1.45215,3.375,3.39844,5.0625,5.83594,5.0625,2.2959,0,4.19434-1.66309,5.69531-4.99219,1.5-3.70215,2.25-8.08594,2.25-13.14844Z"/>
      <path d="m1112.94531,1076.65625h28.19531v42.82031c0,4.07812.39746,7.05566,1.19531,8.92969.84375,1.54688,2.43652,2.32031,4.78125,2.32031,2.2959,0,3.84277-.77344,4.64062-2.32031.84375-1.54688,1.26562-4.52246,1.26562-8.92969v-42.82031h28.19531v46.61719c0,3.09375-.24609,5.89551-.73828,8.40234-.49219,2.50879-1.26562,4.78125-2.32031,6.82031s-2.41504,3.90234-4.07812,5.58984c-1.66406,1.6875-3.64551,3.23438-5.94141,4.64062-6.1875,3.65625-13.19531,5.48438-21.02344,5.48438-7.92188,0-14.93066-1.82812-21.02344-5.48438-2.34473-1.40625-4.34863-2.94043-6.01172-4.60547-1.66406-1.66309-3.02344-3.52637-4.07812-5.58984-1.05469-2.06152-1.82812-4.34668-2.32031-6.85547-.49219-2.50684-.73828-5.30859-.73828-8.40234v-46.61719Z"/>
      <path d="m1261.16406,1152.66406h-28.19531v-40.21875c0-3.46777-.34082-5.88184-1.01953-7.24219-.67969-1.3584-1.86328-2.03906-3.55078-2.03906-3.9375,0-5.90625,3.72656-5.90625,11.17969v38.32031h-28.19531v-76.00781h28.19531c-.04688,1.87598-.09473,3.61035-.14062,5.20312-.04688,1.59473-.11719,3.07129-.21094,4.42969l-.28125,4.85156c4.5459-10.7334,11.20312-16.10156,19.96875-16.10156,6.09277,0,10.82812,2.27441,14.20312,6.82031,3.4209,4.54785,5.13281,10.87598,5.13281,18.98438v51.82031Z"/>
      <path d="m1313.19531,1152.66406c.0459-.7959.09375-1.70996.14062-2.74219.0459-1.03027.11621-2.22559.21094-3.58594.09375-.84375.16406-2.13184.21094-3.86719-2.71875,4.40723-5.36816,7.47754-7.94531,9.21094-2.53125,1.6875-5.64941,2.53125-9.35156,2.53125-7.64062,0-13.64062-3.4209-18-10.26562-4.31348-6.84277-6.46875-16.3584-6.46875-28.54688,0-12.79688,2.10938-22.71094,6.32812-29.74219,4.21875-7.07715,10.1709-10.61719,17.85938-10.61719,4.21875,0,7.61719.93848,10.19531,2.8125,2.71777,1.87598,5.34375,5.13281,7.875,9.77344-.14062-2.43652-.21094-3.91309-.21094-4.42969l-.28125-7.66406v-41.625h28.26562v118.75781h-28.82812Zm-12.02344-38.32031c0,10.40625,2.32031,15.60938,6.96094,15.60938,4.35938,0,6.53906-5.36621,6.53906-16.10156,0-10.26562-2.10938-15.39844-6.32812-15.39844-4.78125,0-7.17188,5.29785-7.17188,15.89062Z"/>
      </svg>
      </SvgLayer>
      <SvgLayer ref={el => svgRefs.current[3] = el} key={3}>
      <svg id="b" data-name="Layer 3" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" viewBox="0 0 2048 2048">
      <rect x="617.39541" y="821.0237" width="240" height="240" style={svgFillColor}/>
      <rect x="1314.60299" y="161.73372" width="240" height="240" style={svgFillColor}/>
      <circle cx="1248.80693" cy="1500.03244" r="141.84072" style={svgFillColor}/>
      <circle cx="1728.85837" cy="844.29073" r="141.84072" style={svgFillColor}/>
      <polygon points="795.7327 172.47323 648.47746 427.52677 942.98794 427.52677 795.7327 172.47323" style={svgFillColor}/>
      <polygon points="265.25044 1514.34639 117.9952 1769.39994 412.50568 1769.39994 265.25044 1514.34639" style={svgFillColor}/>
      </svg>
      </SvgLayer>
      <SvgLayer ref={el => svgRefs.current[4] = el} key={4}>
      <svg id="b" data-name="Layer 4" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" viewBox="0 0 2048 2048">
      <rect x="1314.60299" y="1120" width="300" height="300" style={svgFillColor}/>
      <circle cx="941.27957" cy="579.03463" r="177.30091" style={svgFillColor}/>
      <polygon points="979.80174 1535.84221 795.7327 1854.65914 1163.87079 1854.65914 979.80174 1535.84221" style={svgFillColor}/>
      <rect x="203.92585" width="300" height="300" style={svgFillColor}/>
      <circle cx="1870.69909" cy="1789.30418" r="177.30091" style={svgFillColor}/>
      <polygon points="191.45744 596.92707 7.38839 915.744 375.52648 915.744 191.45744 596.92707" style={svgFillColor}/>
      <circle cx="368.75834" cy="1434.70237" r="177.30091" style={svgFillColor}/>
      <polygon points="1798.67204 260.21769 1614.60299 579.03463 1982.74108 579.03463 1798.67204 260.21769" style={svgFillColor}/>
      </svg>
      </SvgLayer>
    </Wrapper>
  );
}
