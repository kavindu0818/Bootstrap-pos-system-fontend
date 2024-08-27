import ItemModel from "../model/ItemModel.js";
import CustomerModel from "../model/customerModel.js";
import { customer } from "../db/db.js";
import { item } from "../db/db.js";
import { orderDetails } from "../db/db.js";
import { order } from "../db/db.js";
import orderDetailsModel from "../model/orderDetailsModel.js";

let selectedCustomerId;
let itemCode;
let lastQtyFix;

$('#invoice-code').val(OrderIdGenerate());

function OrderIdGenerate() {
    let lastId = 'OD00-001';

    if (orderDetails.length > 0) {
        let lastElement = orderDetails[orderDetails.length - 1];

        if (lastElement && lastElement._orderId) {
            let lastIdParts = lastElement._orderId.split('-');
            let lastNumber = parseInt(lastIdParts[1]);

            lastId = `OD00-${String(lastNumber + 1).padStart(3, '0')}`;
        }
    }

    return lastId;
}

$('#invoice-input-cus-cmb').on('change', function(){
    selectedCustomerId = $('#invoice-input-cus-cmb option:selected').text();
    for (let customerArElement of customer) {
        if (customerArElement.id==selectedCustomerId){
            $('#invoice-cus-name').val(customerArElement.name);
            $('#invoice-cus-salary').val(customerArElement.salary);
            $('#invoice-cus-address').val(customerArElement.address);
            $('#item-select-cmb').focus();
        }
    }
});

$('#item-select-cmb').on('change', function(){
    itemCode = $('#item-select-cmb option:selected').text();
    for (let itm of item) {
        if (itm.code==itemCode){
            $('#itemName').val(itm.itemName);
            $('#item-select-price').val(itm.price);
            $('#item-select-qty').val(itm._qty);
            $('#invoice-input-cus-cmb').focus();
        }
    }
});

$(document).ready(function(){
    $('#item-select-add-btn').click(function(){

        var price = $('#item-select-price').val();
        var qty = $('#item-select-orderQty').val();

        var result = price * qty;

        $('#total').val(result);
        $('#subTotal').val(result);

        for (let itm of item) {
            if (itm.code == itemCode) {
                itm.qty = lastQtyFix;
                break;
            }
        }
    });
});

$(document).ready(function () {
    $('#discount, #subTotal').on('input', function () {

        var discount = parseFloat($('#discount').val()) || 0;
        var subTotal = parseFloat($('#subTotal').val()) || 0;
        var total = parseFloat($('#total').val()) || 0;

        var result =  total - (total * discount / 100);

        $('#subTotal').val(result.toFixed(2));
    });
});

$(document).ready(function () {
    $('#cash, #balance').on('input', function () {

        var subTotal = parseFloat($('#subTotal').val()) || 0;
        var cash = parseFloat($('#cash').val()) || 0;

        var result =  cash - subTotal;

        $('#balance').val(result.toFixed(2));
    });
});

$('#item-select-orderQty').on('input', function () {

    // Debug: Check event trigger
    console.log("Input event triggered");

    // Get the selected item code
    let itemCode = $('#item-select-cmb option:selected').text();

    // Debug: Check selected item code
    console.log("Selected item code:", itemCode);

    // Loop through the items to find the matching item by code
    for (let itm of item) {
        // Debug: Check each item
        console.log("Checking item:", itm.code);

        if (itm.code == itemCode) {
            // Get the order quantity and current quantity values
            let qtyL = itm._qty;
            let orderQty = parseFloat($('#item-select-orderQty').val()) || 0;
            // let qtyL = parseFloat($('#item-select-qty').val()) || 0;

            // Debug: Check input values
            console.log("Order Qty:", orderQty, "Qty L:", qtyL);

            // Calculate the last quantity
            let lastQty = qtyL - orderQty;

            lastQtyFix = lastQty;

            // Debug: Check updated item qty
            console.log("Updated item qty:", itm.qty);

            // Update the input field with the new qty
            setItemQty(lastQty);

            // Debug: Check if input field is updated
            console.log("Updated input field qty:", $('#item-select-qty').val());

            // break;
        }
    }
});

function setItemQty(lastQty){
    $('#item-select-qty').val(lastQty);
}


$("#purchase").on('click',function(){

    var orderId = $("#invoice-code").val();
    var orderDate = $("#invoice-date").val();
    var cusId = $("#invoice-input-cus-cmb").val();
    var ItemId = $("#item-select-cmb").val();
    var qty = $("#item-select-orderQty").val();
    var total = $("#total").val();
    var cash = $("#cash").val();
    var discount = $("#discount").val();
    var itemName = $("#itemName").val();
    var price = $("#item-select-price").val();


    var cusObj = new orderDetailsModel(orderId,orderDate,cusId,ItemId,qty,total,cash,discount);

    orderDetails.push(cusObj);

    var newRow = `<tr>
            <td>${orderId}</td>
            <td>${itemName}</td>
            <td>${price}</td>
            <td>${qty}</td>
            <td>${total}</td>
        </tr>`;

    $("#orderTable tbody").append(newRow);

    $('#invoice-code').val(OrderIdGenerate());

    clearFields();

    displayOrderCounts();
    // loadAllCustomerId();
});

function displayOrderCounts() {
    const customerCountDisplay = $('#order-count');
    customerCountDisplay.text(` ${orderDetails.length}`);
}

function clearFields() {
    $("#invoice-date").val('');
    $("#invoice-input-cus-cmb").val('');
    $("#item-select-cmb").val('');
    $("#itemName").val('');
    $("#item-select-price").val('');
    $("#item-select-qty").val('');
    $("#total").val('');
    $("#cash").val('');
    $("#discount").val('');

}

("#item-select-orderQty").on('keyup', () => {
    var orderFormQtyOnHand=parseInt($('#item-select-qty').val());
    var orderQty =parseInt($('#item-select-orderQty').val());
    var itemQtyPattern = /^\d+$/;
    var errorMessageQty = $('.errorOrderQty');
    var errorQty = $('.errorQty');


    if (!itemQtyPattern.test(orderQty)) {
        errorQty.show();
        $('#item-select-orderQty').css('border', '2px solid red');
    } else {
        errorQty.hide();
        $('#item-select-orderQty').css('border', '2px solid green');
    }

    if (orderQty>orderFormQtyOnHand){
        $('#orderQtyValue').text(orderFormQtyOnHand);
        errorMessageQty.show();
    }else {
        errorMessageQty.hide();
    }
});



