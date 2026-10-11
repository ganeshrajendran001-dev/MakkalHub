const itemForm = document.getElementById("itemForm");
const itemMessage = document.getElementById("itemMessage");

let itemList = [];

let savedItemList = [];


// ==========================================
// PAGE LOAD
// ==========================================

document.addEventListener("DOMContentLoaded", function () {

        // ==========================================
    // AUTOMATIC TODAY'S DATE
    // ==========================================

    const itemDate =
        document.getElementById("itemDate");

    if (itemDate) {

        const today = new Date();

        const year =
            today.getFullYear();

        const month =
            String(today.getMonth() + 1)
                .padStart(2, "0");

        const day =
            String(today.getDate())
                .padStart(2, "0");

        itemDate.value =
            `${year}-${month}-${day}`;

        // Prevent selecting another date
        itemDate.readOnly = true;

    }

    // ==========================================
    // AUTOMATIC UNIT SELECTION
    // ==========================================

    const itemNameSelect =
        document.getElementById("itemName");

    const itemUnitSelect =
        document.getElementById("itemUnit");


    if (itemNameSelect && itemUnitSelect) {

        itemNameSelect.addEventListener(
            "change",
            function () {

                const selectedItem =
                    itemNameSelect.value;


                if (
                    selectedItem === "Oil" ||
                    selectedItem === "Kerosene"
                ) {

                    itemUnitSelect.value =
                        "Litre";

                }

                else if (
                    selectedItem === "Rice" ||
                    selectedItem === "Sugar" ||
                    selectedItem === "Wheat" ||
                    selectedItem === "Dal"
                ) {

                    itemUnitSelect.value =
                        "Kg";

                }

            }
        );

    }


    // ==========================================
    // CHANGE SAVE ITEM BUTTON
    // ==========================================

    const saveButton =
        itemForm.querySelector(
            ".save-button"
        );


    if (saveButton) {

        saveButton.textContent =
            "➕ Add Item";

        saveButton.type =
            "button";

        saveButton.addEventListener(
            "click",
            addItemToList
        );

    }


    // ==========================================
    // CREATE ITEM LIST AREA
    // ==========================================

    const itemListContainer =
        document.createElement("div");


    itemListContainer.id =
        "itemListContainer";


    itemListContainer.style.marginTop =
        "25px";


    itemForm.appendChild(
        itemListContainer
    );


    // ==========================================
    // CREATE FINAL SAVE BUTTON
    // ==========================================

    const saveAllButton =
        document.createElement("button");


    saveAllButton.type =
        "button";


    saveAllButton.className =
        "save-button";


    saveAllButton.textContent =
        "💾 Save All Items";


    saveAllButton.style.marginTop =
        "20px";


    saveAllButton.addEventListener(
        "click",
        saveAllItems
    );


    itemForm.appendChild(
        saveAllButton
    );


    // ==========================================
    // LOAD TODAY'S SAVED ITEMS
    // ==========================================

    loadSavedItems();

});



// ==========================================
// ADD ITEM TO TEMPORARY LIST
// ==========================================

