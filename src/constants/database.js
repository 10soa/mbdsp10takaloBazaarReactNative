import SQLite from 'react-native-sqlite-storage';

const db = SQLite.openDatabase(
  {
    name: 'baselocal.db',
    location: 'default',
  },
  () => console.log('Database opened'),
  (error) => console.error('Error opening database:', error)
);

export const initDB = () => {
  db.transaction(tx => {
    tx.executeSql(
      'CREATE TABLE IF NOT EXISTS brouillonBase (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, description TEXT, category_id INTEGER, image_file TEXT, user_id INTEGER)',
      [],
      () => console.log('Success!'),
      (error) => console.error('Error creating table:', error)
    );
  });
};

export const insertDraft = (draft) => {
  db.transaction(tx => {
    tx.executeSql(
      'INSERT INTO brouillonBase (name, description, category_id, image_file, user_id) VALUES (?, ?, ?, ?, ?)',
      [draft.name, draft.description, draft.category_id, draft.image_file, draft.user_id],
      () => console.log('Brouillon inseré!'),
      (error) => console.error('Error inserting draft:', error)
    );
  });
};

export const getDrafts = (callback) => {
  db.transaction(tx => {
    tx.executeSql(
      'SELECT * FROM brouillonBase',
      [],
      (tx, results) => {
        const drafts = [];
        for (let i = 0; i < results.rows.length; i++) {
          drafts.push(results.rows.item(i));
        }
        callback(drafts);
      },
      (error) => console.error('Error fetching drafts:', error)
    );
  });
};

export const deleteDrafts = (id) => {
  db.transaction(tx => {
    tx.executeSql(
      'DELETE FROM brouillonBase WHERE id = ?',
      [id],
      () => console.log('Brouillon supprimé!'),
      (error) => console.error('Error deleting draft:', error)
    );
  });
};
