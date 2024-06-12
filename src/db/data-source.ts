// db/data-source.ts

import { DataSource, DataSourceOptions } from 'typeorm';

export const dataSourceOptions: DataSourceOptions = {
  type: 'mariadb',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: 'root',
  database: 'ultatel-Mostafa-Roshdy',
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: process.env.NODE_ENV !== 'production', // Sync only in non-production environments
  logging: true,
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
