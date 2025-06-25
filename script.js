const stages = [
    { title: "수리 영역", time: 900 }, // 15분
    { title: "추리 영역", time: 1200 }, // 20분
    { title: "지각 영역", time: 600 }  // 10분
];

let currentStage = 0;
let timeLeft = stages[currentStage].time;
let timerInterval = null;
let isPaused = false;

const timer = document.getElementById('timer');
const stageTitle = document.getElementById('stage-title');
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const stopBtn = document.getElementById('stopBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const resetBtn = document.getElementById('resetBtn');
const completionMessage = document.getElementById('completion-message');
const timeUpSound = document.getElementById('timeUpSound');

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

function updateDisplay() {
    timer.textContent = formatTime(timeLeft);
    stageTitle.textContent = stages[currentStage].title;
    if (timeLeft < 30) {
        timer.classList.add('warning');
    } else {
        timer.classList.remove('warning');
    }
}

function startTimer() {
    if (!timerInterval && !isPaused) {
        timeLeft = stages[currentStage].time;
    }
    isPaused = false;
    
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        if (timeLeft > 0) {
            timeLeft--;
            updateDisplay();
        } else {
            timeUpSound.play();
            clearInterval(timerInterval);
            if (currentStage < stages.length - 1) {
                // Show next stage name for 2 seconds
                const nextStageName = stages[currentStage + 1].title;
                timer.textContent = '';
                stageTitle.textContent = nextStageName;
                setTimeout(() => {
                    currentStage++;
                    timeLeft = stages[currentStage].time;
                    updateDisplay();
                    startTimer(); // Start next stage automatically
                }, 2000);
            } else {
                completionMessage.classList.remove('hidden');
                document.querySelector('.test-info').classList.add('hidden');
            }
        }
    }, 1000);
    
    startBtn.disabled = true;
    pauseBtn.disabled = false;
}

function pauseTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
    isPaused = true;
    startBtn.disabled = false;
    pauseBtn.disabled = true;
}

function stopTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
    isPaused = false;
    timeLeft = stages[currentStage].time;
    updateDisplay();
    startBtn.disabled = false;
    pauseBtn.disabled = false;
    completionMessage.classList.add('hidden');
    document.querySelector('.test-info').classList.remove('hidden');
}

function resetAll() {
    clearInterval(timerInterval);
    timerInterval = null;
    isPaused = false;
    currentStage = 0;
    timeLeft = stages[currentStage].time;
    updateDisplay();
    completionMessage.classList.add('hidden');
    document.querySelector('.test-info').classList.remove('hidden');
    startBtn.disabled = false;
    pauseBtn.disabled = false;
}

function previousStage() {
    if (currentStage > 0) {
        currentStage--;
        stopTimer();
    }
}

function nextStage() {
    if (currentStage < stages.length - 1) {
        currentStage++;
        stopTimer();
    }
}

startBtn.addEventListener('click', startTimer);
pauseBtn.addEventListener('click', pauseTimer);
stopBtn.addEventListener('click', stopTimer);
prevBtn.addEventListener('click', previousStage);
nextBtn.addEventListener('click', nextStage);
resetBtn.addEventListener('click', resetAll);

// Initialize display
updateDisplay();
