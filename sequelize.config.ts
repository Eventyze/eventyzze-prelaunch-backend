module.exports = {
    development: {
      dialect: 'postgres',
      host: 'localhost',
      username: 'your_username',
      password: 'your_password',
      database: 'your_database',
      migrationStorage: 'sequelize',
      migrationStorageTableName: 'migrations',
      migrations: './src/migrations', // Change this path as needed
    },
  };
  