

var total_income = 0;
var expenses = [];


async function getTotalIncome(month, year)
{
    const endpoint = `api/income.php?get=total&month=${ month }&year=${ year }`;

    await apiRequest(endpoint, null, 'GET', function(error, response)
    {
        total_income = response.data.total_income || 0;
    });
}


async function totals(month, year)
{
    await getTotalIncome(month, year);
    calculateTotalExpenses(month, year);
}


async function getExpenses(month, year)
{
    const endpoint = 'api/expenses.php?get=all';

    await apiRequest(endpoint, null, 'GET', function(error, response)
    {
        if(error) expenses = 'error';
        else
        {
            expenses = response.data;
            showExpenses(month, year);
        }
    });
}


var date_filter = extractFormData([ 'monthFilter', 'yearFilter' ]);


function dateFilter(filter = null)
{
    date_filter = extractFormData([ 'monthFilter', 'yearFilter' ]);
    showExpenses(date_filter.monthFilter, date_filter.yearFilter);
    if (filter === 'year') totals(date_filter.yearFilter);
}


async function main(month, year)
{
    await getExpenses(month, year);
    calculateMonthlyExpensesTotal(year);
}
main(date_filter.monthFilter, date_filter.yearFilter);


function showExpenses(month, year)
{
    totals(month, year);

    const expenses_container = document.getElementById('expenses');
    expenses_container.innerHTML = '';

    if (expenses === 'error')
    {
        expenses_container.innerHTML = `<p class="no-data">An error occurred!</p>`;
        return;
    }

    const filtered_expenses = expenses.filter(expense => parseInt(expense.month) === parseInt(month) && parseInt(expense.year) === parseInt(year));

    if (expenses.length === 0 || filtered_expenses.length === 0)
    {
        expenses_container.innerHTML = `<p class="no-data">No expenses for ${ months[month] } ${ year }.</p>`;
        return;
    }

    var counter = 1;

    filtered_expenses.forEach(expense =>
    {
        expenses_container.innerHTML += `
            <div class="amount-box flex-left">
                <div class="count">
                    <h1>${ counter.toString().padStart(2, '0') }</h1>
                </div>
                <div class="details">
                    <h1>${ expense.expense }</h1>
                    <p>${ months[expense.month] } ${ expense.year }</p>
                </div>
                <div class="price">
                    <h1>-R${ expense.amount.toLocaleString() }</h1>
                </div>
                <div class="actions flex-right">
                    <button class="round flex-center edit" onclick="editExpense(${ expense.expense_id })">
                        <svg xmlns="http://www.w3.org/2000/svg" x-bind:width="size" x-bind:height="size" viewBox="0 0 24 24" fill="none" stroke="currentColor" x-bind:stroke-width="stroke" stroke-linecap="round" stroke-linejoin="round" width="22" height="22" stroke-width="2">
                            <path d="M4 20h4l10.5 -10.5a2.828 2.828 0 1 0 -4 -4l-10.5 10.5v4"></path>
                            <path d="M13.5 6.5l4 4"></path>
                        </svg>
                    </button>
                    <button class="round flex-center delete" onclick="confirmDeleteExpense(${ expense.expense_id })">
                        <svg xmlns="http://www.w3.org/2000/svg" x-bind:width="size" x-bind:height="size" viewBox="0 0 24 24" fill="none" stroke="currentColor" x-bind:stroke-width="stroke" stroke-linecap="round" stroke-linejoin="round" width="22" height="22" stroke-width="2">
                            <path d="M4 7l16 0"></path>
                            <path d="M10 11l0 6"></path>
                            <path d="M14 11l0 6"></path>
                            <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12"></path>
                            <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3"></path>
                        </svg>
                    </button>
                </div>
            </div>
        `;

        counter++;
    });
}


function calculateMonthlyExpensesTotal(year)
{
    const expenses_months = [];
    const year_expenses = expenses.filter(expense => parseInt(expense.year) === parseInt(year));

    year_expenses.forEach(expense =>
    {
        const expense_month = expense.month;
        if (expenses_months.includes(expense_month) === false) expenses_months.push(expense_month);
    });
    
    const year_expenses_container = document.getElementById('yearExpenses');
    year_expenses_container.innerHTML = '';

    var counter = 1;
    var prev_month_total_expenses = 0;

    expenses_months.forEach(month =>
    {
        var month_total_expenses = 0;

        const month_expenses = year_expenses.filter(expense => parseInt(expense.month) === parseInt(month));
        month_expenses.forEach(month_expense => month_total_expenses += parseFloat(month_expense.amount));

        var level_class = 'increase';
        var level_icon = `
            <svg xmlns="http://www.w3.org/2000/svg" x-bind:width="size" x-bind:height="size" viewBox="0 0 24 24" fill="none" stroke="currentColor" x-bind:stroke-width="stroke" stroke-linecap="round" stroke-linejoin="round" width="24" height="24" stroke-width="2">
            <path d="M17 7l-10 10"></path>
            <path d="M8 7l9 0l0 9"></path>
            </svg>
        `;
        if (month_total_expenses < prev_month_total_expenses)
        {
            level_class = 'decrease';
            level_icon = `
                <svg xmlns="http://www.w3.org/2000/svg" x-bind:width="size" x-bind:height="size" viewBox="0 0 24 24" fill="none" stroke="currentColor" x-bind:stroke-width="stroke" stroke-linecap="round" stroke-linejoin="round" width="24" height="24" stroke-width="2">
                    <path d="M7 7l10 10"></path>
                    <path d="M17 8l0 9l-9 0"></path>
                </svg>
            `;
        }
        if (month_total_expenses === prev_month_total_expenses)
        {
            level_class = 'straight';
            level_icon = `
                <svg xmlns="http://www.w3.org/2000/svg" x-bind:width="size" x-bind:height="size" viewBox="0 0 24 24" fill="none" stroke="currentColor" x-bind:stroke-width="stroke" stroke-linecap="round" stroke-linejoin="round" width="24" height="24" stroke-width="2">
                    <path d="M5 12l14 0"></path>
                    <path d="M15 16l4 -4"></path>
                    <path d="M15 8l4 4"></path>
                </svg>
            `;
        }

        year_expenses_container.innerHTML += `
            <div class="amount-box month-total flex-left" onclick="main(${ month }, ${ year })">
                <div class="count">
                    <h1>${ counter.toString().padStart(2, '0') }</h1>
                </div>
                <div class="details">
                    <h1>${ months[month] }</h1>
                    <p>Total expenses: ${ month_expenses.length }</p>
                </div>
                <div class="price">
                    <h1>-R${ month_total_expenses.toLocaleString() }</h1>
                </div>
                <div class="level flex-right ${ level_class }">
                    ${ level_icon }
                </div>
            </div>
        `;

        counter++;
        prev_month_total_expenses = month_total_expenses;
    });
}


