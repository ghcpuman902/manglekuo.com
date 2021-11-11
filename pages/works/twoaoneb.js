import Layout from '../../components/layout'
import Styles from'/styles/twoaoneb.module.css'
import Head from 'next/head'
import { useEffect , useState , useReducer } from 'react'


function Digit({digit}){
    return (
        <span className={Styles.digit}>{digit}</span>
    );
}

function Row({num, AB}){
    return (
        <div className={Styles.row} style={AB[0]==4?{backgroundColor:'#0000ff'}:null}>
            <Digit digit={num[0]} />
            <Digit digit={num[1]} />
            <Digit digit={num[2]} />
            <Digit digit={num[3]} />
            <span>{`${AB[0]}A${AB[1]}B`}</span>
        </div>
    );
}

const getGuessingNumber = () => {
    let result = [];
    let options = [0,1,2,3,4,5,6,7,8,9];
    let digit1 = Math.floor(Math.random()*10);
    result = result.concat(options.splice(digit1,1));
    let digit2 = Math.floor(Math.random()*9);
    result = result.concat(options.splice(digit2,1));
    let digit3 = Math.floor(Math.random()*8);
    result = result.concat(options.splice(digit3,1));
    let digit4 = Math.floor(Math.random()*7);
    result = result.concat(options.splice(digit4,1));
    return result; // as an array
}

const getAB = (guessedNumArr, correctNumArr) => {
    let A = 0;
    let B = 0;
    correctNumArr.map((val,idx) => {
        if(val == guessedNumArr[idx]){
            A += 1;
            return;
        }
        if(guessedNumArr.join("").indexOf(val) >= 0){
            B += 1;
            return;
        }
    });
    return [A,B];
}

const findRepeatFirstN2 = (s) => {
     
    // This is O(N^2) method
    let p = -1, i, j;
    for(i = 0; i < s.length; i++)
    {
        for(j = i + 1; j < s.length; j++)
        {
            if (s[i] == s[j])
            {
                p = i;
                break;
            }
        }
        if (p != -1)
            break;
    }
    return p;
}


function TwoAOneBGame() {

    const [inputVals, setInputVals] = useState([1,2,3,4]);
    const [numHistory, setNumHistory] = useState([]);
    const [abHistory, setABHistory] = useState([]);

    const [guessingNum,setGuessingNum] = useState(getGuessingNumber());

    const handleInput = (e,i) => {
        e.preventDefault();
        let tempArr = inputVals.slice(0);
        // tempArr[i] = e.target.value;
        // if(tempArr[i] > 10){
        //     // no over 10
        //     tempArr[i] = tempArr[i] % 10;
        // }
        // if(tempArr[i] < 0){
        //     // no under 0
        //     tempArr[i] = 9;
        // }

        console.log(e.nativeEvent.data);
        if(isNaN(e.nativeEvent.data)){
            return;
        }
        tempArr[i] = e.nativeEvent.data;
        

        // if(`${tempArr[(i+1)%4]}${tempArr[(i+2)%4]}${tempArr[(i+3)%4]}`.indexOf(tempArr[i]) >= 0){
        //     // repeating digit
        //     // force non repeat
        //     let digits = "0123456789";
        //     digits = digits.replace(tempArr[(i+1)%4],"");
        //     digits = digits.replace(tempArr[(i+2)%4],"");
        //     digits = digits.replace(tempArr[(i+3)%4],"");
        //     tempArr[i] = digits.substr(Math.floor(Math.random()*digits.length),1);
        // }
        setInputVals(tempArr);
        document.getElementsByName(`input-${(i<3?i+1:3)}`)[0].focus();
    }

    const handleConfirm = () => {
        if(findRepeatFirstN2(inputVals.join("")) == -1){
            setABHistory(
                abHistory.concat([getAB(inputVals,guessingNum)])
            );
            setNumHistory(
                numHistory.concat([inputVals])
            );
            setInputVals([1,2,3,4]);
        }else{
            alert("No repeating allowed");
        }
        

    }

    const handleStartAgain = () => {
        setNumHistory([]);
        setInputVals([1,2,3,4]);
        setGuessingNum(getGuessingNumber());
    }

    return (
        <div className={Styles.twoaonegame}>
            <h1>2A1B 小遊戲</h1>
            {[0,1,2,3].map( (val,idx) => {return(
                <input name={`input-${val}`} key={`input-${val}`} className={Styles.input} value={inputVals[val]} onChange={e => handleInput(e,val)} type="tel" />
            )})}
            <button onClick={()=>{handleConfirm()}} className={Styles.confirm}>Confirm</button>
            <div>
                {numHistory.map((num, idx) => {return (<Row key={idx} num={num} AB={abHistory[idx]}/>)}).slice(0).reverse()}
            </div>
            <button onClick={()=>{handleStartAgain()}} className={Styles.startagain}>Start again</button>
        </div>
    )
}


