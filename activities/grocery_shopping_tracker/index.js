const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin, // Read from standard input (keyboard)
  output: process.stdout // Write to standard output (console)
});

const shoppingList = [
    {
        name: "Banana",
        quantity: 3,
        price: 5.00,
        purchased: false
    }
]; // Define an array to store the shopping list

// Initial Display
displayShoppingList();


function displayShoppingList() {
    shoppingList.forEach((item, index) => {
        const status = item.purchased ? ' (Purchased)' : '';
        console.log(`${index + 1}. Name: ${item.name} Quantity: ${item.quantity} Price: $${item.price}${status}`)
    });

    rl.question('1 - Add Item, 2 - Toggle Purchased, 3 - Remove Item, 4 - Quit: ', (choice) => {
        switch (choice) {
            case '1':
                addItem();
                break;
            case '2':
                togglePurchased();
                break;
            case '3':
                removeItem();
                break;
            case '4':
                console.log("Goodbye!");
                rl.close();
                break;
            default:
                console.log("Invalid Choice, please choose a valid option (1/2/3/4): ")
                displayShoppingList();
                break;
        }
    })
}


function addItem() {
    rl.question('Enter the name of the item: ', itemName => {
        itemName = itemName.trim();

        if (!itemName) {
            console.log("Please enter a valid item name: ");
            return addItem();
        }

        rl.question('Enter the quantity of the item: ', itemQuantity => {
            const quantity = parseInt(itemQuantity);

            rl.question(`Enter the price for ${itemName}: `, priceEntered => {
                const price = parseFloat(priceEntered) || 0;
    
                const newItem = {
                    name: itemName,
                    quantity: quantity,
                    price: price.toFixed(2), // Formats the price to two decimal places
                    purchased: false
                }
    
                shoppingList.push(newItem);
                console.log(`${itemName} has been added to the shopping list`)
                displayShoppingList();
            })
        })
    })
}

function togglePurchased(){
    rl.question('Enter the number of the item to toggle: ', itemNumber => {
        const index = parseInt(itemNumber) - 1;
        if (index >= 0 && index < shoppingList.length) {
            shoppingList[index].purchased = !shoppingList[index].purchased;

            displayShoppingList();
        } else {
            console.log("invalid item number");
            displayShoppingList();
        }
    })
}

function removeItem() {
    rl.question('Enter the number of the item to remove: ', itemNumber => {
        const index = parseInt(itemNumber) - 1;
        if (index >= 0 && index < shoppingList.length) {

            const removedItem = shoppingList.splice(index, 1);
            console.log(`${removedItem[0].name} has been removed from the shopping list`);

            displayShoppingList();
        } else {
            console.log("invalid item number");
            displayShoppingList
        }
    })
}