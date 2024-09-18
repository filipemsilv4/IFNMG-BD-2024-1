import oracledb from 'oracledb';

const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  connectString: process.env.DB_CONNECT_STRING
};

async function initialize() {
  await oracledb.createPool(dbConfig);
}

async function close() {
  await oracledb.getPool().close();
}

async function execute(sql: string, binds: any[] = [], opts: object = {}) {
  let connection;
  try {
    connection = await oracledb.getConnection();
    const result = await connection.execute(sql, binds, opts);
    return result;
  } catch (err) {
    console.error(err);
    throw err;
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error(err);
      }
    }
  }
}

export { initialize, close, execute };