// Application state
const state = {
    hoursAvailable: 5,
    seasonalMode: 'playing', // 'playing' or 'grind'
    golferType: 50, // 0 = Social, 100 = Competitive
    daysPerWeek: 3,
    
    // Default percentages
    defaultPercentages: {
        playing: {
            playing: 65,
            practice: 25,
            physicalMental: 10
        },
        grind: {
            playing: 25,
            practice: 55,
            physicalMental: 20
        }
    },
    
    // Practice breakdown percentages
    practiceBreakdown: {
        driver: 20,
        approach: 30,
        shortGame: 20,
        putting: 30
    },
    
    // Charts
    overallChart: null,
    practiceChart: null
};

// Initialize the application
function init() {
    // Set up event listeners
    setupEventListeners();
    
    // Create day buttons
    createDayButtons();
    
    // Initialize day labels
    initDayLabels();
    
    // Update UI based on initial state
    updateUI();
}

// Set up event listeners
function setupEventListeners() {
    // Hours slider
    document.getElementById('hoursSlider').addEventListener('input', (e) => {
        state.hoursAvailable = parseInt(e.target.value);
        updateUI();
    });
    
    // Season toggle
    document.getElementById('seasonToggle').addEventListener('change', (e) => {
        state.seasonalMode = e.target.checked ? 'grind' : 'playing';
        updateUI();
    });
    
    // Golfer type slider
    document.getElementById('golferSlider').addEventListener('input', (e) => {
        state.golferType = parseInt(e.target.value);
        updateUI();
    });
    
    // Export button
    document.getElementById('exportBtn').addEventListener('click', () => {
        exportPlan();
    });
}

// Create day buttons
function createDayButtons() {
    const container = document.getElementById('daysButtonContainer');
    
    for (let i = 1; i <= 7; i++) {
        const button = document.createElement('button');
        button.className = `btn flex-fill ${i === state.daysPerWeek ? 'btn-primary' : 'btn-outline-secondary'}`;
        button.textContent = i;
        button.addEventListener('click', () => {
            state.daysPerWeek = i;
            updateUI();
        });
        container.appendChild(button);
    }
}

// Initialize day labels
function initDayLabels() {
    const labelContainer = document.getElementById('dayLabels');
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    
    days.forEach(day => {
        const col = document.createElement('div');
        col.className = 'col text-center';
        const label = document.createElement('div');
        label.className = 'fw-bold small';
        label.textContent = day;
        col.appendChild(label);
        labelContainer.appendChild(col);
    });
}

// Update UI based on current state
function updateUI() {
    // Update hours display
    document.getElementById('hoursDisplay').textContent = `${state.hoursAvailable} hrs`;
    document.getElementById('totalHoursDisplay').textContent = `${state.hoursAvailable} hrs`;
    
    // Update season mode
    updateSeasonMode();
    
    // Update days display
    document.getElementById('daysDisplay').textContent = `${state.daysPerWeek} days`;
    updateDayButtons();
    
    // Update golfer type
    updateGolferType();
    
    // Calculate allocations
    const { allocations, practiceAllocations, percentages } = calculateTimeAllocations();
    
    // Update text summary
    updateTextSummary(allocations, practiceAllocations, percentages);
    
    // Update charts
    updateCharts(allocations, practiceAllocations, percentages);
    
    // Update weekly schedule
    updateWeeklySchedule(allocations, practiceAllocations);
}

// Update season mode UI
function updateSeasonMode() {
    const toggle = document.getElementById('seasonToggle');
    const playingLabel = document.getElementById('playingLabel');
    const grindLabel = document.getElementById('grindLabel');
    const currentMode = document.getElementById('currentMode');
    
    toggle.checked = state.seasonalMode === 'grind';
    
    playingLabel.className = `me-3 ${state.seasonalMode === 'playing' ? 'fw-bold text-primary' : 'text-muted'}`;
    grindLabel.className = `ms-3 ${state.seasonalMode === 'grind' ? 'fw-bold text-success' : 'text-muted'}`;
    
    currentMode.className = `badge ${state.seasonalMode === 'playing' ? 'bg-primary' : 'bg-success'}`;
    currentMode.textContent = `Currently in: ${state.seasonalMode === 'playing' ? 'Playing Season' : 'Grind Mode'}`;
}

