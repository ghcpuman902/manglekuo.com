import Head from 'next/head'
import Link from 'next/link'
import tenFactsStyles from '../styles/tenFacts.module.css'
import { useState, useEffect, useRef } from 'react';
import Matter from 'matter-js'
// module aliases for the 2d Physics engine, matter.js
let Engine = Matter.Engine,
    Runner = Matter.Runner,
    Render = Matter.Render,
    Bodies = Matter.Bodies,
    Composite = Matter.Composite;



///////////////////////////////////////////
///////////PAGE CONFIGURATIONS/////////////
///////////////////////////////////////////

                    // DESCRIPTION CAN BE THIS LONG DESCRIPTION CAN BE THIS LONG DESCRIPTION CAN BE THIS LONG DESCRIPTION CAN BE THIS LONG ///////////
const description = "This is one experiment with my personal website. It creats description cards of facts about me, and they floats to the top.";

// const STATIC_DENSITY = 15;
// const PARTICLE_SIZE = 6;
const PARTICLE_BOUNCYNESS = 1.01;
const THICKNESS = 100;
const WALL_HEIGHT = 10000;

/*
Personal website - falling cards about me
List of quotes or facts about me, in card form
falling from above
click or tap to disapear
new ones fall down

TODO:
- Add animations for popping
- Add interaction using cursor / touch
- Add interation using gravity
*/



const quotesArr = [
`My name is Mangle Kuo`,
<>My Instagram is <a target="_blank" href="https://www.instagram.com/ghcpuman902/">@Ghcpuman902</a><br/>or <a target="_blank" href="https://www.instagram.com/manglekuo/">@MangleKuo</a></>,
`❌❌❌❌❌❌ ❌❌❌❌❌❌ ❌❌❌❌❌❌ ❌❌❌❌❌❌ ❌❌❌❌❌❌ ❌❌❌❌❌❌ ❌❌❌❌❌❌ TAP TO POP`,
`I watch web development videos all the time 🌐`,
`I love drinking craft beer 🍺`,
`I speak fluent Mandarin & English`,
`I’m GAY 🏳️‍🌈`,
`I’m proudly from Taiwan 🇹🇼`,
`I take really good photos 📷`,
<>Listening to: <br/>Never Going Under by Circa Waves <br/>The Loneliest Time by Carly Rae Jepsen <br/>Ditto by NewJeans</>,
`Currently I'm trying to find a job in London`,
`Looking for a job in web development that’s creativity involved.`,
`CURIOSITY IS MY SUPER POWER 🦸‍♂️`,
`I’m bad at writing ✒️`,
`I didn’t finish my physics degree at Imperial College London`,
`I can find a location within London from 1 photo`,
`My high school was in London, UK`,
`My mum side family are from XiAn, China, where I did my year 1-4`,
`I'm interested in cities`,
<Link href="/">← Back to home</Link>,

];

// const quotesString = 
// `A
// B`;



///////////////////////////////////////////
///////////////////////////////////////////
///////////////////////////////////////////


const Trfrm2Dtext = (x,y,a) => {
  return `translate(${x}px, ${y}px) rotate(${a * (180/Math.PI)}deg)`;
}


const generateCardVertices = (x,y,w,h) => {
  let r = 15;
  let vArr = [];
  vArr.push({x: x-w/2, y: y-h/2+r});
  vArr.push({x: x-w/2+r, y: y-h/2});
  vArr.push({x: x+w/2-r, y: y-h/2});
  vArr.push({x: x+w/2, y: y-h/2+r});
  vArr.push({x: x+w/2, y: y+h/2-r});
  vArr.push({x: x+w/2-r, y: y+h/2});
  vArr.push({x: x-w/2+r, y: y+h/2});
  vArr.push({x: x-w/2, y: y+h/2-r});

  return vArr;
}


