import {postgresQuery} from "../../../libs/dbcrud";
/**
 * handler to get all menu api
 * @param {object} event from api gateway
 * @param {object} context from api gateway
 * @param {function} callback callback function to return response to api gateway
 * @returns http response object
 */
export async function handler(event, context, callback) { // eslint-disable-line no-unused-vars

  try {
    const {lat,long} = event.query;
    const query = `SELECT * FROM pik_vendor_branch_details WHERE ST_DWithin(Geography(ST_MakePoint(longitude, latitude)),Geography(ST_MakePoint(${long},${lat})),10000);`;
    const response = await postgresQuery(query);
    return response;
  } catch (err) {
      callback(new Error(`[400] ${err}`));
  }
}