function submitExpense()
{
    const form_inputs =
    [
        'expense',
        'amount',
        'month',
        'year',
    ];

    const submit = validateInputs(form_inputs);

    if (submit)
    {
        const form_values = extractFormData(form_inputs);
        const edit_expenseID = document.getElementById('editExpenseID').value;

        if (edit_expenseID == 0) addExpense(form_values, edit_expenseID);
        else updateExpense(form_values);
    }
}


function addExpense(form_values)
{
    const endpoint = 'api/expenses.php';
    const payload =
    {
        'expense': form_values.expense,
        'amount': form_values.amount,
        'month': form_values.month,
        'year': form_values.year,
    };

    apiRequest(endpoint, payload, 'POST', function(error, response)
    {
        display('hide', 'addExpenseModal');

        if(error) alertMessage('error', 'An error occurred');
        else
        {
            if (response.message === 'success') 
            {
                alertMessage('success', 'Expense added');
                main(form_values.month, form_values.year);
            }
            else alertMessage('error', 'Something went wrong');
        }
    });
}


function updateExpense(form_values)
{
    const endpoint = 'api/expenses.php';
    const payload =
    {
        'expense': form_values.expense,
        'amount': form_values.amount,
        'month': form_values.month,
        'year': form_values.year,
        'expense_id': document.getElementById('editExpenseID').value,
    };

    apiRequest(endpoint, payload, 'PUT', function(error, response)
    {
        display('hide', 'addExpenseModal');

        if(error) alertMessage('error', 'An error occurred');
        else
        {
            if (response.message === 'success') 
            {
                alertMessage('success', 'Expense updated');
                main(form_values.month, form_values.year);
            }
            else alertMessage('error', 'Something went wrong');
        }
    });
}


function editExpense(expense_id)
{
    const expense = expenses.find(expense => parseInt(expense.expense_id) === parseInt(expense_id));

    const input_values =
    {
        'editExpenseID': expense_id,
        'expense': expense.expense,
        'amount': expense.amount,
        'month': expense.month,
        'year': expense.year,
    };
    fillInputValues(input_values);

    display('show', 'addExpenseModal');
}


function confirmDeleteExpense(expense_id)
{
    document.getElementById('deleteExpenseID').value = expense_id;
    display('show', 'confirmDeleteExpenseModal');
}


function deleteExpense()
{
    const expense_id = document.getElementById('deleteExpenseID').value;

    const expense = expenses.find(expense => parseInt(expense.expense_id) === parseInt(expense_id));

    const endpoint = 'api/expenses.php';
    const payload = { 'expense_id': expense_id };

    apiRequest(endpoint, payload, 'DELETE', function(error, response)
    {
        display('hide', 'confirmDeleteExpenseModal');

        if(error) alertMessage('error', 'An error occurred');
        else
        {
            if (response.message === 'success') 
            {
                alertMessage('success', 'Expense deleted');
                main(expense.month, expense.year);
            }
            else alertMessage('error', 'Something went wrong');
        }
    });
}


function calculateTotalExpenses(month, year)
{
    var total_expenses = 0;

    const month_expenses = expenses.filter(expense => parseInt(expense.month) === parseInt(month) && parseInt(expense.year) === parseInt(year));
    month_expenses.forEach(expense => total_expenses += parseInt(expense.amount));

    const output =
    {
        'monthTitle': months[month],
        'totalExpenses': total_expenses.toLocaleString(),
    };
    injectTextContent(output);
}


function clearExpenseForm()
{    
    const input_values =
    {
        'expense': '',
        'amount': '',
        'month': date_filter.monthFilter, // pre-fill month as the current selected month
        'editExpenseID': 0,
    };
    fillInputValues(input_values);

    document.getElementById('expenseBox').classList.remove('label-up');
    document.getElementById('amountBox').classList.remove('label-up');
}


function showExpenseModal()
{
    clearExpenseForm();
    display('show', 'addExpenseModal');
}