const Card = (props) => {
  const cardRef = useRef(null);    

  const [isShow, setIsShow] = useState(true);

  const matterBody = useRef();

  const isAdded = useRef(false);

  const initX = useRef(),
        initY = useRef(),
        initWidth = useRef(),
        initHeight = useRef();


  const requestRef = useRef();
  const animateThisCard = () => {

    if (cardRef.current && !isAdded.current) {
      // console.log(cardRef.current.getBoundingClientRect());
      let {x,y,width,height} = cardRef.current.getBoundingClientRect();
      [initX.current,initY.current,initWidth.current,initHeight.current] = [x,y,width,height];
      
      matterBody.current = Bodies.fromVertices(initX.current+(initWidth.current/2)+Math.floor(Math.random()*window.innerWidth), initY.current+(initHeight.current/2)+(props.id-4)*200, generateCardVertices(x+Math.floor(Math.random()*window.innerWidth),y+(props.id-4)*200,width,height), {
          restitution: PARTICLE_BOUNCYNESS,
      });


      props.addBody(matterBody.current);
      isAdded.current = true;
    }

    if (cardRef.current && isShow && isAdded.current && props.getAnglePos(props.id)) {

          
      const thisCard = props.getAnglePos(props.id);


      // console.log(`${thisCard.angle}º, x:${thisCard.position.x} y:${thisCard.position.y} `);

      // console.log(cardRef.current);
      // let Trfrm2D = Trfrm2Dtext(thisCard.position.x-initX.current-initWidth.current/2, thisCard.position.y-initY.current-initHeight.current/2,thisCard.angle );
      
      let Trfrm2D = `rotate(${thisCard.angle * (180/Math.PI)}deg)`;
      cardRef.current.style.transform = Trfrm2D;
      cardRef.current.style.position = `absolute`;
      cardRef.current.style.left = `${thisCard.position.x-initX.current-initWidth.current/2}px`;
      cardRef.current.style.top = `${thisCard.position.y-initY.current-initHeight.current/2}px`;
      // console.log(thisCard.position.x-initX.current-initWidth.current/2, thisCard.position.y-initY.current-initHeight.current/2,thisCard.angle );
      
    }
    requestRef.current = requestAnimationFrame(animateThisCard);
  }
  
  useEffect(() => {
    requestRef.current = requestAnimationFrame(animateThisCard);
    return () => {
      window.cancelAnimationFrame(animateThisCard);
      
    };
  }, []);

  const handleClick = () => {
    if(props.children != (<Link href="/">← Back to home</Link>)){
      setIsShow(false);
      props.rmvBody(matterBody.current.id);
    }
  }

  return isShow?(
    <div ref={cardRef} className={tenFactsStyles.card} onClick={handleClick}>
        <p>{props.children}</p>
    </div>
  ):null;
}