// Update day buttons
function updateDayButtons() {
    const buttons = document.querySelectorAll('#daysButtonContainer button');
    
    buttons.forEach((button, index) => {
        const day = index + 1;
        button.className = `btn flex-fill ${day === state.daysPerWeek ? 'btn-primary' : 'btn-outline-secondary'}`;
    });
}

// Update golfer type UI
function updateGolferType() {
    const socialBadge = document.getElementById('socialBadge');
    const balancedBadge = document.getElementById('balancedBadge');
    const competitiveBadge = document.getElementById('competitiveBadge');
    const description = document.getElementById('profileDescription');
    
    // Update badges
    socialBadge.className = `badge me-1 ${state.golferType < 33 ? 'bg-primary fw-bold' : 'bg-light text-muted'}`;
    balancedBadge.className = `badge mx-1 ${state.golferType >= 33 && state.golferType <= 66 ? 'bg-info fw-bold' : 'bg-light text-muted'}`;
    competitiveBadge.className = `badge ms-1 ${state.golferType > 66 ? 'bg-danger fw-bold' : 'bg-light text-muted'}`;
    
    // Update description text
    if (state.golferType < 33) {
        description.innerHTML = `<span class="fw-bold text-primary">Social Focus:</span> You enjoy golf primarily for fun and socializing. Your plan emphasizes playing time with friends while still getting some structured practice to improve.`;
    } else if (state.golferType > 66) {
        description.innerHTML = `<span class="fw-bold text-danger">Competitive Focus:</span> You're dedicated to improving your scores and competing at a higher level. Your plan balances intensive practice with strategic playing time.`;
    } else {
        description.innerHTML = `<span class="fw-bold text-info">Balanced Approach:</span> You want to improve while keeping golf enjoyable. Your plan provides a well-rounded mix of playing, structured practice, and preparation.`;
    }
}

// Calculate time allocations
function calculateTimeAllocations() {
    // Adjust percentages based on golfer type (0 = Social, 100 = Competitive)
    let adjustedPercentages = { ...state.defaultPercentages[state.seasonalMode] };
    
    if (state.seasonalMode === 'playing') {
        // For playing mode: more social means more playing, less practice and physical/mental
        const playingAdjustment = (100 - state.golferType) / 5; // Up to 20% adjustment
        const practiceAdjustment = -playingAdjustment * 0.7; // 70% of adjustment comes from practice
        const physicalMentalAdjustment = -playingAdjustment * 0.3; // 30% from physical/mental
        
        adjustedPercentages = {
            playing: Math.min(85, Math.max(50, adjustedPercentages.playing + playingAdjustment)),
            practice: Math.min(40, Math.max(10, adjustedPercentages.practice + practiceAdjustment)),
            physicalMental: Math.min(20, Math.max(5, adjustedPercentages.physicalMental + physicalMentalAdjustment))
        };
    } else { // grind mode
        // For grind mode: more social means more playing, less practice
        const practiceAdjustment = (state.golferType - 50) / 2.5; // Up to 20% adjustment
        const playingAdjustment = -practiceAdjustment * 0.8; // 80% of adjustment comes from playing
        const physicalMentalAdjustment = -practiceAdjustment * 0.2; // 20% from physical/mental
        
        adjustedPercentages = {
            playing: Math.min(40, Math.max(15, adjustedPercentages.playing + playingAdjustment)),
            practice: Math.min(75, Math.max(40, adjustedPercentages.practice + practiceAdjustment)),
            physicalMental: Math.min(30, Math.max(10, adjustedPercentages.physicalMental + physicalMentalAdjustment))
        };
    }
    
    // Ensure percentages add up to 100%
    const total = Object.values(adjustedPercentages).reduce((sum, val) => sum + val, 0);
    const normalizedPercentages = {};
    
    for (const key in adjustedPercentages) {
        normalizedPercentages[key] = (adjustedPercentages[key] / total) * 100;
    }
    
    const allocations = {
        playing: Math.round((normalizedPercentages.playing / 100) * state.hoursAvailable * 60) / 60,
        practice: Math.round((normalizedPercentages.practice / 100) * state.hoursAvailable * 60) / 60,
        physicalMental: Math.round((normalizedPercentages.physicalMental / 100) * state.hoursAvailable * 60) / 60
    };
    
    // Practice breakdown remains the same, but now based on adjusted allocations
    const practiceAllocations = {
        driver: Math.round((state.practiceBreakdown.driver / 100) * allocations.practice * 60) / 60,
        approach: Math.round((state.practiceBreakdown.approach / 100) * allocations.practice * 60) / 60,
        shortGame: Math.round((state.practiceBreakdown.shortGame / 100) * allocations.practice * 60) / 60,
        putting: Math.round((state.practiceBreakdown.putting / 100) * allocations.practice * 60) / 60
    };
    
    return { allocations, practiceAllocations, percentages: normalizedPercentages };
}

