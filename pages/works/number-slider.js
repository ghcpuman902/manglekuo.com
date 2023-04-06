import {useState} from 'react';
import numberSliderFactory from '../../components/numberSliderFactory';

const WidthSlider = numberSliderFactory(0, 1000, 1, 300, 'px');
const HeightSlider = numberSliderFactory(0, 1000, 1, 400, 'px');
const MarginTopSlider = numberSliderFactory(-100, 100, 0.5, 0, 'px');
const MarginLeftSlider = numberSliderFactory(-100, 100, 0.5, 0, 'px');

const FlexColumn = ({ children }) => (
    <div
        style={{
            width: '80vw',
            maxWidth: '500px',
            height: 'auto',
        }}
    >{children}</div>
);

const NumberSliderPage = () => {
    const [width, setWidth] = useState(10);
    const [height, setHeight] = useState(10);
    const [marginTop, setMarginTop] = useState(0);
    const [marginLeft, setMarginLeft] = useState(0);
    const handleWidthChange = (value) => setWidth(value);
    const handleHeightChange = (value) => setHeight(value);
    const handleMarginTopChange = (value) => setMarginTop(value);
    const handleMarginLeftChange = (value) => setMarginLeft(value);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}
    >

        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#333',
            }}
        >
        <div
        style={{
            boxSizing: 'border-box',
            border: '1px solid #fff',
            height: `${height}px`,
            width: `${width}px`,
            marginTop: `${marginTop}px`,
            marginLeft: `${marginLeft}px`,
            background: 'linear-gradient(135deg, #ff0000 0%, #ffff00 17%, #00ff00 34%, #00ffff 51%, #0000ff 68%, #ff00ff 85%, #ff0000 100%)',
        }}
        ></div>
        </div>
        <FlexColumn>width:</FlexColumn>
        <FlexColumn><WidthSlider onValueChange={handleWidthChange} /></FlexColumn>
        <FlexColumn>height:</FlexColumn>
        <FlexColumn><HeightSlider onValueChange={handleHeightChange} /></FlexColumn>
        <FlexColumn>marginTop:</FlexColumn>
        <FlexColumn><MarginTopSlider onValueChange={handleMarginTopChange} /></FlexColumn>
        <FlexColumn>marginLeft:</FlexColumn>
        <FlexColumn><MarginLeftSlider onValueChange={handleMarginLeftChange} /></FlexColumn>
    </div>
  );
};

export default NumberSliderPage;
