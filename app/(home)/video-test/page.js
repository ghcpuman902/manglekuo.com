'use client'
import Link from 'next/link';
import aS from '../index.module.css'
import { useState, useEffect, useRef } from 'react';


function VideoElementMutedIsTrue() {
    return (<><video src="/images/Output6.mp4" width="820" height="880" autoPlay={true} playsInline={true} muted={true}>
    </video></>)
}

function VideoElementMuted() {
    return (<><video src="/images/Output6.mp4" width="820" height="880" autoPlay={true} playsInline={true} muted>
    </video></>)
}
function VideoElementMutedIsMuted() {
    return (<><video src="/images/Output6.mp4" width="820" height="880" autoPlay={true} playsInline={true} muted="muted">
    </video></>)
}
export default function Page() {

    const [replayTrigger, setReplayTrigger] = useState(0);

    return (
        <div className="w-full px-3">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                <div className='border border-neutral-100 shadow rounded-lg p-3'>
                    <VideoElementMutedIsTrue />
                    <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
                        {`<video src="/images/Output6.mp4" width="820" height="880" autoPlay={true} playsInline={true} muted={true}>
                </video>`}
                    </code>
                </div>
                <div className='border border-neutral-100 shadow rounded-lg p-3'>

                    <VideoElementMuted />
                    <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
                        {`<video src="/images/Output6.mp4" width="820" height="880" autoPlay={true} playsInline={true} muted>
                </video>`}
                    </code>
                </div>
                <div className='border border-neutral-100 shadow rounded-lg p-3'>

                    <VideoElementMutedIsMuted />
                    <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
                        {`<video src="/images/Output6.mp4" width="820" height="880" autoPlay={true} playsInline={true} muted='muted'>
                </video>`}
                    </code>
                </div>
            </div>
            <div className="max-w-[800px] mx-auto my-8 pt-10 text-[16px]/[24px] [&_a]:underline">
                <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl text-slate-800">
                    observation: <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono font-semibold">
                        {`muted=\{true\}`}
                    </code> is removed by React
                </h1>
                <p className="leading-7 [&:not(:first-child)]:mt-6">
                    Today (16 Nov 2023) I realised the video autoplay on my website stopped working on the phone.
                </p>
                <p className="leading-7 [&:not(:first-child)]:mt-6">
                    I think it is caused by missing muted attribute, as stated in <Link href="https://developer.apple.com/documentation/webkit/delivering_video_content_for_safari/">this Safari article</Link>:
                </p>
                <blockquote className="mt-6 border-l-2 pl-6 italic">
                    "autoplay executes only if the video doesn’t contain an audio track, or if the video element includes the muted attribute"
                </blockquote>
                <p className="leading-7 [&:not(:first-child)]:mt-6">
                    And the browser tool does indeed show <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
                        {`<video class="_home__video__VBdxx _home__root__zbqsU" src="/images/Output6.mp4" width="820" height="880" autoplay playsinline></video>`}
                    </code> with the muted attribute missing.
                </p>
                <p className="leading-7 [&:not(:first-child)]:mt-6">
                    Here I test how different ways of wrtting the muted attribute in jsx got turned into html:
                </p>
            </div>
            <div className="max-w-[800px] mx-auto my-8 pt-10 text-[16px]/[24px] [&_a]:underline">
                <p className="leading-7 [&:not(:first-child)]:mt-6">
                    After making sure there are no update on any browser policy (they don't like things happening without user asking for it),{" "}
                    I started checking <Link href="https://developer.apple.com/documentation/webkit/delivering_video_content_for_safari/">this safari doc</Link> again{" "}
                    and thought it might be issues with one of the attribute on the video tag.
                </p>
            </div>
        </div>);
}