const groceryListDao = require("./groceryListDAO");
const uuid = require("uuid");

async function postItem(item) {
    // validate the item
    if (validateItem(item)) {
        let data = await groceryListDao.postItem({
            ItemID: uuid.v4(),
            name: item.name,
            price: parseFloat(item.price).toFixed(2),
            purchased: false
        });
        return data;
    }
    return null;
}

function validateItem(item) {
    return (item.name && item.price);
}

async function getAllItems() {
    const items = await groceryListDao.getAllItems();
    return items;
}

async function getItemById(itemId) {
    const item = await groceryListDao.getItemById(itemId);
    return item;
}

async function getItemsByName(itemName) {
    const items = await groceryListDao.getItemsByName(itemName);
    return items;
}

async function updateItem(itemId) {
    const updatedItem = await groceryListDao.updateItem(itemId);
    return updatedItem;
}

async function deleteItem(itemId) {
    const data = await groceryListDao.deleteItem(itemId);
    return data;
}

module.exports = {
    postItem,
    getAllItems,
    getItemById,
    getItemsByName,
    updateItem,
    deleteItem
}