function addItemToList() {

    const itemDate =
        document.getElementById(
            "itemDate"
        ).value;


    const itemName =
        document.getElementById(
            "itemName"
        ).value;


    const itemPrice =
        document.getElementById(
            "itemPrice"
        ).value;


    const itemUnit =
        document.getElementById(
            "itemUnit"
        ).value;


    const itemQuantity =
        document.getElementById(
            "itemQuantity"
        ).value;


    const availability =
        document.getElementById(
            "availability"
        ).value;


    const itemDescription =
        document.getElementById(
            "itemDescription"
        ).value;



    // ==========================================
    // VALIDATION
    // ==========================================

    if (!itemDate) {

        showMessage(
            "Please select date.",
            "red"
        );

        return;
    }


    if (!itemName) {

        showMessage(
            "Please select an item.",
            "red"
        );

        return;
    }


    if (!itemPrice) {

        showMessage(
            "Please enter price.",
            "red"
        );

        return;
    }


    if (!itemUnit) {

        showMessage(
            "Please select unit.",
            "red"
        );

        return;
    }


    if (!itemQuantity) {

        showMessage(
            "Please enter quantity.",
            "red"
        );

        return;
    }



    // ==========================================
    // CHECK DUPLICATE TEMPORARY ITEM
    // ==========================================

    const alreadyAdded =
        itemList.some(
            function (item) {

                return (
                    item.itemDate ===
                        itemDate &&
                    item.itemName ===
                        itemName
                );

            }
        );


    if (alreadyAdded) {

        showMessage(
            "This item is already added for this date.",
            "red"
        );

        return;
    }



    // ==========================================
    // CHECK DUPLICATE SAVED ITEM
    // ==========================================

    const alreadySaved =
        savedItemList.some(
            function (item) {

                return (
                    item.item_date ===
                        itemDate &&
                    item.item_name ===
                        itemName
                );

            }
        );


    if (alreadySaved) {

        showMessage(
            "This item is already saved for this date.",
            "red"
        );

        return;
    }



    // ==========================================
    // ADD ITEM
    // ==========================================

    itemList.push({

        itemDate:
            itemDate,

        itemName:
            itemName,

        itemPrice:
            itemPrice,

        itemUnit:
            itemUnit,

        itemQuantity:
            itemQuantity,

        availability:
            availability,

        itemDescription:
            itemDescription

    });



    // ==========================================
    // DISPLAY LIST
    // ==========================================

    displayItemList();



    // ==========================================
    // CLEAR ITEM FIELDS
    // ==========================================

    document.getElementById(
        "itemName"
    ).value = "";


    document.getElementById(
        "itemPrice"
    ).value = "";


    document.getElementById(
        "itemQuantity"
    ).value = "";


    document.getElementById(
        "itemDescription"
    ).value = "";


    document.getElementById(
        "availability"
    ).value =
        "Available";


    document.getElementById(
        "itemUnit"
    ).value =
        "Kg";


    showMessage(
        "Item added. You can add more items.",
        "green"
    );

}



// ==========================================
// LOAD SAVED ITEMS FROM DATABASE
// ==========================================

async function loadSavedItems() {

    try {

        const response =
            await fetch(
                "http://https://makkalhub-backend.onrender.com/api/items"
            );


        if (!response.ok) {

            throw new Error(
                "Failed to load items"
            );

        }


        const data =
            await response.json();


        if (
            data.success &&
            Array.isArray(data.items)
        ) {

            savedItemList =
                data.items;

        }

        else {

            savedItemList = [];

        }


        displayItemList();


    }

    catch (error) {

        console.error(
            "Load Saved Items Error:",
            error
        );

        savedItemList = [];

        displayItemList();

    }

}



// ==========================================
// DISPLAY ALL ITEMS
// ==========================================

