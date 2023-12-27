// Import the mathjs library
const mathjs = require('mathjs');

function groupArrays(outerArray, groupingIndex, aggregationIndex, aggregateFunc = 'sum') {
    
    // Input validation checks 

    if (!Array.isArray(outerArray) || !outerArray.every(innerArray => Array.isArray(innerArray) && innerArray.length === outerArray[0].length)) {
        throw new Error('outerArray must be an array of arrays, and all inner arrays must be of equal length.');
    }
    if (typeof groupingIndex !== 'number' || groupingIndex < 0 || groupingIndex >= outerArray[0].length || !outerArray.every(innerArray => typeof innerArray[groupingIndex] === 'string')) {
        throw new Error('groupingIndex must be a valid index number for the inner arrays, and all values at that index position must be strings.');
    }
    if (typeof aggregationIndex !== 'number' || aggregationIndex < 0 || aggregationIndex >= outerArray[0].length || !outerArray.every(innerArray => typeof innerArray[aggregationIndex] === 'number')) {
        throw new Error('aggregationIndex must be a valid index number for the inner arrays, and all values at that index position must be numbers.');
    }
    if (typeof aggregateFunc !== 'string') {
        throw new Error('aggregateFunc must be a string.');
    }
    
    // Get unique grouping values
    const uniqueGroupValues = [...new Set(outerArray.map(item => item[groupingIndex]))];
    
    // Create array to hold results
    const results = [];
    
    // Define aggregation functions with corresponding string identifiers
    const aggregationFunctions = {
        'sum': values => mathjs.sum(values),
        'max': values => mathjs.max(values),
        'min': values => mathjs.min(values),
        'mean': values => mathjs.mean(values),
        'count': values => values.length
    };

    // Check if the provided aggregateFunc is a string and exists in predefined functions 
    if (typeof aggregateFunc === 'string' && aggregationFunctions.hasOwnProperty(aggregateFunc)) {
        // If valid, assign the corresponding aggregation function to aggregateFunc
        aggregateFunc = aggregationFunctions[aggregateFunc];
    } else {
        // Throw an error if aggregateFunc is not recognized
        throw new Error(`Unrecognized aggregate function: ${aggregateFunc}. Please use one of the following: 'sum', 'max', 'min', 'mean', 'count'.`);
    }
    
    // Iterate through each unique group value
    uniqueGroupValues.forEach(groupValue => {
      
        // Get data for the current group value
        const groupData = outerArray.filter(item => item[groupingIndex] === groupValue);

        // Use the provided aggregation function to calculate result
        const aggregatedValue = aggregateFunc(groupData.map(item => item[aggregationIndex]));

    // Create and push an array with group value and aggregated value
        results.push([groupValue, aggregatedValue]);
    });
    
    // Sort results by aggregated value (descending)
    results.sort((a, b) => b[1] - a[1]);
    
    return results;
}

// Test output
const myData = [  
    ["A001", "Atlanta", "Food", 500000, 30000],
    ["A002", "Atlanta", "Food", 470000, 30000],
    ["C001", "Chicago", "Drug", 460000, 26000],
    ["C002", "Chicago", "Food", 550000, 33000],
    ["A003", "Atlanta", "Food", 680000, 48000],
    ["H001", "Houston", "Drug", 660000, 48000],
    ["A004", "Atlanta", "Drug", 240000, 17000],
    ["C003", "Chicago", "Drug", 400000, 25000],
    ["H002", "Houston", "Food", 420000, 26000],
    ["C004", "Chicago", "Food", 610000, 37000],
    ["A005", "Atlanta", "Drug", 200000, 13000],
    ["H003", "Houston", "Drug", 700000, 49000]
];

// Test outputs

try {
    groupArrays(myData, 1, 4, 'sum');
} catch (error) {
    console.error(error.message);
}

// Test with default 'sum' aggregation
const resultDefault = groupArrays(myData, 1, 4);
console.log("Default aggregation:", resultDefault);

// Test with user-provided 'sum' aggregation
const resultSum = groupArrays(myData, 1, 4, 'sum');
console.log("Sum aggregation:", resultSum);

// Test with user-provided 'max' aggregation
const resultMax = groupArrays(myData, 1, 4, 'max');
console.log("Max aggregation:", resultMax);

// Test with user-provided 'min' aggregation
const resultMin = groupArrays(myData, 1, 4, 'min');
console.log("Min aggregation:", resultMin);

// Test with user-provided 'mean' aggregation
const resultMean = groupArrays(myData, 1, 4, 'mean');
console.log("Mean Aggregation:", resultMean);

// Test with user-provided 'count' aggregation
const resultCount = groupArrays(myData, 1, 4, 'count');
console.log("Count Aggregation:", resultCount);
