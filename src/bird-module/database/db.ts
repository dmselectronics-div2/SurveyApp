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

    // Create bird_survey table
    try {
      await executeSqlAsync(database, `
        CREATE TABLE IF NOT EXISTS bird_survey (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          email TEXT,
          uniqueId TEXT,
          habitatType TEXT,
          point TEXT,
          pointTag TEXT,
          latitude TEXT,
          longitude TEXT,
          date TEXT,
          observers TEXT,
          startTime TEXT,
          endTime TEXT,
          weather TEXT,
          water TEXT,
          season TEXT,
          statusOfVegy TEXT,
          species TEXT,
          count TEXT,
          maturity TEXT,
          sex TEXT,
          behaviour TEXT,
          identification TEXT,
          status TEXT,
          radiusOfArea TEXT,
          remark TEXT,
          imageUri TEXT,
          cloudIntensity TEXT,
          rainIntensity TEXT,
          windIntensity TEXT,
          sunshineIntensity TEXT,
          waterLevel TEXT
        )
      `);
      console.log('bird_survey table ready');
    } catch (error: any) {
      console.error('Error setting up bird_survey table:', error.message);
    }

    // Create failed_submissions table
    try {
      await executeSqlAsync(database, `
        CREATE TABLE IF NOT EXISTS failed_submissions (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          formData TEXT
        )
      `);
      console.log('failed_submissions table ready');
    } catch (error: any) {
      console.error('Error setting up failed_submissions table:', error.message);
    }

    // Create bird_drafts table
    try {
      await executeSqlAsync(database, `
        CREATE TABLE IF NOT EXISTS bird_drafts (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          draftId TEXT UNIQUE,
          habitatType TEXT,
          pointTag TEXT,
          date TEXT,
          lastModified TEXT,
          currentStep INTEGER DEFAULT 0,
          formData TEXT
        )
      `);
      console.log('bird_drafts table ready');
    } catch (error: any) {
      console.error('Error setting up bird_drafts table:', error.message);
    }

    // Add missing userConfirm column to Users table (migration for existing installs)
    try {
      await executeSqlAsync(database, "ALTER TABLE Users ADD COLUMN userConfirm INTEGER DEFAULT 0");
    } catch (e) {
      // Column already exists, ignore
    }

    // Add missing policyConfirm column to Users table (migration for existing installs)
    try {
      await executeSqlAsync(database, "ALTER TABLE Users ADD COLUMN policyConfirm INTEGER DEFAULT 0");
    } catch (e) {
      // Column already exists, ignore
    }

    // Add sync-related columns to bird_survey (migration for existing installs)
    const birdMigrationColumns = [
      { name: 'sync_status', def: "TEXT DEFAULT 'pending'" },
      { name: 'server_id', def: 'TEXT' },
      { name: 'updated_at', def: 'TEXT' },
      { name: 'created_at', def: "TEXT DEFAULT (datetime('now'))" },
      { name: 'dominantVegetation', def: 'TEXT' },
      { name: 'descriptor', def: 'TEXT' },
    ];
    for (const col of birdMigrationColumns) {
      try {
        await executeSqlAsync(database, `ALTER TABLE bird_survey ADD COLUMN ${col.name} ${col.def}`);
      } catch (e) {
        // Column already exists, ignore
      }
    }

    // Create bird_observations table if not exists
    try {
      await executeSqlAsync(database, `
        CREATE TABLE IF NOT EXISTS bird_observations (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          uniqueId TEXT,
          species TEXT,
          count TEXT,
          maturity TEXT,
          sex TEXT,
          behaviour TEXT,
          identification TEXT,
          status TEXT,
          remarks TEXT,
          imageUri TEXT
        )
      `);
      console.log('bird_observations table ready');
    } catch (error: any) {
      console.error('Error setting up bird_observations table:', error.message);
    }

    // Create dashboard_cache table for offline dashboard data
    try {
      await executeSqlAsync(database, `
        CREATE TABLE IF NOT EXISTS dashboard_cache (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          cache_key TEXT UNIQUE,
          data TEXT,
          updated_at TEXT DEFAULT (datetime('now'))
        )
      `);
      console.log('dashboard_cache table ready');
    } catch (error: any) {
      console.error('Error setting up dashboard_cache table:', error.message);
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