function displayItemList() {

    const container =
        document.getElementById(
            "itemListContainer"
        );


    if (!container) {
        return;
    }


    container.innerHTML = "";



    // ==========================================
    // NO ITEMS
    // ==========================================

    if (
        itemList.length === 0 &&
        savedItemList.length === 0
    ) {

        container.innerHTML = `
            <p>
                No items added yet.
            </p>
        `;

        return;

    }



    // ==========================================
    // HEADING
    // ==========================================

    const heading =
        document.createElement(
            "h3"
        );


    heading.textContent =
        "Today's Items";


    container.appendChild(
        heading
    );



    // ==========================================
    // SAVED DATABASE ITEMS
    // ==========================================

    savedItemList.forEach(
        function (item) {

            const itemCard =
                document.createElement(
                    "div"
                );


            itemCard.style.border =
                "1px solid #ddd";


            itemCard.style.borderRadius =
                "10px";


            itemCard.style.padding =
                "15px";


            itemCard.style.marginBottom =
                "12px";


            itemCard.style.background =
                "#f9f9f9";



            itemCard.innerHTML = `

                <div style="
                    display:flex;
                    justify-content:space-between;
                    align-items:center;
                    gap:15px;
                ">

                    <div>

                        <strong style="
                            font-size:18px;
                        ">
                            ${escapeHtml(
                                item.item_name
                            )}
                        </strong>

                        <p style="
                            margin:6px 0;
                        ">
                            💰 Price:
                            ₹${item.price}
                            / ${escapeHtml(
                                item.unit || "Kg"
                            )}
                        </p>

                        <p style="
                            margin:6px 0;
                        ">
                            📦 Quantity:
                            ${item.quantity}
                            ${escapeHtml(
                                item.unit || "Kg"
                            )}
                        </p>

                        <p style="
                            margin:6px 0;
                        ">
                            📌 Status:
                            ${escapeHtml(
                                item.availability
                            )}
                        </p>

                    </div>


                    <button
                        type="button"
                        class="delete-saved-item-button"
                        data-id="${item.daily_item_id}"
                        style="
                            background:#dc3545;
                            color:white;
                            border:none;
                            padding:8px 12px;
                            border-radius:6px;
                            cursor:pointer;
                        "
                    >
                        🗑️ Delete
                    </button>

                </div>

            `;


            container.appendChild(
                itemCard
            );

        }
    );



    // ==========================================
    // TEMPORARY ITEMS
    // ==========================================

    itemList.forEach(
        function (item, index) {

            const itemCard =
                document.createElement(
                    "div"
                );


            itemCard.style.border =
                "1px solid #ddd";


            itemCard.style.borderRadius =
                "10px";


            itemCard.style.padding =
                "15px";


            itemCard.style.marginBottom =
                "12px";


            itemCard.style.background =
                "#f9f9f9";



            itemCard.innerHTML = `

                <div style="
                    display:flex;
                    justify-content:space-between;
                    align-items:center;
                    gap:15px;
                ">

                    <div>

                        <strong style="
                            font-size:18px;
                        ">
                            ${escapeHtml(
                                item.itemName
                            )}
                        </strong>

                        <p style="
                            margin:6px 0;
                        ">
                            💰 Price:
                            ₹${item.itemPrice}
                            / ${escapeHtml(
                                item.itemUnit
                            )}
                        </p>

                        <p style="
                            margin:6px 0;
                        ">
                            📦 Quantity:
                            ${item.itemQuantity}
                            ${escapeHtml(
                                item.itemUnit
                            )}
                        </p>

                        <p style="
                            margin:6px 0;
                        ">
                            📌 Status:
                            ${escapeHtml(
                                item.availability
                            )}
                        </p>

                        ${
                            item.itemDescription
                            ? `
                                <p style="
                                    margin:6px 0;
                                ">
                                    ℹ️ ${escapeHtml(
                                        item.itemDescription
                                    )}
                                </p>
                              `
                            : ""
                        }

                    </div>


                    <button
                        type="button"
                        class="remove-item-button"
                        data-index="${index}"
                        style="
                            background:#dc3545;
                            color:white;
                            border:none;
                            padding:8px 12px;
                            border-radius:6px;
                            cursor:pointer;
                        "
                    >
                        🗑️ Remove
                    </button>

                </div>

            `;


            container.appendChild(
                itemCard
            );

        }
    );



    // ==========================================
    // TEMPORARY REMOVE BUTTON
    // ==========================================

    const removeButtons =
        container.querySelectorAll(
            ".remove-item-button"
        );


    removeButtons.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    const index =
                        Number(
                            button.dataset.index
                        );


                    itemList.splice(
                        index,
                        1
                    );


                    displayItemList();


                    showMessage(
                        "Item removed.",
                        "green"
                    );

                }
            );

        }
    );



    // ==========================================
    // DATABASE DELETE BUTTON
    // ==========================================

    const deleteButtons =
        container.querySelectorAll(
            ".delete-saved-item-button"
        );


    deleteButtons.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    const dailyItemId =
                        button.dataset.id;


                    deleteSavedItem(
                        dailyItemId
                    );

                }
            );

        }
    );

}



