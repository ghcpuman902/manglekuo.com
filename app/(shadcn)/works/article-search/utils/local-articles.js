'use client';
const ARTICLES = 'articles-search::articles';
const SUCCESSFULSOURCES = 'articles-search::successful-sources';
const TIME = 'articles-search::update-time';
const QUERYEMBEDDINGS = 'articles-search::query-embeddings';

// Retrieve articles data from local storage
export const getLocalArticles = () => {
  try {
    if (typeof window !== "undefined") {
      const articles = JSON.parse(localStorage.getItem(ARTICLES));
      const successfulSources = JSON.parse(localStorage.getItem(SUCCESSFULSOURCES));
      const updateTime = JSON.parse(localStorage.getItem(TIME));
      if (!articles || !successfulSources || !updateTime) {
        return [null, null, null];
      }
      return [articles, successfulSources, updateTime];
    } else {
      return [null, null, null];
    }
  } catch (e) {
    console.error("Error reading from local storage:", e);
    return [];
  }
}

// Update the articles data in local storage
export const updateLocalArticles = ({ articles, successfulSources, updateTime }) => {
  try {
    if (typeof window !== "undefined") {
      localStorage.setItem(ARTICLES, JSON.stringify(articles));
      localStorage.setItem(SUCCESSFULSOURCES, JSON.stringify(successfulSources));
      localStorage.setItem(TIME, JSON.stringify(updateTime));
      return { articles, successfulSources, updateTime };
    } else {
      return {};
    }
  } catch (e) {
    console.error("Error reading from local storage:", e);
    return {};
  }
}

// Retrieve embedding of a query from local storage
export const searchLocalQueryEmbedding = (query) => {
  try {
    if (typeof window !== "undefined") {
      const queryEmbeddings = JSON.parse(localStorage.getItem(QUERYEMBEDDINGS));
      if (!queryEmbeddings) {
        return null;
      }
      return queryEmbeddings[query] || null;
    } else {
      return null;
    }
  } catch (e) {
    console.error("Error reading from local storage:", e);
    return null;
  }
}

// Append new embedding to local storage, keep only 20 latest
export const appendLocalQueryEmbedding = ({ query, embedding }) => {
  try {
    if (typeof window !== "undefined") {
      let queryEmbeddings = JSON.parse(localStorage.getItem(QUERYEMBEDDINGS)) || {};
      
      // Add new embedding to the front
      queryEmbeddings = { [query]: embedding, ...queryEmbeddings };

      // Trim to the 20 latest
      queryEmbeddings = Object.keys(queryEmbeddings)
        .slice(0, 20)
        .reduce((result, key) => {
          result[key] = queryEmbeddings[key];
          return result;
        }, {});

      localStorage.setItem(QUERYEMBEDDINGS, JSON.stringify(queryEmbeddings));
      return queryEmbeddings;
    } else {
      return {};
    }
  } catch (e) {
    console.error("Error reading from local storage:", e);
    return {};
  }
}