// Format time in hours and minutes
function formatTime(hours) {
    const wholeHours = Math.floor(hours);
    const minutes = Math.round((hours - wholeHours) * 60);
    
    if (wholeHours === 0) {
        return `${minutes} min`;
    } else if (minutes === 0) {
        return `${wholeHours} hr`;
    } else {
        return `${wholeHours} hr ${minutes} min`;
    }
}

// Update text summary
function updateTextSummary(allocations, practiceAllocations, percentages) {
    const summary = document.getElementById('planSummary');
    const modeText = state.seasonalMode === 'playing' ? 'Playing Season' : 'Grind Mode';
    let golferTypeText = "";
    
    if (state.golferType < 33) {
        golferTypeText = "socially-focused";
    } else if (state.golferType > 66) {
        golferTypeText = "competitively-focused";
    } else {
        golferTypeText = "balanced";
    }
    
    summary.textContent = `Based on your ${state.hoursAvailable} hours available this week in ${modeText} with a ${golferTypeText} approach, 
    you should spend ${formatTime(allocations.playing)} playing golf (${Math.round(percentages.playing)}%), 
    ${formatTime(allocations.practice)} practicing (${Math.round(percentages.practice)}%), and 
    ${formatTime(allocations.physicalMental)} on physical/mental preparation (${Math.round(percentages.physicalMental)}%). 
    Within your practice time, focus ${formatTime(practiceAllocations.driver)} on driver, 
    ${formatTime(practiceAllocations.approach)} on approach shots, 
    ${formatTime(practiceAllocations.shortGame)} on short game, and 
    ${formatTime(practiceAllocations.putting)} on putting.`;
}

// Update charts
function updateCharts(allocations, practiceAllocations, percentages) {
    updateOverallChart(allocations, percentages);
    updatePracticeChart(practiceAllocations);
    updateLegends(allocations, percentages);
    updatePracticeInsight(practiceAllocations);
}

// Update overall chart
function updateOverallChart(allocations, percentages) {
    const ctx = document.getElementById('overallChart').getContext('2d');
    
    // Destroy previous chart if it exists
    if (state.overallChart) {
        state.overallChart.destroy();
    }
    
    // Chart data
    const data = {
        labels: ['Playing', 'Practice', 'Physical/Mental'],
        datasets: [{
            data: [allocations.playing, allocations.practice, allocations.physicalMental],
            backgroundColor: ['#34D399', '#60A5FA', '#FBBF24'],
            borderWidth: 0,
            hoverOffset: 4
        }]
    };
    
    // Chart options
    const options = {
        cutout: '70%',
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        const value = context.raw;
                        return ` ${formatTime(value)} (${Math.round(percentages[context.label.toLowerCase().replace('/', '')])})%`;
                    }
                }
            }
        }
    };
    
    // Create chart
    state.overallChart = new Chart(ctx, {
        type: 'doughnut',
        data: data,
        options: options
    });
}

