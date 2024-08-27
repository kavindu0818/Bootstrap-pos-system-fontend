import CustomerModel from "../model/customerModel.js";
import {customer} from "../db/db.js";
var recordIndex;


loadAllCustomerId();
$("#add-inp-cusId").val(cusIdGenerate());

$("#add-btn-cus").on('click',function(){

        var inputValueId = $("#add-inp-cusId").val();
        var inputValueFname = $("#add-inp-cusName").val();
        var inputValueAddress = $("#add-inp-cusAddress").val();
        var inputValueSalary = $("#add-inp-cusSalary").val();

    const customer = {

        id:inputValueId,
        name:inputValueFname,
        address: inputValueAddress,
        salary: inputValueSalary
    }

    $.ajax({
        url: "http://localhost:8080/pos/customer",
        type: "DELETE",
        contentType: "application/json",
        data: JSON.stringify(customer),
        success: (Response) => {
            clearField();
            loadAllCustomerId();
            $("#add-inp-cusId").val(cusIdGenerate());
            displayCustomerCounts()
        }

    });


        // customer.push(cusObj);

        var newRow = `<tr>
            <td>${inputValueId}</td>
            <td>${inputValueFname}</td>
            <td>${inputValueAddress}</td>
            <td>${inputValueSalary}</td>
        </tr>`;

        $("#cus-table tbody").append(newRow);


    });
    function displayCustomerCounts() {
        const customerCountDisplay = $('#customer-count');
        customerCountDisplay.text(` ${customer.length}`);
    }

function loadAllCustomerId() {
    $('#invoice-input-cus-cmb').empty();
    for (let customerArElement of customer) {
        $('#invoice-input-cus-cmb').append(`<option>${customerArElement.id}</option>`);
    }
}

function cusIdGenerate() {
    let lastId = 'C00-001';

    if (customer.length > 0) {
        let lastElement = customer[customer.length - 1];

        if (lastElement && lastElement.id) {
            let lastIdParts = lastElement.id.split('-');
            let lastNumber = parseInt(lastIdParts[1]);

            lastId = `C00-${String(lastNumber + 1).padStart(3, '0')}`;
        }
    }

    return lastId;
}

$("#cus-table").on('click', 'tr', function() {
    $("#tbl-value>tr").click(function (){
        let id=$(this).children(':eq(0)').text();
        let name=$(this).children(':eq(1)').text();
        let address=$(this).children(':eq(2)').text();
        let salary=$(this).children(':eq(3)').text();

        console.log(id+"  "+name+"  "+address+" "+salary);

        $('#serch-cus-id').val(id);
        $('#serch-cus-name').val(name);
        $('#serch-cus-address').val(address);
        $('#serch-cus-salary').val(salary);
    });
});

$("#cus-table").on('dblclick','tr',function() {
    let alertConfrimDelete = confirm('Do you really want to delete this customer');
    if (alertConfrimDelete==true) {
        let index = $(this).index();
        recordIndex = index;
        $('.delete_btn').click();
    }
});


$("#serch-btn-cus").click(function () {
    let customerID = $('#serch-inp-cus').val();

    let indexTo = -1;

    for (let i = 0; i < customer.length; i++) {
        if (customer[i].id === customerID) {
            indexTo = i;
            break;
        }
    }

    if (indexTo !== -1) {
        // Customer found, set values of text fields
        $('#serch-cus-id').val(customer[indexTo].id);
        $('#serch-cus-name').val(customer[indexTo].name);
        $('#serch-cus-address').val(customer[indexTo].address);
        $('#serch-cus-salary').val(customer[indexTo].salary);

        $('#serch-inp-cus').val('');
    } else {
        // Customer not found, clear text fields
        $('#serch-cus-id').val('');
        $('#serch-cus-name').val('');
        $('#serch-cus-address').val('');
        $('#serch-cus-salary').val('');
        alert("Customer not found!");
    }

});



$("#btn-remove-cus").click(function () {
    let customerID = $('#serch-cus-id').val();

    let response = deleteCustomer(customerID);
    if (response) {
        alert("Customer Removed Successfully");
    } else {
        alert("Customer not found or Update Failed..!");
    }
});

