import { openDB } from 'idb';

const DB_NAME = 'newsDB';
const STORE_NAME = 'articles';
const VERSION = 2; // Increment version to trigger upgrade

interface NewsArticle {
  article_id: string;
  title: string;
  description: string;
  content: string;
  image_url?: string;
  category?: string[];
  source_id: string;
  pubDate?: string;
}

export const initDB = async () => {
  return openDB(DB_NAME, VERSION, {
    upgrade(db, oldVersion, newVersion, transaction) {
      // If store doesn't exist, create it
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'article_id' });
        // Create indexes
        store.createIndex('type', 'type');
        store.createIndex('timestamp', 'timestamp');
        store.createIndex('category', 'category', { multiEntry: true });
      } else {
        // Store exists, ensure indexes are present
        const store = transaction.objectStore(STORE_NAME);
        if (!store.indexNames.contains('type')) {
          store.createIndex('type', 'type');
        }
        if (!store.indexNames.contains('timestamp')) {
          store.createIndex('timestamp', 'timestamp');
        }
        if (!store.indexNames.contains('category')) {
          store.createIndex('category', 'category', { multiEntry: true });
        }
      }
    },
  });
};

export const storeArticles = async (articles: NewsArticle[], type: string) => {
  try {
    const db = await initDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.store;
    const timestamp = new Date().getTime();

    await Promise.all(
      articles.map(article => 
        store.put({
          ...article,
          type,
          timestamp
        })
      )
    );

    await tx.done;
    return true;
  } catch (error) {
    console.error('Error storing articles:', error);
    return false;
  }
};

export const getCachedArticles = async (type: string) => {
  try {
    const db = await initDB();
    const tx = db.transaction(STORE_NAME, 'readonly');
    const index = tx.store.index('type');
    
    if (!index) {
      throw new Error('Type index not found');
    }

    const articles = await index.getAll(type);
    return articles;
  } catch (error) {
    console.error('Error getting cached articles:', error);
    return [];
  }
};

export const clearOldCache = async (maxAge: number = 24 * 60 * 60 * 1000) => {
  try {
    const db = await initDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.store;
    const index = store.index('timestamp');
    
    if (!index) {
      throw new Error('Timestamp index not found');
    }

    const oldTimestamp = new Date().getTime() - maxAge;
    let cursor = await index.openCursor();

    while (cursor) {
      if (cursor.value.timestamp < oldTimestamp) {
        await cursor.delete();
      }
      cursor = await cursor.continue();
    }

    await tx.done;
    return true;
  } catch (error) {
    console.error('Error clearing old cache:', error);
    return false;
  }
};