// Update practice chart
function updatePracticeChart(practiceAllocations) {
    const ctx = document.getElementById('practiceChart').getContext('2d');
    
    // Destroy previous chart if it exists
    if (state.practiceChart) {
        state.practiceChart.destroy();
    }
    
    // Chart data
    const data = {
        labels: ['Driver', 'Approach', 'Short Game', 'Putting'],
        datasets: [{
            label: 'Hours',
            data: [
                practiceAllocations.driver,
                practiceAllocations.approach,
                practiceAllocations.shortGame,
                practiceAllocations.putting
            ],
            backgroundColor: ['#F472B6', '#A78BFA', '#4ADE80', '#38BDF8'],
            borderWidth: 0,
            borderRadius: 4
        }]
    };
    
    // Chart options
    const options = {
        indexAxis: 'y',
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        const value = context.raw;
                        return ` ${formatTime(value)}`;
                    }
                }
            }
        },
        scales: {
            x: {
                beginAtZero: true
            }
        }
    };
    
    // Create chart
    state.practiceChart = new Chart(ctx, {
        type: 'bar',
        data: data,
        options: options
    });
}

// Update legends
function updateLegends(allocations, percentages) {
    const legendContainer = document.getElementById('overallLegend');
    legendContainer.innerHTML = '';
    
    const items = [
        { name: 'Playing', value: allocations.playing, color: '#34D399' },
        { name: 'Practice', value: allocations.practice, color: '#60A5FA' },
        { name: 'Physical/Mental', value: allocations.physicalMental, color: '#FBBF24' }
    ];
    
    items.forEach(item => {
        const div = document.createElement('div');
        div.className = 'd-flex justify-content-between align-items-center mb-2';
        
        const left = document.createElement('div');
        left.className = 'd-flex align-items-center';
        
        const dot = document.createElement('div');
        dot.className = 'color-dot me-2';
        dot.style.backgroundColor = item.color;
        
        const name = document.createElement('span');
        name.className = 'small';
        name.textContent = item.name;
        
        left.appendChild(dot);
        left.appendChild(name);
        
        const right = document.createElement('div');
        const time = document.createElement('span');
        time.className = 'small fw-bold';
        time.textContent = formatTime(item.value);
        
        const percent = document.createElement('span');
        percent.className = 'small text-muted ms-1';
        percent.textContent = `(${Math.round(percentages[item.name.toLowerCase().replace('/', '')])})%`;
        
        right.appendChild(time);
        right.appendChild(percent);
        
        div.appendChild(left);
        div.appendChild(right);
        
        legendContainer.appendChild(div);
    });
}

// Update practice insight
function updatePracticeInsight(practiceAllocations) {
    const insight = document.getElementById('practiceInsight');
    
    // Sort practice allocations by time (descending)
    const sorted = Object.entries(practiceAllocations)
        .map(([key, value]) => ({ name: key.charAt(0).toUpperCase() + key.slice(1), value }))
        .sort((a, b) => b.value - a.value);
    
    insight.textContent = `Insight: For a ${state.hoursAvailable}-hour week, your practice time focuses on ${sorted[0].name} (${formatTime(sorted[0].value)}) and ${sorted[1].name} (${formatTime(sorted[1].value)}).`;
}

