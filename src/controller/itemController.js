import ItemModel from "../model/ItemModel.js";
import {customer, item} from "../db/db.js";
var recordIndex;


$('#add-item-code').val(ItemIdGenerate());
function ItemIdGenerate() {
    let lastId = 'I00-001';

    if (item.length > 0) {
        let lastElement = item[item.length - 1];

        if (lastElement && lastElement.code) {
            let lastIdParts = lastElement.code.split('-');
            let lastNumber = parseInt(lastIdParts[1]);

            lastId = `I00-${String(lastNumber + 1).padStart(3, '0')}`;
        }
    }

    return lastId;
}
$("#btn-add-item").on('click',function(){
    console.log("hiiiiiiiiiii")
    var itemCode = $("#add-item-code").val();
    var itemName = $("#add-item-name").val();
    var itemQty = $("#add-item-qty").val();
    var itemPrice = $("#add-item-price").val();

    var itemObj = new  ItemModel(itemCode, itemName, itemQty, itemPrice);

    item.push(itemObj);

    var newRow = `<tr>
            <td>${itemCode}</td>
            <td>${itemName}</td>
            <td>${itemQty}</td>
            <td>${itemPrice}</td>
        </tr>`;

    $("#item-table tbody").append(newRow);

    clearField();
    loadAllItemId();
    $('#add-item-code').val(ItemIdGenerate());
    displayItemCounts();
});

function displayItemCounts() {
    const customerCountDisplay = $('#item-count');
    customerCountDisplay.text(` ${item.length}`);
}

function loadAllItemId() {
    $('#item-select-cmb').empty();
    for (let customerArElement of item) {
        $('#item-select-cmb').append(`<option>${customerArElement.code}</option>`);
    }
}
$("#item-table").on('click', 'tr', function() {
    $("#item-tbl-value>tr").click(function (){
        let code =$(this).children(':eq(0)').text();
        let name =$(this).children(':eq(1)').text();
        let qty =$(this).children(':eq(2)').text();
        let price =$(this).children(':eq(3)').text();

        console.log(code+"  "+name+"  "+qty+" "+price);

        $('#s-item-inp-code').val(code);
        $('#s-item-inp-name').val(name);
        $('#s-item-inp-qty').val(qty);
        $('#s-item-inp-price').val(price);
    });
});

$("#item-table").on('dblclick','tr',function() {
    let alertConfrimDelete = confirm('Do you really want to delete this customer');
    if (alertConfrimDelete==true) {
        let index = $(this).index();
        recordIndex = index;
        $('.delete_btn').click();
    }
});


$("#btn-remove-item").click(function () {
    let itemCode = $('#s-item-inp-code').val();

    let response = deleteItem(itemCode);
    if (response) {
        alert("Customer Removed Successfully");
    } else {
        alert("Customer not found or Update Failed..!");
    }
});

function deleteItem(itemCode){
    let indexToDelete = -1;
    for (let i = 0; i < item.length; i++) {
        if (item[i].code === itemCode) {
            indexToDelete = i;
            break;
        }
    }

    if (indexToDelete !== -1) {
        // Remove the customer from the array
        item.splice(indexToDelete, 1);

        // Update the table
        updateTable();
        clearFieldSearch();

        return true; // Deleted successfully
    } else {
        return false; // Customer not found or deletion failed
    }
}

function updateTable() {
    $("#item-table tbody").empty();

    item.forEach(function(itm) {
        let row = `<tr>
            <td>${itm.code}</td>
            <td>${itm.itemName}</td>
            <td>${itm.qty}</td>
            <td>${itm.price}</td>
        </tr>`;
        $('#item-table tbody').append(row);
    });
}

$("#btn-update-item").click(function () {
    let itemCode = $('#s-item-inp-code').val();
    let response = updateItem(itemCode);
    if (response) {
        alert("Item Updated Successfully");
    } else {
        alert("Update Failed..!");
    }
});

