import { type NextRequest, NextResponse } from 'next/server'
import { cache } from 'react'

async function replaceCharsWithASCII(inputString: string) : Promise<{response: string, timeNow: string}>  {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          // Split the string into an array of characters
          let chars = inputString.split('');
  
          // Replace each character with its ASCII representation
          let result = chars.map(char => char.charCodeAt(0)).join(' ');
          const response = result;
          const now = new Date(); 
          const timeNow = now.toLocaleString(); 
  
          // Resolve the promise with the result
          resolve({response,timeNow});
        } catch (error) {
          // If an error occurs, reject the promise with the error
          const now = new Date(); 
          const timeNow = now.toLocaleString(); 
          reject({response:error,timeNow});
        }
      }, 5000); // Add a delay of 5 seconds
    });
}
const testCacheFunction = cache(replaceCharsWithASCII);


export async function POST(request: NextRequest) {
    const { text } = await request.json();

    let {response,timeNow} = await testCacheFunction(text);

    return NextResponse.json({response,timeNow});
}