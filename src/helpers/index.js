export const convertSecToHMS = sec => {
  var min = Math.floor(sec / 60), hour = Math.floor(min / 60)

  var minTime = (min % 60).toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false })
  var secTime = (sec % 60).toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false })

  return `${hour}:${minTime}:${secTime}`
}