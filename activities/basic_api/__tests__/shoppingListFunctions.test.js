const { addItem, togglePurchased, removeItem } = require('../src/shoppingListFunctions');

describe('Shopping List Functionality Tests', () => {
  test('should add an item to the shopping list', () => {
    const response = addItem('Bread', 1, 1.99);
    expect(response).toBe('Bread has been added to the shopping list');
  });

  test('should toggle purchased of a particular item', () => {
    const response = togglePurchased(1);
    expect(response).toBe('Toggle purchase status of Bread');
  })

  test('should remove an item from the shopping list', () => {
    const response = removeItem(1);
    expect(response).toBe('Bread has been removed');
  })
});