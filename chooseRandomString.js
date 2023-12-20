function chooseRandomString(...options) {
    // Validate that at least one option is provided
    if (options.length === 0) {
      throw new Error('Please provide at least one option.');
    }
  
    // Initialize an array to hold selectable values
    const selectableValues = [];
  
    // Loop through each option and add values to the selectable array
    for (const option of options) {
      if (typeof option === 'string') {
  
        // If it's a string, add it directly to the selectable array
        selectableValues.push(option);
      } else if (Array.isArray(option)) {
  
        // If it's an array, add its values to the selectable array
        for (const value of option) {
          if (typeof value === 'string') {
            selectableValues.push(value);
          } 
          // If an invalid type is provided, throw an error
          else {
            throw new Error('Options must be strings or arrays of strings.');
          }
        }
      } else {
        // If an invalid type is provided, throw an error
        throw new Error('Options must be strings or arrays of strings.');
      }
    }
  
    // Randomly select an option
    const randomIndex = Math.floor(Math.random() * selectableValues.length);
    return selectableValues[randomIndex];
  }
  
  // Test output
  const array1 = ['Option 2', 'Option 3', 'Option 4']
  const array2 = ['Option 5', 'Option 6', 'Option 7']
  try {
    const result = chooseRandomString('Option 1', array1, 'Option 4', array2);
    console.log(result);
  } catch (error) {
    console.error(error.message);
  }
  