/**
 * Simulator Integration Extension for Golf Planner
 * This module adds functionality to integrate with a public simulator calendar
 * and generate Calendly booking links
 */

// Simulator Integration Module
const SimulatorIntegration = (function() {
    // Private state
    const state = {
        connected: false,
        status: 'disconnected',
        availability: [],
        bookings: [],
        simulatorStatus: {
            online: false,
            lastUpdate: null
        }
    };

    // Configuration
    const config = {
        simulatorActivities: ['driver', 'approach', 'shortGame', 'putting'],
        calendlyBaseUrl: 'https://calendly.com/nn-05/1-hour-tee-time',
        operatingHours: {
            start: 8, // 8 AM
            end: 20   // 8 PM
        }
    };

    // Private methods
    function initializeStatusBadge() {
        const existingBadge = document.getElementById('simulatorStatusBadge');
        if (existingBadge) {
            console.log('Simulator status badge already exists, skipping creation');
            return;
        }

        const statusContainer = document.getElementById('simulatorStatus');
        if (!statusContainer) {
            console.error('Could not find simulator status container');
            return;
        }

        const badge = document.createElement('span');
        badge.id = 'simulatorStatusBadge';
        badge.className = 'status-badge disconnected';
        badge.textContent = 'Disconnected';
        statusContainer.appendChild(badge);
    }

    function updateStatusBadge() {
        const badge = document.getElementById('simulatorStatusBadge');
        if (!badge) return;

        badge.className = `status-badge ${state.status}`;
        badge.textContent = state.status.charAt(0).toUpperCase() + state.status.slice(1);
    }

    function updateAvailabilityDisplay() {
        const container = document.getElementById('simulatorSlots');
        if (!container) return;

        if (state.availability.length === 0) {
            container.innerHTML = '<p>No available time slots</p>';
            return;
        }

        const slots = state.availability.map(slot => {
            const start = new Date(slot.start).toLocaleTimeString();
            const end = new Date(slot.end).toLocaleTimeString();
            return `<div class="time-slot">
                <span class="time">${start} - ${end}</span>
                <button class="book-button" data-start="${slot.start}" data-end="${slot.end}">
                    Book Now
                </button>
            </div>`;
        }).join('');

        container.innerHTML = slots;
    }

    function updateBookingsDisplay() {
        const container = document.getElementById('simulatorBookings');
        if (!container) return;

        if (state.bookings.length === 0) {
            container.innerHTML = '<p>No active bookings</p>';
            return;
        }

        const bookings = state.bookings.map(booking => {
            const start = new Date(booking.start).toLocaleString();
            const end = new Date(booking.end).toLocaleString();
            return `<div class="booking">
                <span class="time">${start} - ${end}</span>
                <button class="cancel-button" data-id="${booking.id}">
                    Cancel
                </button>
            </div>`;
        }).join('');

        container.innerHTML = bookings;
    }

    function isSimulatorAvailable(day, startHour, endHour) {
        // Check if simulator is within operating hours
        if (startHour < config.operatingHours.start || endHour > config.operatingHours.end) {
            return null;
        }

        // Check if simulator is already booked during this time
        const isBooked = state.bookings.some(booking => {
            const bookingStart = new Date(booking.start).getHours();
            const bookingEnd = new Date(booking.end).getHours();
            return (startHour >= bookingStart && startHour < bookingEnd) ||
                   (endHour > bookingStart && endHour <= bookingEnd);
        });

        if (isBooked) {
            return null;
        }

        // Find the next available slot
        const availableSlot = state.availability.find(slot => {
            const slotStart = new Date(slot.start).getHours();
            const slotEnd = new Date(slot.end).getHours();
            return (startHour >= slotStart && endHour <= slotEnd);
        });

        return availableSlot || null;
    }

    function generateCalendlyLink(date, startHour, duration) {
        const formattedDate = date.toISOString().split('T')[0];
        const formattedTime = `${Math.floor(startHour)}:${Math.round((startHour % 1) * 60)}`;
        return `${config.calendlyBaseUrl}?date=${formattedDate}&time=${formattedTime}&duration=${duration}`;
    }

    // Public API
    return {
        init: function() {
            console.log('Initializing Simulator Integration...');
            try {
                initializeStatusBadge();
                state.connected = true;
                state.status = 'connected';
                updateStatusBadge();
                updateAvailabilityDisplay();
                updateBookingsDisplay();
                console.log('Simulator Integration initialized');
            } catch (error) {
                console.error('Error initializing Simulator Integration:', error);
                state.connected = false;
                state.status = 'error';
                updateStatusBadge();
            }
        },

        getStatus: function() {
            return state.status;
        },

        getAvailability: function() {
            return state.availability;
        },

        getBookings: function() {
            return state.bookings;
        },

        isSimulatorAvailable: isSimulatorAvailable,
        generateCalendlyLink: generateCalendlyLink,

        bookSession: function(startTime, endTime) {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    const success = Math.random() > 0.1; // 90% success rate
                    if (success) {
                        const booking = {
                            id: Date.now(),
                            start: startTime,
                            end: endTime
                        };
                        state.bookings.push(booking);
                        updateBookingsDisplay();
                        resolve(booking);
                    } else {
                        reject(new Error('Failed to book session'));
                    }
                }, 1000);
            });
        },

        cancelBooking: function(bookingId) {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    const index = state.bookings.findIndex(b => b.id === bookingId);
                    if (index !== -1) {
                        state.bookings.splice(index, 1);
                        updateBookingsDisplay();
                        resolve(true);
                    } else {
                        reject(new Error('Booking not found'));
                    }
                }, 1000);
            });
        }
    };
})();

