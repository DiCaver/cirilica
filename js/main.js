let BGcyrillicAlphabet;
let BGlatinAlphabet;
let BGlatinENAlphabet;

// Define a function to process the data
function processData(data) {
  BGcyrillicAlphabet = data.cyrillic;
  BGlatinAlphabet = data.latin;
  BGlatinENAlphabet = data.latinEN;

  // Now you can use these arrays
  console.log(BGcyrillicAlphabet);
  console.log(BGlatinAlphabet);
  console.log(BGlatinENAlphabet);

  // Call another function and pass the data to it
  anotherFunction(BGcyrillicAlphabet);
}

// Use the fetch API to load the JSON file
fetch("JSON/bulgarian.json")
  .then((response) => response.json())
  .then((data) => {
    // Call the processData function with the fetched data
    processData(data);
  })
  .catch((error) => {
    console.error("Error loading JSON:", error);
  });

// Define another function that uses the data
function anotherFunction(alphabet) {
  // You can use BGcyrillicAlphabet (as "alphabet" here) in this function
  console.log("Using alphabet in another function:", alphabet);
}
