import Users from "../../../libs/collections/Users";
/**
 * handler to list users api
 * @param {object} event from api gateway
 * @param {object} context from api gateway
 * @param {function} callback callback function to return response to api gateway
 * @returns http response object
 */
export async function handler(event, context,callback) {
  try {
    const { query } = event;
    if(query.id=== event.cognitoPoolClaims.email){
    const users =  new Users(query);
    await users.fetch();
    return users.toJSON();
    }else{
      throw new Error(`[401] Sorry! You are not authorized to view this content`);
  }

  } catch (err) {
    console.log(err.toString());
    const regex = RegExp('\\[...]');
    const response = regex.test(err) ? err.toString().replace(/^Error:/,'').trim() : `[400] ${err.toString()}`;
    callback(new Error(response));
  }
}