_id = (id) => {
    return document.getElementById(id);
}

_class = (className) => {
    return document.getElementsByClassName(className);
}



validateTime = (id, maxValue) => {
    let element = _id(id);
    if(element.value > maxValue){
        element.value = maxValue;
    }else if(element.value < 0){
        element.value = 0;
    }
    element.value = Math.round(element.value);
}

let indicatorBar = _id('indicator-bar');

const barShrinking = [
    { width: '100%' },
    { width: '0%' }
];


var state = 'init';

let startButton = _id('start-btn');
let pauseButton = _id('pause-btn');
let resetButton = _id('reset-btn');

let hoursField = _id('hours');
let minutesField = _id('minutes');
let secondsField = _id('seconds');

let errorMessage = _id('error-message');

pauseButton.style.display = 'none';

let timerDisplay = _id('timer');
let duration = 0;


updateTimer = () =>{
    if(state ==='init') return;
    if(state === 'playing'){
        seconds = parseInt(duration % 60);
        minutes = parseInt(duration % 3600 / 60);
        hours = parseInt(duration / 3600);
    
        hours = hours < 10 ? "0" + hours : hours;
        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;
    
        timerDisplay.innerHTML = hours + ":" + minutes + ":" + seconds;
    
        duration--;
        if(duration < 0){
            timerDisplay.classList.add('running');
            let i = 0, maxLoop = 2;
            alarmRingtone.play();
            let alarmLoop = setInterval(()=>{
                i++
                alarmRingtone.play();
                if(i >= maxLoop) clearInterval(alarmLoop);
            },1500);
            return;
        } 
    }
    setTimeout(() => updateTimer(),1000);
}

startTimer = () => { 
    if(state === 'init'){
        let hours = parseInt(hoursField.value);
        let minutes = parseInt(minutesField.value);
        let seconds = parseInt(secondsField.value);
        duration = (hours*3600) + (minutes*60) + seconds;
        if(duration <= 0){
            errorMessage.innerHTML = "Please set a valid time!"
            setTimeout(()=>{
                errorMessage.innerHTML = ""
            },3000);
        }else{
            startButton.style.display = 'none';
            pauseButton.style.display = 'block';
            state = 'playing';
            updateTimer();
            indicatorBar.style.animationDuration = (duration+1) +'s';
            indicatorBar.classList.add('running');
        }
    }else if(state === 'paused'){
        startButton.style.display = 'none';
        pauseButton.style.display = 'block';
        state = 'playing';
        indicatorBar.style.animationPlayState = 'running';
    }
}

pauseTimer = () => {
    state = 'paused';
    startButton.style.display = 'block';
    pauseButton.style.display = 'none';
    indicatorBar.style.animationPlayState = 'paused';
}

resetTimer = () => {
    state = 'init';
    startButton.style.display = 'block';
    pauseButton.style.display = 'none';
    hoursField.value = 0;
    minutesField.value = 0;
    secondsField.value = 0;
    timerDisplay.innerHTML = '00:00:00';
    indicatorBar.style.animationPlayState = 'running';
    indicatorBar.classList.remove('running');
    timerDisplay.classList.remove('running');
}
