

var incomes = [];
var budgets = [];
var expenses = [];


async function getBudgets()
{
    const endpoint = 'api/budget.php';

    await apiRequest(endpoint, null, 'GET', function(error, response)
    {
        budgets = error ? 'error' : response.data;
    });
}


async function getIncomes()
{
    const endpoint = `api/income.php?get=all`;

    await apiRequest(endpoint, null, 'GET', function(error, response)
    {
        incomes = error ? 'error' : response.data;
    });
}


async function getExpenses()
{
    const endpoint = 'api/expenses.php?get=all';

    await apiRequest(endpoint, null, 'GET', function(error, response)
    {
        expenses = error ? 'error' : response.data;
    });
}


var date_filter = extractFormData([ 'monthFilter', 'yearFilter' ]);


function dateFilter(filter)
{
    date_filter = extractFormData([ 'monthFilter', 'yearFilter' ]);

    calculateMonthTotals(date_filter.monthFilter, date_filter.yearFilter);

    if (filter === 'year') showYearBudget(date_filter.yearFilter);
}


async function main(month, year)
{
    await getBudgets();
    await getIncomes();
    await getExpenses();

    showYearBudget(year);
    calculateMonthTotals(month, year);
}
main(date_filter.monthFilter, date_filter.yearFilter);


function showYearBudget(year)
{
    const year_budget_container = document.getElementById('yearBudget');
    year_budget_container.innerHTML = '';

    var chart_data = [];

    const year_budgets = budgets.filter(budget => parseInt(budget.year) === parseInt(year));

    year_budgets.forEach(budget =>
    {
        var month_total_expenses = 0;
        const month_expenses = expenses.filter(expense => parseInt(expense.month) === parseInt(budget.month) && parseInt(expense.year) === parseInt(budget.year));
        month_expenses.forEach(month_expense => month_total_expenses += parseFloat(month_expense.amount));

        var month_total_income = 0;
        const month_incomes = incomes.filter(income => parseInt(income.month) === parseInt(budget.month) && parseInt(income.year) === parseInt(budget.year));
        month_incomes.forEach(month_income => month_total_income += parseFloat(month_income.amount));

        var budget_met = parseInt(budget.amount) > (month_total_income - month_total_expenses) ? false : true;

        year_budget_container.innerHTML += `
            <div class="amount-box month-total flex-left ${ budget_met ? 'met' : 'not-met' }">
                <div class="details">
                    <h1>${ months[budget.month] }</h1>
                    <p>Budget ${ budget_met ? 'met' : 'not met' }</p>
                </div>
                <div class="price income">
                    <p>Income</p>
                    <h1>+R${ month_total_income.toLocaleString() }</h1>
                </div>
                <div class="price expense">
                    <p>Expenses</p>
                    <h1>-R${ month_total_expenses.toLocaleString() }</h1>
                </div>
                <div class="price budget">
                    <p>Budget</p>
                    <h1>R${ budget.amount.toLocaleString() }</h1>
                </div>
                <div class="actions flex-right">
                    <button class="round flex-center" onclick="editBudget(${ budget.budget_id }, ${ budget.amount }, ${ budget.month }, ${ budget.year })" title="Adjust budget">
                        <svg xmlns="http://www.w3.org/2000/svg" x-bind:width="size" x-bind:height="size" viewBox="0 0 24 24" fill="none" stroke="currentColor" x-bind:stroke-width="stroke" stroke-linecap="round" stroke-linejoin="round" width="22" height="22" stroke-width="2">
                            <path d="M4 20h4l10.5 -10.5a2.828 2.828 0 1 0 -4 -4l-10.5 10.5v4"></path>
                            <path d="M13.5 6.5l4 4"></path>
                        </svg>
                    </button>
                </div>
            </div>
        `;

        const new_chart_data = 
        {
            'month': months[budget.month].substring(0, 3),
            'income': month_total_income,
            'expenses': month_total_expenses,
        };
        chart_data.push(new_chart_data);
    });

    showChart(chart_data);
}


var budget_chart;


function showChart(chart_data)
{
    const labels = chart_data.map(data => data.month);
    const income_data = chart_data.map(data => data.income);
    const expenses_data = chart_data.map(data => data.expenses);

    const ctx = document.getElementById('budgetChart').getContext('2d');

    if (budget_chart) budget_chart.destroy();

    budget_chart = new Chart(ctx, 
    {
        type: 'line',
        data: 
        {
            labels: labels,
            datasets: 
            [
                {
                    label: 'Income',
                    data: income_data,
                    borderColor: '#088c05',
                    tension: 0.4
                },
                {
                    label: 'Expenses',
                    data: expenses_data,
                    borderColor: '#dc0000',
                    tension: 0.4
                }
            ]
        },
        options: 
        {
            responsive: true,
        }
    });
}


