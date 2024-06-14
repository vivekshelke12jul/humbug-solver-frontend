import fetch from 'node-fetch';

const mat0 = [
  ['B', ' ', '#'],
  ['#', '*', '#'],
  ['*', 'B', '*'],
  ['#', 'B', '#']
]
const mat = [
  ['B', 'B', 'B'],
  ['B', '#', '*'],
  ['*', '*', '*']
]

const mat2 = [
  ['B', '*'],
  [' ', ' ']
]


const used = mat0
// Function to get an object from the user and perform the required operations
async function sendObjectAsJsonPostRequest() {
  
  const userObject = {
    rows: used.length,
    columns: used[0].length,
    matrix: used
  };

  // Convert object to JSON string
  const jsonString = JSON.stringify(userObject);

  try {
    // Create the POST request to the /get-solution endpoint
    const response = await fetch('http://localhost:8080/get-solution', {
      method: 'POST', // Use POST method to send data in the request body
      headers: {
        'Content-Type': 'application/json'
      },
      body: jsonString // Attach the JSON string as the request body
    });

    if (!response.ok) {
      throw new Error(`Network response was not ok, status: ${response.status}`);
    }

    const data = await response.json(); // Assuming the server returns a JSON response

    

    // console.log(data)

    // let actions = data['actions']
    // let states = data['states']
    // states.forEach(element => {
    //   console.log(element)
    // })
    // actions.forEach(element => {
    //   console.log(element)
    // });
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
  }
}

// Call the function to execute the above steps
sendObjectAsJsonPostRequest();
