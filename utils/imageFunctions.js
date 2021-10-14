// function for going through the image blob

const mostCommonCharActer = (str) => {
  const charMap = {};
  let max = 0;
  let maxChar = '';
  for (const char of str) {
    charMap[char] = charMap[char] + 1 || 1;
  }
  for (const char in charMap) {
    // look at each char in charMap
    if (charMap[char] > max) {
      // if the value is greater than max
      max = charMap[char]; // update new max value
      maxChar = char; // set the max character
    }
  }
  return maxChar;
};
export {mostCommonCharActer};
