import SQLite from 'react-native-sqlite-storage';

// NOTE: Do NOT call SQLite.enablePromise(true) here.
// It is a global setting that breaks callback-style usage in 30+ other files.

let db: SQLite.SQLiteDatabase | null = null;

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

const getDatabase = async (): Promise<SQLite.SQLiteDatabase> => {
  if (db) return db;
  db = await openDatabaseAsync({
    name: 'BluTally.db',
    location: 'default',
  });
  return db;
};

export const initDatabase = async (): Promise<void> => {
  const database = await getDatabase();

  // Helper function to check if table exists
  const tableExists = async (tableName: string): Promise<boolean> => {
    try {
      const [result] = await executeSqlAsync(
        database,
        `SELECT name FROM sqlite_master WHERE type='table' AND name=?`,
        [tableName]
      );
      return result.rows.length > 0;
    } catch (error) {
      return false;
    }
  };

  // Create plants table if it doesn't exist
  const plantsExists = await tableExists('plants');
  if (!plantsExists) {
    await executeSqlAsync(database, `
      CREATE TABLE plants (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        plant_type TEXT,
        photo TEXT,
        photo_base64 TEXT,
        date TEXT,
        time_of_day TEXT,
        description TEXT,
        latitude REAL,
        longitude REAL,
        contact_info TEXT,
        can_use_photo INTEGER DEFAULT 0,
        photo_credit TEXT,
        sync_status TEXT DEFAULT 'pending',
        server_id TEXT,
        error_message TEXT,
        created_at TEXT DEFAULT (datetime('now'))
      )
    `);
  }

  // Create animals table if it doesn't exist
  const animalsExists = await tableExists('animals');
  if (!animalsExists) {
    await executeSqlAsync(database, `
      CREATE TABLE animals (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        animal_type TEXT,
        photo TEXT,
        photo_base64 TEXT,
        date TEXT,
        time_of_day TEXT,
        description TEXT,
        latitude REAL,
        longitude REAL,
        contact_info TEXT,
        can_use_photo INTEGER DEFAULT 0,
        photo_credit TEXT,
        sync_status TEXT DEFAULT 'pending',
        server_id TEXT,
        error_message TEXT,
        created_at TEXT DEFAULT (datetime('now'))
      )
    `);
  }

  // Create nature table if it doesn't exist
  const natureExists = await tableExists('nature');
  if (!natureExists) {
    await executeSqlAsync(database, `
      CREATE TABLE nature (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nature_type TEXT,
        photo TEXT,
        photo_base64 TEXT,
        date TEXT,
        time_of_day TEXT,
        description TEXT,
        latitude REAL,
        longitude REAL,
        contact_info TEXT,
        can_use_photo INTEGER DEFAULT 0,
        photo_credit TEXT,
        sync_status TEXT DEFAULT 'pending',
        server_id TEXT,
        error_message TEXT,
        created_at TEXT DEFAULT (datetime('now'))
      )
    `);
  }

  // Create human_activities table if it doesn't exist
  const activitiesExists = await tableExists('human_activities');
  if (!activitiesExists) {
    await executeSqlAsync(database, `
      CREATE TABLE human_activities (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        activity_type TEXT,
        photo TEXT,
        photo_base64 TEXT,
        date TEXT,
        time_of_day TEXT,
        description TEXT,
        latitude REAL,
        longitude REAL,
        contact_info TEXT,
        can_use_photo INTEGER DEFAULT 0,
        photo_credit TEXT,
        sync_status TEXT DEFAULT 'pending',
        server_id TEXT,
        error_message TEXT,
        created_at TEXT DEFAULT (datetime('now'))
      )
    `);
  }

  // Create Users table if it doesn't exist
  const usersExists = await tableExists('Users');
  if (!usersExists) {
    await executeSqlAsync(database, `
      CREATE TABLE Users (
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
  }

  // Create LoginData table if it doesn't exist
  const loginDataExists = await tableExists('LoginData');
  if (!loginDataExists) {
    await executeSqlAsync(database, `
      CREATE TABLE LoginData (
        id INTEGER PRIMARY KEY,
        email TEXT
      )
    `);
    // Initialize LoginData with default values
    await executeSqlAsync(database, 'INSERT INTO LoginData (id, email) VALUES (?, ?)', [1, '']);
  } else {
    // If table exists but is empty, initialize it
    const [result] = await executeSqlAsync(database, 'SELECT COUNT(*) as count FROM LoginData');
    if (result.rows.item(0).count === 0) {
      await executeSqlAsync(database, 'INSERT INTO LoginData (id, email) VALUES (?, ?)', [1, '']);
    }
  }
};

// ============================================
// INSERT FUNCTIONS
// ============================================

export const insertPlant = async (data: any): Promise<number> => {
  const database = await getDatabase();
  const [result] = await executeSqlAsync(database,
    `INSERT INTO plants (plant_type, photo, photo_base64, date, time_of_day, description, latitude, longitude, sync_status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [data.plant_type, data.photo, data.photo_base64, data.date, data.time_of_day, data.description, data.latitude, data.longitude, data.sync_status || 'pending']
  );
  return result.insertId;
};

export const insertAnimal = async (data: any): Promise<number> => {
  const database = await getDatabase();
  const [result] = await executeSqlAsync(database,
    `INSERT INTO animals (animal_type, photo, photo_base64, date, time_of_day, description, latitude, longitude, sync_status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [data.animal_type, data.photo, data.photo_base64, data.date, data.time_of_day, data.description, data.latitude, data.longitude, data.sync_status || 'pending']
  );
  return result.insertId;
};

export const insertNature = async (data: any): Promise<number> => {
  const database = await getDatabase();
  const [result] = await executeSqlAsync(database,
    `INSERT INTO nature (nature_type, photo, photo_base64, date, time_of_day, description, latitude, longitude, sync_status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [data.nature_type, data.photo, data.photo_base64, data.date, data.time_of_day, data.description, data.latitude, data.longitude, data.sync_status || 'pending']
  );
  return result.insertId;
};

export const insertHumanActivity = async (data: any): Promise<number> => {
  const database = await getDatabase();
  const [result] = await executeSqlAsync(database,
    `INSERT INTO human_activities (activity_type, photo, photo_base64, date, time_of_day, description, latitude, longitude, sync_status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [data.activity_type, data.photo, data.photo_base64, data.date, data.time_of_day, data.description, data.latitude, data.longitude, data.sync_status || 'pending']
  );
  return result.insertId;
};

// ============================================
// SYNC HELPER FUNCTIONS
// ============================================

export const getPendingRecords = async (table: string): Promise<any[]> => {
  const database = await getDatabase();
  const [results] = await executeSqlAsync(database,
    `SELECT * FROM ${table} WHERE sync_status = 'pending'`
  );
  const records: any[] = [];
  for (let i = 0; i < results.rows.length; i++) {
    records.push(results.rows.item(i));
  }
  return records;
};

export const markAsSynced = async (table: string, id: number, serverId: string): Promise<void> => {
  const database = await getDatabase();
  await executeSqlAsync(database,
    `UPDATE ${table} SET sync_status = 'synced', server_id = ? WHERE id = ?`,
    [serverId, id]
  );
};

export const markAsFailed = async (table: string, id: number, errorMessage: string): Promise<void> => {
  const database = await getDatabase();
  await executeSqlAsync(database,
    `UPDATE ${table} SET sync_status = 'failed', error_message = ? WHERE id = ?`,
    [errorMessage, id]
  );
};

export const getTotalPendingCount = async (): Promise<number> => {
  const database = await getDatabase();
  let total = 0;
  const tables = ['plants', 'animals', 'nature', 'human_activities'];
  for (const table of tables) {
    const [results] = await executeSqlAsync(database,
      `SELECT COUNT(*) as count FROM ${table} WHERE sync_status = 'pending'`
    );
    total += results.rows.item(0).count;
  }
  return total;
};
// ============================================
// LOGIN DATA MANAGEMENT FUNCTIONS
// ============================================

export const getLoginEmail = async (): Promise<string | null> => {
  const database = await getDatabase();
  try {
    const [results] = await executeSqlAsync(database, 'SELECT email FROM LoginData WHERE id = 1');
    if (results.rows.length > 0) {
      return results.rows.item(0).email || null;
    }
    return null;
  } catch (error) {
    console.error('Error getting login email:', error);
    return null;
  }
};

export const setLoginEmail = async (email: string): Promise<void> => {
  const database = await getDatabase();
  try {
    await executeSqlAsync(database, 'UPDATE LoginData SET email = ? WHERE id = 1', [email]);
  } catch (error) {
    console.error('Error setting login email:', error);
    throw error;
  }
};

// ============================================
// USERS MANAGEMENT FUNCTIONS
// ============================================

export const insertUser = async (userData: any): Promise<number> => {
  const database = await getDatabase();
  const [result] = await executeSqlAsync(database,
    `INSERT INTO Users (email, password, pin, isGoogleLogin, emailConfirm, name, area, fingerPrint, userImageUrl)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [userData.email, userData.password, userData.pin, userData.isGoogleLogin || 0, userData.emailConfirm || 0, userData.name, userData.area, userData.fingerPrint || 0, userData.userImageUrl]
  );
  return result.insertId;
};

export const getUserByEmail = async (email: string): Promise<any> => {
  const database = await getDatabase();
  try {
    const [results] = await executeSqlAsync(database, 'SELECT * FROM Users WHERE email = ?', [email]);
    if (results.rows.length > 0) {
      return results.rows.item(0);
    }
    return null;
  } catch (error) {
    console.error('Error getting user by email:', error);
    return null;
  }
};

export const updateUser = async (email: string, updates: any): Promise<void> => {
  const database = await getDatabase();
  try {
    const fields = Object.keys(updates).map(key => `${key} = ?`).join(', ');
    const values = Object.values(updates);
    values.push(email);
    await executeSqlAsync(database,
      `UPDATE Users SET ${fields} WHERE email = ?`,
      values as any[]
    );
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};
