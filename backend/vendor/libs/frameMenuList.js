/**
 * Method to frame menu list based on category
 * @param data from containing menu list
 * @return {Array} grouped menu list based on category
 */
export const frameMenuList = (data) => {
    const group = data.reduce((acc, menu) => {
        acc[menu.heading_level] = [...acc[menu.heading_level] || [], menu];
        return acc;
    }, {});
    const finalMenuList = Object.keys(group).map((key, index) => {
        const obj = {
            category_name: key,
            menu_list: group[key]
        };
        return obj;
    });
    return finalMenuList;
};
