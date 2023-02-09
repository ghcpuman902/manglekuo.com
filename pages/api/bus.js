import Cors from 'cors'
import request from 'request'

// Initializing the cors middleware
// You can read more about the available options here: https://github.com/expressjs/cors#configuration-options
const cors = Cors({
  methods: ['POST', 'GET', 'HEAD'],
})

// Helper method to wait for a middleware to execute before continuing
// And to throw an error when an error happens in a middleware
function runMiddleware(
  req,
  res,
  fn
) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result)
      }

      return resolve(result)
    })
  })
}

export default async function handler(
  req,
  res
) {
  // Run the middleware
  await runMiddleware(req, res, cors)

  // Rest of the API logic

    const   TheHighwayN = "490014016N", //Lvp St
            TheHighwayS = "490014016S", //Shadwell
            TobaccoDock = "490013687J", //Canary Wharf
            WellcloseSt = "490018662W"; //Night bus C.London


    const getArrivalTime = (stopID) => {
        return new Promise((resolve, reject) => {
            request({
                'method': 'GET',
                'url': `https://api.tfl.gov.uk/StopPoint/${stopID}/Arrivals`,
                'headers': {
                }
            }, function (error, response) {
                if (error) reject(error);
                let list = [];
                let responseObj = JSON.parse(response.body);
                // console.log(responseObj);
                if(responseObj.length > 0){
                    if(typeof responseObj[0]["id"] === 'undefined'){
                        throw new Error(`non-empty response but id undefined. response is as follows: ${JSON.stringify(responseObj)}`);
                    }else{
                        responseObj.forEach(el => {
                            list.push({
                                id: el.id,
                                naptanId: el.naptanId,
                                stationName: el.stationName,
                                lineName: el.lineName,
                                destinationName: el.destinationName,
                                timeToStation: el.timeToStation,
                                expectedArrival: el.expectedArrival
                            });
                        });
                    }
                }else{
                }
                resolve(list);
            });
        });
    };

    let result = {list:[],ERR:""};
    const [list1, list2] = await Promise.all([
        getArrivalTime(TobaccoDock),
        getArrivalTime(WellcloseSt)
    ]);
    result.list.push(list1);
    result.list.push(list2);
    res.status(200).send(JSON.stringify(result.list));
}




