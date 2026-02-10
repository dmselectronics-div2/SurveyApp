import React, { useEffect, useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import NetInfo from '@react-native-community/netinfo';
import SQLite from 'react-native-sqlite-storage';

// Use callback-style wrapper to avoid SQLite.enablePromise(true) which breaks other files
const openDatabase = (): Promise<any> => {
  return new Promise((resolve, reject) => {
    const database = SQLite.openDatabase(
      { name: 'app.db', location: 'default' },
      () => resolve(database),
      (error) => reject(error),
    );
  });
};

// Promise wrapper for executeSql using callback-style API
const executeSqlPromise = (db: any, sql: string, params: any[] = []): Promise<[any]> => {
  return new Promise((resolve, reject) => {
    db.transaction((tx: any) => {
      tx.executeSql(
        sql,
        params,
        (_tx: any, results: any) => resolve([results]),
        (_tx: any, error: any) => { reject(error); return false; },
      );
    });
  });
};

const CustomDropdown = ({
  tableName,
  apiEndpoint,
  placeholder,
  value,
  setValue,
  updateSummary = () => {},
  isDarkMode,
  error
}) => {
  const [db, setDb] = useState(null);
  const [options, setOptions] = useState([]);
  const [showInput, setShowInput] = useState(false);
  const [customValue, setCustomValue] = useState('');
  const [isFocus, setIsFocus] = useState(false);

  useEffect(() => {
    (async () => {
      const database = await openDatabase();
      setDb(database);
      await initTable(database);

      const unsubscribe = NetInfo.addEventListener(state => {
        if (state.isConnected) {
          syncData(database);
        }
      });

      const net = await NetInfo.fetch();
      if (net.isConnected) {
        await syncData(database);
      } else {
        await loadLocalData(database); // fallback if offline
      }

      return () => unsubscribe();
    })();
  }, []);

  const initTable = async (db) => {
    await executeSqlPromise(db,
      `CREATE TABLE IF NOT EXISTS ${tableName} (
         id INTEGER PRIMARY KEY AUTOINCREMENT,
         label TEXT NOT NULL,
         value TEXT NOT NULL UNIQUE,
         synced INTEGER DEFAULT 0
       );`
    );
  };

  const insertValue = async (db, label, value) => {
    await executeSqlPromise(db,
      `INSERT OR IGNORE INTO ${tableName} (label, value, synced) VALUES (?, ?, 0);`,
      [label, value]
    );
  };

  const getAllValues = async (db) => {
    const [results] = await executeSqlPromise(db,`SELECT * FROM ${tableName};`);
    return results.rows.raw();
  };

  const getUnsyncedValues = async (db) => {
    const [results] = await executeSqlPromise(db,`SELECT * FROM ${tableName} WHERE synced = 0;`);
    return results.rows.raw();
  };

  const markValueAsSynced = async (db, id) => {
    await executeSqlPromise(db,`UPDATE ${tableName} SET synced = 1 WHERE id = ?;`, [id]);
  };

  const loadLocalData = async (db) => {
    const localData = await getAllValues(db);
    const formatted = localData.map(item => ({ label: item.label, value: item.value }));
    setOptions([...formatted, { label: 'Other', value: 'Other' }]);
  };

  const syncData = async (db) => {
    const unsynced = await getUnsyncedValues(db);
    for (const item of unsynced) {
      try {
        const res = await fetch(`${apiEndpoint}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ label: item.label, value: item.value }),
        });
        if (res.ok) {
          await markValueAsSynced(db, item.id);
        }
      } catch (err) {
        console.log('Sync failed for', item.value);
      }
    }

    try {
      const res = await fetch(`${apiEndpoint}`);
      const data = await res.json();
      const localData = await getAllValues(db);
      const localValues = localData.map(i => i.value);

      for (const item of data) {
        if (!localValues.includes(item.value)) {
          await insertValue(db, item.label, item.value);
        }
      }

      const all = await getAllValues(db);
      const formatted = all.map(i => ({ label: i.label, value: i.value }));
      setOptions([...formatted, { label: 'Other', value: 'Other' }]);

    } catch (err) {
      console.log('Fetch failed:', err.message);
      await loadLocalData(db); // fallback if fetch fails
    }
  };

  const handleAddCustomValue = async () => {
    const newValue = customValue.trim();
    if (!newValue || !db) return;
    await insertValue(db, newValue, newValue);
    setOptions(prev => [
      ...prev.filter(v => v.value !== 'Other'),
      { label: newValue, value: newValue },
      { label: 'Other', value: 'Other' },
    ]);
    setValue(newValue);
    setCustomValue('');
    setShowInput(false);
    updateSummary(newValue);

    const net = await NetInfo.fetch();
    if (net.isConnected) {
      await syncData(db);
    }
  };

  return (
    <View style={{ paddingVertical: 10 }}>
      <Dropdown
        style={[
          styles.dropdown,
          isFocus && styles.dropdownFocused,
          error && styles.errorBorder,
          { backgroundColor: 'rgba(255,255,255,0.9)', color: isDarkMode ? 'black' : 'black' },
        ]}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        itemTextStyle={{ color: isDarkMode ? 'black' : 'black' }}
        data={options}
        search
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder={!isFocus && !value ? placeholder : ''}
        searchPlaceholder="Search..."
        value={value}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={item => {
          if (item.value === 'Other') {
            setShowInput(true);
          } else {
            setValue(item.value);
            setShowInput(false);
            updateSummary(item.value);
          }
        }}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}

      {showInput && (
        <View style={{ marginTop: 10 }}>
          <TextInput
            placeholder={`Enter custom ${placeholder.toLowerCase()}`}
            value={customValue}
            onChangeText={setCustomValue}
            style={styles.textInput}
            placeholderTextColor={'gray'}
          />
          <Button title="Add" onPress={handleAddCustomValue} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  dropdown: {
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 8,
    padding: 13,
    width: '100%',
  },
  dropdownFocused: {
    borderColor: 'blue',
  },
  placeholderStyle: {
    color: 'gray',
  },
  selectedTextStyle: {
    color: 'black',
  },
  inputSearchStyle: {
    color: 'black',
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  textInput: {
    borderWidth: 1,
    borderColor: 'gray',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    color: 'black',
  },
  errorBorder: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 5,
  },
});

export default CustomDropdown;
