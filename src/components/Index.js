import React from 'react';
import Image from 'next/image';
import Head from 'next/head';
import styles from '../../public/styles/Home.module.css';
import dateFormat, { masks } from "dateformat";
import Link from 'next/link';
import { useRouter } from 'next/navigation';

async function getCampaigns() {
  // const response = await fetch("http://127.0.0.1:8000/api/campaigns");
  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/campaigns`);
  const data = await response.json();
  return data;
}
const handleNavigation = ({ slug }) => {
  const router = useRouter()
  router.push("/" + slug)
}
export default async function Index() {
  const data = await getCampaigns();
  console.log(data);
  return (
    <div className={styles.container}>
      <Head>
        <title>Kiprono Campaigns Manager</title>
        <meta name='description' content='A site for listing upcoming campaigns' />
      </Head>
      <main className={styles.main}>
        <div className={styles.innerContent}>
          <h1>Available Campaigns</h1>
          {data.map((element) => (
            <div key={element.slug}>
              <div className={styles.item}>
                <div className={styles.imgContainer}>
                  <Image className={styles.img} src={"https://res.cloudinary.com/dtfpzo5yt/" + element.logo} height={120} width={100} alt="image" />
                </div>
                <div className={styles.rightItem}>
                  <Link href={"/" + element.slug}>
                    <h2>{element.title}</h2>
                  </Link>
                  
                  <p>{element.description}</p>
                  <small>{dateFormat(new Date(element.created_at), "dddd, mmmm dS, yyyy, h:MM:ss TT")}</small>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
