import Layout from '../../components/layout'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import Pusher from 'pusher-js';
import { FetchError } from 'node-fetch';


export default function Post() {
    const [result, setResult] = useState("");

    useEffect(()=>{
        var pusher = new Pusher('dff952f2acad25a5a7d5', {
            cluster: 'ap3'
        });
      
        var channel = pusher.subscribe('my-channel');
        channel.bind('my-event', function(data) {
            console.log("PUSHER received",JSON.stringify(data));
            setResult(data.message);
        });
    },[]);

    const handleChange = (e) => {
        fetch('/api/syncPaste', {
            method: 'POST',
            body: JSON.stringify({message: e.target.value})
        }).then(response => response.json())
        .then(data => {console.log(data.result)});
    }


    return (
      <Layout>
        <Head>
            <title>Sync Paste</title>
        </Head>
        <article>
            <h1>Sync Paste</h1>
            Sent on change
            <textarea style={{width: 300, height: 100}} onChange={(e) => {handleChange(e)}}></textarea>
            Received
            <textarea style={{width: 700, height: 500}} value={result} readOnly></textarea>
            
        </article>
      </Layout>
    )
  }