function deleteCustomer(customerID){
    let indexToDelete = -1;
    for (let i = 0; i < customer.length; i++) {
        if (customer[i].id === customerID) {
            indexToDelete = i;
            break;
        }
    }

    if (indexToDelete !== -1) {
        // Remove the customer from the array
        customer.splice(indexToDelete, 1);

        // Update the table
        updateTable();
        clearFieldSearch();

        return true; // Deleted successfully
    } else {
        return false; // Customer not found or deletion failed
    }
}

function updateTable() {
    $("#cus-table tbody").empty();

    customer.forEach(function(cus) {
        let row = `<tr>
            <td>${cus.id}</td>
            <td>${cus.name}</td>
            <td>${cus.address}</td>
            <td>${cus.salary}</td>
        </tr>`;
        $('#cus-table tbody').append(row);
    });
}

$("#btn-update-cus").click(function () {
    let customerID = $('#serch-cus-id').val();
    let response = updateCustomer(customerID);
    if (response) {
        alert("Customer Updated Successfully");
    } else {
        alert("Update Failed..!");

    }
});

function updateCustomer(customerID) {
    let cus = null;
    for (let i = 0; i < customer.length; i++) {
        if (customer[i].id === customerID) {
            cus = customer[i];
            break;
        }
    }

    if (cus !== null) {

        var id = $("#serch-cus-id").val();
        var name = $("#serch-cus-name").val();
        var address = $("#serch-cus-address").val();
        var salary = $("#serch-cus-salary").val();

        const upCus ={
            uId: id,
            uName:name,
            uAddress:address,
            uSalary:salary
        }

        $.ajax({
            url: "http://localhost:8080/pos/customer",
            type: "PUT",
            contentType: "application/json",
            data: JSON.stringify(upCus),
            success: (Response) => {
                addCustomerTable();
                clearFieldSearch();
            },
            error: (res) => {
                alert('Error updating');
            }
        });

        return true;
    } else {
        return false;
    }
}

function addCustomerTable() {
    $("#cus-table tbody").empty();

    for (let cus of customer) {
        let row = `<tr>
            <td>${cus.id}</td>
            <td>${cus.name}</td>
            <td>${cus.address}</td>
            <td>${cus.salary}</td>
        </tr>`;
        $('#cus-table').append(row);
    }
}

function clearFieldSearch(){
    $("#serch-cus-id").val('');
    $("#serch-cus-name").val('');
    $("#serch-cus-address").val('');
    $("#serch-cus-salary").val('');
}

function clearField(){
    $("#add-inp-cusId").val('');
    $("#add-inp-cusName").val('');
    $("#add-inp-cusAddress").val('');
    $("#add-inp-cusSalary").val('');
}

$('#add-inp-cusId').on('keyup', function () {
    var cusid = $(this).val();
    var cusidPattern = /^C\d{3}$/;
    var errorMessage = $('.errorMessageId');

    if (!cusidPattern.test(cusid)) {
        errorMessage.show();
        $(this).css({ 'border': '2px solid red' });
    } else {
        errorMessage.hide();
        $(this).css({ 'border': '2px solid green' });
    }
});

// Validate Customer Name
$('#add-inp-cusName').on('keyup', function () {
    var cusName = $(this).val();
    var cuanamePattern = /^\s*\S.{3,18}\S\s*$/
    var errorMessage = $('.errorMessageName');

    if (!cuanamePattern.test(cusName)) {
        errorMessage.show();
        $(this).css({'border': '2px solid red'});
    } else {
        errorMessage.hide();
        $(this).css({'border': '2px solid green'});
    }
});

// Validate Customer Address
$('#add-inp-cusAddress').on('keyup', function () {
    var cusAddress = $(this).val();
    var cusAddressPattern = /^.{7,}$/;
    var errorMessage = $('.errorMessageAddress');

    if (!cusAddressPattern.test(cusAddress)) {
        errorMessage.show();
        $(this).css({ 'border': '2px solid red' });
    } else {
        errorMessage.hide();
        $(this).css({ 'border': '2px solid green' });
    }
});


$('#add-inp-cusSalary').on('keyup', function () {
    var cusSalary = $(this).val();
    var salaryPattern = /^\d+(\.\d{1,2})?$/;
    var errorMessage = $('.errorMessageSalary');

    if (!salaryPattern.test(cusSalary)) {
        errorMessage.show();
        $(this).css({ 'border': '2px solid red' });
    } else {
        errorMessage.hide();
        $(this).css({ 'border': '2px solid green'});
    }
});
