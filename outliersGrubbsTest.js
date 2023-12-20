const jStat = require('jstat');

function outliersGrubbsTest(dataArray, label, measure, alpha = 0.05, testType = 'two-sided') {
  
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
  if (typeof alpha !== 'number' || alpha <= 0 || alpha >= 1) {
    throw new Error('The fourth parameter (alpha) requires a number between 0 and 1.');
  }
  const validTestTypes = ['two-sided', 'left-sided', 'right-sided'];
  if (!validTestTypes.includes(testType)) {
    throw new Error("The fifth parameter requires 'two-sided', 'left-sided', or 'right-sided.'"); 
  }

  // Get sample mean and standard deviation
  const mean = jStat.mean(dataArray.map(dataPoint => dataPoint[measure]));
  const stdD = jStat.stdev(dataArray.map(dataPoint => dataPoint[measure]), true);
   
  // Get most extreme value and its corresponding label 
  let extremeValue = undefined;
  let extremeLabel = undefined;

  for (const dataPoint of dataArray) {
    const labelValue = dataPoint[label];
    const measureValue = dataPoint[measure];
    
    if (typeof measureValue !== 'number') {
      throw new Error('Measure values must be numbers.');
    }
    if (typeof labelValue !== 'string') {
      throw new Error('Label values must be strings.');
    }

    // Calculate the deviation
    const deviation = Math.abs((measureValue - mean) / stdD);

    // Implement logic based on the testType  
    switch (testType) {
      case 'two-sided':
        if (!extremeValue || deviation > Math.abs((extremeValue - mean) / stdD)) {
          extremeValue = measureValue;
          extremeLabel = labelValue;
        }
        break;
      case 'left-sided':
        if (!extremeValue || measureValue < extremeValue) {
          extremeValue = measureValue;
          extremeLabel = labelValue;
        }
        break;
      case 'right-sided':
        if (!extremeValue || measureValue > extremeValue) {
          extremeValue = measureValue;
          extremeLabel = labelValue;
        }
        break;
    }
  }
  
  // Calculate Grubbs' statistic (G-score) for extreme value
  const gScore = Math.abs((extremeValue - mean) / stdD);

  // Calculate degrees of freedom (df) for dataArray
  const df = dataArray.length - 2;

  // Calculate critical value from the t-distribution
  let tCriticalValue;

  switch (testType) {   
    case 'two-sided':
      // For a two-sided test, use alpha/2 for each tail  
      tCriticalValue = jStat.studentt.inv(1 - alpha / 2, df);
      break;
    case 'left-sided':
      // For a left-sided test, use alpha for the left tail
      tCriticalValue = jStat.studentt.inv(alpha, df);
      break;
    case 'right-sided':
      // For a right-sided test, use alpha for the right tail
      tCriticalValue = jStat.studentt.inv(1 - alpha, df);
      break;
  }

  // Compare G-score with critical value
  const isOutlier = Math.abs(gScore) > Math.abs(tCriticalValue);

  // Construct the result object 
  let result;
  if (isOutlier) {
    result = {
      testType,
      isOutlier,
      outlierValue: extremeValue,
      outlierLabel: extremeLabel,
      mean: parseFloat(mean.toFixed(2)), 
      stdDev: parseFloat(stdD.toFixed(2)) 
    };
  } else {
    result = {
      testType,
      isOutlier
    };
  }

  return result;  
}

// Test output
const testData = [
  { month: "Jan", orders: 2, sales: 2200 },
  { month: "Feb", orders: 4, sales: 3700 }, 
  { month: "Mar", orders: 6, sales: 5900 },
  { month: "Apr", orders: 8, sales: 8300 },
  { month: "May", orders: 7, sales: 6800 },
  { month: "Jun", orders: 100, sales: 9400 },
  { month: "Jul", orders: 5, sales: 5100 },
  { month: "Aug", orders: 9, sales: 9800 },
  { month: "Sep", orders: 5, sales: 5200 }, 
  { month: "Oct", orders: 4, sales: 4000 },
  { month: "Nov", orders: 3, sales: 3200 },
  { month: "Dec", orders: 9, sales: 9200 }  
];

const result1 = outliersGrubbsTest(testData, 'month', 'orders', 0.05, 'tit-sided');
const result2 = outliersGrubbsTest(testData, 'month', 'orders', 0.05, 'left-sided');
const result3 = outliersGrubbsTest(testData, 'month', 'orders', 0.05, 'right-sided');

console.log(result1); 
console.log(result2);
console.log(result3);