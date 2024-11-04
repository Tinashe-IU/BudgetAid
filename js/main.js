

const months = 
[
    '', // for 0-based indexing
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
];

const date = new Date();
const today = 
{
    'month': date.getMonth() + 1,
    'year': date.getFullYear(),
}

document.getElementById('monthFilter').value = today.month; // by default set monthFilter to current month


async function apiRequest(endpoint, payload, method, callback) 
{
    try
    {
        const options = { method: method };

        if (method !== 'GET') 
        {
            options.headers = { 'Content-Type': 'application/json' };
            options.body = JSON.stringify(payload);
        }

        const response = await fetch(endpoint, options);
        const error = !response.ok ? 'error' : null;
        const response_data = await response.json();

        callback(error, response_data);
    }
    catch (error) { callback(error, null) };
}


/**
 * 
 * @param {object} data
 * E.g {name: 'Thokozani', surname: 'Kubheka'}
 * 
 * document.getElementById('name').textContent = 'Thokozani'
 * 
 * document.getElementById('surname').textContent = 'Kubheka'
 */
function injectTextContent(data)
{
    for(const elementID in data)
    {
        const value = data[elementID];
        document.getElementById(elementID).textContent = value;
    }
}


function goTo(url, new_page = false)
{
    if (new_page === true) window.open(`${url}`, '_blank');
    else location.href = url;
}


function display(hide_or_show, element_id)
{
    if (hide_or_show === 'show')
    {
        document.getElementById(element_id).classList.remove('hidden');
        document.getElementById(element_id).classList.add('displayed');
    }
    else
    {
        document.getElementById(element_id).classList.add('hidden');
        document.getElementById(element_id).classList.remove('displayed');
    }
}


function css(element_id, property, value)
{
    document.getElementById(element_id).style[property] = value;
}
    

function alertMessage(type, message)
{
    const alert_container = document.getElementById('alertContainer');

    alert_container.innerHTML = `
        <div class='alert ${type} flex-left' id='alertContent'>
            <p>${message}</p>
        </div>
    `;

    removeAlertMessage((type === 'error' || type === 'warning') ? 'later' : 'automatically');
}


function removeAlertMessage(when)
{
    const alert_content = document.getElementById('alertContent');

    if (when === 'now') alert_content.remove();
    else
    {
        if (alert_content)
        {
            setTimeout(() =>
            { 
                alert_content.remove() 
            },
            (when === 'automatically') ? 4000 : 7000);
        }
    }
}


function toggleTheme() 
{
    const current_theme = localStorage.getItem('theme');

    if (current_theme === 'light-mode') 
    {
        document.body.classList.remove('light-mode');
        localStorage.setItem('theme', 'dark-mode');
    } 
    else 
    {
        document.body.classList.add('light-mode');
        localStorage.setItem('theme', 'light-mode');
    }
}


function applySavedTheme() 
{
    const saved_theme = localStorage.getItem('theme');
    if (saved_theme === 'light-mode') document.body.classList.add('light-mode');
}
applySavedTheme();
