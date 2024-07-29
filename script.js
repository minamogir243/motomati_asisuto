document.addEventListener("DOMContentLoaded", function() {
    const inventoryForm = document.getElementById("inventory-form");
    const itemNameInput = document.getElementById("item-name");
    const itemQuantityInput = document.getElementById("item-quantity");
    const itemPriceInput = document.getElementById("item-price");
    const inventoryTableBody = document.querySelector("#inventory-table tbody");

    // ローカルストレージから在庫データを取得
    function loadInventory() {
        const inventory = JSON.parse(localStorage.getItem("inventory")) || [];
        inventory.forEach(item => addItemToTable(item));
    }

    // 在庫データをローカルストレージに保存
    function saveInventory(inventory) {
        localStorage.setItem("inventory", JSON.stringify(inventory));
    }

    // 在庫をテーブルに追加
    function addItemToTable(item) {
        const row = document.createElement("tr");

        const nameCell = document.createElement("td");
        nameCell.contentEditable = true;
        nameCell.textContent = item.name;
        row.appendChild(nameCell);

        const quantityCell = document.createElement("td");
        quantityCell.contentEditable = true;
        quantityCell.textContent = item.quantity;
        row.appendChild(quantityCell);

        const priceCell = document.createElement("td");
        priceCell.contentEditable = true;
        priceCell.textContent = item.price;
        row.appendChild(priceCell);

        const actionCell = document.createElement("td");
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "削除";
        deleteButton.addEventListener("click", function() {
            deleteItem(item.name);
            row.remove();
        });
        actionCell.appendChild(deleteButton);
        row.appendChild(actionCell);

        inventoryTableBody.appendChild(row);

        // テーブルセルの編集終了時にデータを保存
        [nameCell, quantityCell, priceCell].forEach(cell => {
            cell.addEventListener("blur", function() {
                updateItem(item.name, nameCell.textContent, quantityCell.textContent, priceCell.textContent);
            });
        });
    }

    // 在庫を追加
    function addItem(name, quantity, price) {
        const inventory = JSON.parse(localStorage.getItem("inventory")) || [];
        const item = { name, quantity, price };
        inventory.push(item);
        saveInventory(inventory);
        addItemToTable(item);
    }

    // 在庫を削除
    function deleteItem(name) {
        let inventory = JSON.parse(localStorage.getItem("inventory")) || [];
        inventory = inventory.filter(item => item.name !== name);
        saveInventory(inventory);
    }

    // 在庫を更新
    function updateItem(originalName, newName, newQuantity, newPrice) {
        let inventory = JSON.parse(localStorage.getItem("inventory")) || [];
        const itemIndex = inventory.findIndex(item => item.name === originalName);
        if (itemIndex !== -1) {
            inventory[itemIndex] = { name: newName, quantity: newQuantity, price: newPrice };
            saveInventory(inventory);
        }
    }

    // フォームの送信イベントを処理
    inventoryForm.addEventListener("submit", function(event) {
        event.preventDefault();
        const name = itemNameInput.value;
        const quantity = itemQuantityInput.value;
        const price = itemPriceInput.value;
        addItem(name, quantity, price);
        itemNameInput.value = "";
        itemQuantityInput.value = "";
        itemPriceInput.value = "";
    });

    // ページ読み込み時に在庫を表示
    loadInventory();
});

