document.addEventListener("DOMContentLoaded", function() {
    const inventoryForm = document.getElementById("inventory-form");
    const itemNameInput = document.getElementById("item-name");
    const itemQuantityInput = document.getElementById("item-quantity");
    const itemPriceInput = document.getElementById("item-price");
    const itemImageInput = document.getElementById("item-image");
    const inventoryTableBody = document.querySelector("#inventory-table tbody");
    
    const salesForm = document.getElementById("sales-form");
    const saleItemNameInput = document.getElementById("sale-item-name");
    const saleQuantityInput = document.getElementById("sale-quantity");
    const salesList = document.getElementById("sales-list");
    const showSalesButton = document.getElementById("show-sales");

    // ローカルストレージから在庫データを取得
    function loadInventory() {
        const inventory = JSON.parse(localStorage.getItem("inventory")) || [];
        inventory.forEach(item => addItemToTable(item));
    }

    // 在庫データをローカルストレージに保存
    function saveInventory(inventory) {
        localStorage.setItem("inventory", JSON.stringify(inventory));
    }

    // ローカルストレージから売り上げデータを取得
    function loadSales() {
        return JSON.parse(localStorage.getItem("sales")) || [];
    }

    // 売り上げデータをローカルストレージに保存
    function saveSales(sales) {
        localStorage.setItem("sales", JSON.stringify(sales));
    }

    // 在庫をテーブルに追加
    function addItemToTable(item) {
        const row = document.createElement("tr");

        const imageCell = document.createElement("td");
        const image = document.createElement("img");
        image.src = item.image;
        image.alt = item.name;
        imageCell.appendChild(image);
        row.appendChild(imageCell);

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
                updateItem(item.name, nameCell.textContent, quantityCell.textContent, priceCell.textContent, item.image);
            });
        });
    }

    // 在庫を追加
    function addItem(name, quantity, price, image) {
        const inventory = JSON.parse(localStorage.getItem("inventory")) || [];
        const item = { name, quantity, price, image };
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
    function updateItem(originalName, newName, newQuantity, newPrice, image) {
        let inventory = JSON.parse(localStorage.getItem("inventory")) || [];
        const itemIndex = inventory.findIndex(item => item.name === originalName);
        if (itemIndex !== -1) {
            inventory[itemIndex] = { name: newName, quantity: newQuantity, price: newPrice, image: image };
            saveInventory(inventory);
        }
    }

    // 売り上げを登録
    function registerSale(itemName, quantitySold) {
        const inventory = JSON.parse(localStorage.getItem("inventory")) || [];
        const itemIndex = inventory.findIndex(item => item.name === itemName);

        if (itemIndex !== -1 && inventory[itemIndex].quantity >= quantitySold) {
            const sales = loadSales();
            const sale = {
                itemName,
                quantitySold,
                salePrice: inventory[itemIndex].price * quantitySold,
                date: new Date().toLocaleString()
            };
            sales.push(sale);
            saveSales(sales);

            // 在庫を減らす
            inventory[itemIndex].quantity -= quantitySold;
            saveInventory(inventory);

            // テーブルを再描画
            inventoryTableBody.innerHTML = "";
            loadInventory();
        } else {
            alert("在庫が不足しています。");
        }
    }

    // 売り上げを表示
    function showSales() {
        salesList.innerHTML = ""; // 既存の内容をクリア
        const sales = loadSales();
        sales.forEach(sale => {
            const saleDiv = document.createElement("div");
            saleDiv.textContent = `商品名: ${sale.itemName}, 数量: ${sale.quantitySold}, 売り上げ: ${sale.salePrice}, 日付: ${sale.date}`;
            salesList.appendChild(saleDiv);
        });
    }

    // 在庫フォームの送信イベントを処理
    inventoryForm.addEventListener("submit", function(event) {
        event.preventDefault();

        const name = itemNameInput.value;
        const quantity = itemQuantityInput.value;
        const price = itemPriceInput.value;
        const imageFile = itemImageInput.files[0];
        
        if (imageFile) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const image = e.target.result;
                addItem(name, quantity, price, image);
                itemNameInput.value = "";
                itemQuantityInput.value = "";
                itemPriceInput.value = "";
                itemImageInput.value = "";
            };
            reader.readAsDataURL(imageFile);
        }
    });

    // 売り上げフォームの送信イベントを処理
    salesForm.addEventListener("submit", function(event) {
        event.preventDefault();
        
        const itemName = saleItemNameInput.value;
        const quantitySold = parseInt(saleQuantityInput.value);

        registerSale(itemName, quantitySold);

        saleItemNameInput.value = "";
        saleQuantityInput.value = "";
    });

    // 売り上げ確認ボタンのクリックイベントを処理
    showSalesButton.addEventListener("click", showSales);

    // ページ読み込み時に在庫を表示
    loadInventory();
});
