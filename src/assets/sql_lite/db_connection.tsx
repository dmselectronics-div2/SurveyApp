import SQLite from 'react-native-sqlite-storage';

SQLite.enablePromise(true);

let db: SQLite.SQLiteDatabase | null = null;

const getDatabase = async (): Promise<SQLite.SQLiteDatabase> => {
  if (db) return db;
  db = await SQLite.openDatabase({
    name: 'BluTally.db',
    location: 'default',
  });
  return db;
};

export const initDatabase = async (): Promise<void> => {
  const database = await getDatabase();

  await database.executeSql(`
    CREATE TABLE IF NOT EXISTS plants (
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

  await database.executeSql(`
    CREATE TABLE IF NOT EXISTS animals (
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

  await database.executeSql(`
    CREATE TABLE IF NOT EXISTS nature (
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

  await database.executeSql(`
    CREATE TABLE IF NOT EXISTS human_activities (
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
};

// ============================================
// INSERT FUNCTIONS
// ============================================

export const insertPlant = async (data: any): Promise<number> => {
  const database = await getDatabase();
  const [result] = await database.executeSql(
    `INSERT INTO plants (plant_type, photo, photo_base64, date, time_of_day, description, latitude, longitude, sync_status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [data.plant_type, data.photo, data.photo_base64, data.date, data.time_of_day, data.description, data.latitude, data.longitude, data.sync_status || 'pending']
  );
  return result.insertId;
};

export const insertAnimal = async (data: any): Promise<number> => {
  const database = await getDatabase();
  const [result] = await database.executeSql(
    `INSERT INTO animals (animal_type, photo, photo_base64, date, time_of_day, description, latitude, longitude, sync_status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [data.animal_type, data.photo, data.photo_base64, data.date, data.time_of_day, data.description, data.latitude, data.longitude, data.sync_status || 'pending']
  );
  return result.insertId;
};

export const insertNature = async (data: any): Promise<number> => {
  const database = await getDatabase();
  const [result] = await database.executeSql(
    `INSERT INTO nature (nature_type, photo, photo_base64, date, time_of_day, description, latitude, longitude, sync_status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [data.nature_type, data.photo, data.photo_base64, data.date, data.time_of_day, data.description, data.latitude, data.longitude, data.sync_status || 'pending']
  );
  return result.insertId;
};

export const insertHumanActivity = async (data: any): Promise<number> => {
  const database = await getDatabase();
  const [result] = await database.executeSql(
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
  const [results] = await database.executeSql(
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
  await database.executeSql(
    `UPDATE ${table} SET sync_status = 'synced', server_id = ? WHERE id = ?`,
    [serverId, id]
  );
};

export const markAsFailed = async (table: string, id: number, errorMessage: string): Promise<void> => {
  const database = await getDatabase();
  await database.executeSql(
    `UPDATE ${table} SET sync_status = 'failed', error_message = ? WHERE id = ?`,
    [errorMessage, id]
  );
};

export const getTotalPendingCount = async (): Promise<number> => {
  const database = await getDatabase();
  let total = 0;
  const tables = ['plants', 'animals', 'nature', 'human_activities'];
  for (const table of tables) {
    const [results] = await database.executeSql(
      `SELECT COUNT(*) as count FROM ${table} WHERE sync_status = 'pending'`
    );
    total += results.rows.item(0).count;
  }
  return total;
};
