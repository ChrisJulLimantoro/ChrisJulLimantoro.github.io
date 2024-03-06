// Get the search parameters from the URL
const urlParams = new URLSearchParams(window.location.search);

// Get the value of the 'workout' parameter
const workoutParam = urlParams.get('workout');

// Now, workoutParam contains the value of the 'workout' parameter
console.log(workoutParam); // This will log the value of the workout parameter

// Variable for canvas
var canvas = document.querySelector('#canvas');

var url = 'https://pcu-fit-default-rtdb.asia-southeast1.firebasedatabase.app/workouts/'+workoutParam+'.json';
var networkDataReceived = false;
fetch(url)
    .then(function(res) {
        return res.json();
    })
    .then(function(data) {
        networkDataReceived = true;
        console.log('From web', data);
        updateUI(data);
    });

if ('indexedDB' in window) {
    readAllData('workouts')
        .then(function(data) {
            if (!networkDataReceived) {
                console.log('From cache', data);
                for (var key in data) {
                    if (data[key].id == workoutParam) {
                        updateUI(data[key]);
                    }
                }
            }
        });
}

function updateUI(data) {
    var title = document.querySelector('#title');
    title.textContent = data.title;
    
    var image = document.querySelector('#img');
    image.src = data.image;
    
    var level = document.querySelector('#level');
    level.textContent = data.level;
    
    var target = document.querySelector('#target');
    for(var key in data.target) {
        target.textContent += data.target[key] + ', ';
    }
    
    var sets = document.querySelector('#sets');
    sets.textContent = data.set;

    var reps = document.querySelector('#reps');
    reps.textContent = data.reps;

    var equipment = document.querySelector('#equipment');
    equipment.textContent = data.equipment;
}
