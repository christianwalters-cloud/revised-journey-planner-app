export function calculateLockStatuses({
    morningTime,
    nightTime,
    currentTime,

    morningCompleted,
    morningVerseCompleted,
    todoCompleted,
    nightCompleted
}){
    const status ={morning: "locked", todo : "locked", night:"locked"};

    const [mHour, mMin] = (morningTime || "09:00").split(":").map(Number);
    const [nHour, nMin] = (nightTime || "18:00").split(":").map(Number);

    const currentMins = currentTime.hour * 60 + currentTime.minute;
    const currentMorningMins = mHour * 60 + mMin;
    const currentNightMins = nHour *60 + nMin;

    //Morning Routine
    if (morningCompleted) status.morning = "done";
    else if(currentMins >= currentMorningMins) status.morning = "unlocked";

    //To Do List
    if (todoCompleted) status.todo = "done";
    else if(morningVerseCompleted) status.todo = "unlocked";


    //Night Routine
    if (nightCompleted) status.night ="done";
    else if(currentMins >= currentNightMins || todoCompleted) status.night = "unlocked";

    return status;
}