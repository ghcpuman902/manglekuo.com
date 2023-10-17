import { kv } from '@vercel/kv';
import { type NextRequest, NextResponse } from 'next/server'

// DELETE method for deleting all keys
export async function DELETE(request: NextRequest) {
    const query = "AS::";
  // scan all keys
  for await (const key of kv.scanIterator()) {
    // check if key starts with 'AS::'
    if(key.startsWith(query)) {
      // delete the key
      await kv.del(key);
    }
  }
  
  return NextResponse.json('Keys deleted');
}

// POST method for listing all keys with query
export async function POST(request: NextRequest) {
  const query = "AS::";
  let results: {key: string, value: string}[] = [];
  
  // scan all keys
  for await (const key of kv.scanIterator()) {
    // check if key starts with 'AS::'
    if(key.startsWith(query)) {
      // get the value of the key
      let value = JSON.stringify(await kv.get(key));
      
      // slice the value to first 100 characters
      value = value ? value.slice(0, 100) : '';

      // store the key and sliced value
      results.push({key, value});
    }
  }
  
  return NextResponse.json(results);
}