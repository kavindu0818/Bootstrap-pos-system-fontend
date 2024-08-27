import CustomerModel from "../model/customerModel.js";
import {customer, item, orderDetails} from "../db/db.js";
var recordIndex;


function openmenu() {
    const navDiv = document.getElementById('navDiv');
    if (navDiv) {
        navDiv.style.display = "block";
        // navDiv.style.height = "";
    }
}
$(document).ready(function() {
    // Function to display the customer counts in the h3 tag
    function displayCustomerCounts() {
        const customerCountDisplay = $('#customer-count');
        customerCountDisplay.text(` ${customer.length}`);
    }

    // Call the function to display the counts when the document is ready
    displayCustomerCounts();
});

$(document).ready(function() {

    function displayOrderCounts() {
        const customerCountDisplay = $('#order-count');
        customerCountDisplay.text(` ${orderDetails.length}`);
    }
    displayOrderCounts();
});

$(document).ready(function() {

    function displayItemCounts() {
        const customerCountDisplay = $('#item-count');
        customerCountDisplay.text(` ${item.length}`);
    }
    displayItemCounts();
});


$("#customer").hide();
$("#item").hide();
$("#orders").hide();

$("#customer-btn").on('click', () => {
    $("#customer").show();
    $("#home").hide();
    $("#item").hide();
    $("#orders").hide();
});

$("#home-btn").on('click', () => {
    $("#customer").hide();
    $("#home").show();
    $("#item").hide();
    $("#orders").hide();
});

$("#item-btn").on('click', () => {
    $("#item").show();
    $("#home").hide();
    $("#customer").hide();
    $("#orders").hide();
});

$("#Order-btn").on('click', () => {
    $("#orders").show();
    $("#home").hide();
    $("#customer").hide();
    $("#item").hide();
});


// ===============Calender==============================
document.addEventListener('DOMContentLoaded', () => {
    const daysContainer = document.getElementById('days');
    const monthYearDisplay = document.getElementById('month-year');
    const prevButton = document.getElementById('prev');
    const nextButton = document.getElementById('next');

    let currentDate = new Date();

    function renderCalendar(date) {
        daysContainer.innerHTML = '';
        const month = date.getMonth();
        const year = date.getFullYear();

        const firstDayOfMonth = new Date(year, month, 1).getDay();
        const lastDateOfMonth = new Date(year, month + 1, 0).getDate();
        const lastDayOfPrevMonth = new Date(year, month, 0).getDate();

        monthYearDisplay.textContent = `${date.toLocaleString('default', { month: 'long' })} ${year}`;

        for (let i = firstDayOfMonth; i > 0; i--) {
            const day = document.createElement('div');
            day.classList.add('prev-date');
            day.textContent = lastDayOfPrevMonth - i + 1;
            daysContainer.appendChild(day);
        }

        for (let i = 1; i <= lastDateOfMonth; i++) {
            const day = document.createElement('div');
            if (i === date.getDate() && month === new Date().getMonth() && year === new Date().getFullYear()) {
                day.classList.add('today');
            }
            day.textContent = i;
            daysContainer.appendChild(day);
        }

        const nextDays = 42 - daysContainer.children.length;

        for (let i = 1; i <= nextDays; i++) {
            const day = document.createElement('div');
            day.classList.add('next-date');
            day.textContent = i;
            daysContainer.appendChild(day);
        }
    }

    prevButton.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar(currentDate);
    });

    nextButton.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar(currentDate);
    });

    renderCalendar(currentDate);
});

$(function () {
    $('[data-toggle="tooltip"]').tooltip();
});

function updateTime() {
    const timeDisplay = document.getElementById('time-display');
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    timeDisplay.textContent = `${hours}:${minutes}:${seconds}`;
}

setInterval(updateTime, 1000);
updateTime();  // Initial call to display time immediately