function calculateMonthTotals(month, year)
{
    injectTextContent({ 'monthTitle': months[month] });

    var month_total_expenses = 0;
    const month_expenses = expenses.filter(expense => parseInt(expense.month) === parseInt(month) && parseInt(expense.year) === parseInt(year));
    month_expenses.forEach(month_expense => month_total_expenses += parseFloat(month_expense.amount));

    var month_total_income = 0;
    const month_incomes = incomes.filter(income => parseInt(income.month) === parseInt(month) && parseInt(income.year) === parseInt(year));
    month_incomes.forEach(month_income => month_total_income += parseFloat(month_income.amount));

    const chart_data = 
    {
        'month': months[month],
        'total_income': month_total_income,
        'total_expenses': month_total_expenses,
        'remaining_balance': month_total_income - month_total_expenses,
    };
    showTotalsChart(chart_data);
}


var totals_chart;


function showTotalsChart(chart_data)
{

    const ctx = document.getElementById('totalsChart').getContext('2d');

    if (totals_chart) totals_chart.destroy();

    totals_chart = new Chart(ctx, 
    {
        type: 'doughnut',
        data: 
        {
            labels: 
            [
                'Total income',
                'Total spent',
                'Left to save',
            ],
            datasets:
            [
                {
                    data: 
                    [
                        chart_data.total_income || 0,
                        chart_data.total_expenses || 0,
                        chart_data.remaining_balance || 0,
                    ],
                    backgroundColor: [
                        'rgba(75, 192, 122, 0.5)', // Total Income - greenish
                        'rgba(255, 99, 132, 0.5)', // Total Spent - redish
                        'rgba(54, 162, 235, 0.5)',  //Left to Save - blueish
                    ],
                    borderColor: [
                        'rgba(75, 192, 122, 1)',
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                    ],
                    borderWidth: 1
                }
            ]
        },
        options: 
        {
            responsive: true,
            plugins: 
            {
                legend: 
                {
                    display: true,
                    position: 'top'
                },
                tooltip: 
                {
                    callbacks: 
                    {
                        label: function(tooltipItem) 
                        {
                            return tooltipItem.label + ': R' + tooltipItem.raw.toLocaleString();
                        }
                    }
                }
            }
        }
    });

}



function submitBudget()
{
    const form_inputs = 
    [
        'amount',
        'month',
        'year',
    ];
    const submit = validateInputs(form_inputs);

    if (submit)
    {
        form_inputs.push('editBudgetID');
        const form_values = extractFormData(form_inputs);

        if (form_values.editBudgetID == 0) addBudget(form_values);
        else updateBudget(form_values);
    }
}


function addBudget(form_values)
{
    const endpoint = 'api/budget.php';
    const payload = 
    { 
        'amount': form_values.amount,
        'month': form_values.month,
        'year': form_values.year,
    };

    apiRequest(endpoint, payload, 'POST', function(error, response)
    {
        display('hide', 'addBudgetModal');

        if(error) alertMessage('error', 'An error occurred');
        else
        {
            if (response.message === 'success') 
            {
                alertMessage('success', 'Budget added');
                main(form_values.month, form_values.year);
            }
            else if (response.message === 'duplicate') 
            {
                alertMessage('warning', 'Budget already added for that month');
                display('show', 'addBudgetModal');
            }
            else alertMessage('error', 'Something went wrong');
        }
    });
}


function updateBudget(form_values)
{
    const endpoint = 'api/budget.php';
    const payload =
    {
        'amount': form_values.amount,
        'month': form_values.month,
        'year': form_values.year,
        'budget_id': form_values.editBudgetID,
    };

    apiRequest(endpoint, payload, 'PUT', function(error, response)
    {
        display('hide', 'addBudgetModal');

        if(error) alertMessage('error', 'An error occurred');
        else
        {
            if (response.message === 'success') 
            {
                alertMessage('success', 'Budget updated');
                main(form_values.month, form_values.year);
            }
            else alertMessage('error', 'Something went wrong');
        }
    });
}


function editBudget(budget_id, amount, month, year)
{
    const input_values =
    {
        'editBudgetID': budget_id,
        'amount': amount,
        'month': month,
        'year': year,
    };

    fillInputValues(input_values);

    display('show', 'addBudgetModal');
}