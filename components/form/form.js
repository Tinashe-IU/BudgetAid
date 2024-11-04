
/**
 * 
 * @param {string[]} input_ids 
 * 
 * E.g. input_ids = [ 'name', 'surname' ]
 * 
 * if (document.getElementById('name').value === '')
 * {
 *  return false;
 * }
 * 
 * @returns boolean
 */
function validateInputs(input_ids)
{    
    for(let i = 0; i < input_ids.length; i++)
    {
        const input_id = input_ids[i];
        const input_value = document.getElementById(input_id).value;

        if(input_value === '')
        {
            inputError(input_id);   
            return false;
        }
    };

    return true;
}


function moveLabelUp(input_id)
{
    const input_box_class_list = document.getElementById(input_id + 'Box').classList;
    if (input_box_class_list.contains('label-up') === false)
    {
        document.getElementById(input_id + 'Box').classList.add('label-up');
    }
}


function inputError(input_id)
{
    document.getElementById(input_id + 'Box').classList.add('input-error');
    moveLabelUp(input_id);
}


function removeInputError(input_id)
{
    document.getElementById(input_id + 'Box').classList.remove('input-error');
}


/**
 * 
 * @param {object} data 
 * E.g. data = { name: 'Tinashe', surname: 'Mavhurume' }
 * 
 * document.getElementById('name').value = 'Tinashe'
 * 
 * document.getElementById('surname').value = 'Mavhurume'
 */
function fillInputValues(data)
{
    for(var input_id in data)
    {
        if (document.getElementById(input_id + 'Box')) moveLabelUp(input_id);
        const input_value = data[input_id];
        document.getElementById(input_id).value = input_value;
    }
}


/**
 * 
 * @param {string[]} input_ids 
 * 
 * E.g. input_ids = [ 'name', 'surname' ]
 * 
 * output: {
 * 
 *  name: document.getElementById('name').value,
 * 
 *  surname: document.getElementById('surname').value,
 * 
 * }
 * 
 * @returns object
 */
function extractFormData(input_ids)
{
    let data = {};

    for(let i = 0; i < input_ids.length; i++)
    {
        const input_id = input_ids[i];
        const input_value = document.getElementById(input_id).value;
        
        data[input_id] = input_value;
    }

    return data;
}