// Generate weekly schedule
function generateWeeklySchedule(allocations, practiceAllocations) {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    let schedule = [];
    
    // Create available days based on daysPerWeek setting
    // Prefer weekend days first, then distribute remaining days
    let availableDays = [];
    
    // Always include weekend days first if possible
    if (state.daysPerWeek >= 1) availableDays.push('Saturday');
    if (state.daysPerWeek >= 2) availableDays.push('Sunday');
    
    // Add weekdays as needed
    const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    let remainingDays = state.daysPerWeek - availableDays.length;
    
    for (let i = 0; i < remainingDays && i < weekdays.length; i++) {
        availableDays.push(weekdays[i]);
    }
    
    // Standardize playing time into 18-hole (4hr) and 9-hole (2hr) rounds
    let playingTimeRemaining = allocations.playing;
    const playingSessions = [];
    
    // Allocate full 18-hole rounds (4 hours each)
    while (playingTimeRemaining >= 4) {
        playingSessions.push({
            type: 'playing',
            name: '18-Hole Round',
            time: 4
        });
        playingTimeRemaining -= 4;
    }
    
    // Allocate 9-hole rounds (2 hours each)
    while (playingTimeRemaining >= 2) {
        playingSessions.push({
            type: 'playing',
            name: '9-Hole Round',
            time: 2
        });
        playingTimeRemaining -= 2;
    }
    
    // If any time is left, allocate to short playing session
    if (playingTimeRemaining > 0) {
        playingSessions.push({
            type: 'playing',
            name: 'Short Playing Session',
            time: playingTimeRemaining
        });
    }
    
    // Sort other activities by time allocation (descending)
    const otherActivities = [
        { type: 'driver', name: 'Driver Practice', time: practiceAllocations.driver },
        { type: 'approach', name: 'Approach Practice', time: practiceAllocations.approach },
        { type: 'shortGame', name: 'Short Game Practice', time: practiceAllocations.shortGame },
        { type: 'putting', name: 'Putting Practice', time: practiceAllocations.putting },
        { type: 'physicalMental', name: 'Physical/Mental', time: allocations.physicalMental }
    ].filter(a => a.time > 0).sort((a, b) => b.time - a.time);
    
    // Combine playing sessions with other activities
    const allActivities = [...playingSessions, ...otherActivities];
    
    // Simple distribution - just assign activities to available days
    if (availableDays.length > 0) {
        let dayIndex = 0;
        allActivities.forEach(activity => {
            const day = availableDays[dayIndex % availableDays.length];
            schedule.push({
                day,
                activity: activity.name,
                type: activity.type,
                time: activity.time
            });
            dayIndex++;
        });
    }
    
    return schedule;
}

// Update weekly schedule
function updateWeeklySchedule(allocations, practiceAllocations) {
    const container = document.getElementById('scheduleContainer');
    container.innerHTML = '';
    
    const schedule = generateWeeklySchedule(allocations, practiceAllocations);
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    
    days.forEach(day => {
        const dayItems = schedule.filter(item => item.day === day);
        const totalHours = dayItems.reduce((sum, item) => sum + (item.time || 0), 0);
        
        const col = document.createElement('div');
        col.className = 'col';
        
        const dayColumn = document.createElement('div');
        dayColumn.className = 'day-column';
        
        if (dayItems.length === 0) {
            const restDay = document.createElement('div');
            restDay.className = 'rest-day';
            restDay.textContent = 'Rest Day';
            dayColumn.appendChild(restDay);
        } else {
            const hoursLabel = document.createElement('div');
            hoursLabel.className = 'day-hours';
            hoursLabel.textContent = `${totalHours.toFixed(1)} hrs`;
            dayColumn.appendChild(hoursLabel);
            
            dayItems.forEach(item => {
                const itemTime = item.time || 0;
                const heightClass = `time-block-${Math.min(4, Math.ceil(itemTime))}`;
                
                const block = document.createElement('div');
                block.className = `activity-block ${heightClass}`;
                block.style.backgroundColor = getActivityColor(item.type);
                
                const name = document.createElement('div');
                name.className = 'activity-name';
                name.textContent = item.activity;
                
                const time = document.createElement('div');
                time.className = 'activity-time';
                time.textContent = formatTime(itemTime);
                
                block.appendChild(name);
                block.appendChild(time);
                dayColumn.appendChild(block);
            });
        }
        
        col.appendChild(dayColumn);
        container.appendChild(col);
    });
}