// Extend window.GolfPlanner namespace
window.GolfPlanner = window.GolfPlanner || {};

// Store the original updateWeeklySchedule function
const originalUpdateWeeklySchedule = window.GolfPlanner.updateWeeklySchedule || null;

// Enhanced updateWeeklySchedule function that adds booking links
window.GolfPlanner.updateWeeklySchedule = function(allocations, practiceAllocations) {
    // Call the original function if available
    if (typeof originalUpdateWeeklySchedule === 'function') {
        originalUpdateWeeklySchedule.call(this, allocations, practiceAllocations);
    }
    
    // Enhance the schedule blocks with booking links
    enhanceScheduleBlocksWithBookingLinks();
};

// Function to enhance the schedule blocks with booking links
function enhanceScheduleBlocksWithBookingLinks() {
    try {
        // Get all activity blocks
        const activityBlocks = document.querySelectorAll('.activity-block');
        
        activityBlocks.forEach(block => {
            // Only process blocks that represent simulator activities
            const blockClasses = block.className;
            const isSimulatorActivity = SimulatorIntegration.config.simulatorActivities.some(
                type => blockClasses.includes(type)
            );
            
            if (isSimulatorActivity) {
                // Check if it already has a booking link
                if (!block.querySelector('.booking-link')) {
                    // Get the time slot info if available
                    const timeSlot = block.querySelector('.activity-time-slot');
                    
                    if (timeSlot) {
                        // Extract time range from the text
                        const timeRange = timeSlot.textContent;
                        const [startTime, endTime] = timeRange.split('-');
                        
                        // Parse times to get startHour
                        const startParts = startTime.trim().match(/(\d+):(\d+)\s*([AP]M)/);
                        const endParts = endTime.trim().match(/(\d+):(\d+)\s*([AP]M)/);
                        
                        if (startParts && endParts) {
                            let startHours = parseInt(startParts[1]);
                            const startMinutes = parseInt(startParts[2]);
                            const startPeriod = startParts[3];
                            
                            let endHours = parseInt(endParts[1]);
                            const endMinutes = parseInt(endParts[2]);
                            const endPeriod = endParts[3];
                            
                            // Convert to 24 hour format
                            if (startPeriod === 'PM' && startHours < 12) startHours += 12;
                            if (startPeriod === 'AM' && startHours === 12) startHours = 0;
                            
                            if (endPeriod === 'PM' && endHours < 12) endHours += 12;
                            if (endPeriod === 'AM' && endHours === 12) endHours = 0;
                            
                            // Calculate decimal hours
                            const startHour = startHours + (startMinutes / 60);
                            const endHour = endHours + (endMinutes / 60);
                            
                            // Get the activity name and day
                            const activityName = block.querySelector('.activity-name').textContent;
                            const day = block.closest('.day-column').dataset.day || 
                                       getColumnDayFromIndex(Array.from(
                                           document.querySelectorAll('.day-column')
                                       ).indexOf(block.closest('.day-column')));
                            
                            // Check if simulator is available for this slot
                            const simulatorSlot = SimulatorIntegration.isSimulatorAvailable(day, startHour, endHour);
                            
                            // Create appropriate button based on availability
                            const bookButton = document.createElement('button');
                            bookButton.style.fontSize = '0.7rem';
                            
                            if (simulatorSlot) {
                                // Simulator is available - create booking button
                                bookButton.className = 'btn btn-sm btn-success mt-1 booking-link';
                                bookButton.textContent = 'Book Simulator';
                                
                                // Calculate date for the day
                                const today = new Date();
                                const dayIndex = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].indexOf(day);
                                const currentDay = today.getDay(); // 0 = Sunday, 1 = Monday, ...
                                const daysToAdd = (dayIndex + 1) % 7 - currentDay;
                                const daysUntilTargetDay = daysToAdd >= 0 ? daysToAdd : daysToAdd + 7;
                                const targetDate = new Date(today);
                                targetDate.setDate(today.getDate() + daysUntilTargetDay);
                                
                                // Use suggested start time if available, otherwise use the requested time
                                const bookingStartHour = simulatorSlot.suggestedStart || startHour;
                                const bookingHours = Math.floor(bookingStartHour);
                                const bookingMinutes = Math.round((bookingStartHour - bookingHours) * 60);
                                targetDate.setHours(bookingHours, bookingMinutes, 0, 0);
                                
                                // Calculate duration
                                const duration = endHour - startHour;
                                
                                // Generate Calendly link
                                const bookingLink = SimulatorIntegration.generateCalendlyLink(
                                    targetDate,
                                    bookingStartHour,
                                    duration
                                );
                                
                                // Set the link to the button
                                bookButton.onclick = function() {
                                    window.open(bookingLink, '_blank');
                                };
                            } else {
                                // Simulator is not available - create unavailable button
                                bookButton.className = 'btn btn-sm btn-outline-secondary mt-1 booking-link';
                                bookButton.textContent = 'Simulator Unavailable';
                                bookButton.disabled = true;
                                
                                // Add tooltip with more information
                                bookButton.title = 'The simulator is booked during this time slot. Try optimizing the schedule again or choose another time.';
                            }
                            
                            // Add button to the block
                            block.appendChild(bookButton);
                        }
                    } else {
                        // No specific time slot - create a generic "Check Availability" button
                        const checkButton = document.createElement('button');
                        checkButton.className = 'btn btn-sm btn-outline-light mt-1 booking-link';
                        checkButton.textContent = 'Check Simulator';
                        checkButton.style.fontSize = '0.7rem';
                        
                        // Generic booking link if no specific time slot
                        checkButton.onclick = function() {
                            window.open(SimulatorIntegration.config.calendlyBaseUrl, '_blank');
                        };
                        
                        // Add button to the block
                        block.appendChild(checkButton);
                    }
                }
            }
        });
    } catch (error) {
        console.error('Error enhancing schedule blocks with booking links:', error);
    }
}

