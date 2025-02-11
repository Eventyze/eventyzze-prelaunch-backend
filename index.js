function mainTime(){
const selectedTime = "23:00";
const userTimezoneOffset = -new Date().getTimezoneOffset() / 60; // e.g., +1 for GMT+1

// Convert selected time to a Date object
const [hours, minutes] = selectedTime.split(":").map(Number);
const localTime = new Date();
localTime.setHours(hours, minutes, 0, 0);

// Convert local time to UTC
const utcTime = new Date(localTime.getTime() - userTimezoneOffset * 60 * 60 * 1000);

console.log("UTC Time:", utcTime.toISOString()); // Store this in your database

return utcTime
}


function userTime (){
    const time = mainTime()
const userViewingTimezoneOffset = -new Date().getTimezoneOffset() / 60; // e.g., +3 for GMT+3

// Convert UTC to the viewer's timezone
const userTime = new Date(time.getTime() + userViewingTimezoneOffset * 60 * 60 * 1000);

console.log("User's Local Time:", userTime.toLocaleTimeString());
}

mainTime()
userTime()
