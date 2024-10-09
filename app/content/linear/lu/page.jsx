    "use client";
    import React, { useState, useEffect } from 'react';
    import { BlockMath } from 'react-katex'; 
    import 'katex/dist/katex.min.css'; 

    export default function LU() {
        
        const [size, setSize] = useState(3); 
        const [matrixA, setMatrixA] = useState([]); 
        const [matrixB, setMatrixB] = useState([]); 
        const [matrixX, setMatrixX] = useState([]); 
        const [isCalculated, setIsCalculated] = useState(false);
        const [error, setError] = useState();
        const [steps, setSteps] = useState([]);

        useEffect(() => {
            const newMatrixA = Array.from({ length: size }, () =>
                Array.from({ length: size }, () => "")
            );
            const newMatrixB = Array.from({ length: size }, () => "");
            // let testA =[[-2,3,1],[3,4,-5],[1,-2,1]]
            // let testB = [9,0,-4]
            setMatrixA(newMatrixA);
            // setMatrixA(testA);
            setMatrixB(newMatrixB);
            // setMatrixB(testB);
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

        // ฟังก์ชันทำ Diagonalization (LU Decomposition)
        function diagonalization(A, L) {
            for (let k = 0; k < size - 1; k++) {
                for (let i = k + 1; i < size; i++) {
                    L[i][k] = A[i][k] / A[k][k];  // คำนวณ Factor
                    for (let j = k; j < size; j++) {
                        A[i][j] = A[i][j] - L[i][k] * A[k][j];
                    }
                }
            }
        }

        // ฟังก์ชันทำ Forward Substitution
        function forward_substitution(A, B, X) {
            X[0] = B[0];
            for (let i = 1; i < size; i++) {
                let s = 0;
                for (let j = 0; j < i; j++) {
                    s += A[i][j] * X[j];
                }
                X[i] = B[i] - s;
            }
        }

        // ฟังก์ชันทำ Back Substitution
        function back_substitution(A, X) {
            X[size - 1] = X[size - 1] / A[size - 1][size - 1];

            for (let i = size - 2; i >= 0; --i) {
                let s = 0;
                for (let j = i + 1; j < size; ++j) {
                    s += A[i][j] * X[j];
                }
                X[i] = (X[i] - s) / A[i][i];
            }
        }

        const calLU = () => {
            let A = matrixA.map(row => [...row]);
            let B = [...matrixB];
            let X = Array(size).fill(0);
            let L = Array.from({ length: size }, () => Array(size).fill(0));

            // ทำ LU Decomposition
            diagonalization(A, L);

            // Forward substitution
            forward_substitution(L, B, X);

            // Back substitution
            back_substitution(A, X);

            setMatrixX(X);
            setIsCalculated(true);
        };

        function submitValue() {
            const isMatrixAComplete = matrixA.every(row => row.every(value => value !== ""));
            const isMatrixBComplete = matrixB.every(value => value !== "");

            if (!isMatrixAComplete || !isMatrixBComplete) {
                return; 
            }

            calLU();
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
                <div className='mt-8 text-center text-4xl header'>LU Decomposition Method</div>
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
                                {/* Matrix A */}
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

                                {/* Matrix B */}
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

                            <div className="text-2xl mb-4">Back Substitution</div>
                            {matrixX.map((x, index) => (
                                <BlockMath key={index} math={`x_${index + 1} = ${Math.ceil(x)}`} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        );  
    }
