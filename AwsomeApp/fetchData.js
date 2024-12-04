const cheerio = require('cheerio');

// Define the URL of the HTML page you want to read
const url = 'https://protrack.pagekite.me';

// Function to fetch stored values and return them as an array
async function fetchStoredValues() {
  try {
    const response = await fetch(url); // Make an HTTP GET request using fetch
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
      
    const html = await response.text(); // Get the response body as text
    const $ = cheerio.load(html); // Load the HTML content into Cheerio

    // Extract the desired elements and their text content
    const storedValues = $('h2:contains("Stored Value 1:")').nextAll('p').toArray().map(element => $(element).text());

    // Return the extracted content
    return storedValues;
  } catch (error) {
    // If an error occurs during the HTTP request or parsing, throw the error
    throw error;
  }
}

module.exports = fetchStoredValues;