// =================================================================================


function Table({data,max}) {
    let returnJsx = [];
    for (let idx = 0; idx < data.length; idx++) {
        const val = data[idx];
        for (let i = 0; i < val.length; i++) {
            const v = val[i];
            const r = Math.round(v/max*(v/max)*10);
            const g = Math.round(v/max*(v/max)*4);
            const b = Math.round(v/max*(v/max)*255);
            returnJsx.push( <div key={`${idx}-${i}`} style={{backgroundColor:`rgb(${r},${g},${b})`}}><span className={Styles.digit}>{i}</span>:{v}</div> );
        }
    }
    return (<div className={Styles.table}>
        {returnJsx}
    </div>);
}






// ==================================================================================

const getAllNumArr = () => {
    let tempNumArr = [];
    for (let a = 0; a < 10; a++) {
        for (let b = 0; b < 10; b++) {
            for (let c = 0; c < 10; c++) {
                for (let d = 0; d < 10; d++) {
                    tempNumArr.push({answer:[a,b,c,d],satisfaction:0,score:0});
                }
            }
        }
    }
    return tempNumArr;
}



const h_initialState = {
    inputNumVals:[1,2,3,4],
    inputABVals:[0,0],
    numHistory:[],
    abHistory:[],
    probabilities:Array(4).fill(Array(10).fill(8)),
    listOfAllNumbers:getAllNumArr(),
};

function h_reducer(state, action) {
    let tempArr;
    switch (action.type) {
        case 'updateNumInput':
            tempArr = state.inputNumVals.slice(0);
            tempArr[action.payload.idx] = action.payload.input;
            if(tempArr[action.payload.idx] > 10){
                // no over 10
                tempArr[action.payload.idx] = tempArr[action.payload.idx] % 10;
            }
            if(tempArr[action.payload.idx] < 0){
                // no under 0
                tempArr[action.payload.idx] = 9;
            }
            return ({
                ...state,
                inputNumVals: tempArr,
            });
        case 'updateABInput':
            tempArr = state.inputABVals.slice(0);
            tempArr[action.payload.idx] = action.payload.input;
            if(tempArr[action.payload.idx] > 4){
                // no over 4
                tempArr[action.payload.idx] = tempArr[action.payload.idx] % 4;
            }
            if(tempArr[action.payload.idx] < 0){
                // no under 0
                tempArr[action.payload.idx] = 3;
            }
            return ({
                ...state,
                inputABVals: tempArr,
            });
        case 'pushToHistory':

            return ({
                ...state,
                inputNumVals:[1,2,3,4],
                inputABVals:[0,0],
                numHistory:state.numHistory.concat([state.inputNumVals]),
                abHistory:state.abHistory.concat([state.inputABVals]),
            });
        case 'updateListOfAllNumbers':
            return ({
                ...state,
                listOfAllNumbers: action.payload.listOfAllNumbers,
                probabilities: action.payload.probabilities,
            });
        case 'reset':
            
            return ({
                ...h_initialState,
                listOfAllNumbers:getAllNumArr(),
            });
        case 'undo':
            
            return ({
                ...state,
                inputNumVals:[1,2,3,4],
                inputABVals:[0,0],
                numHistory:state.numHistory.slice(0, -1),
                abHistory:state.abHistory.slice(0, -1),
                listOfAllNumbers:getAllNumArr(),
            });
        default:
            throw new Error();
    }
}


