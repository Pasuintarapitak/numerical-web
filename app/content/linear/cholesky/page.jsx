    "use client";
    import { useState, useEffect } from 'react';
    import { BlockMath } from 'react-katex'; 
    import 'katex/dist/katex.min.css'; 

    export default function Cholesky() {
        const [size, setSize] = useState(3); 
        const [matrixA, setMatrixA] = useState([]); 
        const [matrixB, setMatrixB] = useState([]); 
        const [matrixX, setMatrixX] = useState([]); 
        const [matrixL, setMatrixL] = useState([]); 
        const [isCalculated, setIsCalculated] = useState(false);
        const [error, setError] = useState();

        useEffect(() => {
            const newMatrixA = Array.from({ length: size }, () =>
                Array.from({ length: size }, () => "")
            );
            const newMatrixB = Array.from({ length: size }, () => "");
            setMatrixA(newMatrixA);
            setMatrixB(newMatrixB);
            setMatrixX(Array.from({ length: size }, () => ""));
            setMatrixL(Array.from({ length: size }, () => Array(size).fill(0)));
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

        // ฟังก์ชันทำ Cholesky Decomposition
        function choleskyDecomposition(A, L) {
            for (let i = 0; i < size; i++) {
                for (let j = 0; j < i + 1; j++) {
                    let sum = 0;
                    for (let k = 0; k < j; k++) {
                        sum += L[i][k] * L[j][k];
                    }

                    if (i === j) {
                        L[i][j] = Math.sqrt(A[i][i] - sum);
                    } else {
                        L[i][j] = (1 / L[j][j] * (A[i][j] - sum));
                    }
                }
            }
        }

        // ฟังก์ชันทำ Forward Substitution
        function forward_substitution(L, B, X) {
            for (let i = 0; i < size; i++) {
                let sum = 0;
                for (let j = 0; j < i; j++) {
                    sum += L[i][j] * X[j];
                }
                X[i] = (B[i] - sum) / L[i][i];
            }
        }

        // ฟังก์ชันทำ Back Substitution
        function back_substitution(L, X) {
            for (let i = size - 1; i >= 0; i--) {
                let sum = 0;
                for (let j = i + 1; j < size; j++) {
                    sum += L[j][i] * X[j];
                }
                X[i] = (X[i] - sum) / L[i][i];
            }
        }

        const calCholesky = () => {
            let A = matrixA.map(row => [...row]);
            let B = [...matrixB];
            let X = Array(size).fill(0);
            let L = Array.from({ length: size }, () => Array(size).fill(0));

            // ทำ Cholesky Decomposition
            choleskyDecomposition(A, L);

            // Forward substitution
            forward_substitution(L, B, X);

            // Back substitution
            back_substitution(L, X);

            console.log(X);
            
            setMatrixX(X);
            setMatrixL(L);
            if(X.map(i => i != NaN)){
                setIsCalculated(false);
                alert("Error mathematics OR Input is incomplete")
            }
            else{
                setIsCalculated(true);
            }
            
        };

        function submitValue() {
            const isMatrixAComplete = matrixA.every(row => row.every(value => value !== ""));
            const isMatrixBComplete = matrixB.every(value => value !== "");

            if (!isMatrixAComplete || !isMatrixBComplete) {
                return; 
            }

            calCholesky();
            
        }

        function clearValue() {
            setSize(3);
            setMatrixA(Array.from({ length: 3 }, () => Array.from({ length: 3 }, () => "")));
            setMatrixB(Array.from({ length: 3 }, () => ""));
            setMatrixX(Array.from({ length: 3 }, () => ""));
            setMatrixL(Array.from({ length: 3 }, () => Array(3).fill(0)));
            setIsCalculated(false);
        };

        return (
            <div>
                <div className='mt-8 text-center text-4xl header'>Cholesky Decomposition Method</div>
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
