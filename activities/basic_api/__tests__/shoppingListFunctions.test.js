const { addItem, togglePurchased, removeItem } = require('../src/shoppingListFunctions');

describe('Shopping List Functionality Tests', () => {
  test('should add an item to the shopping list', () => {
    const response = addItem('Bread', 1, 1.99);
    expect(response).toBe('Bread has been added to the shopping list');
  });

  test('should toggle purchase status of an item based on index', () => {
    const response = togglePurchased(1);
    expect(response).toBe('Toggle purchase status of Bread');
  });

  test('should fail to toggle purchase status of an item due to invalid index', () => {
    const response = togglePurchased(-1);
    expect(response).toBe('Invalid Item Index');
  });

  test('should remove an item from the shopping list based on index', () => {
    const response = removeItem(1);
    expect(response).toBe('Bread has been removed');
  });

  test('should fail to remove an item from the shopping list due to invalid index', () => {
    const response = removeItem(-1);
    expect(response).toBe('Invalid Item Index');
  });
});