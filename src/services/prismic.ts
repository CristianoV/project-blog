import * as prismic from '@prismicio/client';
import * as prismicNext from '@prismicio/next';

export const repositoryName = prismic.getRepositoryName(
  'https://cristianovblog.cdn.prismic.io/api/v2'
);

/** @type {prismic.ClientConfig['routes']} **/
const routes: prismic.ClientConfig['routes'] = [
  {
    type: 'home',
    path: '/',
  },
  {
    type: 'post',
    path: '/post',
  },
];

/**
 * @param config {prismicNext.CreateClientConfig} - Configuration for the Prismic client.
 */
export const createClient = (config: prismicNext.CreateClientConfig = {}) => {
  const client = prismic.createClient(
    'https://cristianovblog.cdn.prismic.io/api/v2',
    {
      routes,
      ...config,
    }
  );

  prismicNext.enableAutoPreviews({
    client,
    previewData: config.previewData,
    req: config.req,
  });

  return client;
};
