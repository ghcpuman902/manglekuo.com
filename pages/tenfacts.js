import Head from 'next/head'
import tenFactsStyles from '../styles/tenFacts.module.css'
import { useState, useEffect, useRef } from 'react';
import Matter from 'matter-js'
// module aliases
let Engine = Matter.Engine,
    Runner = Matter.Runner,
    Render = Matter.Render,
    Bodies = Matter.Bodies,
    Composite = Matter.Composite;



const STATIC_DENSITY = 15;
const PARTICLE_SIZE = 6;
const PARTICLE_BOUNCYNESS = 1.1;
const THICKNESS = 100;
const WALL_HEIGHT = 10000;

/*
Personal website - falling cards about me
List of quotes or facts about me, in card form
falling from above
click or tap to disapear
new ones fall down


*/



const quotesString = 
`CURIOSITY IS MY SUPER POWER
Let’s be honest I’m only 24 and I don’t know who I am and what I want
I’m bad at writing
I didn’t finish my physics degree at Imperial College London
I watch web development videos all the time
I love drinking craft beer but I’m terrible at remembering everything
I’m GAY
I’m from Taiwan
I enjoy doing photography
Looking for a job in web development that’s creativity involved.
My name is Mangle Kuo
My Instagram is @MangleKuo
I love listening to Jolin Tsai, MAMAMOO, Lorde
Currently I work for a AR glasses design house
Keep up with the good work

Taipei / London`;

// const quotesString = 
// `A
// B`;


const quotesArr = quotesString.split("\n");

const Trfrm2Dtext = (x,y,a) => {
  return `translate(${x}px, ${y}px) rotate(${a * (180/Math.PI)}deg)`;
}





const Card = (props) => {
    const cardRef = useRef(null);

    const [isShow, setIsShow] = useState(true);
    const [isAdded, setIsAdded] = useState(false);
    const [matterBodyId, setMatterBodyId] = useState(null);

    let matterBody, renderCard;

    useEffect(() => {
      let {world, engine, runner} = props;
      console.log("world",world);

      if (world && cardRef.current && !isAdded) {
        // console.log(cardRef.current.getBoundingClientRect());
        let {x,y,width,height} = cardRef.current.getBoundingClientRect();
        let [initX,initY,initWidth,initHeight] = [x,y,width,height];
        matterBody = Bodies.rectangle(initX+(initWidth/2), initY+(initHeight/2), initWidth, initHeight, {
            restitution: PARTICLE_BOUNCYNESS,
        });

        Composite.add(
          world,
          [matterBody],
        );
        setMatterBodyId(matterBody.id);
        setIsAdded(true);
      }

      return () => {
        if (world && matterBodyId) {

          let thisCard = world.bodies.find(element => element.id == matterBodyId);  
          console.log("unmounted",thisCard);
            if(thisCard){
              Composite.remove(
                world,
                thisCard,
              )
              window.cancelAnimationFrame(renderCard);
            }
        }
      };
    });

    // useEffect(() => {
    //   let {world, engine, runner} = props;

    //   if (world && matterBodyId) {
    //     console.log(matterBodyId,isShow,Composite.get(world, matterBodyId));
    //     if(!isShow && Composite.get(world, matterBodyId)){
    //       let matterBody = Composite.get(world, matterBodyId);
    //       Composite.remove(
    //         world,
    //           matterBody,
    //       )
    //       window.cancelAnimationFrame(renderCard);
    //     }
    //   }
    // }, [isShow]);

    useEffect(() => {
      let {world, engine, runner} = props;

      if (world && matterBodyId) {

  
        let {x,y,width,height} = cardRef.current.getBoundingClientRect();
        let [initX,initY,initWidth,initHeight] = [x,y,width,height];

        renderCard = () => {
            
          if(isShow && cardRef.current){
            // console.log("renderCard");
            // console.log(world);
            // console.log(`added card id ${matterBodyId}`);
            let thisCard = world.bodies.find(element => element.id == matterBodyId);  
            // console.log(thisCard);

            // console.log(`${thisCard.angle}º, x:${thisCard.position.x} y:${thisCard.position.y} `);

            // console.log(cardRef.current);
            let Trfrm2D = Trfrm2Dtext(thisCard.position.x-initX-initWidth/2, thisCard.position.y-initY-initHeight/2,thisCard.angle );
            cardRef.current.style.transform = Trfrm2D;
            window.requestAnimationFrame(renderCard);
          }
      
        };

      }
    },[matterBodyId]);

    return isShow?(
        <div ref={cardRef} className={tenFactsStyles.card} onClick={ () => {setIsShow(false)} }>
            <p>{props.text}</p>
        </div>
    ):null;
}


