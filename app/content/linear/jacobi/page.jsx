"use client";
import { useState, useEffect } from 'react';
import { BlockMath } from 'react-katex'; 
import 'katex/dist/katex.min.css'; 


export default function Jacobi() {
    const [size, setSize] = useState(3); 
    const [matrixA, setMatrixA] = useState([]); //Initial A
    const [matrixB, setMatrixB] = useState([]); //Initial B
    const [matrixX, setMatrixX] = useState([]); 
    const [matrixS, setMatrixS] = useState([]); //Intital x start
    const [results, setResults] = useState([]);
    const [errorList, setErrorList] = useState([]);
    const [isCalculated, setIsCalculated] = useState(false);
    const [error, setError] = useState();

    useEffect(() => {
        const newMatrixA = Array.from({ length: size }, () => Array.from({ length: size }, () => ""));
        const newMatrixB = Array.from({ length: size }, () => "");
        const newMatrixX = Array.from({ length: size }, () => "");
        const newMatrixS = Array.from({ length: size }, () => "");
        //  let newMatrixA =[[5,2,0,0],[2,5,2,0],[0,2,5,2],[0,0,2,5]]
        // let newMatrixB = [12,17,14,7]
        // let newMatrixS = [0,0,0,0]

        setMatrixA(newMatrixA);
        setMatrixB(newMatrixB);
        setMatrixX(newMatrixX);
        setMatrixS(newMatrixS);

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

    const handleMatrixChangeS = (rowIndex, value) => {
        const newMatrix = [...matrixS];
        newMatrix[rowIndex] = parseFloat(value);
        setMatrixS(newMatrix);
    };
    const handleSizeChange = (e) => {
        setSize(parseInt(e.target.value));
    };

   
    const calJacobi = () => {
        let A = matrixA.map(row => [...row]); // Copy matrix A
        let B = [...matrixB]; // Copy matrix B
        let X = [...matrixS]; // Initial guess for X
        let P = Array(size).fill(0); // New values of X
        let E = Array(size).fill(0); // Error array
        let converged = false;
        const tolerance = error || 0.000001;
        let count = 0;
        let max_iter = 100;
        let data = []
        let ea = []
 
        for (let r = 0; r < max_iter; r++) {
            // Update P values based on Jacobi method
            for (let i = 0; i < size; i++) {
                P[i] = B[i];
                for (let j = 0; j < size; j++) {
                    if (i === j){
                        continue;
                    }
                    P[i] -= A[i][j] * X[j];
                }
                P[i] = P[i] / A[i][i];
  
            }
            data.push({
                iteration: r+1,
                X: [...P]
            });
            count++;
    
            // Check for convergence
            converged = true;
            for (let l = 0; l < size; l++) {
                E[l] = Math.abs((P[l] - X[l]) / P[l]);
                if (E[l] >= tolerance) {
                    converged = false;
                }
            }
            ea.push([...E]);
           
            if (converged) break;
    
            // Prepare for the next iteration
            X = [...P];
        }
        console.log(E);
        
        if (!converged) {
            alert("The solution did not converge.");
            setIsCalculated(false);
        } else {
            setResults(data);
            setErrorList(ea);
            setMatrixX(P); // Update state with the final solution
            setIsCalculated(true);
            console.log(ea);
            console.log(data);
            
            
            
        }
    };
    

    function submitValue() {
        const isMatrixAComplete = matrixA.every(row => row.every(value => value !== ""));
        const isMatrixBComplete = matrixB.every(value => value !== "");

        if (!isMatrixAComplete || !isMatrixBComplete) {
            return; 
        }

        calJacobi();
        
    }

    function clearValue() {
        setSize(3);
        setMatrixA(Array.from({ length: 3 }, () => Array.from({ length: 3 }, () => "")));
        setMatrixB(Array.from({ length: 3 }, () => ""));
        setMatrixX(Array.from({ length: 3 }, () => ""));
        setMatrixS(Array.from({ length: 3 }, () => ""));
        setIsCalculated(false);
    };

    return (
        <div>
            <div className='mt-8 text-center text-4xl header'>Jacobi Method</div>
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

                {/* X start */}
                <div className="flex justify-center text-xl mt-12">X start</div>
                <div className="flex justify-center gap-x-4 mt-5 mb-5">
                                {matrixS.map((value, rowIndex) => (
                                    <input
                                        key={rowIndex}
                                        type="number"
                                        value={value}
                                        onChange={(e) => handleMatrixChangeS(rowIndex, e.target.value)}
                                        className="border p-2 w-20 text-center rounded hover:bg-sky-100 hover:border-sky-500 w-16 h-20"
                                        placeholder={`x${rowIndex + 1}`}
                                    />
                                ))}
                </div>
 
                {isCalculated && (
                        <div className='bg-white-300 m-10 p-4 h-auto '>
                        <div className='grid grid-cols-4 gap-4 p-4 border-b-2 bg-gray-100'>
                            <div>iter</div>
                            <div>x</div>
                           
                            <div>error(%)</div>
                        </div>
                        {results.map((result, index) => (
                            <div key={index} className='grid grid-cols-4 gap-4 p-2'>
                                <div>{result.iteration}</div>
                                <div>{result.X.map((x, i) => <div key={i}>{"X"+(i+1)+" : "+x.toFixed(5)}</div>)}</div>
                                <div>{errorList[index].map((e, i) => <div key={i}>{(e * 100).toFixed(7)}%</div>)}</div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );  
}
