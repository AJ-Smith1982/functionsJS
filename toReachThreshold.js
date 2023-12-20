function toReachThreshold(dataArray, targetThreshold) {
    
    // Input validation checks
    if (!Array.isArray(dataArray) || dataArray.length === 0) {
      throw new Error('dataArray requires an array containing at least one number.');
    }
    if (!dataArray.every(value => typeof value === 'number')) {
      throw new Error('Each element in dataArray must be a number.');
    }
    if (typeof targetThreshold !== 'number' || isNaN(targetThreshold)) {
      throw new Error('targetThreshold must be a number.');
    }
  
    // Define reassignable variables for loop
    let currentSum = 0;
    let i = 0;

    // When targetThreshold is positive
    if (targetThreshold >= 0) {
      do {
        currentSum += dataArray[i];
        i++;
      } while (i < dataArray.length && currentSum < targetThreshold);
  
      return currentSum >= targetThreshold
        ? i
        : -1;
    }
    // When targetThreshold is negative
    else {
      do {
        currentSum += dataArray[i];
        i++;
      } while (i < dataArray.length && currentSum > targetThreshold);
  
      return currentSum <= targetThreshold
        ? i
        : -1;
    }
  }
  
  // Test output
  const dataArray1 = [1, 2, 3, 4, 5];
  const targetThreshold1 = 0;
  const result1 = toReachThreshold(dataArray1, targetThreshold1);
  console.log(result1); // Expected output: 1
  
  const dataArray2 = [1, 2, 3, 4, 5];
  const targetThreshold2 = 5;
  const result2 = toReachThreshold(dataArray2, targetThreshold2);
  console.log(result2); // Expected output: 3
  
  const dataArray3 = [1, -2, -3, 4, 5];
  const targetThreshold3 = -3;
  const result3 = toReachThreshold(dataArray3, targetThreshold3);
  console.log(result3); // Expected output: 3
  
  const dataArray4 = [1, -2, -3, 4, 5];
  const targetThreshold4 = -5;
  const result4 = toReachThreshold(dataArray4, targetThreshold4);
  console.log(result4); // Expected output: -1
  
  