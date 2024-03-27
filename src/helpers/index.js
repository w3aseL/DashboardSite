export const convertSecToHMS = (sec, showLetters=false, showDays=false) => {
  var min = Math.floor(sec / 60), hour = Math.floor(min / 60), days = Math.floor(hour / 24)

  var hourTime = showDays ? (hour % 24).toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false }) : hour
  var minTime = (min % 60).toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false })
  var secTime = (sec % 60).toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false })

  return !showLetters ? `${showDays ? days : ''}${hourTime}:${minTime}:${secTime}` : `${showDays ? `${days}d ` : ''}${hourTime}h ${minTime}m ${secTime}s`
}