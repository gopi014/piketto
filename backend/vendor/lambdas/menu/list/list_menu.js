import {postgresQuery} from "../../../libs/dbcrud";
import {frameMenuList} from "../../../libs/frameMenuList";
/**
 * handler to get all menu api
 * @param {object} event from api gateway
 * @param {object} context from api gateway
 * @param {function} callback callback function to return response to api gateway
 * @returns http response object
 */
export async function handler(event, context, callback) { // eslint-disable-line no-unused-vars

  try {
    const {branchId,id} = event.path;
    const {isRecommended,user} = event.query;
    const condition = isRecommended ? `AND a.is_recommended=true`:"";
    const query = `SELECT a.*,b.heading_level FROM pik_menu_items as a JOIN pik_heading_detail as b ON a.heading_level_id = b.heading_level_id WHERE a.vendor_branch_id='${branchId}' AND a.menu_id='${id}' ${condition} `;
    const response = await postgresQuery(query);
    return user ? frameMenuList(response) : response;
  } catch (err) {
      callback(new Error(`[400] ${err}`));
  }
}