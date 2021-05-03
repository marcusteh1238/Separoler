const { Pool } = require('pg');
const logger = require('../helpers/logger');

const pool = new Pool();

pool.on('error', async (err, client) => {
    logger.error({
        msg: 'Unexpected error on postgres pool.',
        pool,
        client,
        err
    });
    client.release();
    // await pool.end();
    // process.exit(-1);
});

module.exports = { pool };

/*
// async/await - check out a client
(async () => {
  const client = await pool.connect()
  try {
    const res = await client.query('SELECT * FROM users WHERE id = $1', [1])
    console.log(res.rows[0])
  } finally {
    // Make sure to release the client before any error handling,
    // just in case the error handling itself throws an error.
    client.release()
  }
})().catch(err => console.log(err.stack))
*/
