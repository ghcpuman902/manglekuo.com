import Head from 'next/head'
import Link from 'next/link'
import Date from '../components/date'
import Layout, { siteTitle } from '../components/layout'
import utilStyles from '../styles/utils.module.css'
import { getSortedPostsData } from '../lib/posts'

export async function getStaticProps() {
  const allPostsData = getSortedPostsData()
  return {
    props: {
      allPostsData
    }
  }
}


export default function Home({ allPostsData }) {
  const mediumArticles = [
    {
      key: "b08324f5aab2",
      link: "https://manglekuo.medium.com/running-mongodb-on-docker-with-macos-b08324f5aab2",
      title: "Running MongoDB inside a Docker container with macOS and access it using Mongo Compass, for newbies",
      date: "2021-02-21"
    },
    {
      key: "53a482e39fd6",
      link: "https://manglekuo.medium.com/develop-on-macos-dont-clutter-your-home-folder-as-i-did-53a482e39fd6",
      title: "Develop on macOS: don't clutter your home folder like I did…",
      date: "2021-04-21"
    },
    {
      key: "de5b34356a5e",
      link: "https://manglekuo.medium.com/%E8%B2%B7%E7%84%A1%E6%90%8D%E9%9F%B3%E6%A8%82%E6%AA%94%E6%A1%88%E7%9A%84%E5%9D%91-de5b34356a5e",
      title: "買無損音樂檔案的坑",
      date: "2021-04-21"
    },
    {
      key: "b2f79bcdedf0",
      link: "https://manglekuo.medium.com/%E8%A8%AD%E5%AE%9Amacos%E6%9C%AC%E5%9C%B0%E7%AB%AFhttps-ssl%E8%AD%89%E6%9B%B8-b2f79bcdedf0",
      title: "設定macOS本地端HTTPs/SSL證書",
      date: "2021-01-28"
    },
    // {
    //   key: "",
    //   link: "",
    //   title: "",
    //   date: "2021-01-28"
    // },
    // {
    //   key: "",
    //   link: "",
    //   title: "",
    //   date: "2021-01-28"
    // },
    // {
    //   key: "",
    //   link: "",
    //   title: "",
    //   date: "2021-01-28"
    // },
    // {
    //   key: "",
    //   link: "",
    //   title: "",
    //   date: "2021-01-28"
    // },
    // {
    //   key: "",
    //   link: "",
    //   title: "",
    //   date: "2021-01-28"
    // },
  ];



  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <section className={utilStyles.headingMd}>
        <p>Hi, I'm Mangle Kuo, I'm working on this site to get a job, please check again soon, hope it will impress you!</p>
      </section>
      <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
        <h2 className={utilStyles.headingLg}>Try some of this:</h2>
        <a href="/tenfacts">Ten facts about me</a>
        <h2 className={utilStyles.headingLg}>Blog</h2>
        <ul className={utilStyles.list}>
          {allPostsData.map(({ id, date, title }) => (
            <li className={utilStyles.listItem} key={id}>
            <Link href={`/posts/${id}`}>
              <a>{title}</a>
            </Link>
            <br />
            <small className={utilStyles.lightText}>
              <Date dateString={date} />
            </small>
          </li>
          ))}
        </ul>
        <h2 className={utilStyles.headingLg}>Medium.com</h2>
        <ul className={utilStyles.list}>
          {
            mediumArticles.map((val) => (
              <li className={utilStyles.listItem} key={val.key} >
                <a href={val.link}>{val.title}</a>        
                <br />
                <small className={utilStyles.lightText}>
                  <Date dateString={val.date} />
                </small>
              </li>
            ))
          }

        
        </ul>
      </section>
    </Layout>
  );
}