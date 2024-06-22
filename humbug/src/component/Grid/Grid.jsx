import { useEffect, useState } from 'react';
import './Grid.css';
import snail from '../../assets/images/snail.png';
import star from '../../assets/images/star.png';

const Grid = ({ grid }) => {
    const drawGrid = {
        state1: [
            [' ', ' ', ' ', ' ', ' '],
            [' ', 'B', ' ', ' ', ' '],
            [' ', ' ', ' ', ' ', ' '],
            [' ', ' ', ' ', ' ', ' '],
            [' ', ' ', ' ', ' ', ' '],
        ],
        state2: [
            [' ', ' ', ' ', ' ', ' '],
            [' ', ' ', ' ', 'B', ' '],
            [' ', ' ', ' ', ' ', ' '],
            [' ', ' ', ' ', ' ', ' '],
            [' ', ' ', ' ', ' ', ' '],
        ],
        state3: [
            [' ', ' ', ' ', ' ', ' '],
            [' ', ' ', ' ', ' ', ' '],
            [' ', ' ', ' ', ' ', ' '],
            [' ', ' ', ' ', 'B', ' '],
            [' ', ' ', ' ', ' ', ' '],
        ],
        state4: [
            [' ', ' ', ' ', ' ', ' '],
            [' ', 'B', ' ', ' ', ' '],
            [' ', ' ', ' ', ' ', ' '],
            [' ', ' ', ' ', ' ', ' '],
            [' ', ' ', ' ', ' ', ' '],
        ],
    };

    const [currentGridIndex, setCurrentGridIndex] = useState(1);

    useEffect(() => {
        const timer = setTimeout(() => {
            const nextIndex = currentGridIndex % 4 + 1; // Cycle through states 1 to 4
            setCurrentGridIndex(nextIndex);
            console.log(`Updated grid to state${nextIndex}:`, drawGrid[`state${nextIndex}`]);
        }, 1000);

        return () => clearTimeout(timer);
    }, [currentGridIndex]);

    const currentGrid = drawGrid[`state${currentGridIndex}`]; // Get current state based on index

    useEffect(() => {
        console.log("Grid prop changed:", currentGrid);
    }, [currentGrid]);

    const getClass = (idx1, idx2, val) => {
        if (idx1 % 2 === 0 && idx2 % 2 === 0) {
            return 'hidden';
        } else if (idx1 % 2 === 1 && idx2 % 2 === 1) {
            if (val === 'B') {
                return 'snail_tile';
            } else if (val === '*') {
                return 'star_tile';
            } else if (val === '#') {
                return 'unreachable';
            } else if (val === ' '){
                return 'empty_tile';
            }
        } else {
            if (val === '#') {
                return 'wall';
            } else if (val === ' '){
                return 'passable';
            }
        }
    }

    return (
        <>
            <p style={{ color: "white" }}>solution</p>
            <div 
                style={{
                    gridTemplateColumns: `10px repeat(${(currentGrid[0].length - 1) / 2}, 100px 10px)`,
                    gridTemplateRows: `10px repeat(${(currentGrid.length - 1) / 2}, 100px 10px)`
                }}
                className='grid-container solution'
            >
                {currentGrid.map((row, idx) => (
                    row.map((cell, idx2) => (
                        <div className={`${getClass(idx, idx2, cell)}`} key={`${idx}.${idx2}`}>
                            {/* {getTile(idx, idx2)} */}
                        </div>
                    ))
                ))}
            </div>
        </>
    );
};

export default Grid;
