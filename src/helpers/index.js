export const convertSecToHMS = (sec, showLetters=false) => {
  var min = Math.floor(sec / 60), hour = Math.floor(min / 60)

  var minTime = (min % 60).toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false })
  var secTime = (sec % 60).toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false })

  return !showLetters ? `${hour}:${minTime}:${secTime}` : `${hour}h ${minTime}m ${secTime}s`
}