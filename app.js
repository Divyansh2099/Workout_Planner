// State Management
let appState = {
  view: 'view-dashboard',
  generator: {
    track: 'equipment', // 'equipment' or 'bodyweight'
    equipment: ['machines', 'dumbbells', 'barbells', 'kettlebells', 'elastic-band'],
    focusArea: 'Full Body',
    duration: 20,
    difficulty: 'Beginner'
  },
  customExercises: [],
  generatedRoutine: [],
  stats: {
    totalWorkouts: 0,
    totalMinutes: 0,
    totalCalories: 0
  },
  history: [],
  streak: {
    count: 0,
    lastWorkoutDate: ''
  }
};

// Active Session Player State
let playerState = {
  flatRoutine: [],
  currentStepIndex: 0,
  phase: 'work', // 'work' or 'rest'
  timeLeft: 0,
  totalPhaseDuration: 0,
  timerInterval: null,
  isPaused: false,
  soundEnabled: true,
  speechEnabled: true
};

// Audio Elements
let audioCtx = null;

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
  loadUserData();
  initNav();
  initWizard();
  initPlayerControls();
  initCustomBuilder();
  updateDashboard();
});

/* ==========================================================================
   NAVIGATION / ROUTING SYSTEM
   ========================================================================== */
function initNav() {
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const targetView = btn.getAttribute('data-target');
      switchView(targetView);
    });
  });

  // Dashboard quickstart button
  document.getElementById('dash-btn-start').addEventListener('click', () => {
    switchView('view-planner');
  });
}

function showCustomConfirm(message, onConfirm, onCancel) {
  const overlay = document.getElementById('confirm-dialog-overlay');
  const msgEl = document.getElementById('confirm-dialog-message');
  const btnOk = document.getElementById('confirm-btn-ok');
  const btnCancel = document.getElementById('confirm-btn-cancel');

  msgEl.textContent = message;
  overlay.classList.add('active');

  // Clone buttons to clear previous event listeners
  const newBtnOk = btnOk.cloneNode(true);
  const newBtnCancel = btnCancel.cloneNode(true);
  btnOk.parentNode.replaceChild(newBtnOk, btnOk);
  btnCancel.parentNode.replaceChild(newBtnCancel, btnCancel);

  newBtnOk.addEventListener('click', () => {
    overlay.classList.remove('active');
    if (onConfirm) onConfirm();
  });

  newBtnCancel.addEventListener('click', () => {
    overlay.classList.remove('active');
    if (onCancel) onCancel();
  });
}

