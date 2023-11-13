import React from 'react';
import { Badge } from '@components/ui/badge';

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@components/ui/card"
import Image from 'next/image';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGlobe } from '@fortawesome/free-solid-svg-icons'
import { faLinkedin, faGithub, faInstagram, faBehance, faMedium, faJs, faReact } from '@fortawesome/free-brands-svg-icons'
import Link from 'next/link';
const icons = { faLinkedin, faGithub, faInstagram, faBehance, faMedium, faGlobe };

const socialLinks = [
    { icon: "faLinkedin", url: "https://www.linkedin.com/in/htkuo", username: "LinkedIn.com/in/htkuo" },
    { icon: "faGithub", url: "https://github.com/ghcpuman902", username: "GitHub@ghcpuman902" },
    { icon: "faInstagram", url: "https://www.instagram.com/manglekuo/", username: "Instagram@manglekuo" },
    { icon: "faBehance", url: "https://www.behance.net/manglekuo", username: "Be.net/manglekuo" },
    { icon: "faMedium", url: "https://manglekuo.medium.com/", username: "Medium@manglekuo" },
    { icon: "faGlobe", url: "https://manglekuo.com/", username: "https://manglekuo.com (you are here!)" },
]

const SkillBadge = ({ skill, color }) => (
    <Badge variant="outline" className={`mr-2 mb-2 ${color}`}>
        {skill}
    </Badge>
);

const techSkills = ['JavaScript', 'TypeScript', 'React', 'Next.js', 'Node.js', 'GPT', 'embeddings', 'HTML', 'CSS', 'Python', 'SQL', 'Tailwinds', 'RESTful', 'Prisma', 'AWS', 'Kubernetes', 'Alibaba Cloud'];
const designSkills = ['UI/UX Design', 'Web Design', 'Photoshop', 'Illustrator', 'Figma'];
const threeDSkills = ['3D Modelling', 'Blender', 'Autodesk Fusion 360'];
const PMSkills = ['Project Management', 'Asana', 'Slack', 'Trello'];
const languages = ['English (fluent)', 'Mandarin (native)', 'Japanese (basic)'];

const certifications = [
    {
        icon: faJs,
        url: "https://freecodecamp.org/certification/manglekuo/javaScript-algorithms-and-data-structures",
        certificationTitle: "JavaScript Algorithms and Data Structures Developer Certification"
    },
    {
        icon: faReact,
        url: "https://www.freecodecamp.org/certification/manglekuo/front-end-development-libraries",
        certificationTitle: "Front End Development Libraries Developer Certification"
    },
]

const experience = [
    {
        "position": "IT and Business Development Consultant",
        "company": "Quintex",
        "duration": "Mar 2023 - Sep 2023",
        "location": "Taipei, Taiwan | Remote",
        "workType": "Project-Based",
        "points": [
            "Revamped Quintex's digital footprint by skillfully leveraging Figma, Next.js, and Sanity CMS for their website overhaul.",
            "Enhanced data analysis and API integration capabilities by employing OpenAI API for comprehensive exhibitor evaluation reports.",
            "Demonstrated project management excellence from conception to delivery, including material preparation and presentation at a key exhibition in China."
        ]
    },
    {
        "position": "Software Project Manager",
        "company": "Leapsy Co",
        "duration": "Jul 2020 - Dec 2021",
        "location": "Taipei, Taiwan | Shenzhen, China",
        "workType": "Full-Time",
        "points": [
            "Spearheaded two AR/XR projects, delivering enhanced user experiences across iOS, Android, and smart TV platforms via a Mixed Reality OS.",
            "Expanded technical horizons in Android development with Kotlin, C# for Unity, and Flutter.",
            "Pioneered the integration of MediaPipe Gesture Recognition and AirBnB Lottie, and developed GPS and Gyro cursor testing software using Flutter, significantly boosting project capabilities.",
            "Elevated team productivity by 50% through effective communication and utilisation of project tracking tools.",
            "Tailored AR solutions to diverse industry requirements, showcasing adaptability and client-focused innovation."
        ]
    },
    {
        "position": "Editor / Translator",
        "company": "MuFuTianWen",
        "duration": "Jan 2017 - Present",
        "location": "Remote",
        "workType": "Volunteer",
        "points": [
            "Translated and edited astronomy articles for a WeChat account with over 150,000 subscribers, achieving up to 100,000 reads per article.",
            "Developed a bespoke translation topic analysis tool using OpenAI's Embedding and GPT APIs, enhancing content relevance by integrating RSS feeds from news websites."
        ]
    },
    {
        "position": "Web Developer",
        "company": "ImpVis",
        "duration": "Jun 2017 - Sep 2017",
        "location": "London, UK",
        "workType": "Summer Project",
        "points": [
            "Contributed to the pioneering team at Imperial College London, developing interactive educational visualisations for STEM modules.",
            "Collaborated effectively in a team environment, focusing on demystifying abstract concepts and contributing to expansion across four academic departments."
        ]
    }
]

