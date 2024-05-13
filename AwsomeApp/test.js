  // Import the fetchStoredValues function from fetchValues.js
  const fetchStoredValues = require('./fetchData');

  // Define the interval duration in milliseconds (e.g., 5 seconds)
  const intervalDuration = 500;

  // Function to fetch and print stored values in a loop
  async function fetchAndPrintStoredValues() {
    try {
      // Call the fetchStoredValues function and handle the returned values
      const [lat, long] = await fetchStoredValues();
      // Print the returned values
      console.log(parseFloat(lat));
      console.log(parseFloat(long));
    } catch (error) {
      console.error('Error fetching stored values:', error);
    }
  }

  // Start fetching and printing stored values in a loop
  setInterval(fetchAndPrintStoredValues, intervalDuration);