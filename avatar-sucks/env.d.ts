declare global {
    namespace NodeJS {
      interface ProcessEnv {
        DB_USER: string;
        DB_PASSWORD: string;
        DB_CONNECT_STRING: string;
      }
    }
  }
  
  export {};