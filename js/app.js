

async function loadPage(page_name) 
{
    await fetch(`${page_name}.php`)
    .then(response => 
    {
        if (!response.ok) 
        {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.text();
    })
    .then(data => 
    {
        markActiveTab(page_name);

        history.pushState(null, '', `#${page_name}`);
        document.title = `BudgetAid - ${page_name.charAt(0).toUpperCase() + page_name.slice(1)}`;

        document.getElementById("app").innerHTML = data;

        loadPageSpecificAssets(page_name);
    })
    .catch(error => console.error('There was a problem with the fetch operation:', error));
}


// Load page-specific CSS and JS
function loadPageSpecificAssets(page_name)
{
    // Remove previously added page-specific assets to avoid conflicts
    removePageSpecificAssets();

    // Load CSS
    const cssLink = document.createElement("link");
    cssLink.rel = "stylesheet";
    cssLink.href = `css/${page_name}.css`;
    cssLink.classList.add("page-specific");
    document.head.appendChild(cssLink);

    // Load JS
    const script = document.createElement("script");
    script.src = `js/${page_name}.js`;
    script.classList.add("page-specific");
    document.body.appendChild(script);
}


// Function to remove previously loaded page-specific assets
function removePageSpecificAssets() 
{
    document.querySelectorAll(".page-specific").forEach(el => el.remove());
}


// Handle browser back/forward button events
window.onpopstate = function () 
{
    const page_name = location.pathname.replace('#', '');
    loadPage(page_name);
};


document.querySelectorAll('.nav').forEach(tab =>
{
    tab.addEventListener('click', () => 
    {
        const page = tab.getAttribute('data-page');
        loadPage(page);
    });
});


function markActiveTab(page_name) 
{
    document.querySelectorAll('.nav').forEach(nav => nav.classList.remove('active'));

    const activeTab = document.querySelector(`.nav[data-page="${page_name}"]`);
    activeTab.classList.add('active');
}


const initial_page = location.hash.replace('#', '') || 'income';
loadPage(initial_page);