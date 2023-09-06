import { type NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers';

// function hashForDB(message: string){
// // Convert the message to an ArrayBuffer
// const encoder = new TextEncoder();
// const data = encoder.encode(message);
// // Compute the hash using the SHA-256 algorithm
// crypto.subtle.digest("SHA-256", data)
//   .then(hash => {
//     // Convert the hash to a hexadecimal string
//     const hashArray = Array.from(new Uint8Array(hash));
//     const hashHex = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
//     return hashHex; // Output the hash
//   })
//   .catch(error => {
//     console.error(error);
//     return "";
//   });
// }

export async function POST(request: NextRequest) {
  const cookieStore = cookies()
  let  result = {};
  if(cookies().get('email')?.value && cookies().get('name')?.value && cookies().get('picture')?.value){
    result = {
      email:cookieStore.get('email')?.value,
      name:cookieStore.get('name')?.value,
      picture:cookieStore.get('picture')?.value,
    };
  }else{
    cookies().delete('email');
    cookies().delete('name');
    cookies().delete('picture');
    if(cookies().get('email')?.value!=='' || cookies().get('name')?.value!=='' || cookies().get('picture')?.value!==''){
      throw new Error('cookie can not be deleted');
    }
  }
  return NextResponse.json({result:result})
}