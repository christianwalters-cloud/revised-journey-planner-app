export function calculateLockStatuses({
    morningTime,
    nightTime,
    currentTime,

    // 🚀 Updated: Separated morning trackers for clear validation bounds
    morningGratitudeCompleted, 
    morningVerseCompleted,      
    todoCompleted,
    nightCompleted
}){
    const status = { morning: "locked", todo: "locked", night: "locked" };

    const [mHour, mMin] = (morningTime || "09:00").split(":").map(Number);
    const [nHour, nMin] = (nightTime || "18:00").split(":").map(Number);

    const currentMins = currentTime.hour * 60 + currentTime.minute;
    const currentMorningMins = mHour * 60 + mMin;
    const currentNightMins = nHour * 60 + nMin;

    // 1. Morning Routine Calculations
    // 🚀 Check if BOTH individual split phases are marked as done
    const morningFullyDone = morningGratitudeCompleted && morningVerseCompleted;

    if (morningFullyDone) {
        status.morning = "done";
    } else if (currentMins >= currentMorningMins) {
        status.morning = "unlocked";
    }

    // 2. To Do List Calculations
    if (todoCompleted) {
        status.todo = "done";
    } else if (morningFullyDone) { 
        // 🚀 Fix: The list only unlocks after completing the final verse step
        status.todo = "unlocked";
    }

    // 3. Night Routine Calculations
    if (nightCompleted) {
        status.night = "done";
    } else if (currentMins >= currentNightMins || todoCompleted) {
        status.night = "unlocked";
    }

    return status;
}
