

var income_sources = [];


async function getIncomeSources(month, year)
{
    const endpoint = 'api/income.php?get=all';

    await apiRequest(endpoint, null, 'GET', function(error, response)
    {
        if(error) income_sources = 'error';
        else
        {
            income_sources = response.data;
            showIncomeSources(month, year);
        }
    });
}


var date_filter = extractFormData([ 'monthFilter', 'yearFilter' ]);


function dateFilter(filter = null)
{
    date_filter = extractFormData([ 'monthFilter', 'yearFilter' ]);
    showIncomeSources(date_filter.monthFilter, date_filter.yearFilter);
    if (filter === 'year') calculateMonthlyIncomeTotal(date_filter.yearFilter);
}


async function main(month, year)
{
    await getIncomeSources(month, year);
    calculateMonthlyIncomeTotal(year);
}
main(date_filter.monthFilter, date_filter.yearFilter);


function showIncomeSources(month, year)
{
    calculateTotalIncome(month, year);

    const income_sources_container = document.getElementById('incomeSources');

    if (income_sources === 'error')
    {
        income_sources_container.innerHTML = '<p class="no-data">An error occurred!</p>';
        return;
    }

    const filtered_income_sources = income_sources.filter(income_source => parseInt(income_source.month) === parseInt(month) && parseInt(income_source.year) === parseInt(year));

    if (income_sources.length === 0 || filtered_income_sources.length === 0)
    {
        income_sources_container.innerHTML = `<p class="no-data">No income sources added for ${ months[month] } ${ year }.</p>`;
        return;
    }

    var counter = 1;

    income_sources_container.innerHTML = '';

    filtered_income_sources.forEach(income_source =>
    {
        income_sources_container.innerHTML += `
            <div class="amount-box flex-left">
                <div class="count">
                    <h1>${ counter.toString().padStart(2, '0') }</h1>
                </div>
                <div class="details">
                    <h1>${ income_source.source }</h1>
                    <p>${ months[income_source.month] } ${ income_source.year }</p>
                </div>
                <div class="price">
                    <h1>+R${ income_source.amount.toLocaleString() }</h1>
                </div>
                <div class="actions flex-right">
                    <button class="round flex-center edit" onclick="editIncomeSource(${ income_source.source_id })">
                        <svg xmlns="http://www.w3.org/2000/svg" x-bind:width="size" x-bind:height="size" viewBox="0 0 24 24" fill="none" stroke="currentColor" x-bind:stroke-width="stroke" stroke-linecap="round" stroke-linejoin="round" width="22" height="22" stroke-width="2">
                            <path d="M4 20h4l10.5 -10.5a2.828 2.828 0 1 0 -4 -4l-10.5 10.5v4"></path>
                            <path d="M13.5 6.5l4 4"></path>
                        </svg>
                    </button>
                    <button class="round flex-center delete" onclick="confirmDeleteIncomeSource(${ income_source.source_id })">
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


function calculateTotalIncome(month, year)
{
    const filtered_income_sources = income_sources.filter(income_source => parseInt(income_source.month) === parseInt(month) && parseInt(income_source.year) === parseInt(year));

    var total_income = 0;

    if (filtered_income_sources.length !== 0)
    {
        filtered_income_sources.forEach(income_source => total_income += parseInt(income_source.amount));
    }

    const output =
    {
        'monthTitle': months[month],
        'totalIncome': total_income.toLocaleString(),
    };
    injectTextContent(output);
}


function calculateMonthlyIncomeTotal(year)
{
    const income_months = [];
    const year_income_sources = income_sources.filter(income_source => parseInt(income_source.year) === parseInt(year));
    
    year_income_sources.forEach(income_source =>
    {
        const income_month = income_source.month;
        if (income_months.includes(income_month) === false) income_months.push(income_month);
    });
    
    const year_income_container = document.getElementById('yearIncome');
    year_income_container.innerHTML = '';

    var chart_data = [];
    var counter = 1;
    var prev_month_income = 0;

    income_months.forEach(month =>
    {
        var month_total_income = 0;

        const month_income_sources = year_income_sources.filter(income_source => parseInt(income_source.month) === parseInt(month));
        month_income_sources.forEach(month_income_source => month_total_income += parseFloat(month_income_source.amount));

        var level_class = 'increase';
        var level_icon = `
            <svg xmlns="http://www.w3.org/2000/svg" x-bind:width="size" x-bind:height="size" viewBox="0 0 24 24" fill="none" stroke="currentColor" x-bind:stroke-width="stroke" stroke-linecap="round" stroke-linejoin="round" width="24" height="24" stroke-width="2">
            <path d="M17 7l-10 10"></path>
            <path d="M8 7l9 0l0 9"></path>
            </svg>
        `;
        if (month_total_income < prev_month_income)
        {
            level_class = 'decrease';
            level_icon = `
                <svg xmlns="http://www.w3.org/2000/svg" x-bind:width="size" x-bind:height="size" viewBox="0 0 24 24" fill="none" stroke="currentColor" x-bind:stroke-width="stroke" stroke-linecap="round" stroke-linejoin="round" width="24" height="24" stroke-width="2">
                    <path d="M7 7l10 10"></path>
                    <path d="M17 8l0 9l-9 0"></path>
                </svg>
            `;
        }
        if (month_total_income === prev_month_income)
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

        year_income_container.innerHTML += `
            <div class="amount-box month-total flex-left" onclick="showIncomeSources(${ month }, ${ year })">
                <div class="count">
                    <h1>${ counter.toString().padStart(2, '0') }</h1>
                </div>
                <div class="details">
                    <h1>${ months[month] }</h1>
                    <p>Income sources: ${ month_income_sources.length }</p>
                </div>
                <div class="price">
                    <h1>+R${ month_total_income.toLocaleString() }</h1>
                </div>
                <div class="level flex-right ${ level_class }">
                    ${ level_icon }
                </div>
            </div>
        `;

        counter++;
        prev_month_income = month_total_income;

        const new_chart_data = 
        {
            'month': month,
            'total_income': month_total_income,
        };
        chart_data.push(new_chart_data);
    });

    showChart(chart_data);
}


var chart_instance;


function showChart(chart_data)
{
    const ctx = document.getElementById('incomeChart').getContext('2d');

    if (chart_instance) chart_instance.destroy();

    const labels = chart_data.map(item => `${ months[item.month].substring(0, 3) }`);

    chart_instance = new Chart(ctx,
    {
        type: 'line',
        data:
        {
            labels: labels,
            datasets: 
            [
                {
                    label: 'Total income (p/m)',
                    data: chart_data.map(item => item.total_income),
                    borderColor: '#088c05',
                    borderWidth: 2,
                    tension: 0.4,
                }
            ]
        },
        options: 
        {
            responsive: true,
            scales: 
            {
                y: { beginAtZero: true }
            }
        }
    });
}


function submitIncomeSource()
{
    const form_inputs =
    [
        'source',
        'amount',
        'month',
        'year',
    ];

    const submit = validateInputs(form_inputs);

    if (submit)
    {
        const form_values = extractFormData(form_inputs);
        const edit_sourceID = document.getElementById('editSourceID').value;

        if (edit_sourceID === '0') addIncomeSource(form_values, edit_sourceID);
        else updateIncomeSource(form_values);
    }
}


function addIncomeSource(form_values)
{
    const endpoint = 'api/income.php';
    const payload =
    {
        'source': form_values.source,
        'amount': form_values.amount,
        'month': form_values.month,
        'year': form_values.year,
    };

    apiRequest(endpoint, payload, 'POST', function(error, response)
    {
        display('hide', 'addIncomeSourceModal');

        if(error) alertMessage('error', 'An error occurred');
        else
        {
            if (response.message === 'success') 
            {
                alertMessage('success', 'Income source added');
                main(form_values.month, form_values.year);
            }
            else alertMessage('error', 'Something went wrong');
        }
    });
}


function updateIncomeSource(form_values)
{
    const endpoint = 'api/income.php';
    const payload =
    {
        'source': form_values.source,
        'amount': form_values.amount,
        'month': form_values.month,
        'year': form_values.year,
        'source_id': document.getElementById('editSourceID').value,
    };

    apiRequest(endpoint, payload, 'PUT', function(error, response)
    {
        display('hide', 'addIncomeSourceModal');

        if(error) alertMessage('error', 'An error occurred');
        else
        {
            if (response.message === 'success') 
            {
                alertMessage('success', 'Income source updated');
                main(form_values.month, form_values.year);
            }
            else alertMessage('error', 'Something went wrong');
        }
    });
}


function editIncomeSource(source_id)
{
    const income_source = income_sources.find(income_source => parseInt(income_source.source_id) === parseInt(source_id));

    const input_values =
    {
        'editSourceID': source_id,
        'source': income_source.source,
        'amount': income_source.amount,
        'month': income_source.month,
        'year': income_source.year,
    };
    fillInputValues(input_values);

    display('show', 'addIncomeSourceModal');
}


function confirmDeleteIncomeSource(source_id)
{
    document.getElementById('deleteSourceID').value = source_id;
    display('show', 'confirmDeleteIncomeSourceModal');
}


function deleteIncomeSource()
{
    const source_id = document.getElementById('deleteSourceID').value;

    const income_source = income_sources.find(income_source => parseInt(income_source.source_id) === parseInt(source_id));
    
    const endpoint = 'api/income.php';
    const payload = { 'source_id': source_id };

    apiRequest(endpoint, payload, 'DELETE', function(error, response)
    {
        display('hide', 'confirmDeleteIncomeSourceModal');

        if(error) alertMessage('error', 'An error occurred');
        else
        {
            if (response.message === 'success') 
            {
                alertMessage('success', 'Income source deleted');
                main(income_source.month, income_source.year);
            }
            else alertMessage('error', 'Something went wrong');
        }
    });
}


function clearIncomeSourceForm()
{
    const input_values =
    {
        'source': '',
        'amount': '',
        'month': date_filter.monthFilter,
        'editSourceID': 0,
    };
    fillInputValues(input_values);

    document.getElementById('sourceBox').classList.remove('label-up');
    document.getElementById('amountBox').classList.remove('label-up');
}


function showIncomeSourceModal()
{
    clearIncomeSourceForm();
    display('show', 'addIncomeSourceModal');
}

