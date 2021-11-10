import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import photoStyle from '../styles/photo.module.css'



export default function Photo() {

  return (
    <>
        <Head>
            <title>Photo</title>
        </Head>
        <div>
            <div className={photoStyle.bgWrap}>
                <Image
                    priority
                    src="/images/DSC09305.jpg"
                    alt="Mountains"
                    layout="fill"
                    objectFit="cover"
                    quality={100}
                />
                <p>Some Text</p>
            </div>
            <div className={photoStyle.floatingBox}>
                <h3>Mangle Kuo</h3>
                + Web Dev <br/>
                + Photos <br/>
                + Blog <br/>
                + Links <br/>
            </div>
        </div>
    </>
  );
}