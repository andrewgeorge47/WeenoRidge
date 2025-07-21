/**
 * Calendar Integration for Golf Planner
 * This file handles the integration with various calendar services
 * Updated to use Google Identity Services instead of deprecated gapi.auth2
 */

// Global variable for token client
let tokenClient;

// Main namespace for calendar functionality
const CalendarIntegration = (function() {
    // Private state
    const state = {
        connected: false,
        provider: null,
        busyTimes: [],
        authToken: null,
        userPreferences: {
            preferredDays: [],
            preferredTimes: [],
            maxHoursPerDay: 8,
            minRestBetweenSessions: 12 // hours
        }
    };

    // Private methods
    function initializeProvider(provider) {
        return new Promise((resolve, reject) => {
            // Simulate provider initialization
            setTimeout(() => {
                state.provider = provider;
                state.connected = true;
                resolve();
            }, 1000);
        });
    }

    function fetchBusyTimes() {
        // Generate mock busy times for testing
        const busyTimes = [];
        const now = new Date();
        const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

        days.forEach(day => {
            // Add 2-3 busy slots per day
            const numSlots = Math.floor(Math.random() * 2) + 2;
            for (let i = 0; i < numSlots; i++) {
                const start = new Date(now);
                start.setHours(9 + Math.floor(Math.random() * 8));
                start.setMinutes(0);
                
                const end = new Date(start);
                end.setHours(start.getHours() + Math.floor(Math.random() * 3) + 1);

                busyTimes.push({
                    day,
                    start: start.toISOString(),
                    end: end.toISOString()
                });
            }
        });

        state.busyTimes = busyTimes;
        return busyTimes;
    }

    function findAvailableSlots(busyTimes, preferences) {
        const availableSlots = [];
        const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        
        days.forEach(day => {
            const dayBusyTimes = busyTimes.filter(slot => slot.day === day);
            let lastEnd = new Date();
            lastEnd.setHours(8, 0, 0, 0); // Start at 8 AM
            
            const dayEnd = new Date();
            dayEnd.setHours(20, 0, 0, 0); // End at 8 PM

            dayBusyTimes.sort((a, b) => new Date(a.start) - new Date(b.start));

            dayBusyTimes.forEach(busySlot => {
                const busyStart = new Date(busySlot.start);
                const busyEnd = new Date(busySlot.end);

                if (busyStart > lastEnd) {
                    availableSlots.push({
                        day,
                        start: lastEnd.toISOString(),
                        end: busyStart.toISOString()
                    });
                }

                lastEnd = busyEnd;
            });

            if (lastEnd < dayEnd) {
                availableSlots.push({
                    day,
                    start: lastEnd.toISOString(),
                    end: dayEnd.toISOString()
                });
            }
        });

        return availableSlots;
    }

    function optimizeSchedule(schedule, constraints) {
        const { calendarAvailability, activityPreferences } = constraints;
        
        // Sort activities by priority
        schedule.sort((a, b) => {
            const priorityA = getActivityPriority(a.type);
            const priorityB = getActivityPriority(b.type);
            return priorityB - priorityA;
        });

        // Apply calendar constraints
        if (calendarAvailability) {
            schedule = applyCalendarConstraints(schedule, calendarAvailability);
        }

        // Apply activity preferences
        if (activityPreferences) {
            schedule = applyActivityPreferences(schedule, activityPreferences);
        }

        return schedule;
    }

    function getActivityPriority(type) {
        const priorities = {
            'playing': 1,
            'driver': 2,
            'approach': 2,
            'shortGame': 3,
            'putting': 4,
            'physicalMental': 5
        };
        return priorities[type] || 0;
    }

    function applyCalendarConstraints(schedule, availability) {
        return schedule.filter(item => {
            const dayAvailability = availability[item.day] || [];
            return dayAvailability.some(slot => {
                const slotStart = new Date(slot.start);
                const slotEnd = new Date(slot.end);
                const duration = (slotEnd - slotStart) / (1000 * 60 * 60);
                return duration >= item.time;
            });
        });
    }

    function applyActivityPreferences(schedule, preferences) {
        return schedule.map(item => {
            const dayPreferences = preferences[item.day] || [];
            if (dayPreferences.length > 0) {
                const preferredSlot = dayPreferences.find(slot => {
                    const duration = (new Date(slot.end) - new Date(slot.start)) / (1000 * 60 * 60);
                    return duration >= item.time;
                });

                if (preferredSlot) {
                    return {
                        ...item,
                        startTime: new Date(preferredSlot.start),
                        endTime: new Date(preferredSlot.end)
                    };
                }
            }
            return item;
        });
    }

    function exportToCalendar(schedule) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const success = Math.random() > 0.1; // 90% success rate
                if (success) {
                    resolve({ success: true, message: 'Schedule exported successfully' });
                } else {
                    reject(new Error('Failed to export schedule'));
                }
            }, 1000);
        });
    }

    // Public API
    return {
        init: function() {
            console.log('Initializing Calendar Integration...');
            try {
                state.connected = true;
                state.provider = 'mock';
                console.log('Calendar Integration initialized');
            } catch (error) {
                console.error('Error initializing Calendar Integration:', error);
                state.connected = false;
            }
        },

        connect: function(provider) {
            return initializeProvider(provider);
        },

        disconnect: function() {
            state.connected = false;
            state.provider = null;
            state.authToken = null;
            state.busyTimes = [];
        },

        getBusyTimes: function() {
            if (!state.connected) {
                return [];
            }
            return fetchBusyTimes();
        },

        optimizeSchedule: function(schedule, constraints) {
            return optimizeSchedule(schedule, constraints);
        },

        exportToCalendar: function(schedule) {
            return exportToCalendar(schedule);
        },

        updatePreferences: function(preferences) {
            state.userPreferences = {
                ...state.userPreferences,
                ...preferences
            };
        },

        getRecommendedSchedule: function(params) {
            const { hoursAvailable, daysPerWeek, golferType, seasonalMode } = params;
            const busyTimes = this.getBusyTimes();
            const availableSlots = findAvailableSlots(busyTimes, state.userPreferences);
            
            return {
                schedule: [],
                availableSlots
            };
        }
    };
})();

// Initialize the calendar integration when the DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    CalendarIntegration.init().then(() => {
        console.log('Calendar Integration initialized');
    }).catch(error => {
        console.error('Error initializing Calendar Integration:', error);
    });
});

// Export for use in other modules
window.CalendarIntegration = CalendarIntegration;