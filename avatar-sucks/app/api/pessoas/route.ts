import { NextResponse } from 'next/server';
import oracledb from 'oracledb';

export async function GET() {
  let connection;

  try {
    connection = await oracledb.getConnection({
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      connectString: process.env.DB_CONNECT_STRING
    });

    const result = await connection.execute(
      'SELECT * FROM Pessoa',
      [],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Erro ao buscar dados' }, { status: 500 });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (error) {
        console.error(error);
      }
    }
  }
}