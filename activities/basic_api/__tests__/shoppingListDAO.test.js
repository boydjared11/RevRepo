const { readShoppingList, writeShoppingList } = require('../src/shoppingListDAO');
const fs = require('fs');
const path = require('path');

// Mock the fs module
jest.mock('fs');

describe('DAO Tests', () => {
  beforeEach(() => {
    fs.writeFileSync.mockClear();
  });

  test('should write shopping list to data.json', () => {
    const shoppingList = [{ name: 'Milk', quantity: 1, price: 2.99 }];
    
    // Call the function to write the shopping list
    writeShoppingList(shoppingList);

    // Dynamically generate the correct file path
    const filePath = path.join(__dirname, '../src/data.json');

    // Check if fs.writeFileSync was called with the correct arguments
    expect(fs.writeFileSync).toHaveBeenCalledWith(filePath, JSON.stringify(shoppingList, null, 2));
  });

  test('should get shopping list from data.json', () => {
    const shoppingList = readShoppingList();

    expect(shoppingList).toBe();
  })
});
