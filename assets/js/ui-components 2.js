// UI Components Module
const UIComponents = (function() {
    // Private state
    let overallChart = null;
    let practiceChart = null;

    // Private methods
    function createOverallChart(data) {
        const ctx = document.getElementById('overallChart');
        if (!ctx) {
            console.error('Overall chart canvas not found');
            return;
        }

        if (overallChart) {
            overallChart.destroy();
        }

        const chartData = {
            labels: ['Playing', 'Practice', 'Physical/Mental'],
            datasets: [{
                data: [
                    data.allocations.playing,
                    data.allocations.practice,
                    data.allocations.physicalMental
                ],
                backgroundColor: [
                    '#4CAF50',  // Green for playing
                    '#2196F3',  // Blue for practice
                    '#FFC107'   // Yellow for physical/mental
                ]
            }]
        };

        overallChart = new Chart(ctx, {
            type: 'pie',
            data: chartData,
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom'
                    },
                    title: {
                        display: true,
                        text: 'Overall Time Allocation (Hours)'
                    }
                }
            }
        });
    }

    function createPracticeChart(data) {
        const ctx = document.getElementById('practiceChart');
        if (!ctx) {
            console.error('Practice chart canvas not found');
            return;
        }

        if (practiceChart) {
            practiceChart.destroy();
        }

        const chartData = {
            labels: ['Driver', 'Approach', 'Short Game', 'Putting'],
            datasets: [{
                data: [
                    data.practiceBreakdown.driver,
                    data.practiceBreakdown.approach,
                    data.practiceBreakdown.shortGame,
                    data.practiceBreakdown.putting
                ],
                backgroundColor: [
                    '#F44336',  // Red for driver
                    '#9C27B0',  // Purple for approach
                    '#00BCD4',  // Cyan for short game
                    '#8BC34A'   // Light green for putting
                ]
            }]
        };

        practiceChart = new Chart(ctx, {
            type: 'pie',
            data: chartData,
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom'
                    },
                    title: {
                        display: true,
                        text: 'Practice Breakdown (Hours)'
                    }
                }
            }
        });
    }

    function updateScheduleDisplay(schedule) {
        const container = document.getElementById('scheduleDisplay');
        if (!container) {
            console.error('Schedule display container not found');
            return;
        }

        // Group activities by day
        const scheduleByDay = schedule.reduce((acc, activity) => {
            if (!acc[activity.day]) {
                acc[activity.day] = [];
            }
            acc[activity.day].push(activity);
            return acc;
        }, {});

        // Create HTML for each day
        const html = Object.entries(scheduleByDay)
            .map(([day, activities]) => `
                <div class="schedule-day">
                    <h4>${day}</h4>
                    <div class="activities">
                        ${activities.map(activity => `
                            <div class="activity-item ${activity.type}">
                                <div class="activity-header">
                                    <span class="activity-name">${activity.activity}</span>
                                    <span class="activity-time">${activity.time.toFixed(1)} hours</span>
                                </div>
                                <div class="activity-details">
                                    ${getRecommendedDrills(activity.type)}
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `).join('');

        container.innerHTML = html;
    }

    function getRecommendedDrills(activityType) {
        const drills = GolfPlanner.getRecommendedDrills(activityType);
        if (!drills || drills.length === 0) return '';

        return `
            <div class="recommended-drills">
                <h5>Recommended Drills:</h5>
                <ul>
                    ${drills.map(drill => `
                        <li>${drill.name} - ${drill.description}</li>
                    `).join('')}
                </ul>
            </div>
        `;
    }

    function showLoading(show) {
        const overlay = document.getElementById('loadingOverlay');
        if (overlay) {
            overlay.style.display = show ? 'flex' : 'none';
        }
    }

    function showError(message) {
        const container = document.getElementById('errorContainer');
        if (container) {
            container.innerHTML = `
                <div class="error-message">
                    <i class="fas fa-exclamation-circle"></i>
                    <p>${message}</p>
                </div>
            `;
        }
    }

    function showCalendarProviderSelection() {
        const modal = document.getElementById('calendarModal');
        if (modal) {
            modal.style.display = 'block';
        }
    }

    function showSimulatorInfo() {
        const modal = document.getElementById('simulatorModal');
        if (modal) {
            modal.style.display = 'block';
        }
    }

    // Public API
    return {
        init: function() {
            console.log('Initializing UI Components...');
            
            // Close modals when clicking outside
            window.onclick = function(event) {
                const calendarModal = document.getElementById('calendarModal');
                const simulatorModal = document.getElementById('simulatorModal');
                
                if (event.target === calendarModal) {
                    calendarModal.style.display = 'none';
                }
                if (event.target === simulatorModal) {
                    simulatorModal.style.display = 'none';
                }
            };
        },

        updateCharts: function(data) {
            try {
                createOverallChart(data);
                createPracticeChart(data);
            } catch (error) {
                console.error('Error updating charts:', error);
                showError('Error updating charts. Please check the console for details.');
            }
        },

        updateSchedule: function(schedule) {
            try {
                updateScheduleDisplay(schedule);
            } catch (error) {
                console.error('Error updating schedule:', error);
                showError('Error updating schedule. Please check the console for details.');
            }
        },

        showLoading: showLoading,
        showError: showError,
        showCalendarProviderSelection: showCalendarProviderSelection,
        showSimulatorInfo: showSimulatorInfo
    };
})();

// Export for use in other modules
window.UIComponents = UIComponents; 