export default function tenFacts() {
    const boxRef = useRef(null)
    const canvasRef = useRef(null)

    const [constraints, setContraints] = useState()
    const [world, setWorld] = useState()

    let engine, render, runner;

    const handleResize = () => {
        setContraints(boxRef.current.getBoundingClientRect())
    }

    useEffect(() => {
      // When component mount
      let view = boxRef.current.getBoundingClientRect();
      const WIDTH = view.width, 
            HEIGHT = view.height;

      // create an engine
      engine = Engine.create({gravity: {x:0,y:-1}});

      // create an rederer for debug 
      // render = Render.create({
      //   element: boxRef.current,
      //   engine: engine,
      //   canvas: canvasRef.current,
      //   options: {
      //     width: WIDTH,
      //     height: HEIGHT,
      //     background: 'rgba(255, 0, 0, 0.5)', // 'transparent',
      //     wireframes: false,
      //   },
      // })



      // create two walls and a ground
      var roof = Bodies.rectangle(WIDTH/2, 0-THICKNESS/2, WIDTH, THICKNESS, { isStatic: true });

      var wallLeft = Bodies.rectangle(0-THICKNESS/2, (HEIGHT+WALL_HEIGHT)/2, THICKNESS, HEIGHT+WALL_HEIGHT, { isStatic: true });
      var wallRight = Bodies.rectangle(WIDTH+THICKNESS/2, (HEIGHT+WALL_HEIGHT)/2, THICKNESS, HEIGHT+WALL_HEIGHT, { isStatic: true });
      var ball = Bodies.circle(40, HEIGHT, 30, { restitution: PARTICLE_BOUNCYNESS });

      // add all of the bodies to the world
      Composite.add(engine.world, [roof, wallLeft, wallRight, ball])

      // run the renderer
      // Render.run(render)

      // console.log(render.engine.world.bodies[3].position.x);


      // create runner
      runner = Runner.create();

      // run the engine
      Runner.run(runner, engine);

      (function render() {
        let canvas = canvasRef.current;
        let context = canvas.getContext('2d');

        canvas.width = WIDTH;
        canvas.height = HEIGHT;

        var bodies = Composite.allBodies(engine.world);
        // console.log(bodies);
    
        window.requestAnimationFrame(render);
    
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
    })();




      setContraints(boxRef.current.getBoundingClientRect())
      setWorld(engine.world)
      window.addEventListener('resize', handleResize)
      
      return () => {
        window.removeEventListener('resize', handleResize)
      }
    }, [])

    useEffect(() => {
      if (constraints) {
        let view = constraints;
        const WIDTH = view.width, 
              HEIGHT = view.height;
        // Dynamically update canvas and bounds
        // scene.bounds.max.x = WIDTH
        // scene.bounds.max.y = HEIGHT
        // scene.options.width = WIDTH
        // scene.options.height = HEIGHT
        // scene.canvas.width = WIDTH
        // scene.canvas.height = HEIGHT
        // Dynamically update floor


        var bodies = Composite.allBodies(world);
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
    }, [world, constraints])
    



    return (
      <>
        <Head>
            <title>10 facts about me</title>
        </Head>
        <div ref={boxRef} className={tenFactsStyles.main}>
        <canvas ref={canvasRef} />
        {
            quotesArr.map((val, idx) => {
                return (
                    <Card key={idx} text={val} world={world} engine={engine} runner={runner}  constraints={constraints} />
                )
            })
        }
        </div>

      </>
    )
  }