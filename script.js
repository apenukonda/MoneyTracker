let expenses = [];
let totalAmount = 0;

const categoryInput = document.getElementById('category-input');
const amountInput = document.getElementById('amount-input');
const dateInput = document.getElementById('date-input');
const addBtn = document.getElementById('add-btn');
const expenseTableBody = document.getElementById('expense-table-body');
const totalAmountCell = document.getElementById('total-amount');
const ctx = document.getElementById('expenses-pie-chart').getContext('2d');

// Initialize the pie chart
const pieChart = new Chart(ctx, {
    type: 'pie',
    data: {
        labels: [], 
        datasets: [{
            data: [], 
            backgroundColor: [], 
        }]
    },
    options: {
        responsive: false,
        plugins: {
            legend: {
                position: 'top',
            },
            tooltip: {
                callbacks: {
                    label: function(tooltipItem) {
                        return tooltipItem.label + ': Rs.' + tooltipItem.raw.toFixed(2);
                    }
                }
            }
        }
    }
});

function updatePieChart() {

    const categories = {};
    expenses.forEach(expense => {
        if (!categories[expense.category]) {
            categories[expense.category] = 0;
        }
        categories[expense.category] += expense.amount;
    });

    const chartLabels = Object.keys(categories);
    const chartData = Object.values(categories);
    const chartColors = chartLabels.map(() => `hsl(${Math.random() * 360}, 70%, 50%)`); 

    pieChart.data.labels = chartLabels;
    pieChart.data.datasets[0].data = chartData;
    pieChart.data.datasets[0].backgroundColor = chartColors;

    pieChart.update();
}

addBtn.addEventListener('click', function () {
    const category = categoryInput.value.trim();
    const amount = Number(amountInput.value);
    const date = dateInput.value;

    if (category === '') {
        alert('Please enter a category');
        return;
    }
    if (isNaN(amount) || amount <= 0) {
        alert('Please enter a valid amount');
        return;
    }
    if (date === '') {
        alert('Please select a date');
        return;
    }

    const expense = { category, amount, date };
    expenses.push(expense);
    totalAmount += amount;
    totalAmountCell.textContent = totalAmount;

    const newRow = expenseTableBody.insertRow();
    const categoryCell = newRow.insertCell();
    const amountCell = newRow.insertCell();
    const dateCell = newRow.insertCell();
    const deleteCell = newRow.insertCell();

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = 'Delete';
    deleteBtn.classList.add('delete-btn');
    deleteBtn.addEventListener('click', function () {
        expenses.splice(expenses.indexOf(expense), 1);
        totalAmount -= expense.amount;
        totalAmountCell.textContent = totalAmount;
        expenseTableBody.removeChild(newRow);

        updatePieChart();
    });

    categoryCell.textContent = expense.category;
    amountCell.textContent = expense.amount;
    dateCell.textContent = expense.date;
    deleteCell.appendChild(deleteBtn);

    updatePieChart();
});
