import { createClient } from '../../services/prismic';
import { GetStaticProps } from 'next';
import { RichText } from 'prismic-dom';
import styles from './styles.module.scss';

import { FaYoutube, FaInstagram, FaLinkedin, FaFacebook } from 'react-icons/fa';
import Head from 'next/head';
import Image from 'next/image';

type Content = {
  title: string;
  description: string;
  banner: string;
  facebook: string;
  instagram: string;
  youtube: string;
  linkedin: string;
};

interface ContentProps {
  content: Content;
}

export default function Sobre({ content }: ContentProps) {
  return (
    <>
      <Head>
        <title>Quem somos? | Sujeito Programador</title>
      </Head>
      <main className={styles.container}>
        <div className={styles.containerHeader}>
          <section className={styles.ctaText}>
            <h1>{content.title}</h1>
            <p>{content.description}</p>

            <a href={content.youtube}>
              <FaYoutube size={40} />
            </a>

            <a href={content.instagram}>
              <FaInstagram size={40} />
            </a>

            <a href={content.facebook}>
              <FaFacebook size={40} />
            </a>

            <a href={content.linkedin}>
              <FaLinkedin size={40} />
            </a>
          </section>

          <Image
            src={content.banner}
            alt='Sobre Sujeito Programador'
            quality={100}
            width={490}
            height={500}
            placeholder='blur'
            blurDataURL='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mN0vQgAAWEBGHsgcxcAAAAASUVORK5CYII='
          />
        </div>
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const client = createClient();

  const response = await client.getSingle('about');

  const { title, description, banner, facebook, instagram, youtube, linkedin } =
    response.data;

  const content = {
    title: RichText.asText(title),
    description: RichText.asText(description),
    banner: banner.url,
    facebook: facebook.url,
    instagram: instagram.url,
    youtube: youtube.url,
    linkedin: linkedin.url,
  };

  return {
    props: {
      content,
    },
    revalidate: 60 * 30,
  };
};
