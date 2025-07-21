// Golf Planner Main Module
const GolfPlanner = (function() {
    // Private state
    const state = {
        hoursAvailable: 10,
        seasonalMode: 'regular',
        golferType: 'intermediate',
        daysPerWeek: 5,
        calendarIntegration: null,
        simulatorIntegration: null,
        activityPreferences: {
            preferredDays: [],
            preferredTimes: [],
            weatherConditions: []
        }
    };

    // Private methods
    function initializeEventListeners() {
        // Hours available input
        const hoursInput = document.getElementById('hoursAvailable');
        if (hoursInput) {
            hoursInput.addEventListener('change', function() {
                state.hoursAvailable = parseFloat(this.value);
                updatePlanner();
            });
        }

        // Seasonal mode selection
        const seasonalModeSelect = document.getElementById('seasonalMode');
        if (seasonalModeSelect) {
            seasonalModeSelect.addEventListener('change', function() {
                state.seasonalMode = this.value;
                updatePlanner();
            });
        }

        // Days per week selection
        const daysPerWeekSelect = document.getElementById('daysPerWeek');
        if (daysPerWeekSelect) {
            daysPerWeekSelect.addEventListener('change', function() {
                state.daysPerWeek = parseInt(this.value);
                updatePlanner();
            });
        }

        // Golfer type selection
        const golferTypeSelect = document.getElementById('golferType');
        if (golferTypeSelect) {
            golferTypeSelect.addEventListener('change', function() {
                state.golferType = this.value;
                updatePlanner();
            });
        }

        // Calendar integration
        const calendarConnectBtn = document.getElementById('connectCalendar');
        if (calendarConnectBtn) {
            calendarConnectBtn.addEventListener('click', function() {
                UIComponents.showCalendarProviderSelection();
            });
        }

        // Simulator integration
        const simulatorConnectBtn = document.getElementById('connectSimulator');
        if (simulatorConnectBtn) {
            simulatorConnectBtn.addEventListener('click', function() {
                UIComponents.showSimulatorInfo();
            });
        }
    }

    function updatePlanner() {
        UIComponents.showLoading(true);

        try {
            console.log('Starting planner update with state:', state);

            // Get calendar availability if connected
            const calendarAvailability = state.calendarIntegration ? 
                state.calendarIntegration.getBusyTimes() : null;
            console.log('Calendar availability:', calendarAvailability);

            // Generate schedule using planning algorithm
            console.log('Calling PlanningAlgorithm.generateSchedule with params:', {
                hoursAvailable: state.hoursAvailable,
                daysPerWeek: state.daysPerWeek,
                golferType: state.golferType,
                seasonalMode: state.seasonalMode,
                calendarAvailability: calendarAvailability,
                activityPreferences: state.activityPreferences
            });

            const result = PlanningAlgorithm.generateSchedule({
                hoursAvailable: state.hoursAvailable,
                daysPerWeek: state.daysPerWeek,
                golferType: state.golferType,
                seasonalMode: state.seasonalMode,
                calendarAvailability: calendarAvailability,
                activityPreferences: state.activityPreferences
            });

            console.log('Planning algorithm result:', result);

            // Update UI with results
            UIComponents.updateCharts(result.allocations);
            UIComponents.updateSchedule(result.schedule);

            // Update activity preferences display
            UIComponents.updateActivityPreferences(state.activityPreferences);

        } catch (error) {
            console.error('Detailed error in updatePlanner:', {
                message: error.message,
                stack: error.stack,
                state: state
            });
            UIComponents.showError(`Error updating planner: ${error.message}. Please check the console for details.`);
        } finally {
            UIComponents.showLoading(false);
        }
    }

    function initializeCalendarIntegration() {
        if (window.CalendarIntegration) {
            state.calendarIntegration = window.CalendarIntegration;
            state.calendarIntegration.init();
        }
    }

    function initializeSimulatorIntegration() {
        if (window.SimulatorIntegration) {
            state.simulatorIntegration = window.SimulatorIntegration;
            state.simulatorIntegration.init();
        }
    }

    // Public API
    return {
        init: function() {
            console.log('Initializing Golf Planner...');
            
            // Initialize UI components
            if (typeof UIComponents.init === 'function') {
                UIComponents.init();
            }
            
            // Initialize integrations
            initializeCalendarIntegration();
            initializeSimulatorIntegration();
            
            // Set up event listeners
            initializeEventListeners();
            
            // Initial update
            updatePlanner();
        },

        // Update activity preferences
        updateActivityPreferences: function(preferences) {
            state.activityPreferences = {
                ...state.activityPreferences,
                ...preferences
            };
            updatePlanner();
        },

        // Get recommended drills for an activity
        getRecommendedDrills: function(activityType) {
            return PlanningAlgorithm.getRecommendedDrills(activityType, state.golferType);
        },

        // Get current state
        getState: function() {
            return { ...state };
        }
    };
})();

// Export for use in other modules
window.GolfPlanner = GolfPlanner;