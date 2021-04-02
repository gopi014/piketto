import {getKeyValues} from './getssmkeys';


/**
 * Method to make postgres db connection
 * @return {string} db connection
 */
 export const pg =async () => {
    try{
        const {postgresConnectionString} = process.env;
        const data = await getKeyValues([postgresConnectionString]);
        if (data.Parameters[0] && "Value" in data.Parameters[0]) {
            const text_secret_data = data.Parameters[0]["Value"];
            const conn_string = JSON.parse(text_secret_data);
            return conn_string;
          } else {
            throw new Error('Connection Details Not Found...');
          }
    }
    catch(e){
        console.log(e);
        throw new Error(`[400] ${e.toString()}`);
    }
 };