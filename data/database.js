import path from 'path';
import csvdb from 'node-csv-query';

const database = { connection: null };

/**
 * db connection to the csv file using node-csv-query
 * @see {@link https://github.com/rdubigny/node-csv-query}
 */
csvdb(path.join(__dirname, 'database.csv'), { rtrim: true }).then((db) => {
  // eslint-disable-next-line no-console
  console.log('Connected to database!');

  database.connection = db;
});

export default database;
