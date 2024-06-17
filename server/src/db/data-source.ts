// db/data-source.ts

import { DataSource, DataSourceOptions } from 'typeorm';

export const dataSourceOptions: DataSourceOptions = {
  type: process.env.DB_TYPE as any,
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 3306,
  username: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_DATABASE || 'ultatel-Mostafa-Roshdy',
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: true, // Sync only in non-production environments
  // logging: true,
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
