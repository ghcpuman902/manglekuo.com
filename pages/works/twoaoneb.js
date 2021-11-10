import Layout from '../../components/layout'
import Styles from'/styles/twoaoneb.module.css'
import Head from 'next/head'
import { useEffect , useState } from 'react'


function Digit({digit}){
    return (
        <span className={Styles.digit}>{digit}</span>
    );
}

function Row({num, AB}){
    return (
        <div className={Styles.row}>
            <Digit digit={num[0]} />
            <Digit digit={num[1]} />
            <Digit digit={num[2]} />
            <Digit digit={num[3]} />
            <span>{`A${AB[0]}B${AB[1]}`}</span>
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
    console.log(guessedNumArr, correctNumArr);
    let A = 0;
    let B = 0;
    correctNumArr.map((val,idx) => {
        console.log(val,guessedNumArr[idx],"A");
        if(val == guessedNumArr[idx]){
            A += 1;
            return;
        }
        console.log(val,guessedNumArr.join("").indexOf(val),"B");
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
        console.log(inputVals.slice(0),tempArr[i]);
        tempArr[i] = e.target.value;
        if(tempArr[i] > 10){
            // no over 10
            tempArr[i] = tempArr[i] % 10;
        }
        if(tempArr[i] < 0){
            // no under 0
            tempArr[i] = 0;
        }
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
        <>
            {[0,1,2,3].map( (val,idx) => {return(
                <input name={`input-${val}`} key={val} className={Styles.input} value={inputVals[val]} onChange={e => handleInput(e,val)} type="number" min="0" max="9" step="1" />
            )})}
            <button onClick={()=>{handleConfirm()}} className={Styles.confirm}>Confirm</button>
            <div>
                {numHistory.map((num, idx) => {return (<Row key={idx} num={num} AB={abHistory[idx]}/>)}).slice(0).reverse()}
            </div>
            <button onClick={()=>{handleStartAgain()}} className={Styles.startagain}>Start again</button>
        </>
    )
  }


  export default function TwoAOneB() {


    return (
      <Layout>
        <Head>
            <title>2A1B hack</title>
        </Head>
        <article>
            <h1>2A1B 破解器</h1>
            <TwoAOneBGame />
        </article>
      </Layout>
    )
  }