function updateItem(itemCode) {
    let itmIndex = -1;
    for (let i = 0; i < item.length; i++) {
        if (item[i].code === itemCode) {
            itmIndex = i;
            break;
        }
    }

    if (itmIndex !== -1) {
        item[itmIndex].code = $("#s-item-inp-code").val();
        item[itmIndex].itemName = $("#s-item-inp-name").val();
        item[itmIndex].qty = $("#s-item-inp-qty").val();
        item[itmIndex].price = $("#s-item-inp-price").val();
        addItemTable();
        clearFieldSearch();
        return true;
    } else {
        return false;
    }
}

function addItemTable() {
    // Empty the table body
    $("#item-table tbody").empty();

    // Rebuild the table with the updated data
    for (let itm of item) {
        let row = `<tr>
            <td>${itm.code}</td>
            <td>${itm.itemName}</td>
            <td>${itm.qty}</td>
            <td>${itm.price}</td>
        </tr>`;
        $('#item-table').append(row);
    }
}

$("#itm-serch-btn").click(function () {
    let itemCode = $('#serch-inp-item').val();

    let indexTo = -1;

    for (let i = 0; i < item.length; i++) {
        if (item[i].code === itemCode) {
            indexTo = i;
            break;
        }
    }

    if (indexTo !== -1) {
        // Customer found, set values of text fields
        $('#s-item-inp-code').val(item[indexTo].code);
        $('#s-item-inp-name').val(item[indexTo].itemName);
        $('#s-item-inp-qty').val(item[indexTo].qty);
        $('#s-item-inp-price').val(item[indexTo].price);

        $('#serch-inp-item').val('');
    } else {
        // Customer not found, clear text fields
        $('#s-item-inp-code').val('');
        $('#s-item-inp-name').val('');
        $('#s-item-inp-qty').val('');
        $('#s-item-inp-price').val('');
        alert("Item not found!");
    }

});



function clearFieldSearch(){
    $("#s-item-inp-code").val('');
    $("#s-item-inp-name").val('');
    $("#s-item-inp-qty").val('');
    $("#s-item-inp-price").val('');
}

function clearField() {
    $("#add-item-name").val('');
    $("#add-item-qty").val('');
    $("#add-item-price").val('');
}

$('#add-item-code').on('keyup', function () {
    var itemId = $(this).val();
    var itemIdPattern = /^I\d{3}$/;
    var errorMessage = $('.errorMessageId');

    if (!itemIdPattern.test(itemId)) {
        errorMessage.show();
        $(this).css({ 'border': '2px solid red' });
    } else {
        errorMessage.hide();
        $(this).css({ 'border': '2px solid green' });
    }
});

// Validate Item Name
$('#add-item-name').on('keyup', function () {
    var itemName = $(this).val();
    var errorMessage = $('.errorMessageName');

    if (itemName.trim() === "") {
        errorMessage.show();
        $(this).css({ 'border': '2px solid red' });
    } else {
        errorMessage.hide();
        $(this).css({ 'border': '2px solid green' });
    }
});

// Validate Item Quantity
$('#add-item-qty').on('keyup', function () {
    var itemQty = $(this).val();
    var itemQtyPattern = /^\d+$/;
    var errorMessage = $('.errorMessageQty');

    if (!itemQtyPattern.test(itemQty)) {
        errorMessage.show();
        $(this).css({ 'border': '2px solid red' });
    } else {
        errorMessage.hide();
        $(this).css({ 'border': '2px solid green' });
    }
});

// Validate Unit Price
$('#add-item-price').on('keyup', function () {
    var unitPrice = $(this).val();
    var unitPricePattern = /^\d+(\.\d{1,2})?$/;
    var errorMessage = $('.errorMessagePrice');

    if (!unitPricePattern.test(unitPrice)) {
        errorMessage.show();
        $(this).css({ 'border': '2px solid red' });
    } else {
        errorMessage.hide();
        $(this).css({ 'border': '2px solid green' });
    }
});
