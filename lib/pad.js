module.exports = function(number, length) {
  let numbers = (number + '').split('')

  while (numbers.length < length)
      numbers.unshift('0')

  return numbers.join('');
}
