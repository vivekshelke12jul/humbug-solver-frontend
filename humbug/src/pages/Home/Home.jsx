import { useEffect, useState } from 'react';
import Grid from '../../component/Grid/Grid';
import './Home.css';

const Home = () => {
  const [grid, setGrid] = useState([]);
  const [rows, setRows] = useState(0);
  const [columns, setColumns] = useState(0);

  

  const drawGrid = () => {
    const rows = document.querySelector('#rows').value;
    const columns = document.querySelector('#columns').value;

    setRows(rows);
    setColumns(columns);

    const trows = rows * 2 + 1;
    const tcolumns = columns * 2 + 1;

    const gridContainer = document.getElementById('gridContainer');

    gridContainer.innerHTML = '';

    gridContainer.style.gridTemplateRows = `10px repeat(${rows}, 100px 10px)`;
    gridContainer.style.gridTemplateColumns = `10px repeat(${columns}, 100px 10px)`;

    const tile_classes = ['empty_tile', 'snail_tile', 'star_tile', 'unreachable'];

    function change_tile(event) {
      const currentClass = event.target.classList[1];
      const currentIndex = tile_classes.indexOf(currentClass);
      const nextIndex = (currentIndex + 1) % tile_classes.length;
      event.target.classList.remove(currentClass);
      event.target.classList.add(tile_classes[nextIndex]);
    }

    function toggle_wall(event) {
      event.target.classList.toggle('passable');
      event.target.classList.toggle('wall');
    }

    for (let i = 0; i < trows; i++) {
      for (let j = 0; j < tcolumns; j++) {
        const gridItem = document.createElement('div');
        gridItem.classList.add('gridItem');

        if (i % 2 === 0 && j % 2 === 0) {
          gridItem.style.visibility = 'hidden';
        } else if (i % 2 === 1 && j % 2 === 1) {
          gridItem.addEventListener('click', change_tile);
          gridItem.classList.add('empty_tile');
        } else {
          gridItem.addEventListener('click', toggle_wall);
          gridItem.classList.add('passable');
        }
        gridContainer.appendChild(gridItem);
      }
    }
  };

  const extractJson = () => {
    let mat = [];
    const trows = rows * 2 + 1;
    const tcolumns = columns * 2 + 1;
    const gridContainer = document.getElementById('gridContainer').children;

    let index = 0;
    for (let i = 0; i < trows; i++) {
      let row = [];
      for (let j = 0; j < tcolumns; j++) {
        const cell = gridContainer[index];
        if (cell.classList.contains('empty_tile')) {
          row.push(' ');
        } else if (cell.classList.contains('snail_tile')) {
          row.push('B');
        } else if (cell.classList.contains('star_tile')) {
          row.push('*');
        } else if (cell.classList.contains('unreachable') || cell.classList.contains('wall')) {
          row.push('#');
        } else {
          row.push(' ');
        }
        index++;
      }
      mat.push(row);
    }

    console.log("MAT",mat);

    // const blob = new Blob([JSON.stringify(mat, null, 2)], { type: 'application/json' });
    // const url = URL.createObjectURL(blob);
    // const a = document.createElement('a');
    // a.href = url;
    // a.download = 'grid.json';
    // a.click();
    // URL.revokeObjectURL(url);

    return mat;
  };


  const makeRequestToServer = async (matrix) => {
    const stateObject = {
      rows: matrix.length,
      columns: matrix[0].length,
      matrix: matrix,
    };

    const jsonString = JSON.stringify(stateObject);
    try {
      const response = await fetch('http://localhost:8080/get-solution', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: jsonString,
      });

      if (!response.ok) {
        throw new Error(`Network response was not ok, status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
    }
  };

  useEffect(() => {
    console.log("GRID", grid)
  }, [grid])

  const handleSolve = async () => {
    const matrix = extractJson();
    const data = await makeRequestToServer(matrix);
    if (data) {
      setGrid(data.matrix);
    }
  };

  return (
    <div>
      <div>
        <h1>Draw a Grid</h1>
        <div className="name">Vivek</div>
        <input placeholder='row' type="number" id="rows" required />
        <input placeholder='column' type="number" id="columns" required />
        <button onClick={drawGrid}>Draw Grid</button>
        <button onClick={handleSolve}>Solve</button>
      </div>
      <div id="gridContainer" className="grid-container"></div>
      <Grid grid={grid} />
    </div>
  );
};

export default Home;