// ==========================================
// DELETE SAVED DATABASE ITEM
// ==========================================

async function deleteSavedItem(
    dailyItemId
) {

    const confirmDelete =
        confirm(
            "Are you sure you want to delete this item from Today's Items?"
        );


    if (!confirmDelete) {
        return;
    }


    try {

        const response =
            await fetch(
                `http://https://makkalhub-backend.onrender.com/api/items/${dailyItemId}`,
                {
                    method: "DELETE"
                }
            );


        const data =
            await response.json();


        if (!data.success) {

            showMessage(
                data.message ||
                "Failed to delete item.",
                "red"
            );

            return;

        }


        // ==========================================
        // REMOVE FROM LOCAL LIST
        // ==========================================

        savedItemList =
            savedItemList.filter(
                function (item) {

                    return (
                        String(
                            item.daily_item_id
                        ) !==
                        String(
                            dailyItemId
                        )
                    );

                }
            );


        displayItemList();


        showMessage(
            "✅ Today's item deleted successfully.",
            "green"
        );

    }

    catch (error) {

        console.error(
            "Delete Saved Item Error:",
            error
        );


        showMessage(
            "Failed to delete item. Please try again.",
            "red"
        );

    }

}



// ==========================================
// SAVE ALL ITEMS
// ==========================================

async function saveAllItems() {

    if (itemList.length === 0) {

        showMessage(
            "Please add at least one item.",
            "red"
        );

        return;
    }


    const saveAllButton =
        document.querySelector(
            "#itemForm button:last-child"
        );


    if (saveAllButton) {

        saveAllButton.disabled =
            true;

        saveAllButton.textContent =
            "💾 Saving Items...";

    }


    let successCount = 0;

    let failedCount = 0;



    // ==========================================
    // SAVE EACH ITEM
    // ==========================================

    for (
        const item of itemList
    ) {

        try {

            const response =
                await fetch(
                    "http://https://makkalhub-backend.onrender.com/api/items",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({

                            itemDate:
                                item.itemDate,

                            itemName:
                                item.itemName,

                            itemPrice:
                                item.itemPrice,

                            itemUnit:
                                item.itemUnit,

                            itemQuantity:
                                item.itemQuantity,

                            availability:
                                item.availability,

                            itemDescription:
                                item.itemDescription

                        })

                    }
                );


            const data =
                await response.json();


            if (data.success) {

                successCount++;

            }

            else {

                failedCount++;

                console.error(
                    "Failed:",
                    item.itemName,
                    data.message
                );

            }

        }

        catch (error) {

            failedCount++;

            console.error(
                "Error saving:",
                item.itemName,
                error
            );

        }

    }



    // ==========================================
    // RESULT
    // ==========================================

    if (failedCount === 0) {

        showMessage(
            `✅ ${successCount} item(s) saved successfully.`,
            "green"
        );


        itemList = [];


        // ==========================================
        // RELOAD DATABASE ITEMS
        // ==========================================

        await loadSavedItems();


       itemForm.reset();

// Set today's date again after form reset
const today = new Date();

const year =
    today.getFullYear();

const month =
    String(today.getMonth() + 1)
        .padStart(2, "0");

const day =
    String(today.getDate())
        .padStart(2, "0");

document.getElementById("itemDate").value =
    `${year}-${month}-${day}`;

    }

    else {

        showMessage(
            `Saved: ${successCount} | Failed: ${failedCount}`,
            "red"
        );

    }



    if (saveAllButton) {

        saveAllButton.disabled =
            false;

        saveAllButton.textContent =
            "💾 Save All Items";

    }

}



// ==========================================
// ESCAPE HTML
// ==========================================

function escapeHtml(value) {

    if (
        value === null ||
        value === undefined
    ) {

        return "";

    }


    return String(value)
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}



// ==========================================
// MESSAGE
// ==========================================

function showMessage(
    message,
    color
) {

    if (!itemMessage) {
        return;
    }


    itemMessage.textContent =
        message;


    itemMessage.style.color =
        color;

}