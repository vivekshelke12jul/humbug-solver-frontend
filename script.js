
function drawGrid() {
    const rows = document.querySelector('#rows').value;
    const columns = document.querySelector('#columns').value;

    console.log("rows: ",rows)
    console.log("cols: ",columns)

    const trows = rows*2+1;
    const tcolumns = columns*2+1;
    
    const gridContainer = document.getElementById('gridContainer');
    console.log(trows, tcolumns)

    gridContainer.innerHTML = '';

    gridContainer.style.gridTemplateRows = `10px repeat(${rows}, 100px 10px)`; // Rows sized as a percentage
    gridContainer.style.gridTemplateColumns = `10px repeat(${columns}, 100px 10px)`; // Columns sized as a percentage
    
    // Define the color classes
    const tile_classes = ['empty_tile', 'snail_tile', 'star_tile', 'unreachable'];
    function change_tile(event) {
        const currentClass = event.target.classList[1]; // Assuming the first class is 'gridItem'

        const currentIndex = tile_classes.indexOf(currentClass);
        const nextIndex = (currentIndex + 1) % tile_classes.length; // Wrap around 
        
        event.target.classList.remove(currentClass);
        event.target.classList.add(tile_classes[nextIndex]);
    }

    function toggle_wall(event) {
        event.target.classList.toggle('passable');
        event.target.classList.toggle('wall');
    }

    // Create the grid items
    for (let i = 0; i < trows; i++) {
        for (let j = 0; j < tcolumns; j++) {
            const gridItem = document.createElement('div');
            gridItem.classList.add('gridItem');

            if(i%2 == 0 && j%2 == 0) {
                gridItem.style.visibility = 'hidden';
            }
            else if(i%2 == 1 && j%2 == 1){
                gridItem.addEventListener('click', change_tile);
                gridItem.classList.add('empty_tile')
            }
            else{
                gridItem.addEventListener('click', toggle_wall);
                gridItem.classList.add('passable')
            }
            gridContainer.appendChild(gridItem);
        }
    }
}

function extractJson() {

    //converting grid to json
    let mat = []

    const gridContainer = document.getElementById('gridContainer');
    const rows = document.querySelector('#rows').value;
    const columns = document.querySelector('#columns').value;
    
    console.log("rowsi: ",rows)
    console.log("colsi: ",columns)

    const trows = rows*2+1;
    const tcolumns = columns*2+1;

    let index = 0;
    for(let i=0; i<trows; i++){
        let row = []
        for(let j=0; j<tcolumns; j++){
            const cell = document.getElementById(`gridContainer`).children[index];
            console.log('cell: ', cell)
            if(cell.classList[1] === 'empty_tile'){
                row.push(' ')
            }else if(cell.classList[1] === 'snail_tile'){
                row.push('B')
            }else if(cell.classList[1] === 'star_tile'){
                row.push('*')
            }else if(cell.classList[1] === 'unreachable'){
                row.push('#')
            }
            else if(cell.classList[1] === 'wall'){
                row.push('#')
            }
            else{
                row.push(' ')
            }
            index++;
        }
        mat.push(row)
    }
    return mat;
}

async function makeRequestToServer(matrix) {
    const stateObject = {
        rows: matrix.length,
        columns: matrix[0].length,
        matrix: matrix
    };

    const jsonString = JSON.stringify(stateObject);
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
        return data;
      } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
      }
}
async function solve() {
    let matrix = extractJson();
    const data = await makeRequestToServer(matrix);
    console.log(data)
}