function switchView(viewId) {
  // If leaving the player view while active, warn the user
  if (appState.view === 'view-player' && playerState.timerInterval && viewId !== 'view-player') {
    showCustomConfirm(
      "Are you sure you want to quit your active workout session? Your progress won't be saved.",
      () => {
        // Stop timer and clean up player state
        if (playerState.timerInterval) {
          clearInterval(playerState.timerInterval);
          playerState.timerInterval = null;
        }
        // Force view switch
        switchView(viewId);
      }
    );
    return;
  }

  // Stop timer and clean up player state if leaving the player view
  if (appState.view === 'view-player' && viewId !== 'view-player') {
    if (playerState.timerInterval) {
      clearInterval(playerState.timerInterval);
      playerState.timerInterval = null;
    }
    stopConfetti();
    const completionOverlay = document.getElementById('completion-overlay');
    if (completionOverlay) {
      completionOverlay.classList.remove('active');
    }
  }

  // Update nav buttons active state
  document.querySelectorAll('.nav-btn').forEach(btn => {
    if (btn.getAttribute('data-target') === viewId) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  // Switch view displays
  document.querySelectorAll('.view-section').forEach(sec => {
    if (sec.id === viewId) {
      sec.classList.add('active');
    } else {
      sec.classList.remove('active');
    }
  });

  appState.view = viewId;
  window.scrollTo(0, 0);

  // If returning to dashboard, refresh stats
  if (viewId === 'view-dashboard') {
    updateDashboard();
  }
}

/* ==========================================================================
   LOCAL STORAGE & ANALYTICS DATA
   ========================================================================== */
function loadUserData() {
  const savedData = localStorage.getItem('flexifit_user_data');
  if (savedData) {
    try {
      const parsed = JSON.parse(savedData);
      appState.stats = parsed.stats || { totalWorkouts: 0, totalMinutes: 0, totalCalories: 0 };
      appState.history = parsed.history || [];
      appState.customExercises = parsed.customExercises || [];
      appState.streak = parsed.streak || { count: 0, lastWorkoutDate: '' };
    } catch (e) {
      console.error("Error reading localStorage", e);
    }
  }
  verifyStreakValidity();
}

function saveUserData() {
  const dataToSave = {
    stats: appState.stats,
    history: appState.history,
    customExercises: appState.customExercises,
    streak: appState.streak
  };
  localStorage.setItem('flexifit_user_data', JSON.stringify(dataToSave));
}

function updateDashboard() {
  // Update counter stats
  document.getElementById('stat-total-workouts').textContent = appState.stats.totalWorkouts;
  document.getElementById('stat-total-minutes').textContent = appState.stats.totalMinutes;
  document.getElementById('stat-total-calories').textContent = Math.round(appState.stats.totalCalories);

  // Update streak text
  document.getElementById('streak-count-txt').textContent = `${appState.streak.count} Day${appState.streak.count === 1 ? '' : 's'}`;

  // Populate dynamic weekly calendar
  renderWeeklyStreak();

  // Populate dynamic history logs
  renderHistoryLogs();
}

function verifyStreakValidity() {
  if (!appState.streak.lastWorkoutDate) return;
  
  const todayStr = getLocalDateString(new Date());
  const lastDate = new Date(appState.streak.lastWorkoutDate);
  const today = new Date(todayStr);
  
  // Calculate difference in days
  const diffTime = Math.abs(today - lastDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  // If streak missed (more than 1 day difference from last workout date, ignoring today)
  if (diffDays > 1 && appState.streak.lastWorkoutDate !== todayStr) {
    appState.streak.count = 0;
    saveUserData();
  }
}

function renderWeeklyStreak() {
  const container = document.getElementById('streak-days-container');
  container.innerHTML = '';

  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const today = new Date();
  
  // Get start of the current week (Monday)
  const currentDay = today.getDay(); // 0 is Sunday, 1 is Monday, etc.
  const distanceToMonday = currentDay === 0 ? 6 : currentDay - 1;
  const monday = new Date(today);
  monday.setDate(today.getDate() - distanceToMonday);

  // Generate date strings for current week (Mon-Sun)
  const weekDates = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    weekDates.push(getLocalDateString(d));
  }

  const todayStr = getLocalDateString(today);

  daysOfWeek.forEach((dayName, idx) => {
    const dateStr = weekDates[idx];
    const isCompleted = appState.history.some(log => log.date === dateStr);
    const isToday = dateStr === todayStr;

    const dayDot = document.createElement('div');
    dayDot.className = 'streak-day-dot';
    if (isCompleted) dayDot.classList.add('completed');
    if (isToday) dayDot.classList.add('active');

    dayDot.innerHTML = `
      <span class="streak-day-lbl">${dayName}</span>
      <div class="streak-circle"></div>
    `;
    container.appendChild(dayDot);
  });
}

function renderHistoryLogs() {
  const container = document.getElementById('history-list-container');
  container.innerHTML = '';

  if (appState.history.length === 0) {
    container.innerHTML = `
      <div class="history-empty">
        No workouts recorded yet. Plan a session to begin!
      </div>
    `;
    return;
  }

  // Sort logs: newest first
  const sortedHistory = [...appState.history].sort((a, b) => b.timestamp - a.timestamp);

  sortedHistory.forEach(log => {
    const dateObj = new Date(log.date);
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    const formattedDate = dateObj.toLocaleDateString('en-US', options);

    const item = document.createElement('div');
    item.className = 'history-item';
    item.innerHTML = `
      <div class="history-item-left">
        <span class="history-item-title">${log.track}</span>
        <span class="history-item-date">${formattedDate}</span>
      </div>
      <div class="history-item-right">
        <span class="history-item-stat time">${log.duration}m</span>
        <span class="history-item-stat calories">${Math.round(log.calories)} kcal</span>
      </div>
    `;
    container.appendChild(item);
  });
}

function getLocalDateString(date) {
  const offset = date.getTimezoneOffset();
  const adjustedDate = new Date(date.getTime() - (offset * 60 * 1000));
  return adjustedDate.toISOString().split('T')[0];
}

/* ==========================================================================
   WORKOUT PLANNER WIZARD & GENERATION ALGORITHM
   ========================================================================== */
let currentWizardStep = 1;

function initWizard() {
  const nextBtn = document.getElementById('btn-wizard-next');
  const prevBtn = document.getElementById('btn-wizard-prev');

  nextBtn.addEventListener('click', () => {
    if (currentWizardStep === 1) {
      goToWizardStep(2);
    } else if (currentWizardStep === 2) {
      if (appState.generator.track === 'equipment' && appState.generator.equipment.length === 0) {
        showToast('Please select at least 1 equipment type!');
        return;
      }
      generateWorkoutRoutine();
      goToWizardStep(3);
    } else if (currentWizardStep === 3) {
      startWorkoutPlayer();
    }
  });

  prevBtn.addEventListener('click', () => {
    if (currentWizardStep > 1) {
      goToWizardStep(currentWizardStep - 1);
    }
  });

  // Setup pill listeners
  setupPills('focus-area-pills', (val) => appState.generator.focusArea = val);
  setupPills('duration-pills', (val) => appState.generator.duration = parseInt(val));
  setupPills('difficulty-pills', (val) => appState.generator.difficulty = val);
}

function setupPills(containerId, callback) {
  const container = document.getElementById(containerId);
  container.querySelectorAll('.pill-option').forEach(pill => {
    pill.addEventListener('click', () => {
      container.querySelectorAll('.pill-option').forEach(p => p.classList.remove('selected'));
      pill.classList.add('selected');
      callback(pill.getAttribute('data-value'));
    });
  });
}

function selectTrack(trackType) {
  appState.generator.track = trackType;
  
  const equipCard = document.getElementById('track-equip-card');
  const bodyCard = document.getElementById('track-body-card');
  const equipGroup = document.getElementById('equipment-selectors-group');
  const bodyGroup = document.getElementById('bodyweight-callout-group');

  if (trackType === 'equipment') {
    equipCard.classList.add('selected');
    bodyCard.classList.remove('selected');
    equipGroup.style.display = 'block';
    bodyGroup.style.display = 'none';
  } else {
    bodyCard.classList.add('selected');
    equipCard.classList.remove('selected');
    equipGroup.style.display = 'none';
    bodyGroup.style.display = 'block';
  }
}

function toggleEquipmentCheckbox(element, equipType) {
  const chk = element.querySelector('input[type="checkbox"]');
  chk.checked = !chk.checked;

  if (chk.checked) {
    element.classList.add('checked');
    if (!appState.generator.equipment.includes(equipType)) {
      appState.generator.equipment.push(equipType);
    }
  } else {
    element.classList.remove('checked');
    appState.generator.equipment = appState.generator.equipment.filter(e => e !== equipType);
  }
}

function goToWizardStep(stepNum) {
  // Hide current pane
  document.getElementById(`wizard-pane-${currentWizardStep}`).classList.remove('active');
  document.getElementById(`wizard-node-${currentWizardStep}`).classList.remove('active');
  if (currentWizardStep < stepNum) {
    document.getElementById(`wizard-node-${currentWizardStep}`).classList.add('completed');
  }

  // Show new pane
  currentWizardStep = stepNum;
  document.getElementById(`wizard-pane-${currentWizardStep}`).classList.add('active');
  document.getElementById(`wizard-node-${currentWizardStep}`).classList.add('active');
  document.getElementById(`wizard-node-${currentWizardStep}`).classList.remove('completed');

  // Clear future step badges
  for (let i = currentWizardStep + 1; i <= 3; i++) {
    document.getElementById(`wizard-node-${i}`).classList.remove('completed', 'active');
  }

  // Handle nav buttons display
  const prevBtn = document.getElementById('btn-wizard-prev');
  const nextBtn = document.getElementById('btn-wizard-next');

  if (currentWizardStep === 1) {
    prevBtn.style.visibility = 'hidden';
    nextBtn.textContent = 'Continue';
  } else if (currentWizardStep === 2) {
    prevBtn.style.visibility = 'visible';
    nextBtn.textContent = 'Generate Plan';
  } else {
    prevBtn.style.visibility = 'visible';
    nextBtn.textContent = 'Start Workout Session';
  }
}

// THE GENERATOR ENGINE
function generateWorkoutRoutine() {
  const track = appState.generator.track;
  const focus = appState.generator.focusArea;
  const duration = appState.generator.duration;
  const difficulty = appState.generator.difficulty;

  // Merge static database with custom exercises from local storage
  const fullDatabase = [...EXERCISES_DATABASE, ...appState.customExercises];

  // 1. FILTER CANDIDATE EXERCISES
  let candidates = fullDatabase.filter(ex => {
    // Exclude warmups/cooldowns from core selection
    if (ex.type === 'warmup' || ex.type === 'cooldown') return false;

    // Filter by Track Equipment
    if (track === 'bodyweight') {
      return ex.equipment === 'none';
    } else {
      // Equipment track: include 'none' + items selected in checkboxes
      return ex.equipment === 'none' || appState.generator.equipment.includes(ex.equipment);
    }
  });

  // Filter by Focus Area
  if (focus !== 'Full Body') {
    candidates = candidates.filter(ex => {
      if (focus === 'Upper Body') {
        return ['Chest', 'Back', 'Shoulders', 'Arms'].includes(ex.target);
      } else if (focus === 'Lower Body') {
        return ex.target === 'Legs';
      } else if (focus === 'Core') {
        return ex.target === 'Core';
      } else if (focus === 'Cardio') {
        return ex.type === 'cardio' || ex.target === 'Cardio';
      }
      return true;
    });
  }

  // Filter by Difficulty
  let difficultyMatches = candidates.filter(ex => ex.difficulty === difficulty);
  // Fallback: if we don't have enough exercises in that difficulty, merge other difficulties
  if (difficultyMatches.length >= 3) {
    candidates = difficultyMatches;
  }

  // Shuffle candidates array
  candidates.sort(() => Math.random() - 0.5);

  // 2. DEFINE EXERCISE STRUCTURE
  // 1 warmup (30s) + 1 cooldown (40s) is about ~1.5 mins
  // Workout block duration: 40s work + 20s rest = 1 min
  const availableMinutes = duration - 3; // buffer for warmup/cooldowns
  
  // Decide unique exercises and rounds
  let numUnique = 4;
  if (duration <= 10) numUnique = 3;
  else if (duration <= 20) numUnique = 4;
  else if (duration <= 30) numUnique = 5;
  else numUnique = 6;

  // Adjust unique count based on available exercises
  if (candidates.length < numUnique) {
    numUnique = candidates.length;
  }

  // If no candidates, create fallback exercises
  if (numUnique === 0) {
    candidates = [
      { id: "fallback_pushup", name: "Pushups", equipment: "none", type: "strength", target: "Chest", description: "Bodyweight chest builders.", steps: ["Place hands wide.", "Lower and press body."], duration: 40, caloriesPerMin: 6 },
      { id: "fallback_squat", name: "Squats", equipment: "none", type: "strength", target: "Legs", description: "Bodyweight lower body builder.", steps: ["Feet shoulder-width.", "Squat low, stand."], duration: 40, caloriesPerMin: 6 }
    ];
    numUnique = candidates.length;
  }

  const selectedUnique = candidates.slice(0, numUnique);
  
  // Calculate Rounds
  const totalSetsNeeded = Math.max(2, Math.round(availableMinutes));
  const rounds = Math.max(1, Math.round(totalSetsNeeded / numUnique));

  // Build the flat routine
  const routine = [];

  // Get warmups
  const warmupsList = fullDatabase.filter(ex => ex.type === 'warmup').sort(() => Math.random() - 0.5).slice(0, 2);
  warmupsList.forEach((warm, i) => {
    routine.push({
      type: 'warmup',
      exercise: warm,
      workDuration: warm.duration || 30,
      restDuration: 10
    });
  });

  // Build Rounds of Core Exercises
  for (let r = 1; r <= rounds; r++) {
    selectedUnique.forEach((ex) => {
      routine.push({
        type: 'workout',
        round: r,
        exercise: ex,
        workDuration: ex.duration || 40,
        restDuration: 20
      });
    });
  }

  // Get cooldowns
  const cooldownsList = fullDatabase.filter(ex => ex.type === 'cooldown').sort(() => Math.random() - 0.5).slice(0, 2);
  cooldownsList.forEach((cool, i) => {
    routine.push({
      type: 'cooldown',
      exercise: cool,
      workDuration: cool.duration || 40,
      restDuration: i === cooldownsList.length - 1 ? 0 : 10 // Last step has 0 rest
    });
  });

  appState.generatedRoutine = routine;

  // 3. RENDER THE TIMELINE IN PREVIEW
  renderRoutinePreview();
}

function renderRoutinePreview() {
  const timeline = document.getElementById('routine-timeline-container');
  timeline.innerHTML = '';

  let totalDurationSeconds = 0;
  let totalCalories = 0;
  let exerciseCount = 0;

  // Group duplicate exercises to display each once with a multiplier tag
  const displayItems = [];

  appState.generatedRoutine.forEach((step) => {
    totalDurationSeconds += step.workDuration + step.restDuration;
    
    if (step.type !== 'rest') {
      exerciseCount++;
      const caloriesMin = step.exercise.caloriesPerMin || 6;
      totalCalories += (step.workDuration / 60) * caloriesMin;

      const existing = displayItems.find(item => item.exercise.id === step.exercise.id && item.type === step.type);
      if (existing) {
        existing.count++;
      } else {
        displayItems.push({
          exercise: step.exercise,
          type: step.type,
          workDuration: step.workDuration,
          restDuration: step.restDuration,
          round: step.round,
          count: 1
        });
      }
    }
  });

  // Render the grouped items
  displayItems.forEach((item) => {
    const el = document.createElement('div');
    el.className = `exercise-list-item ${item.exercise.type || 'strength'}`;
    
    let badgeLabel = item.exercise.type || 'Strength';
    if (item.type === 'warmup') badgeLabel = 'Warmup';
    if (item.type === 'cooldown') badgeLabel = 'Cooldown';
    if (item.type === 'workout') {
      badgeLabel = item.count > 1 ? `${item.count} Sets` : 'Workout';
    }

    const multiplierText = item.count > 1 
      ? ` <span style="color:var(--color-primary); font-weight:700; margin-left:5px;">(x${item.count} Sets)</span>` 
      : '';

    el.innerHTML = `
      <div class="exercise-item-header">
        <span class="exercise-item-name">${item.exercise.name}${multiplierText}</span>
        <span class="exercise-item-badge">${badgeLabel}</span>
      </div>
      <div class="exercise-item-meta">
        <span>🎯 ${item.exercise.target}</span>
        <span>⚙️ ${capitalizeFirst(item.exercise.equipment === 'none' ? 'Bodyweight' : item.exercise.equipment)}</span>
        <span>⏱️ ${item.workDuration}s Work / ${item.restDuration}s Rest</span>
      </div>
      <p class="exercise-item-desc">${item.exercise.description}</p>
    `;
    timeline.appendChild(el);
  });

  const finalMin = Math.round(totalDurationSeconds / 60);

  // Update summary widgets
  document.getElementById('summary-duration').textContent = `${finalMin} min`;
  document.getElementById('summary-count').textContent = exerciseCount;
  document.getElementById('summary-calories').textContent = `${Math.round(totalCalories)} kcal`;
}

function capitalizeFirst(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/* ==========================================================================
   ACTIVE SESSION PLAYER ENGINE
   ========================================================================== */
function startWorkoutPlayer() {
  switchView('view-player');

  // Convert routine steps to sequential states: [work, rest, work, rest...]
  const flatSteps = [];
  appState.generatedRoutine.forEach((step) => {
    // Add work phase
    flatSteps.push({
      phase: 'work',
      type: step.type,
      round: step.round,
      exercise: step.exercise,
      duration: step.workDuration
    });
    // Add rest phase if greater than 0
    if (step.restDuration > 0) {
      flatSteps.push({
        phase: 'rest',
        type: step.type,
        round: step.round,
        exercise: step.exercise,
        duration: step.restDuration
      });
    }
  });

  playerState.flatRoutine = flatSteps;
  playerState.currentStepIndex = 0;
  playerState.isPaused = false;
  
  loadPlayerStep(0);
  
  // Voice announce start
  const firstExName = playerState.flatRoutine[0].exercise.name;
  speakText(`Starting workout session. First exercise is ${firstExName}. Prepare to work in three, two, one, go!`);
}

function loadPlayerStep(index) {
  if (index < 0 || index >= playerState.flatRoutine.length) return;

  playerState.currentStepIndex = index;
  const step = playerState.flatRoutine[index];
  playerState.phase = step.phase;
  playerState.timeLeft = step.duration;
  playerState.totalPhaseDuration = step.duration;

  // Update text elements
  const statusBadge = document.getElementById('player-status-badge');
  const timerDisplay = document.getElementById('timer-number-display');
  const timerLabel = document.getElementById('timer-status-label');
  const stepIndicator = document.getElementById('player-step-indicator');
  
  const exNameEl = document.getElementById('player-ex-name');
  const exTargetEl = document.getElementById('player-ex-target');
  const exEquipEl = document.getElementById('player-ex-equipment');
  const exDescEl = document.getElementById('player-ex-desc');
  const stepsContainer = document.getElementById('player-ex-steps-container');

  // Count core exercises (excluding rest steps and warmup/cooldown steps depending on representation)
  const coreTotal = playerState.flatRoutine.filter(s => s.phase === 'work').length;
  const currentWorkIdx = playerState.flatRoutine.slice(0, index + 1).filter(s => s.phase === 'work').length;
  stepIndicator.textContent = `Set ${currentWorkIdx || 1} of ${coreTotal}`;

  // Reset circle color
  const circle = document.getElementById('timer-gauge-circle');
  circle.style.strokeDashoffset = '0';

  if (step.phase === 'work') {
    if (step.type === 'warmup') {
      statusBadge.textContent = 'Warmup';
      statusBadge.className = 'player-phase-badge warmup';
      circle.style.stroke = '#f59e0b'; // Amber
    } else if (step.type === 'cooldown') {
      statusBadge.textContent = 'Cooldown';
      statusBadge.className = 'player-phase-badge cooldown';
      circle.style.stroke = '#10b981'; // Emerald
    } else {
      statusBadge.textContent = `Active Set (Round ${step.round})`;
      statusBadge.className = 'player-phase-badge workout';
      circle.style.stroke = '#8b5cf6'; // Purple
    }
    timerLabel.textContent = 'Seconds Work';
  } else {
    statusBadge.textContent = 'Rest Period';
    statusBadge.className = 'player-phase-badge rest';
    circle.style.stroke = '#06b6d4'; // Cyan
    timerLabel.textContent = 'Rest Time';
  }

  timerDisplay.textContent = playerState.timeLeft;

  // Exercise card details
  exNameEl.textContent = step.exercise.name;
  exTargetEl.textContent = `🎯 Target: ${step.exercise.target}`;
  exEquipEl.textContent = `⚙️ Equipment: ${capitalizeFirst(step.exercise.equipment === 'none' ? 'Bodyweight' : step.exercise.equipment)}`;
  exDescEl.textContent = step.exercise.description;

  // Render steps list
  stepsContainer.innerHTML = '';
  (step.exercise.steps || []).forEach(inst => {
    const li = document.createElement('li');
    li.textContent = inst;
    stepsContainer.appendChild(li);
  });

  // Peek next exercise
  const nextPeek = document.getElementById('player-next-peek-card');
  const nextPeekName = document.getElementById('player-next-peek-name');
  
  // Find next 'work' phase exercise
  let nextWorkStep = null;
  for (let i = index + 1; i < playerState.flatRoutine.length; i++) {
    if (playerState.flatRoutine[i].phase === 'work') {
      nextWorkStep = playerState.flatRoutine[i];
      break;
    }
  }

  if (nextWorkStep) {
    nextPeek.style.visibility = 'visible';
    nextPeekName.textContent = nextWorkStep.exercise.name;
  } else {
    nextPeek.style.visibility = 'hidden';
  }

  // Restart timer loop
  startTimerTicker();
}

function startTimerTicker() {
  clearInterval(playerState.timerInterval);
  
  playerState.timerInterval = setInterval(() => {
    if (playerState.isPaused) return;

    playerState.timeLeft--;
    
    // Draw progress circle
    const circle = document.getElementById('timer-gauge-circle');
    const offset = 534 - (playerState.timeLeft / playerState.totalPhaseDuration) * 534;
    circle.style.strokeDashoffset = offset;

    // Display numbers
    document.getElementById('timer-number-display').textContent = playerState.timeLeft;

    // Beeps countdown trigger on last 3 seconds
    if (playerState.timeLeft <= 3 && playerState.timeLeft > 0) {
      playSound(600, 0.1);
    }

    if (playerState.timeLeft === 0) {
      clearInterval(playerState.timerInterval);
      playSound(1200, 0.25);
      moveToNextStep();
    }
  }, 1000);
}

function moveToNextStep() {
  const nextIdx = playerState.currentStepIndex + 1;
  if (nextIdx < playerState.flatRoutine.length) {
    const nextStep = playerState.flatRoutine[nextIdx];
    
    // announce phase shift
    if (nextStep.phase === 'rest') {
      // Resting. Peek next
      let nextWorkName = "the end of workout";
      for (let i = nextIdx + 1; i < playerState.flatRoutine.length; i++) {
        if (playerState.flatRoutine[i].phase === 'work') {
          nextWorkName = playerState.flatRoutine[i].exercise.name;
          break;
        }
      }
      speakText(`Rest. Up next: ${nextWorkName}`);
    } else {
      speakText(`Start ${nextStep.exercise.name}`);
    }
    
    loadPlayerStep(nextIdx);
  } else {
    completeWorkout();
  }
}

function moveToPrevStep() {
  // Go back to previous work step (not rest)
  let prevIdx = playerState.currentStepIndex - 1;
  while (prevIdx >= 0) {
    if (playerState.flatRoutine[prevIdx].phase === 'work') {
      loadPlayerStep(prevIdx);
      speakText(`Previous exercise: ${playerState.flatRoutine[prevIdx].exercise.name}`);
      return;
    }
    prevIdx--;
  }
  showToast('Already at the first exercise!');
}

function skipCurrentStep() {
  clearInterval(playerState.timerInterval);
  const nextIdx = playerState.currentStepIndex + 1;
  if (nextIdx < playerState.flatRoutine.length) {
    loadPlayerStep(nextIdx);
    if (playerState.flatRoutine[nextIdx].phase === 'work') {
      speakText(`Skipped. Starting ${playerState.flatRoutine[nextIdx].exercise.name}`);
    } else {
      speakText(`Skipped to Rest`);
    }
  } else {
    completeWorkout();
  }
}

function initPlayerControls() {
  const playToggle = document.getElementById('btn-player-toggle');
  const prevBtn = document.getElementById('btn-player-prev');
  const nextBtn = document.getElementById('btn-player-next');
  const abortBtn = document.getElementById('btn-player-abort');
  
  const soundToggle = document.getElementById('btn-toggle-sound');
  const speechToggle = document.getElementById('btn-toggle-speech');

  playToggle.addEventListener('click', () => {
    playerState.isPaused = !playerState.isPaused;
    
    const svgIcon = document.getElementById('svg-play-pause');
    if (playerState.isPaused) {
      playToggle.classList.add('paused');
      // Set icon to Play arrow
      svgIcon.innerHTML = `<polygon points="5 3 19 12 5 21 5 3"></polygon>`;
      speakText("Workout Paused");
    } else {
      playToggle.classList.remove('paused');
      // Set icon to Pause lines
      svgIcon.innerHTML = `<rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect>`;
      speakText("Resuming");
    }
  });

  prevBtn.addEventListener('click', moveToPrevStep);
  nextBtn.addEventListener('click', skipCurrentStep);
  
  abortBtn.addEventListener('click', () => {
    showCustomConfirm(
      "Abandon current workout? Points and stats won't be saved.",
      () => {
        abortWorkout();
      }
    );
  });

  // Sound effects toggle
  soundToggle.addEventListener('click', () => {
    playerState.soundEnabled = !playerState.soundEnabled;
    soundToggle.classList.toggle('active', playerState.soundEnabled);
    showToast(playerState.soundEnabled ? 'Beep sounds enabled' : 'Beep sounds muted');
  });

  // Text to speech coach toggle
  speechToggle.addEventListener('click', () => {
    playerState.speechEnabled = !playerState.speechEnabled;
    speechToggle.classList.toggle('active', playerState.speechEnabled);
    showToast(playerState.speechEnabled ? 'Voice coach enabled' : 'Voice coach muted');
  });

  // Confetti modal close button
  document.getElementById('btn-comp-close').addEventListener('click', () => {
    stopConfetti();
    document.getElementById('completion-overlay').classList.remove('active');
    switchView('view-dashboard');
  });
}

function abortWorkout() {
  clearInterval(playerState.timerInterval);
  playerState.timerInterval = null;
  switchView('view-dashboard');
}

function completeWorkout() {
  clearInterval(playerState.timerInterval);
  playerState.timerInterval = null;

  // Calculate workout statistics
  let totalTimeSeconds = 0;
  let totalCaloriesBurned = 0;
  let exCount = 0;

  appState.generatedRoutine.forEach(step => {
    totalTimeSeconds += step.workDuration;
    if (step.type !== 'rest') {
      exCount++;
      const rate = step.exercise.caloriesPerMin || 6;
      totalCaloriesBurned += (step.workDuration / 60) * rate;
    }
  });

  const minutesWorked = Math.round(totalTimeSeconds / 60);

  // Update Global User Stats
  appState.stats.totalWorkouts += 1;
  appState.stats.totalMinutes += minutesWorked;
  appState.stats.totalCalories += totalCaloriesBurned;

  // Manage Streak count
  const todayStr = getLocalDateString(new Date());
  if (appState.streak.lastWorkoutDate === todayStr) {
    // Already did a workout today, streak count stays the same
  } else {
    // If last workout was yesterday, increment streak
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = getLocalDateString(yesterday);

    if (appState.streak.lastWorkoutDate === yesterdayStr || appState.streak.count === 0) {
      appState.streak.count += 1;
    } else {
      // Missed days
      appState.streak.count = 1;
    }
    appState.streak.lastWorkoutDate = todayStr;
  }

  // Save record to History
  let trackLabel = "Equipment Workout";
  if (appState.generator.track === 'bodyweight') {
    trackLabel = "Bodyweight Workout";
  } else {
    // List selected equipment
    const activeEquipList = appState.generator.equipment.map(e => capitalizeFirst(e)).join(', ');
    trackLabel = `Equipment (${activeEquipList})`;
  }

  appState.history.push({
    id: 'log_' + Date.now(),
    timestamp: Date.now(),
    date: todayStr,
    track: trackLabel,
    duration: minutesWorked,
    calories: totalCaloriesBurned,
    exercisesCount: exCount
  });

  saveUserData();

  // Populate completion modal figures
  document.getElementById('comp-stat-count').textContent = exCount;
  document.getElementById('comp-stat-time').textContent = `${minutesWorked}m`;
  document.getElementById('comp-stat-calories').textContent = `${Math.round(totalCaloriesBurned)}`;

  // Show modal + play confetti
  document.getElementById('completion-overlay').classList.add('active');
  startConfetti();
  speakText("Congratulations! You have completed your workout session. Sensational job!");
}

/* ==========================================================================
   WEB AUDIO API SOUND SYNTH
   ========================================================================== */
function playSound(frequency, duration, type = 'sine') {
  if (!playerState.soundEnabled) return;
  try {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(frequency, audioCtx.currentTime);
    
    gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  } catch (err) {
    console.error("Audio error", err);
  }
}

let activeUtterance = null; // Binds active utterance globally to prevent GC lockup in Chromium speech engines

function speakText(msg) {
  if (!playerState.speechEnabled) return;
  try {
    // Cancel any active speech queues
    window.speechSynthesis.cancel();
    
    activeUtterance = new SpeechSynthesisUtterance(msg);
    activeUtterance.rate = 1.05;
    activeUtterance.pitch = 1.0;
    
    // Choose clean sounding natural voice if present
    const voices = window.speechSynthesis.getVoices();
    const match = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Zira')));
    if (match) {
      activeUtterance.voice = match;
    }

    activeUtterance.onend = () => {
      activeUtterance = null;
    };
    activeUtterance.onerror = () => {
      activeUtterance = null;
    };

    window.speechSynthesis.speak(activeUtterance);
  } catch (err) {
    console.error("TTS error", err);
    activeUtterance = null;
  }
}

/* ==========================================================================
   CUSTOM EXERCISE BUILDER
   ========================================================================== */
function initCustomBuilder() {
  document.getElementById('btn-custom-cancel').addEventListener('click', () => {
    document.getElementById('custom-exercise-form').reset();
    resetStepsBuilder();
    switchView('view-dashboard');
  });
}

function addStepRow() {
  const container = document.getElementById('steps-builder-list');
  const count = container.querySelectorAll('.builder-step-row').length + 1;
  
  const row = document.createElement('div');
  row.className = 'builder-step-row';
  row.innerHTML = `
    <input type="text" class="input-txt custom-step-input" style="flex-grow:1;" placeholder="Step ${count} description..." required>
    <button type="button" class="btn-remove-step" onclick="removeStepRow(this)">&times;</button>
  `;
  container.appendChild(row);
}

function removeStepRow(button) {
  const container = document.getElementById('steps-builder-list');
  const rows = container.querySelectorAll('.builder-step-row');
  
  if (rows.length <= 1) {
    showToast("An exercise needs at least one instructional step!");
    return;
  }
  
  button.parentElement.remove();
  
  // Re-index placeholders
  container.querySelectorAll('.builder-step-row').forEach((row, index) => {
    row.querySelector('input').placeholder = `Step ${index + 1} description...`;
  });
}

function resetStepsBuilder() {
  const container = document.getElementById('steps-builder-list');
  container.innerHTML = `
    <div class="builder-step-row">
      <input type="text" class="input-txt custom-step-input" style="flex-grow:1;" placeholder="Step 1 description..." required>
      <button type="button" class="btn-remove-step" onclick="removeStepRow(this)">&times;</button>
    </div>
  `;
}

function saveCustomExercise() {
  const name = document.getElementById('custom-ex-name').value.trim();
  const equipment = document.getElementById('custom-ex-equipment').value;
  const target = document.getElementById('custom-ex-target').value;
  const difficulty = document.getElementById('custom-ex-difficulty').value;
  const duration = parseInt(document.getElementById('custom-ex-duration').value);
  const calories = parseFloat(document.getElementById('custom-ex-calories').value);
  const desc = document.getElementById('custom-ex-desc').value.trim();

  // Retrieve instruction steps
  const steps = [];
  document.querySelectorAll('.custom-step-input').forEach(input => {
    const val = input.value.trim();
    if (val) steps.push(val);
  });

  const newExercise = {
    id: 'custom_ex_' + Date.now(),
    name,
    equipment,
    type: equipment === 'none' ? 'strength' : 'strength', // customize default type
    target,
    description: desc,
    steps,
    duration,
    caloriesPerMin: calories
  };

  appState.customExercises.push(newExercise);
  saveUserData();
  
  // Reset form
  document.getElementById('custom-exercise-form').reset();
  resetStepsBuilder();

  showToast(`Saved custom exercise: ${name}`);
  switchView('view-dashboard');
}

/* ==========================================================================
   CONFETTI GENERATOR RENDER LOOP
   ========================================================================== */
let confettiActive = false;
let confettiParticles = [];
const confettiColors = ['#ec4899', '#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#06b6d4'];

function startConfetti() {
  const canvas = document.getElementById('confetti-canvas');
  const ctx = canvas.getContext('2d');
  
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  canvas.style.display = 'block';
  
  confettiActive = true;
  confettiParticles = [];

  // Generate particles
  for (let i = 0; i < 120; i++) {
    confettiParticles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      r: Math.random() * 6 + 4,
      d: Math.random() * canvas.height,
      color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
      tilt: Math.random() * 10 - 5,
      tiltAngleIncremental: Math.random() * 0.06 + 0.02,
      tiltAngle: 0
    });
  }

  function renderConfettiLoop() {
    if (!confettiActive) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let active = false;

    confettiParticles.forEach((p, idx) => {
      p.tiltAngle += p.tiltAngleIncremental;
      p.y += (Math.cos(p.d) + 3 + p.r / 2) / 2;
      p.x += Math.sin(p.tiltAngle);
      p.tilt = Math.sin(p.tiltAngle - idx / 3) * 15;

      if (p.y <= canvas.height) {
        active = true;
      } else {
        // Recycle particle to top
        p.x = Math.random() * canvas.width;
        p.y = -20;
      }

      ctx.beginPath();
      ctx.lineWidth = p.r;
      ctx.strokeStyle = p.color;
      ctx.moveTo(p.x + p.tilt + p.r / 2, p.y);
      ctx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r / 2);
      ctx.stroke();
    });

    if (active) {
      requestAnimationFrame(renderConfettiLoop);
    }
  }

  renderConfettiLoop();
}

function stopConfetti() {
  confettiActive = false;
  const canvas = document.getElementById('confetti-canvas');
  canvas.style.display = 'none';
}

/* ==========================================================================
   TOAST NOTIFICATION UTILITY
   ========================================================================== */
function showToast(msg) {
  // Remove existing alert if any
  const oldAlert = document.querySelector('.custom-alert');
  if (oldAlert) oldAlert.remove();

  const alertBox = document.createElement('div');
  alertBox.className = 'custom-alert';
  alertBox.innerHTML = `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
    <span>${msg}</span>
  `;
  document.body.appendChild(alertBox);

  setTimeout(() => {
    alertBox.style.animation = 'fadeIn 0.3s reverse forwards';
    setTimeout(() => alertBox.remove(), 300);
  }, 2700);
}

// Window resizing for canvas confetti support
window.addEventListener('resize', () => {
  const canvas = document.getElementById('confetti-canvas');
  if (canvas && confettiActive) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
});