// Helper function to get day name from column index
function getColumnDayFromIndex(index) {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    return days[index] || 'Monday';
}

// Modify the optimizeSchedule function to use the simulator integration
const originalOptimizeScheduleFunc = window.GolfPlanner.optimizeSchedule;

window.GolfPlanner.optimizeSchedule = function() {
    try {
        // First check if SimulatorIntegration is initialized
        if (!SimulatorIntegration.state.connected) {
            SimulatorIntegration.init();
        }
        
        // Check if we need to fetch simulator availability
        if (SimulatorIntegration.state.availability.length === 0) {
            SimulatorIntegration.fetchSimulatorAvailability();
        }
        
        // Call the original function to continue the process
        if (typeof originalOptimizeScheduleFunc === 'function') {
            originalOptimizeScheduleFunc.call(this);
        } else {
            console.warn('Original optimizeSchedule function not found');
        }
        
        // After a short delay, enhance the schedule blocks
        setTimeout(enhanceScheduleBlocksWithBookingLinks, 500);
    } catch (error) {
        console.error('Error in optimizeSchedule:', error);
    }
};

function addSimulatorBookingButtons() {
    console.log('Adding simulator booking buttons...');
    
    // Find all activity blocks
    const activityBlocks = document.querySelectorAll('.activity-block');
    
    // Loop through each activity block
    activityBlocks.forEach(block => {
        // Get the activity name directly from the block's text content
        const activityText = block.textContent || '';
        
        // Check if this is a simulator activity by text content
        if (activityText.includes('Driver') || 
            activityText.includes('Approach') || 
            activityText.includes('Short Game') || 
            activityText.includes('Putting')) {
            
            // Only add button if one doesn't already exist
            if (!block.querySelector('.booking-link')) {
                // Create booking button
                const bookButton = document.createElement('button');
                bookButton.className = 'btn btn-sm btn-success mt-1 booking-link';
                bookButton.textContent = 'Book Simulator';
                bookButton.style.fontSize = '0.7rem';
                bookButton.style.width = '100%';
                
                // Add generic Calendly link
                bookButton.onclick = function(e) {
                    e.stopPropagation();
                    window.open('https://calendly.com/nn-05/1-hour-tee-time', '_blank');
                };
                
                // Add button to the block
                block.appendChild(bookButton);
            }
        }
    });
}

// Single initialization point
document.addEventListener('DOMContentLoaded', function() {
    // Initialize with a delay to ensure everything is loaded
    setTimeout(function() {
        // Only initialize if not already initialized
        if (!SimulatorIntegration.state.connected) {
            console.log('Initializing simulator integration...');
            SimulatorIntegration.init();
            
            // Add booking buttons after initialization
            setTimeout(addSimulatorBookingButtons, 1000);
        }
    }, 1000);
});

// Export for use in other modules
window.SimulatorIntegration = SimulatorIntegration;