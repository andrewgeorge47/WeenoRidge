// Planning Algorithm Module
const PlanningAlgorithm = (function() {
    // Private state
    const state = {
        activityTypes: {
            playing: {
                priority: 1,
                minDuration: 2,
                maxDuration: 4,
                recoveryTime: 24 // hours
            },
            driver: {
                priority: 2,
                minDuration: 0.5,
                maxDuration: 1.5,
                recoveryTime: 12
            },
            approach: {
                priority: 2,
                minDuration: 0.5,
                maxDuration: 1.5,
                recoveryTime: 12
            },
            shortGame: {
                priority: 3,
                minDuration: 0.5,
                maxDuration: 1.5,
                recoveryTime: 6
            },
            putting: {
                priority: 4,
                minDuration: 0.5,
                maxDuration: 1.5,
                recoveryTime: 0
            },
            physicalMental: {
                priority: 5,
                minDuration: 0.5,
                maxDuration: 1.5,
                recoveryTime: 12
            }
        }
    };

    // Private methods
    function calculateOptimalSchedule(params) {
        // Validate input parameters
        if (!params) {
            throw new Error('No parameters provided to calculateOptimalSchedule');
        }

        const {
            hoursAvailable,
            daysPerWeek,
            golferType,
            seasonalMode,
            calendarAvailability,
            activityPreferences
        } = params;

        // Validate required parameters
        if (typeof hoursAvailable !== 'number' || hoursAvailable <= 0) {
            throw new Error(`Invalid hoursAvailable: ${hoursAvailable}. Must be a positive number.`);
        }

        if (typeof daysPerWeek !== 'number' || daysPerWeek < 1 || daysPerWeek > 7) {
            throw new Error(`Invalid daysPerWeek: ${daysPerWeek}. Must be between 1 and 7.`);
        }

        if (!['beginner', 'intermediate', 'advanced'].includes(golferType)) {
            throw new Error(`Invalid golferType: ${golferType}. Must be one of: beginner, intermediate, advanced`);
        }

        if (!['regular', 'off-season', 'peak-season'].includes(seasonalMode)) {
            throw new Error(`Invalid seasonalMode: ${seasonalMode}. Must be one of: regular, off-season, peak-season`);
        }

        console.log('Validating parameters:', {
            hoursAvailable,
            daysPerWeek,
            golferType,
            seasonalMode,
            hasCalendarAvailability: !!calendarAvailability,
            hasActivityPreferences: !!activityPreferences
        });

        // Calculate time allocations
        const allocations = calculateTimeAllocations(hoursAvailable, golferType, seasonalMode);
        console.log('Calculated allocations:', allocations);
        
        // Generate base schedule
        let schedule = generateBaseSchedule(allocations, daysPerWeek);
        console.log('Generated base schedule:', schedule);
        
        // Optimize schedule based on preferences and constraints
        schedule = optimizeSchedule(schedule, {
            calendarAvailability,
            activityPreferences,
            golferType,
            seasonalMode
        });
        console.log('Optimized schedule:', schedule);

        return {
            schedule,
            allocations
        };
    }

    function calculateTimeAllocations(totalHours, golferType, seasonalMode) {
        // Base percentages
        let percentages = {
            playing: 0.4,
            practice: 0.4,
            physicalMental: 0.2
        };

        // Adjust based on golfer type
        switch (golferType) {
            case 'beginner':
                percentages = {
                    playing: 0.3,
                    practice: 0.5,
                    physicalMental: 0.2
                };
                break;
            case 'intermediate':
                percentages = {
                    playing: 0.4,
                    practice: 0.4,
                    physicalMental: 0.2
                };
                break;
            case 'advanced':
                percentages = {
                    playing: 0.5,
                    practice: 0.3,
                    physicalMental: 0.2
                };
                break;
        }

        // Adjust based on seasonal mode
        if (seasonalMode === 'off-season') {
            percentages.practice += 0.1;
            percentages.playing -= 0.1;
        } else if (seasonalMode === 'peak-season') {
            percentages.playing += 0.1;
            percentages.practice -= 0.1;
        }

        // Calculate hours for each category
        const allocations = {
            playing: totalHours * percentages.playing,
            practice: totalHours * percentages.practice,
            physicalMental: totalHours * percentages.physicalMental
        };

        // Calculate practice breakdown
        const practiceBreakdown = calculatePracticeBreakdown(allocations.practice, golferType);

        return {
            allocations,
            percentages,
            practiceBreakdown
        };
    }

    function calculatePracticeBreakdown(practiceHours, golferType) {
        // Base percentages for practice activities
        let percentages = {
            driver: 0.25,
            approach: 0.25,
            shortGame: 0.25,
            putting: 0.25
        };

        // Adjust based on golfer type
        switch (golferType) {
            case 'beginner':
                percentages = {
                    driver: 0.2,
                    approach: 0.2,
                    shortGame: 0.3,
                    putting: 0.3
                };
                break;
            case 'intermediate':
                percentages = {
                    driver: 0.25,
                    approach: 0.25,
                    shortGame: 0.25,
                    putting: 0.25
                };
                break;
            case 'advanced':
                percentages = {
                    driver: 0.3,
                    approach: 0.3,
                    shortGame: 0.2,
                    putting: 0.2
                };
                break;
        }

        return {
            driver: practiceHours * percentages.driver,
            approach: practiceHours * percentages.approach,
            shortGame: practiceHours * percentages.shortGame,
            putting: practiceHours * percentages.putting
        };
    }

    function generateBaseSchedule(allocations, daysPerWeek) {
        const schedule = [];
        const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        
        // Distribute playing time
        const playingDays = Math.min(daysPerWeek, Math.ceil(allocations.allocations.playing / state.activityTypes.playing.minDuration));
        const playingHoursPerDay = allocations.allocations.playing / playingDays;
        
        for (let i = 0; i < playingDays; i++) {
            schedule.push({
                day: days[i],
                activity: 'Playing Round',
                type: 'playing',
                time: playingHoursPerDay
            });
        }

        // Distribute practice time
        const practiceBreakdown = allocations.practiceBreakdown;
        let currentDay = playingDays;

        Object.entries(practiceBreakdown).forEach(([type, hours]) => {
            const sessions = Math.ceil(hours / state.activityTypes[type].maxDuration);
            const hoursPerSession = hours / sessions;

            for (let i = 0; i < sessions; i++) {
                if (currentDay >= daysPerWeek) currentDay = 0;
                schedule.push({
                    day: days[currentDay],
                    activity: `${type.charAt(0).toUpperCase() + type.slice(1)} Practice`,
                    type: type,
                    time: hoursPerSession
                });
                currentDay++;
            }
        });

        // Distribute physical/mental training
        const physicalSessions = Math.ceil(allocations.allocations.physicalMental / state.activityTypes.physicalMental.maxDuration);
        const physicalHoursPerSession = allocations.allocations.physicalMental / physicalSessions;

        for (let i = 0; i < physicalSessions; i++) {
            if (currentDay >= daysPerWeek) currentDay = 0;
            schedule.push({
                day: days[currentDay],
                activity: 'Physical/Mental Training',
                type: 'physicalMental',
                time: physicalHoursPerSession
            });
            currentDay++;
        }

        return schedule;
    }

    function optimizeSchedule(schedule, constraints) {
        const {
            calendarAvailability,
            activityPreferences,
            golferType,
            seasonalMode
        } = constraints;

        // Sort activities by priority
        schedule.sort((a, b) => {
            return state.activityTypes[a.type].priority - state.activityTypes[b.type].priority;
        });

        // Apply calendar constraints
        if (calendarAvailability) {
            schedule = applyCalendarConstraints(schedule, calendarAvailability);
        }

        // Apply activity preferences
        if (activityPreferences) {
            schedule = applyActivityPreferences(schedule, activityPreferences);
        }

        // Ensure recovery time between sessions
        schedule = ensureRecoveryTime(schedule);

        // Balance workload
        schedule = balanceWorkload(schedule, golferType, seasonalMode);

        return schedule;
    }

    function applyCalendarConstraints(schedule, availability) {
        return schedule.filter(item => {
            const dayAvailability = availability[item.day] || [];
            return dayAvailability.some(slot => {
                const slotStart = new Date(slot.start);
                const slotEnd = new Date(slot.end);
                const duration = (slotEnd - slotStart) / (1000 * 60 * 60); // Convert to hours
                return duration >= item.time;
            });
        });
    }

    function applyActivityPreferences(schedule, preferences) {
        return schedule.map(item => {
            // Find preferred time slot
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

    function ensureRecoveryTime(schedule) {
        const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        const optimizedSchedule = [];

        schedule.forEach(item => {
            const dayIndex = days.indexOf(item.day);
            const recoveryTime = state.activityTypes[item.type].recoveryTime;
            
            // Check if there's enough recovery time from previous activities
            const hasRecoveryTime = !optimizedSchedule.some(existingItem => {
                const existingDayIndex = days.indexOf(existingItem.day);
                const dayDifference = Math.abs(dayIndex - existingDayIndex);
                return dayDifference * 24 < recoveryTime;
            });

            if (hasRecoveryTime) {
                optimizedSchedule.push(item);
            }
        });

        return optimizedSchedule;
    }

    function balanceWorkload(schedule, golferType, seasonalMode) {
        const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        const dailyWorkload = {};

        // Calculate initial daily workload
        days.forEach(day => {
            dailyWorkload[day] = schedule
                .filter(item => item.day === day)
                .reduce((total, item) => total + item.time, 0);
        });

        // Adjust workload based on golfer type and seasonal mode
        const maxDailyHours = golferType === 'beginner' ? 3 : golferType === 'intermediate' ? 4 : 5;
        const minDailyHours = seasonalMode === 'off-season' ? 1 : 2;

        // Redistribute activities to balance workload
        schedule.forEach(item => {
            const currentWorkload = dailyWorkload[item.day];
            
            if (currentWorkload > maxDailyHours) {
                // Find a day with lower workload
                const targetDay = days.find(day => dailyWorkload[day] < maxDailyHours);
                if (targetDay) {
                    item.day = targetDay;
                    dailyWorkload[item.day] -= item.time;
                    dailyWorkload[targetDay] += item.time;
                }
            }
        });

        return schedule;
    }

    // Public API
    return {
        generateSchedule: function(params) {
            return calculateOptimalSchedule(params);
        },

        getActivityTypes: function() {
            return state.activityTypes;
        },

        // New: Get recommended practice drills
        getRecommendedDrills: function(activityType, golferType) {
            const drills = {
                driver: {
                    beginner: [
                        'Basic Grip and Stance',
                        'Swing Path Drills',
                        'Ball Position Practice'
                    ],
                    intermediate: [
                        'Power Generation Drills',
                        'Consistency Exercises',
                        'Shot Shaping Practice'
                    ],
                    advanced: [
                        'Advanced Shot Shaping',
                        'Pressure Situations',
                        'Course Management'
                    ]
                },
                approach: {
                    beginner: [
                        'Basic Iron Strikes',
                        'Distance Control',
                        'Ball Flight Basics'
                    ],
                    intermediate: [
                        'Shot Trajectory Control',
                        'Distance Precision',
                        'Wind Adjustment'
                    ],
                    advanced: [
                        'Advanced Shot Shaping',
                        'Pin Seeking',
                        'Trouble Shot Practice'
                    ]
                },
                shortGame: {
                    beginner: [
                        'Basic Chipping',
                        'Pitching Fundamentals',
                        'Bunker Basics'
                    ],
                    intermediate: [
                        'Advanced Chipping',
                        'Pitch Shot Control',
                        'Bunker Play'
                    ],
                    advanced: [
                        'Specialty Shots',
                        'Advanced Bunker Play',
                        'Pressure Situations'
                    ]
                },
                putting: {
                    beginner: [
                        'Basic Stroke',
                        'Distance Control',
                        'Aiming Practice'
                    ],
                    intermediate: [
                        'Advanced Stroke',
                        'Breaking Putts',
                        'Pressure Putting'
                    ],
                    advanced: [
                        'Advanced Green Reading',
                        'Long Range Putting',
                        'Competition Practice'
                    ]
                }
            };

            return drills[activityType]?.[golferType] || [];
        }
    };
})();

// Export for use in other modules
window.PlanningAlgorithm = PlanningAlgorithm; 