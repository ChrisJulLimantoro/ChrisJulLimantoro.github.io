var shareImageButton = document.querySelector('#share-image-button');
var workoutsArea = document.querySelector('#card-place');
var button = document.querySelector('#install-button');

function openCreatePostModal() {
  // createPostArea.style.display = 'block';
  if (deferredPrompt) {
    deferredPrompt.prompt();

    deferredPrompt.userChoice.then(function(choiceResult) {
      console.log(choiceResult.outcome);

      if (choiceResult.outcome === 'dismissed') {
        console.log('User cancelled installation');
      } else {
        console.log('User added to home screen');
      }
    });

    deferredPrompt = null;
  }
}

button.addEventListener('click', openCreatePostModal);


function clearCards() {
  while(workoutsArea.hasChildNodes()) {
    workoutsArea.removeChild(workoutsArea.lastChild);
  }
}

function createCard(data,num) {
  var cardWrapper = document.createElement('div');
  cardWrapper.className = 'w-full rounded-xl bg-white shadow-lg dark:bg-neutral-700 text-center transition-shadow duration-300 ease-in-out hover:shadow-xl hover:shadow-black/30';
  var cardImage = document.createElement('img');
  cardImage.className = 'rounded-t-xl w-full h-48';
  cardImage.src = data.image;
  cardWrapper.appendChild(cardImage);
  var cardBody = document.createElement('div');
  cardBody.className = 'p-6';
  cardWrapper.appendChild(cardBody);
  var cardTitle = document.createElement('h5');
  cardTitle.className = 'mb-2 text-xl font-bold tracking-wide text-neutral-800 dark:text-neutral-50 uppercase';
  cardTitle.textContent = data.title + " (" + data.level + ")";
  cardBody.appendChild(cardTitle);
  for (var key in data.target) {
    let cardBadge = document.createElement('span');
    cardBadge.className = 'mx-1 inline-block whitespace-nowrap rounded-[0.27rem] bg-primary-100 px-[0.65em] pb-[0.25em] pt-[0.35em] text-center align-baseline text-[0.75em] font-bold leading-none text-primary-700 dark:bg-slate-900 dark:text-primary-500';
    cardBadge.textContent = data.target[key];
    cardBody.appendChild(cardBadge);
  }
  var cardBreak = document.createElement('br');
  cardBody.appendChild(cardBreak);
  var cardLink = document.createElement('a');
  cardLink.className = 'mt-3 inline-block rounded bg-blue-500 px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-blue-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-blue-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-blue-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]';
  cardLink.href = 'detail.html?workout=' + num;
  cardLink.textContent = 'View Details';
  cardBody.appendChild(cardLink);
  workoutsArea.appendChild(cardWrapper);
}

function updateUI(data) { 
  clearCards();
  for (var i = 0; i < data.length; i++) {
    createCard(data[i],i);
  }
}

var url = 'https://pcu-fit-default-rtdb.asia-southeast1.firebasedatabase.app/workouts.json';
var networkDataReceived = false;

fetch(url)
  .then(function(res) {
    console.log('ambil data');
    return res.json();
  })
  .then(function(data) {
    console.log(data)
    networkDataReceived = true;
    console.log('From web', data);
    var dataArray = [];
    for (var key in data) {
      dataArray.push(data[key]);
      writeData('workouts', data[key]);
    }
    updateUI(dataArray);
  });

if ('indexedDB' in window) {
  readAllData('workouts')
    .then(function(data) {
      if (!networkDataReceived) {
        console.log('From cache', data);
        updateUI(data);
      }
    });
}