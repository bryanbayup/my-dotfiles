// Function to create and show the custom alert dialog
function showCustomAlert() {
    // Create the overlay element
    var alertOverlay = document.createElement('div');
    alertOverlay.style.position = 'fixed';
    // alertOverlay.style.left = '0';
    alertOverlay.style.top = '0';
    alertOverlay.style.width = '100%';
    alertOverlay.style.paddingLeft = '25px';
    alertOverlay.style.paddingRight = '25px';
    alertOverlay.style.height = '100%';
    alertOverlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    alertOverlay.style.display = 'flex';
    alertOverlay.style.alignItems = 'center';
    alertOverlay.style.justifyContent = 'center';
    alertOverlay.style.zIndex = '1000';
  
    // Create the alert box element
    var alertBox = document.createElement('div');
    alertBox.style.background = 'white';
    alertBox.style.padding = '20px';
    alertBox.style.borderRadius = '5px';
    alertBox.style.textAlign = 'center';
  
    // Create the title element
    var alertTitle = document.createElement('h3');
    alertTitle.textContent = 'You need an API Key';
  
    // Create the message element
    var alertMsg = document.createElement('p');
    alertMsg.textContent = '';
  
    // Create the link element
    var alertLink = document.createElement('p');
    var alertLinkAnchor = document.createElement('a');
    alertLinkAnchor.href = 'https://digestprompt.io/how-to-use-the-ai-exam-expert-chrome-extension/';
    alertLinkAnchor.textContent = 'Click Here';
    alertLinkAnchor.target = '_blank'; // Open in new tab
    alertLink.textContent = ' for the Steps to Generate and Configure the API Key';
    alertLink.insertBefore(alertLinkAnchor, alertLink.firstChild);
  
    // Create the close button
    var closeButton = document.createElement('span');
    closeButton.textContent = '×';
    closeButton.style.float = 'right';
    closeButton.style.fontSize = '28px';
    closeButton.style.fontWeight = 'bold';
    closeButton.style.cursor = 'pointer';
    closeButton.onclick = function() {
      document.body.removeChild(alertOverlay);
    };
  
    // Append children to alert box
    alertBox.appendChild(closeButton);
    alertBox.appendChild(alertTitle);
    alertBox.appendChild(alertMsg);
    alertBox.appendChild(alertLink);
  
    // Append alert box to overlay
    alertOverlay.appendChild(alertBox);
  
    // Append overlay to body
    document.body.appendChild(alertOverlay);
  }
  

document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('inputForm');
  // const apiResultElement = document.getElementById('apiResult');
  const loader = document.getElementById('loader');
  const inputTextElement = document.getElementById('input_text');
  var submitButton = document.getElementById('submitButton');

  chrome.storage.local.get('apiKey', function(result) {
    if (result.apiKey) {
        var hiddenInput = document.createElement('input');
        hiddenInput.setAttribute('type', 'hidden');
        hiddenInput.setAttribute('name', 'the_api_key');
        hiddenInput.setAttribute('value', result.apiKey);

        form.appendChild(hiddenInput);
    } else{
        showCustomAlert();
        // alert('You need an API Key');
    }
  });

  form.addEventListener('submit', function (e) {

    e.preventDefault();
    submitButton.disabled = true;
    loader.classList.add('active');
    
    if (inputTextElement.value.trim() === '') {
        alert('Job Description Can Not Be Empty');
        loader.classList.remove('active');
        submitButton.disabled = false;
        return; // Stop further execution
    }

    const formData = new FormData(form);
    fetch(form.action, {
        method: 'POST',
        body: formData,
    })
    .then(response => response.text())
    .then(data => {
      document.getElementById('ansHere').textContent = "Answer: "+data;
      loader.classList.remove('active');
      submitButton.disabled = false;
      return; // Stop further execution
    })
    .catch(error => {
        console.error('Error: Unable to fetch data from the API.', error);
        loader.classList.remove('active');
        submitButton.disabled = false;
    }); 
  });

  chrome.storage.local.get('apiKey', function(result) {
    var contentElement = document.getElementById('content');
    
    function displayEditUI(apiKeyValue) {
        contentElement.innerHTML = `
            <br/>
            <div style="display: flex; width: 100%;">
            <div style="width: 70%;">
                <input class="form-control" type="text" id="apiKey" placeholder="Enter API Key" value="${apiKeyValue || ''}">
            </div>
            <div style="width: 30%; display: flex; justify-content: flex-end; align-items: center;">
                <button class="btn btn-danger btn-sm" id="saveButton">Save</button>
            </div>
            </div>
        `;

        document.getElementById('saveButton').addEventListener('click', function() {
            var apiKey = document.getElementById('apiKey').value;
            chrome.storage.local.set({ 'apiKey': apiKey }, function() {
                console.log('API Key saved');
                displayDoneUI();
            });
        });
    }

    function displayDoneUI() {
        contentElement.innerHTML = `
            <br/>
            <div style="display: flex; width: 100%;">
                <div style="width: 60%;">
                    <h4 class="text-success">API Key Saved</h4>
                </div>
                <div style="width: 40%; display: flex; justify-content: flex-end; align-items: center;">
                    <button class="btn btn-danger btn-sm" id="editButton">Edit API Key</button>
                </div>
            </div>
        `;

        document.getElementById('editButton').addEventListener('click', function() {
            chrome.storage.local.get('apiKey', function(result) {
                displayEditUI(result.apiKey);
            });
        });
    }

    chrome.storage.local.get('apiKey', function(result) {
        if (result.apiKey) {
            displayDoneUI();
        } else {
            displayEditUI();
        }
    });
});

});