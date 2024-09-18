import { NextRequest, NextResponse } from 'next/server';
import oracledb from 'oracledb';

export async function POST(request: NextRequest) {
  const { query } = await request.json();
  let connection;

  try {
    connection = await oracledb.getConnection({
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      connectString: process.env.DB_CONNECT_STRING
    });

    // Determinar o tipo de consulta (SELECT, INSERT, UPDATE, DELETE)
    const queryType = query.trim().split(' ')[0].toUpperCase();

    let result;
    if (queryType === 'SELECT') {
      result = await connection.execute(
        query,
        [],
        { outFormat: oracledb.OUT_FORMAT_OBJECT }
      );

      return NextResponse.json({
        columns: result.metaData?.map(meta => meta.name) || [],
        rows: result.rows
      });
    } else {
      // Para INSERT, UPDATE, DELETE
      result = await connection.execute(query, [], { autoCommit: true });
      return NextResponse.json({
        rowsAffected: result.rowsAffected
      });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ 
      error: 'Erro ao executar consulta',
      details: (error as Error).message
    }, { status: 500 });
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