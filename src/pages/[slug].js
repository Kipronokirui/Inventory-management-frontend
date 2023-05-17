import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Link from 'next/link';
import styles from '../../public/styles/Details.module.css';
import dateFormat, { masks } from "dateformat";
import Head from 'next/head';

export default function Campaign({data}) {
  const { query: { slug } } = useRouter()
  const [email, setEmail] = useState("")
  const [submitted, setIsSubmitted] = useState(false)
  const [submitting, setIsSubmitting] = useState(false)
  const handleOnSubmit = (e) => {
    e.preventDefault();
    const options = {
      method: "POST",
      body: JSON.stringify({
        email:email,
        campaign:data.id
      })
    }
    setIsSubmitting(true)
    fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/campaign/subscribe`).
      then(res => res.json()).then((response) => {
        setIsSubmitted(true)
      }).
      catch(error => console.log('error', error)).finally(() => {
        setIsSubmitting(false)
      })
  }
  return (
    <div>
      <Head>
        <title>{data.title}</title>
        <meta name='description' content={data.description} />
      </Head>
      <div key={data.slug}>
              <div className={styles.item}>
                <div className={styles.imgContainer}>
                  <Image className={styles.img} src={"https://res.cloudinary.com/dtfpzo5yt/" + data.logo} height={120} width={100} alt="image" />
                </div>
                <div className={styles.rightItem}>
                  <h2>{data.title}</h2>
                  <p>{data.description}</p>
                  <small>{dateFormat(new Date(data.created_at), "dddd, mmmm dS, yyyy, h:MM:ss TT")}</small>
                </div>
              </div>
      </div>
      <form onSubmit={handleOnSubmit}>
        <div className={styles.formInputGroup}>
          <input
            onChange={(event) => {setEmail(event.target.value)}}
            type='email'
            name="email"
            placeholder='Enter your email address'
            className={styles.formInput} required />
          <input type='submit' name="email"
            value="SUBSCRIBE"
            className={styles.button} />
          <p>wE RESPECT YOUR PRIVACY</p>
        </div>
      </form>
    </div>
  );
}
export async function getStaticPaths() {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/campaigns`);
  const data = await response.json();
  const allSlugs = data.map(item => item.slug)
  const paths = allSlugs.map(slug => ({ params: { slug: slug } }))
  
  return {
    paths,
    fallback:false,
  }
}
export async function getStaticProps({params}) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/campaign/${params.slug}`);
  const data = await response.json();

  return {
    props: {
      data,
    },
  }
}
