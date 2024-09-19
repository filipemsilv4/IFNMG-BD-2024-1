import { NextRequest, NextResponse } from 'next/server';
import oracledb from 'oracledb';

export async function POST(request: NextRequest) {
  let { query } = await request.json();
  let connection;
  query = query.toUpperCase();

  console.log('Query recebida:', query); // Log para debug

  try {
    connection = await oracledb.getConnection({
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      connectString: process.env.DB_CONNECT_STRING
    });

    console.log('Conexão com o banco de dados estabelecida'); // Log para debug

    const result = await connection.execute(
      query,
      [],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    console.log('Query executada com sucesso'); // Log para debug
    console.log(result.rowsAffected, 'linhas afetadas'); // Log para debug

    // Para consultas SELECT, retornamos as colunas e as linhas
    if (query.trim().toUpperCase().startsWith('SELECT')) {
      const response = {
        columns: result.metaData?.map(meta => meta.name) || [],
        rows: result.rows
      };
      console.log('Resposta da API:', JSON.stringify(response, null, 2)); // Log para debug
      return NextResponse.json(response);
    }
    // Para outros tipos de consultas, retornamos apenas o número de linhas afetadas
    else {
      return NextResponse.json({
        rowsAffected: result.rowsAffected
      });
    }
  } catch (error) {
    console.error('Erro detalhado:', error);
    return NextResponse.json({ error: `Erro ao executar consulta: ${(error as Error).message}` }, { status: 500 });
  } finally {
    if (connection) {
      try {
        await connection.close();
        console.log('Conexão com o banco de dados fechada'); // Log para debug
      } catch (error) {
        console.error('Erro ao fechar conexão:', error);
      }
    }
  }
}