// Get color for activity type
function getActivityColor(type) {
    const colorMap = {
        'playing': '#22C55E',
        'driver': '#EC4899',
        'approach': '#8B5CF6',
        'shortGame': '#10B981',
        'putting': '#3B82F6',
        'physicalMental': '#F97316'
    };
    
    return colorMap[type] || '#6B7280';
}

// Export plan as a printable page with auto-download
function exportPlan() {
    // Get current allocations
    const { allocations, practiceAllocations, percentages } = calculateTimeAllocations();
    const schedule = generateWeeklySchedule(allocations, practiceAllocations);
    
    // Get golfer type text
    let golferTypeText = "";
    if (state.golferType < 33) {
        golferTypeText = "socially-focused";
    } else if (state.golferType > 66) {
        golferTypeText = "competitively-focused";
    } else {
        golferTypeText = "balanced";
    }
    
    // Get mode text
    const modeText = state.seasonalMode === 'playing' ? 'Playing Season' : 'Grind Mode';
    
    // Create a new window for the report
    const printWindow = window.open('', '_blank');
    
    // Set up content with inline styles for better compatibility
    let content = `
    <!DOCTYPE html>
    <html>
    <head>
        <title>Weekly Golf Plan - Weeno Ridge</title>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet">
        <style>
            body {
                font-family: Arial, sans-serif;
                padding: 20px;
                max-width: 800px;
                margin: 0 auto;
                color: #19364B;
            }
            .header {
                text-align: center;
                margin-bottom: 30px;
                padding-bottom: 20px;
                border-bottom: 2px solid #D15B27;
            }
            h1, h2, h3 {
                color: #2D7E7B;
                font-weight: bold;
            }
            .bg-light {
                background-color: #F6E8CA !important;
            }
            .badge {
                background-color: #2D7E7B;
            }
            .table {
                margin-top: 15px;
            }
            .footer {
                margin-top: 40px;
                padding-top: 20px;
                border-top: 1px solid #dee2e6;
                text-align: center;
            }
            .download-message {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                background-color: #2D7E7B;
                color: white;
                text-align: center;
                padding: 10px;
                font-weight: bold;
            }
            @media print {
                .no-print {
                    display: none;
                }
            }
            .list-group-item {
                background-color: #F6E8CA;
                border-color: #D15B27;
            }
        </style>
    </head>
    <body>
        <div class="download-message no-print">
            Your PDF is being prepared for download... You can also print this page or save it manually.
        </div>
        
        <div class="header">
            <h1>Weekly Golf Planner</h1>
            <div>Weeno Ridge LLC - GolfOS</div>
        </div>

        <section class="mb-4">
            <h2>Your Golf Plan Summary</h2>
            <div class="p-3 bg-light rounded">
                Based on your ${state.hoursAvailable} hours available this week in ${modeText} with a ${golferTypeText} approach, 
                you should spend ${formatTime(allocations.playing)} playing golf (${Math.round(percentages.playing)}%), 
                ${formatTime(allocations.practice)} practicing (${Math.round(percentages.practice)}%), and 
                ${formatTime(allocations.physicalMental)} on physical/mental preparation (${Math.round(percentages.physicalMental)}%). 
                Within your practice time, focus ${formatTime(practiceAllocations.driver)} on driver, 
                ${formatTime(practiceAllocations.approach)} on approach shots, 
                ${formatTime(practiceAllocations.shortGame)} on short game, and 
                ${formatTime(practiceAllocations.putting)} on putting.
            </div>
        </section>

        <section class="mb-4">
            <h2>Weekly Schedule</h2>
            <div class="p-3">
                <table class="table table-bordered">
                    <thead>
                        <tr>
                            <th>Day</th>
                            <th>Activities</th>
                            <th>Time</th>
                        </tr>
                    </thead>
                    <tbody>
    `;
    
    // Add schedule rows
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    days.forEach(day => {
        const dayItems = schedule.filter(item => item.day === day);
        
        if (dayItems.length > 0) {
            content += `<tr>
                <td>${day}</td>
                <td>
                    <ul class="mb-0">
                        ${dayItems.map(item => `<li>${item.activity}</li>`).join('')}
                    </ul>
                </td>
                <td>${dayItems.reduce((sum, item) => sum + (item.time || 0), 0).toFixed(1)} hrs</td>
            </tr>`;
        } else {
            content += `<tr>
                <td>${day}</td>
                <td colspan="2" class="text-center text-muted">Rest Day</td>
            </tr>`;
        }
    });
    
    content += `
                    </tbody>
                </table>
            </div>
        </section>

        <div class="row mb-4">
            <div class="col-md-6">
                <h3>Time Allocation</h3>
                <div class="p-3">
                    <ul class="list-group">
    `;
    
    // Add time allocation items
    const items = [
        { name: 'Playing', value: allocations.playing, percent: Math.round(percentages.playing) },
        { name: 'Practice', value: allocations.practice, percent: Math.round(percentages.practice) },
        { name: 'Physical/Mental', value: allocations.physicalMental, percent: Math.round(percentages.physicalMental) }
    ];
    
    items.forEach(item => {
        content += `
            <li class="list-group-item d-flex justify-content-between align-items-center">
                <span>${item.name}</span>
                <span>
                    <strong>${formatTime(item.value)}</strong>
                    <span class="badge rounded-pill ms-2">${item.percent}%</span>
                </span>
            </li>
        `;
    });
    
    content += `
                    </ul>
                </div>
            </div>
            <div class="col-md-6">
                <h3>Practice Focus</h3>
                <div class="p-3">
                    <ul class="list-group">
    `;
    
    // Add practice focus items
    const practiceItems = [
        { name: 'Driver', value: practiceAllocations.driver },
        { name: 'Approach', value: practiceAllocations.approach },
        { name: 'Short Game', value: practiceAllocations.shortGame },
        { name: 'Putting', value: practiceAllocations.putting }
    ].sort((a, b) => b.value - a.value);
    
    practiceItems.forEach(item => {
        content += `
            <li class="list-group-item d-flex justify-content-between align-items-center">
                <span>${item.name}</span>
                <strong>${formatTime(item.value)}</strong>
            </li>
        `;
    });
    
    content += `
                    </ul>
                </div>
            </div>
        </div>

        <div class="footer">
            <p>Created on ${new Date().toLocaleDateString()}</p>
            <p class="text-muted small">Visit weenoridge.com for more golf improvement resources</p>
            <button class="btn btn-primary no-print" onclick="window.print()">Print</button>
            <button class="btn btn-secondary no-print" onclick="window.close()">Close</button>
        </div>
        
        <script>
            // Auto-download as PDF after short delay
            setTimeout(function() {
                const element = document.body;
                html2pdf()
                    .set({
                        margin: 1,
                        filename: 'WeeklyGolfPlan.pdf',
                        image: { type: 'jpeg', quality: 0.98 },
                        html2canvas: { scale: 2, useCORS: true },
                        jsPDF: { unit: 'cm', format: 'a4', orientation: 'portrait' }
                    })
                    .from(element)
                    .save();
                
                // Update message
                document.querySelector('.download-message').textContent = 
                    'Your PDF download has started. You can close this window after the download is complete.';
            }, 1500);
        </script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"></script>
    </body>
    </html>
    `;
    
    // Write content to the new window
    printWindow.document.open();
    printWindow.document.write(content);
    printWindow.document.close();
}

// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', init);