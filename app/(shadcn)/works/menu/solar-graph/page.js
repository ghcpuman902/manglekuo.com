import { headers } from 'next/headers'
import { SunTrackerSVG } from './sun-tracker' 

export default function Page() {
    let vercelIpHeaders = []
  const headersList = headers()
  for (let [key] of headersList.entries()) {
    if (key.startsWith('x-vercel-ip')) {
      vercelIpHeaders.push(`${key}: ${headersList.get(key)}`)
    }
  }
  console.log(vercelIpHeaders);
    return (
        <div className="w-full max-w-6xl mx-auto pb-10 px-4" >
            <SunTrackerSVG />
            {vercelIpHeaders.map((val,idx)=>{<div key={idx}>{val}</div>})}
        </div>
    );
}