function TwoAOneBHacker(){
    const [state, dispatch] = useReducer(h_reducer, h_initialState);

    const handleNumInput = (e,i) => {
        // e.preventDefault();
        if(isNaN(e.nativeEvent.data)){
            return;
        }
        dispatch({type:"updateNumInput",payload:{idx:i,input:e.nativeEvent.data}});
        document.getElementsByName(`hacker-input-${(i<3?i+1:'A')}`)[0].focus();
    }
    const handleABInput = (e,i) => {
        // e.preventDefault();
        if(isNaN(e.nativeEvent.data)){
            return;
        }
        dispatch({type:"updateABInput",payload:{idx:i,input:e.nativeEvent.data}});
        document.getElementsByName(`hacker-input-B`)[0].focus();

    }

    const handleConfirm = (e) => {
        e.preventDefault();
        if(findRepeatFirstN2(state.inputNumVals.join("")) == -1){
            dispatch({type:"pushToHistory"});
        }else{
            alert("No repeating allowed");
        }
    }
    const handleStartAgain = (e) => {
        e.preventDefault();
        dispatch({type:"reset"});
    }
    const handleUndo = (e) => {
        e.preventDefault();
        dispatch({type:"undo"});
    }

    const handleFillDigit = (answer) => {
        dispatch({type:"updateNumInput",payload:{idx:0,input:answer[0]}});
        dispatch({type:"updateNumInput",payload:{idx:1,input:answer[1]}});
        dispatch({type:"updateNumInput",payload:{idx:2,input:answer[2]}});
        dispatch({type:"updateNumInput",payload:{idx:3,input:answer[3]}});

    }

    useEffect(() => {
        let emptyArray = [];

        //Use previous result
        state.listOfAllNumbers.map( (number,index) => {
            if(findRepeatFirstN2(number.answer.join("")) == -1){
                // no repeat
                //calculate satisfaction
                let satisfaction = 0;
                state.numHistory.map((val,idx) => {
                    if(getAB(val,number.answer).join("") == state.abHistory[idx].join("")){
                        satisfaction += 1;
                    }
                });
                if(satisfaction == state.numHistory.length){
                    // need to match all past AB result to go to next round
                    emptyArray.push({answer:number.answer, satisfaction:satisfaction, score: 0});
                }
            }
                    
        });
        //generate frequency count
        let frequency = Array(4).fill(Array(10).fill(0));
        emptyArray.map( (number,index) => {
            frequency[0][number.answer[0]]+=1;
            frequency[1][number.answer[1]]+=1;
            frequency[2][number.answer[2]]+=1;
            frequency[3][number.answer[3]]+=1;
        });
        let digitBias = [1,1,1,1];
        for (let n1 = 0; n1 < 4; n1++) {
            const sum = frequency[n1].reduce( (a, b) => {return a + b}, 0);
            const avg = (sum / frequency[n1].length) || 0;
            const std = Math.max(...frequency[n1])-avg;
            console.log(std);
            digitBias[n1] = std;
            // for (let n2 = 0; n2 < 10; n2++) {
            //     if(state.numHistory.flat().join("").indexOf(n2) < 0){
            //         frequency[n1][n2] += 2;
            //     }
            // }
        }
        // digitBias = digitBias.map(v => {v/Math.min(digitBias)});
        console.log(digitBias);
        emptyArray = emptyArray.map( (number,index) => {
            let score = frequency[0][number.answer[0]]*digitBias[0] +
                    frequency[1][number.answer[1]]*digitBias[1]  +
                    frequency[2][number.answer[2]]*digitBias[2]  +
                    frequency[3][number.answer[3]]*digitBias[3] ;

            return ({answer:number.answer, satisfaction:number.satisfaction, score: score});
        });




        emptyArray.sort((a,b) => (a.score > b.score) ? 1 : ((b.score > a.score) ? -1 : (Math.floor(Math.random()*3)-1)));
        // console.log(emptyArray);

        handleFillDigit(emptyArray[emptyArray.length-1].answer?emptyArray[emptyArray.length-1].answer:[1,2,3,4]);

        dispatch({type: "updateListOfAllNumbers",payload:{listOfAllNumbers:emptyArray,probabilities:frequency}});

    },[state.numHistory]);

    useEffect(()=>{
        handleFillDigit([1,2,3,4]);
    },[]);

    return (
        <div className={Styles.twoaonehacker}>
            <h1>2A1B 破解器</h1>
            <Table data={state.probabilities} max={Math.max(...state.probabilities.flat())}/>
            {[0,1,2,3].map( (val,idx) => {return(
                <input name={`hacker-input-${val}`} key={`hacker-input-${val}`} className={Styles.input} value={state.inputNumVals[idx]} onChange={e => handleNumInput(e,idx)} type="tel" />
            )})}
            <span className={Styles.digit}>→</span>
            {["A","B"].map( (val,idx) => {return(
                <span key={`hacker-input-${val}`}>
                <input name={`hacker-input-${val}`} className={Styles.input} value={state.inputABVals[idx]} onChange={e => handleABInput(e,idx)} type="tel" />
                <span className={Styles.digit}>{val}</span>
                </span>
            )})}
            <button onClick={(e)=>{handleConfirm(e)}} className={Styles.confirm}>Input</button>
            <div>
                {state.numHistory.map((num, idx) => {return (<Row key={idx} num={num} AB={state.abHistory[idx]}/>)}).slice(0).reverse()}
            </div>
            <button onClick={(e)=>{handleStartAgain(e)}} className={Styles.startagain}>🔄 Start again</button>
            <button onClick={(e)=>{handleUndo(e)}} className={Styles.startagain}>🔙🔙🔙 Undo </button>
            <div>
                <h2>可能的數字列表</h2>
                (NUM:MATCHING STEPS:SCORE)點擊會自動填入
                {state.listOfAllNumbers.map((num, idx) => {return num.satisfaction==0?null:(<div key={idx} className={Styles.suggestions} onClick={() => {handleFillDigit(num.answer)}}>{num.answer.join("")} ({num.score})</div>)}).reverse()}
            </div>
            
            
        </div>
    )
}


  export default function TwoAOneB() {
    return (
      <>
        <Head>
            <title>2A1B hack</title>
        </Head>
        <div className={Styles.grid}>
            <TwoAOneBGame />
            <TwoAOneBHacker />    
        </div>
      </>
    )
  }