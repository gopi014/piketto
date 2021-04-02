import {
   pg
} from './dbconnect';
import PgConnection from 'postgresql-easy';

/**
 * Method to get All data based on table name
 * @param action postgres action that needs to be performed
 * @param tableName from which data needs to be taken
 * @param params input parameters
 * @return {Array} all the data of the given tablename
 */

export const postgresCrud = async (action, tableName, params) => {
   try {
      const connectionString = await pg();
      const connect = new PgConnection(connectionString);
      const result = await connect[action](tableName, params);
      connect.disconnect();
      return result;
   } catch (e) {
      console.log(e);
      throw `${e.toString()}`;
   }
};

/**
 * Method to perform query operations on db
 * @param query sql query that needs to be performed
 * @return {} result of the sql query
 */
export const postgresQuery = async (query) => {
   try {
      const connectionString = await pg();
      const connect = new PgConnection(connectionString);
      const result = await connect.query(query);
      connect.disconnect();
      return result;
   } catch (e) {
      console.log(e);
      throw `${e.toString()}`;
   }
};

/**
 * Method to perform update operations on db by id
 * @param tableName from which data needs to be taken
 * @param id id for which update needs to be performed
 * @param data data of columns that needs to be updated
 * @return {object} result of updated row
 */
export const postgresUpdateById = async (tableName, id, data) => {
   try {
      const connectionString = await pg();
      const connect = new PgConnection(connectionString);
      const result = await connect.updateById(tableName, id, data);
      connect.disconnect();
      return result;
   } catch (e) {
      console.log(e);
      throw `${e.toString()}`;
   }
};