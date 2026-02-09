import SQLite from 'react-native-sqlite-storage';

// NOTE: Do NOT call SQLite.enablePromise(true) here.
// It is a global setting that breaks callback-style usage in 30+ other files.

let db: SQLite.SQLiteDatabase | null = null;
let initialized = false;

// Promise wrapper for openDatabase (callback-style API)
const openDatabaseAsync = (config: any): Promise<SQLite.SQLiteDatabase> => {
  return new Promise((resolve, reject) => {
    const database = SQLite.openDatabase(
      config,
      () => resolve(database),
      (error: any) => reject(error),
    );
  });
};

// Promise wrapper for executeSql (callback-style API)
const executeSqlAsync = (
  database: SQLite.SQLiteDatabase,
  sql: string,
  params: any[] = [],
): Promise<[any]> => {
  return new Promise((resolve, reject) => {
    database.transaction((tx: any) => {
      tx.executeSql(
        sql,
        params,
        (_tx: any, results: any) => resolve([results]),
        (_tx: any, error: any) => {
          reject(error);
          return false;
        },
      );
    });
  });
};

const initializeUserDb = async (database: SQLite.SQLiteDatabase) => {
  if (initialized) return;

  try {
    // Create LoginData table with error handling
    try {
      await executeSqlAsync(database, `
        CREATE TABLE IF NOT EXISTS LoginData (
          id INTEGER PRIMARY KEY,
          email TEXT
        )
      `);

      // Check if we need to insert default data
      const [result] = await executeSqlAsync(database, 'SELECT COUNT(*) as count FROM LoginData');
      if (result.rows.item(0).count === 0) {
        await executeSqlAsync(database, 'INSERT INTO LoginData (id, email) VALUES (?, ?)', [1, '']);
      }
      console.log('LoginData table ready');
    } catch (error: any) {
      console.error('Error setting up LoginData table:', error.message);
    }

    // Create Users table with error handling
    try {
      await executeSqlAsync(database, `
        CREATE TABLE IF NOT EXISTS Users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          email TEXT UNIQUE,
          password TEXT,
          pin TEXT,
          isGoogleLogin INTEGER DEFAULT 0,
          emailConfirm INTEGER DEFAULT 0,
          name TEXT,
          area TEXT,
          fingerPrint INTEGER DEFAULT 0,
          userImageUrl TEXT,
          created_at TEXT DEFAULT (datetime('now'))
        )
      `);
      console.log('Users table ready');
    } catch (error: any) {
      console.error('Error setting up Users table:', error.message);
    }

    initialized = true;
  } catch (error) {
    console.error('Error initializing user_db:', error);
  }
};

export const getDatabase = async () => {
  if (!db) {
    db = await openDatabaseAsync({name: 'user_db.db', location: 'default'});
    await initializeUserDb(db);
  }
  return db;
};

export const ensureTablesInitialized = async () => {
  await getDatabase();
};
