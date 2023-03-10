import Head from 'next/head';

import styles from './styles.module.scss';
import Link from 'next/link';

import Image from 'next/image';
import { GetStaticProps } from 'next';
import { createClient } from '../../services/prismic';
import { RichText } from 'prismic-dom';
import * as prismic from '@prismicio/client';

import {
  FiChevronLeft,
  FiChevronsLeft,
  FiChevronRight,
  FiChevronsRight,
} from 'react-icons/fi';
import { useState } from 'react';

type Post = {
  slug: string;
  title: string;
  cover: string;
  description: string;
  updatedAt: string;
};

interface PostsProps {
  posts: Post[];
  page: string;
  totalPage: string;
}

export default function Posts({
  posts: postsBlog,
  page,
  totalPage,
}: PostsProps) {
  const [currentPage, setCurrentPage] = useState(Number(page));
  const [posts, setPosts] = useState(postsBlog || []);

  async function reqPost(pageNumber: number) {
    const client = createClient();

    const response = await client.query(
      prismic.predicate.at('document.type', 'post'),
      {
        orderings: ['my.post.date desc'],
        fetch: ['post.title', 'post.description', 'post.cover'],
        pageSize: 3,
        page: pageNumber,
      }
    );

    return response;
  }

  async function navigatePage(pageNumber: number) {
    const response = await reqPost(pageNumber);

    if (response.results.length === 0) {
      return;
    }

    const getPosts = response.results.map((post) => {
      return {
        slug: String(post.uid),
        title: RichText.asText(post.data.title),
        description:
          post.data.description.find(
            (content: { type: string }) => content.type === 'paragraph'
          )?.text ?? '',
        cover: post.data.cover.url,
        updatedAt: new Date(post.last_publication_date).toLocaleDateString(
          'pt-BR',
          {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
          }
        ),
      };
    });

    setPosts(getPosts);
    setCurrentPage(pageNumber);
  }

  return (
    <>
      <Head>
        <title>Blog | Sujeito Programador</title>
      </Head>
      <main className={styles.container}>
        <div className={styles.posts}>
          {posts.map((post) => (
            <Link key={post.slug} href={`/posts/${post.slug}`}>
              <Image
                src={post.cover}
                alt={post.title}
                key={post.slug}
                width={720}
                height={410}
                quality={100}
                placeholder='blur'
                blurDataURL='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mN0vQgAAWEBGHsgcxcAAAAASUVORK5CYII='
              />
              <strong>{post.title}</strong>
              <time>{post.updatedAt}</time>
              <p>{post.description}</p>
            </Link>
          ))}

          <div className={styles.buttonNavigate}>
            {Number(currentPage) >= 2 && (
              <div>
                <button onClick={() => navigatePage(1)}>
                  <FiChevronsLeft size={25} color='#FFF' />
                </button>
                <button onClick={() => navigatePage(Number(currentPage - 1))}>
                  <FiChevronLeft size={25} color='#FFF' />
                </button>
              </div>
            )}

            {Number(currentPage) < Number(totalPage) && (
              <div>
                <button onClick={() => navigatePage(Number(currentPage + 1))}>
                  <FiChevronRight size={25} color='#FFF' />
                </button>
                <button onClick={() => navigatePage(Number(totalPage))}>
                  <FiChevronsRight size={25} color='#FFF' />
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async ({ previewData }) => {
  const client = createClient({ previewData });

  const response = await client.query(
    prismic.predicate.at('document.type', 'post'),
    {
      pageSize: 3,
      fetch: ['post.title', 'post.description', 'post.cover'],
      orderings: ['my.post.date desc'],
    }
  );

  const posts = response.results.map((post) => {
    return {
      slug: post.uid,
      title: RichText.asText(post.data.title),
      description:
        post.data.description.find(
          (content: { type: string }) => content.type === 'paragraph'
        )?.text ?? '',
      cover: post.data.cover.url,
      updatedAt: new Date(post.last_publication_date).toLocaleDateString(
        'pt-BR',
        {
          day: '2-digit',
          month: 'long',
          year: 'numeric',
        }
      ),
    };
  });

  return {
    props: {
      posts,
      page: response.page,
      totalPage: response.total_pages,
    },
    revalidate: 60 * 10,
  };
};
