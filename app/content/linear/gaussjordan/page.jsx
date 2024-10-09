"use client";
import React, { useState, useEffect } from 'react';
import { BlockMath } from 'react-katex'; 
import 'katex/dist/katex.min.css'; 

export default function GaussianElimination() {
    const [size, setSize] = useState(3); 
    const [matrixA, setMatrixA] = useState([]); 
    const [matrixB, setMatrixB] = useState([]); 
    const [matrixX, setMatrixX] = useState([]); 
    const [isCalculated, setIsCalculated] = useState(false);
    const [error, setError] = useState();
    const [steps, setSteps] = useState([]);
    // const [isGauss , setGauss] = useState(false);

    useEffect(() => {
        const newMatrixA = Array.from({ length: size }, () =>
            Array.from({ length: size }, () => "")
        );
        const newMatrixB = Array.from({ length: size }, () => "");
        setMatrixA(newMatrixA);
        setMatrixB(newMatrixB);
        setMatrixX(Array.from({ length: size }, () => ""));
    }, [size]);

    const handleMatrixChange = (rowIndex, colIndex, value) => {
        const newMatrix = [...matrixA];
        newMatrix[rowIndex][colIndex] = parseFloat(value);
        setMatrixA(newMatrix);
    };

    const handleMatrixChangeB = (rowIndex, value) => {
        const newMatrix = [...matrixB];
        newMatrix[rowIndex] = parseFloat(value);
        setMatrixB(newMatrix);
    };

    const handleSizeChange = (e) => {
        setSize(parseInt(e.target.value));
    };
         // Save the step with detailed calculation
                        // eliminationSteps.push({
                        //     eliminatedRow: k + 1,
                        //     factor: factor.toFixed(2), // Store the factor
                        //     matrix: A.map(row => row.map(val => val.toFixed(2)).join(' & ')).join(' \\\\ '),
                        //     resultB: B.map(val => val.toFixed(2)).join(', '),
                        // });
    const Calgaussianjordan = () => {
        let A = matrixA.map(row => [...row]);
        let B = [...matrixB];
        let jordanSteps = [];
                    
        for (let i = 0; i < size; i++) {
            // Check for Mathematical Error (division by zero)
            if (A[i][i] === 0) {
                setError("Mathematical Error: Division by zero at row " + (i + 1));
                return; // Return early if error
            }
                        
            for (let j = 0; j < size; j++) {
                if (i !== j) {
                    let ratio = A[j][i] / A[i][i]; // Ratio calculation
                    for (let k = 0; k < size; k++) {
                        A[j][k] = A[j][k] - ratio * A[i][k]; // Update the row
                    }
                        B[j] -= ratio * B[i];
                }

            }
            jordanSteps.push({
                eliminatedRow: i + 1,
                factor: (A[i][i] !== 0 ? (B[i] / A[i][i]).toFixed(2) : "0"), // Store the factor
                matrix: A.map(row => row.map(val => val.toFixed(2)).join(' & ')).join(' \\\\ '),
                resultB: B.map(val => val.toFixed(2)).join(', '),
                gaussCal: false
            });
         
        }
        
        for (let i = 0; i < size; i++) {
            let temp = A[i][i];
            for (let j = 0 ; j <size; j++){
                A[i][j] /= temp;
                }B[i] /= temp;
                if(i == size-1){
                    jordanSteps.push({
                        eliminatedRow: i + 1,
                        factor: (A[i][i] !== 0 ? (B[i] / A[i][i]).toFixed(2) : "0"), // Store the factor
                        matrix: A.map(row => row.map(val => val.toFixed(2)).join(' & ')).join(' \\\\ '),
                        resultB: B.map(val => val.toFixed(2)).join(', '),
                        gaussCal: true
                    });
                }
        }
                     
        let X = Array(size).fill(0);
        for (let i = size - 1; i >= 0; i--) {
            X[i] = B[i];
            for (let j = i + 1; j < size; j++) {
                X[i] -= A[i][j] * X[j]; 
            }
        }   
                    
        setMatrixX(X.map(val => val.toFixed(2))); 
        setSteps(jordanSteps);
        setIsCalculated(true);
    };

    function submitValue() {
        const isMatrixAComplete = matrixA.every(row => row.every(value => value !== ""));
        const isMatrixBComplete = matrixB.every(value => value !== "");

        if (!isMatrixAComplete || !isMatrixBComplete) {
            return; 
        }

        Calgaussianjordan();
        setIsCalculated(true);
    }

    function clearValue() {
        setSize(3);
        setMatrixA(Array.from({ length: 3 }, () => Array.from({ length: 3 }, () => "")));
        setMatrixB(Array.from({ length: 3 }, () => ""));
        setMatrixX(Array.from({ length: 3 }, () => ""));
        setIsCalculated(false);
    };

    return (
        <div>
            <div className='mt-8 text-center text-4xl header'>Gaussian Jordan Method</div>
            <div className='flex flex-col justify-items-center'>
                <div className="xL mt-4 flex justify-center">
                    <div className="mr-5">
                        <label className='mr-2'>Matrix size (NxN)</label>
                        <input
                            type="number"
                            value={size}
                            onChange={handleSizeChange}
                            className="border-2 border-gray-200 rounded hover:bg-sky-100 hover:border-sky-500 w-20 h-12 text-center"
                            placeholder='3'
                        />
                    </div>
                </div>
                <div className="error mt-4 flex justify-center">
                    <label className='mr-2 mt-4'>Error Tolerance</label>
                    <input
                        type="number"
                        value={error}
                        onChange={(e) => setError(parseFloat(e.target.value))}
                        className="border-2 border-gray-200 rounded hover:bg-sky-100 hover:border-sky-500 w-26 h-12 text-center"
                        placeholder="0.000001"
                    />
                </div>

                <div className='flex justify-center'>
                    <button className='bg-blue-400 m-4 border-2 border-blue-950 rounded pl-4 pr-4 w-28 h-14 text-white hover:bg-blue-600'
                        onClick={submitValue} type="button">Evaluate</button>
                    <button className='bg-red-400 m-4 border-2 border-blue-950 rounded pl-4 pr-4 w-28 h-14 text-white hover:bg-orange-600'
                        onClick={clearValue} type="button">Clear</button>
                </div>
                <div className="flex justify-center items-center mt-8">
                    {matrixA.length > 0 && (
                        <div className="flex">
                            <div className="grid" style={{ gridTemplateColumns: `repeat(${size}, minmax(0, 0.57fr))`, gap: '10px' }}>
                                {matrixA.map((row, rowIndex) =>
                                    row.map((value, colIndex) => (
                                        <input
                                            key={`${rowIndex}-${colIndex}`}
                                            type="number"
                                            value={matrixA[rowIndex][colIndex]}
                                            onChange={(e) => handleMatrixChange(rowIndex, colIndex, e.target.value)}
                                            className="border p-2 w-full text-center rounded hover:bg-sky-100 hover:border-sky-500 w-16 h-20"
                                            placeholder={`a${rowIndex + 1}${colIndex + 1}`}
                                        />
                                    ))
                                )}
                            </div>
                            <div className="flex place-items-center ml-8 mr-8">X</div>
                            <div className="grid" style={{ gridTemplateColumns: `repeat(${size}, min(0,1fr))`, gap: '10px' }}>
                                {matrixX.map((value, rowIndex) => (
                                    <input
                                        key={rowIndex}
                                        type="text"
                                        value={`x${rowIndex + 1}`} readOnly
                                        className="border p-2 w-20 text-center rounded hover:bg-sky-100 hover:border-sky-500 w-16 h-20"
                                    />
                                ))}
                            </div>
                            <div className="flex place-items-center ml-12">=</div>

                            <div className="grid ml-12" style={{ gridTemplateRows: `repeat(${size}, minmax(0, 1fr))`, gap: '2px' }}>
                                {matrixB.map((value, rowIndex) => (
                                    <input
                                        key={rowIndex}
                                        type="number"
                                        value={value}
                                        onChange={(e) => handleMatrixChangeB(rowIndex, e.target.value)}
                                        className="border p-2 w-20 text-center rounded hover:bg-sky-100 hover:border-sky-500 w-16 h-20"
                                        placeholder={`b${rowIndex + 1}`}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {isCalculated && (
                    <div className="flex flex-col items-center mt-8">
                        <div className="text-3xl mb-2">Result</div>

                        {/* Forward Elimination Steps */}
                        <div className="text-2xl mb-4">Forward Elimination</div>
                        {steps.map((step, index) => (
                    <div key={index} className="mb-6">
                
                        
                        <BlockMath math={`\\begin{bmatrix} ${step.matrix} \\end{bmatrix}`} />
                        <BlockMath math={`\\begin{bmatrix} ${step.resultB} \\end{bmatrix}`} />
                    </div>
                ))}

                        {/* Back Substitution Steps */}
                        <div className="text-2xl mb-4">Back Substitution</div>
                        {matrixX.map((x, index) => (
                            <BlockMath key={index} math={`x_${index + 1} = ${x}`} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