export default function tenFacts() {
    const boxRef = useRef(null);
    const canvasRef = useRef(null);

    const [constraints, setContraints] = useState()

    const world = useRef();
    const engine = useRef();
    const runner = useRef();  


    const rqusAnimtRef = useRef();
    const animate = () => {
      if (world.current != undefined) {
        let view = boxRef.current.getBoundingClientRect();
        const WIDTH = view.width, 
              HEIGHT = view.height;

        let canvas = canvasRef.current;
        canvas.opacity=0;
        let context = canvas.getContext('2d');

        canvas.width = WIDTH;
        canvas.height = HEIGHT;

        var bodies = world.current.bodies;
      //  console.log(bodies);
    
        context.fillStyle = '#aaa';
        context.fillRect(0, 0, canvas.width, canvas.height);
    
        context.beginPath();
    
        for (var i = 0; i < bodies.length; i += 1) {
            var vertices = bodies[i].vertices;
    
            context.moveTo(vertices[0].x, vertices[0].y);
    
            for (var j = 1; j < vertices.length; j += 1) {
                context.lineTo(vertices[j].x, vertices[j].y);
            }
    
            context.lineTo(vertices[0].x, vertices[0].y);
        }
    
        context.lineWidth = 1;
        context.strokeStyle = '#000';
        context.stroke();
      }
      rqusAnimtRef.current = requestAnimationFrame(animate);
    }
    


    useEffect(() => {
      let view = boxRef.current.getBoundingClientRect();
      const WIDTH = view.width, 
            HEIGHT = view.height;
      // create an engine
      engine.current = Engine.create({gravity: {x:0,y:-0.2}});
      
      var roof = Bodies.rectangle(WIDTH/2, 0-THICKNESS/2, WIDTH, THICKNESS, { isStatic: true, friction: 0.1 });
      var wallLeft = Bodies.rectangle(0-THICKNESS/2, (HEIGHT+WALL_HEIGHT)/2, THICKNESS, HEIGHT+WALL_HEIGHT, { isStatic: true, friction: 0.1 });
      var wallRight = Bodies.rectangle(WIDTH+THICKNESS/2, (HEIGHT+WALL_HEIGHT)/2, THICKNESS, HEIGHT+WALL_HEIGHT, { isStatic: true, friction: 0.1 });
      var ball = Bodies.circle(400, HEIGHT, 5, { restitution: PARTICLE_BOUNCYNESS });

      // add all of the bodies to the world
      Composite.add(engine.current.world, [roof, wallLeft, wallRight, ball])
      // create runner
      runner.current = Runner.create();
      // run the engine
      Runner.run(runner.current, engine.current);

      world.current = engine.current.world;


      setContraints(boxRef.current.getBoundingClientRect());

      rqusAnimtRef.current = requestAnimationFrame(animate);
      window.addEventListener('resize', handleResize);

      return () => {
        cancelAnimationFrame(rqusAnimtRef.current);
        window.removeEventListener('resize', handleResize)
      }
    }, []);




    const handleResize = () => {
      setContraints(boxRef.current.getBoundingClientRect())
    }

    useEffect(() => {
      if (constraints && canvasRef.current) {
        let view = constraints;
        const WIDTH = view.width, 
              HEIGHT = view.height;

        let canvas = canvasRef.current;

        canvas.width = WIDTH;
        canvas.height = HEIGHT;

        var bodies = world.current.bodies;

        const roof = bodies[0];
        const wallLeft = bodies[1];
        const wallRight = bodies[2];

        // var roof = Bodies.rectangle(WIDTH/2, HEIGHT, WIDTH, STATIC_DENSITY, { isStatic: true });
        Matter.Body.setPosition(roof, {
          x: WIDTH / 2,
          y: 0-THICKNESS/2,
        })
        Matter.Body.setVertices(roof, [
          { x: 0, y: 0 - THICKNESS },
          { x: WIDTH, y: 0 - THICKNESS },
          { x: WIDTH, y: 0 },
          { x: 0, y: 0 },
        ])

        // var wallLeft = Bodies.rectangle(0+THICKNESS/2, HEIGHT/2, THICKNESS, HEIGHT);
        Matter.Body.setPosition(wallLeft, {
          x: 0-THICKNESS/2,
          y: (HEIGHT+WALL_HEIGHT)/2,
        })
        Matter.Body.setVertices(wallLeft, [
          { x: -1*THICKNESS, y: 0 },
          { x: 0, y: 0 },
          { x: 0, y: HEIGHT+WALL_HEIGHT },
          { x: -1*THICKNESS, y: HEIGHT+WALL_HEIGHT },
        ])

        // var wallRight = Bodies.rectangle(WIDTH-THICKNESS/2, HEIGHT/2, THICKNESS, HEIGHT);
        Matter.Body.setPosition(wallRight, {
          x: WIDTH+THICKNESS/2,
          y: (HEIGHT+WALL_HEIGHT)/2,
        })
        Matter.Body.setVertices(wallRight, [
          { x: WIDTH, y: 0 },
          { x: WIDTH+THICKNESS, y: 0 },
          { x: WIDTH+THICKNESS, y: HEIGHT+WALL_HEIGHT },
          { x: WIDTH, y: HEIGHT+WALL_HEIGHT },
        ])

      }
    }, [constraints])




    const getAnglePos = (id) => {
      if (world.current != undefined) {
        var bodies = world.current.bodies;
        return bodies.filter(val => val.id==id)[0];
      }
      return "BE";
    }

    const addBody = (body) => {
      Composite.add(
        world.current,
        [body],
      );
    }

    const rmvBody = (bodyID) => {
      console.log(`removing ID`,bodyID);
      let thisCard = world.current.bodies.find(el => el.id == bodyID); 
      console.log(`removing`,thisCard); 
      if(thisCard){
        console.log(`removing`,thisCard);
        Composite.remove(
          world.current,
          thisCard,
        )
      }
    }

    return (
      <>
        <Head>
            <title>10 facts about me</title>
            <link rel="stylesheet" href="https://use.typekit.net/wxd0kfu.css" />
            <meta name="description" content={description}></meta>
        </Head>
        <div ref={boxRef} className={tenFactsStyles.main}>
        <canvas ref={canvasRef} style={{display:`none`}}/>
        {
            quotesArr.map((val, idx) => {
                return (
                    <Card key={idx+5} id={idx+5} getAnglePos={getAnglePos} addBody={addBody} rmvBody={rmvBody}>{val}</Card>
                )
            })
        }
        </div>

      </>
    )
  }