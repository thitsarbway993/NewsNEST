import { openDB } from 'idb';

const DB_NAME = 'newsDB';
const STORE_NAME = 'articles';
const VERSION = 1;

export const initDB = async () => {
  return openDB(DB_NAME, VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'article_id' });
        store.createIndex('category', 'category');
      }
    },
  });
};

export const storeArticles = async (articles: NewsArticle[]) => {
  const db = await initDB();
  const tx = db.transaction(STORE_NAME, 'readwrite');
  await Promise.all(articles.map(article => tx.store.put(article)));
  return tx.done;
};

export const getCachedArticles = async () => {
  const db = await initDB();
  return db.getAll(STORE_NAME);
};

interface NewsArticle {
  article_id: string;
  // ... same as previous interface
}