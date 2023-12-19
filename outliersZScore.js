const mathjs = require('mathjs');

function outliersZScore(dataArray, label, measure, zThreshold = 2, isSample = false) {
  
  // Input validation checks
  if (!Array.isArray(dataArray) || dataArray.length === 0 || typeof dataArray[0] !== 'object') {
    throw new Error('The first parameter requires an array of objects.');
  }
  if (typeof label !== 'string') {
    throw new Error('The second parameter requires a string.');
  }
  if (typeof measure !== 'string') {
    throw new Error('The third parameter requires a string.');
  }
  if (typeof zThreshold !== 'number' || isNaN(zThreshold)) {
    throw new Error('The fourth parameter requires a number.');
  }
  if (typeof isSample !== 'boolean') {
    throw new Error('The fifth parameter requires a boolean.');
  } 

  // Create an array of values for the specified measure
  const measureArray = dataArray.map(data => data[measure]);

  // Calculate mean for measure values
  const mean = mathjs.mean(measureArray);

  // Calculate stdDev (sample or population) for measure values
  const stdDev = isSample ? mathjs.std(measureArray) : mathjs.std(measureArray, 'uncorrected');

  // Filter the input data to leave the outlier objects only
  const outliersArray = dataArray.filter(data => {
    const value = data[measure];
    const zScore = Math.abs((value - mean) / stdDev);
    return zScore > zThreshold;
  });

  // Map the filtered data to an array of results objects
  const outliers = outliersArray.map(data => {
    const value = data[measure];
    const zScore = parseFloat(((value - mean) / stdDev).toFixed(2));
    const meanFormatted = parseFloat(mean.toFixed(2)); 
    const stdDevFormatted = parseFloat(stdDev.toFixed(2)); 
    const type = value > mean ? 'high' : 'low';

    return {
      label: data[label],
      value,
      type,
      zScore,
      zThreshold,
      stdDev: stdDevFormatted,
      mean: meanFormatted
    };
  });

  return outliers;
}

// Test output
const myData = [
  { month: "Jan", orders: 275, sales: 28500 },
  { month: "Feb", orders: 30, sales: 31200 },
  { month: "Mar", orders: 310, sales: 33100 },
  { month: "Apr", orders: 290, sales: 27700 },
  { month: "May", orders: 285, sales: 28300 },
  { month: "Jun", orders: 305, sales: 27700 },
  { month: "Jul", orders: 292, sales: 31300 },
  { month: "Aug", orders: 307, sales: 30400 },
  { month: "Sep", orders: 290, sales: 27800 },
  { month: "Oct", orders: 612, sales: 62700 },
  { month: "Nov", orders: 310, sales: 29600 },
  { month: "Dec", orders: 314, sales: 30200 }
];

const result1 = outliersZScore(myData, 'month', 'orders', 2, true);
const result2 = outliersZScore(myData, 'month', 'orders', 2, false);

console.log("sample", result1);
console.log("population", result2);