const education = [
    {
        "course": "Introduction to Kubernetes on edX",
        "provider": "edX",
        "duration": "in progress; aim to finish Nov 2023",
        "points": [],
        "status": "current",
        "location": "Online"
    },
    {
        "course": "Google Project Management Certificate on Coursera",
        "provider": "Coursera",
        "duration": "in progress; aim to finish Dec 2023",
        "points": [],
        "status": "current",
        "location": "Online"
    },
    {
        "course": "B.Sc. in Physics",
        "provider": "Imperial College London",
        "duration": "2015 - 2017",
        "points": [
            "Worked as a key member on a summer project (ImperialVisualisations) to create interactive websites as educational tools for the university.",
            "As the president of the Taiwanese Society, orchestrated cross-university events and directed an international academic collaboration from Taiwanese Universities."
        ],
        "status": "completed",
        "location": "London"
    },
    {
        "course": "A levels Maths, Further Maths, Physics A*A*A",
        "provider": "Aldenham School",
        "duration": "2013 - 2015",
        "points": [],
        "status": "completed",
        "location": "London"
    }
]


export default async function Page() {

    return (
        <>
            <div className="grid grid-cols-1 md:grid-rows-4 md:grid-cols-2 xl:grid-rows-2 xl:grid-cols-4 xl:grid-flow-col-dense gap-4 mx-3 md:mx-5 my-8 pt-10">
                <Card className="relative overflow-clip">
                    <CardHeader>
                        <CardTitle>Hao-Tsun Kuo</CardTitle>
                        <CardDescription>a.k.a. Mangle Kuo</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p><a href="mailto:manglekuo@gmail.com">MangleKuo@gmail.com</a></p><p><a href="tel:+447449861436">07449861436</a></p><p>London E1W 2DG</p>
                    </CardContent>
                    {/* <CardFooter>
                    <p>Card Footer</p>
                </CardFooter> */}
                    <Image src="/cv_assets/Head.png" width="397" height="306" className='w-1/2 absolute right-0 bottom-0' />
                </Card>
                <Card className="">
                    <CardHeader>
                        <CardTitle>skills</CardTitle>
                        {/* <CardDescription>aka Mangle Kuo</CardDescription> */}
                    </CardHeader>
                    <CardContent>
                        <div className="text-sm">
                            {techSkills.map(skill => <SkillBadge skill={skill} key={crypto.randomUUID()} color="border-blue-400" />)}
                            {designSkills.map(skill => <SkillBadge skill={skill} key={crypto.randomUUID()} color="border-purple-400" />)}
                            {threeDSkills.map(skill => <SkillBadge skill={skill} key={crypto.randomUUID()} color="border-pink-400" />)}
                            {PMSkills.map(skill => <SkillBadge skill={skill} key={crypto.randomUUID()} color="border-green-400" />)}
                        </div>
                    </CardContent>
                    {/* <CardFooter>
                    <p>Card Footer</p>
                </CardFooter> */}
                </Card>
                <Card className="">
                    <CardHeader>
                        <CardTitle>connect</CardTitle>
                        {/* <CardDescription>aka Mangle Kuo</CardDescription> */}
                    </CardHeader>
                    <CardContent>
                        <div className="table text-md">
                            {socialLinks.map((link) => (
                                <div className="table-row" key={crypto.randomUUID()}>
                                    <div className="table-cell text-center">
                                        <FontAwesomeIcon icon={icons[link.icon]} />
                                    </div>
                                    <div className="table-cell pl-2">
                                        <a href={link.url}>{link.username}</a>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
                <Card className="">
                    <CardHeader>
                        <CardTitle>certifications</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="table text-md">
                            {certifications.map((cert) => (
                                <div className="table-row" key={crypto.randomUUID()}>
                                    <div className="table-cell text-center">
                                        <FontAwesomeIcon icon={cert.icon} />
                                    </div>
                                    <div className="table-cell pl-2">
                                        <a href={cert.url}>{cert.certificationTitle}</a>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
                <Card className="row-span-2 md:col-span-2 flex flex-col">
                    <CardHeader>
                        <CardTitle>experience</CardTitle>
                    </CardHeader>
                    <CardContent className="md:relative h-full max-h-full pr-0">
                        <div className="flex flex-row space-x-4 overflow-x-auto md:absolute inset-0 px-1 md:px-6 mb-4">
                            {experience.map((exp, index) => (
                                <Card className="text-sm min-w-[300px] md:min-w-[400px] lg:min-w-[330px] flex flex-col" key={crypto.randomUUID()}>
                                    <CardHeader>
                                        <CardTitle>{`${exp.position}`}</CardTitle>
                                        <CardDescription>{exp.company} ({exp.duration})</CardDescription>
                                    </CardHeader>
                                    <CardContent className="grow">
                                        <ul className="list-disc [&>li]:mt-2">
                                            {exp.points.map((point, i) => (
                                                <li key={i}>{point}</li>
                                            ))}
                                        </ul>
                                    </CardContent>
                                    <CardFooter className="flex-col text-neutral-400">
                                        <div className="w-full text-right lowercase">{exp.workType}</div>
                                        <div className="w-full text-right uppercase">{exp.location}</div>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
            <div className="grid grid-cols-1 md:grid-rows-3 md:grid-cols-2 xl:grid-rows-2 xl:grid-cols-4 gap-4 m-3 md:m-5">


                <Card className="row-span-2 md:col-span-2 flex flex-col">
                    <CardHeader>
                        <CardTitle>education</CardTitle>
                    </CardHeader>
                    <CardContent className="md:relative h-full max-h-full pr-0">
                        <div className="flex flex-row space-x-4 overflow-x-auto md:absolute inset-0 px-1 md:px-6 mb-4">
                            {education.map((edu, index) => (
                                <Card className="text-sm min-w-[300px] md:min-w-[400px] lg:min-w-[330px] flex flex-col" key={crypto.randomUUID()}>
                                    <CardHeader>
                                        <CardTitle>{`${edu.course}`}</CardTitle>
                                        <CardDescription>{edu.provider} ({edu.duration})</CardDescription>
                                    </CardHeader>
                                    <CardContent className="grow">
                                        <ul className="list-disc [&>li]:mt-2">
                                            {edu.points.map((point, i) => (
                                                <li key={i}>{point}</li>
                                            ))}
                                        </ul>
                                    </CardContent>
                                    <CardFooter className="flex-col text-neutral-400">
                                        <div className="w-full text-right lowercase">{edu.status}</div>
                                        <div className="w-full text-right uppercase">{edu.location}</div>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card className="">
                    <CardHeader>
                        <CardTitle>project: Article Search</CardTitle>
                        <CardDescription><Link href='/works/article-search'>https://manglekuo.com/works/article-search</Link></CardDescription>
                    </CardHeader>
                    <CardContent className="text-sm">
                        <p className="leading-7 [&:not(:first-child)]:mt-6">A web tool that fetches the latest articles from varies RSS sources, and sort the result based on relevance compare to user query using OpenAI's Embeddings.</p>
                        <p className="leading-7 [&:not(:first-child)]:mt-6">Performes well across languages, with a Japanese version avaliable. The article and embedding results are cached locally and on server for optimal speed.</p>
                    </CardContent>
                </Card>
                <Card className="">
                    <CardHeader>
                        <CardTitle>project: Tech Career Helper GPTs</CardTitle>
                        <CardDescription><Link href='https://chat.openai.com/g/g-kQWE2v30U-tech-career-helper'>https://chat.openai.com/g/g-kQWE2v30U-tech-career-helper</Link></CardDescription>
                    </CardHeader>
                    <CardContent className="text-sm">
                        <p className="leading-7 [&:not(:first-child)]:mt-6">An AI assistant revolutionizing career navigation in the tech industry. This GPT offers comprehensive guidance on CV enhancement, job trends analysis, and interview preparation, with a focus on software development roles in London.</p>
                        <p className="leading-7 [&:not(:first-child)]:mt-6">It integrates real-time market data and tech-specific insights, providing users with relevant, up-to-date advice.</p>
                    </CardContent>
                </Card>

            </div>
        </>
    );
}