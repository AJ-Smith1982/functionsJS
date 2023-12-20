const mathjs = require('mathjs');

function outliersTukeyFence(dataArray, label, measure, multiplier = 1.5) {
  
  // Input validation checks
  if (!Array.isArray(dataArray) || dataArray.length === 0 || typeof dataArray[0] !== 'object') {
    throw new Error('The first parameter (dataArray) requires an array of objects.');
  }
  if (typeof label !== 'string') {
    throw new Error('The second parameter (label) requires a string.');
  }
  if (typeof measure !== 'string') {
    throw new Error('The third parameter (measure) requires a string.');
  }
  if (typeof multiplier !== 'number') {
    throw new Error('The fourth parameter (multiplier) requires a number.');
  }

  // Extract the array of values for the specified measure
  const inputArray = dataArray.map(data => data[measure]);

  // Calculate Q1, Q3, and IQR for array
  const Q1 = mathjs.quantileSeq(inputArray, 0.25);
  const Q3 = mathjs.quantileSeq(inputArray, 0.75);
  const IQR = Q3 - Q1;

  // Calculate upper and lower fences for threshold analysis
  const lowerFence = Q1 - (multiplier * IQR);
  const upperFence = Q3 + (multiplier * IQR);

  // Filter the input data to leave the outlier objects only
  const outliersArray = dataArray.filter(data => {
    const value = data[measure];
    return value > upperFence || value < lowerFence;
  });

  // Map the filtered data to an array of results objects
  const outliers = outliersArray.map(data => {
    const value = data[measure];
    const type = value > upperFence ? 'high' : 'low';
    const lowerFenceFormatted = parseFloat(lowerFence.toFixed(2));
    const upperFenceFormatted = parseFloat(upperFence.toFixed(2));

    return {
      label: data[label],
      value,
      type,
      lowerFence: lowerFenceFormatted,
      upperFence: upperFenceFormatted,
      multiplier
    };
  });

  return outliers;
}

// Test output
const myData = [
  { month: 'Jan', orders: 313, sales: 32500 },
  { month: 'Feb', orders: 30, sales: 31200 },
  { month: 'Mar', orders: 315, sales: 33100 },
  { month: 'Apr', orders: 290, sales: 27500 },
  { month: 'May', orders: 293, sales: 28300 },
  { month: 'Jun', orders: 305, sales: 27700 },
  { month: 'Jul', orders: 354, sales: 38100 },
  { month: 'Aug', orders: 307, sales: 30400 },
  { month: 'Sep', orders: 290, sales: 27800 },
  { month: 'Oct', orders: 544, sales: 59700 },
  { month: 'Nov', orders: 288, sales: 29600 },
  { month: 'Dec', orders: 314, sales: 30200 }
];

const result1 = outliersTukeyFence(myData, 'month', 'orders', undefined);
const result2 = outliersTukeyFence(myData, 'month', 'orders', 2);
const result3 = outliersTukeyFence(myData, 'month', 'orders', 3);

console.log(result1);
console.log(result2);
console.log(result3);
