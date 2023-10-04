'use client';
const ARTICLES = 'articles';
const SUCCESSFULSOURCES = 'successful-sources';
const TIME = 'update-time';
const QUERYEMBEDDINGS = 'query-embeddings';

// Check if caches is available
const cacheAvailable = (typeof window !== "undefined")?('caches' in self):false;

// Retrieve articles data from cache
export const getCacheArticles = async () => {
  if (cacheAvailable) {
    try {
      const cache = await caches.open('article-search');
      const articles = await cache.match(ARTICLES);
      const successfulSources = await cache.match(SUCCESSFULSOURCES);
      const updateTime = await cache.match(TIME);

      const parsedArticles = articles ? await articles.json() : null;
      const parsedSuccessfulSources = successfulSources ? await successfulSources.json() : null;
      const parsedUpdateTime = updateTime ? await updateTime.json() : null;

      return [parsedArticles, parsedSuccessfulSources, parsedUpdateTime];
    } catch (error) {
      console.error("Error reading from cache:", error);
      return [null, null, null];
    }
  }
  // In case caches is not available
  return [null, null, null];
}

// Update the articles data in cache
export const updateCacheArticles = async ({ articles, successfulSources, updateTime }) => {
  if (cacheAvailable) {
    try {
      const cache = await caches.open('article-search');
      await cache.put(ARTICLES, new Response(JSON.stringify(articles)));
      await cache.put(SUCCESSFULSOURCES, new Response(JSON.stringify(successfulSources)));
      await cache.put(TIME, new Response(JSON.stringify(updateTime)));
      return { articles, successfulSources, updateTime };
    } catch (error) {
      console.error("Error setting cache:", error);
      return {};
    }
  }
  // In case caches is not available
  return {};
}

// Retrieve embedding of a query from cache
export const searchCacheQueryEmbedding = async (query) => {
  if (cacheAvailable) {
    try {
      const cache = await caches.open('article-search');
      const queryEmbeddingsResponse = await cache.match(QUERYEMBEDDINGS);
      if (!queryEmbeddingsResponse) {
        return null;
      }
      const queryEmbeddings = await queryEmbeddingsResponse.json();
      return queryEmbeddings[query] || null;
    } catch (error) {
      console.error("Error reading from cache:", error);
      return null;
    }
  }
  // In case caches is not available
  return null;
}

// Append new embedding to cache, keep only 20 latest
export const appendCacheQueryEmbedding = async ({ query, embedding }) => {
  if (cacheAvailable) {
    try {
      const cache = await caches.open('article-search');
      let queryEmbeddingsResponse = await cache.match(QUERYEMBEDDINGS);

      let queryEmbeddings = queryEmbeddingsResponse ? await queryEmbeddingsResponse.json() : {};

      // Add new embedding to the front
      queryEmbeddings = { [query]: embedding, ...queryEmbeddings };

      // Trim to the 20 latest
      queryEmbeddings = Object.keys(queryEmbeddings)
        .slice(0, 20)
        .reduce((result, key) => {
          result[key] = queryEmbeddings[key];
          return result;
        }, {});

      await cache.put(QUERYEMBEDDINGS, new Response(JSON.stringify(queryEmbeddings)));
      return queryEmbeddings;
    } catch (error) {
      console.error("Error setting cache:", error);
      return {};
    }
  }
  // In case caches is not available
  return {};
}

export const clearAllData = async () => {
  if (typeof window !== "undefined") {
    localStorage.clear();
  }

  if (cacheAvailable) {
    const cacheNames = await caches.keys();
    await Promise.all(cacheNames.map(cache => caches.delete(cache)));
  }
}