"use client";
import React, { useState, useEffect } from 'react';
import { create, all, log, matrix, setSize } from 'mathjs';
import { BlockMath, InlineMath } from 'react-katex'; // นำเข้า BlockMath และ InlineMath
import 'katex/dist/katex.min.css'; // นำเข้า CSS ของ KaTeX 
const math = create(all);
export default function Cramer() {
    const [sizematrix, setMatrixSize] = useState(3); // Default NxN matrix size
    const [matrixA, setmatrixA] = useState([]); // Matrix A
    const [matrixB, setMatrixB] = useState([]); // Matrix B (เวกเตอร์ B)
    const [matrixX, setMatrixX] = useState([]); // Matrix X (ผลลัพธ์)
    const [error, setError] = useState(0.000001); // State for error tolerance
    const [result,setResults] = useState([]);
    const [detMatrix,setDet] = useState();
    const [isCalculated, setIsCalculated] = useState(false);

    // Effect to update matrices when the matrix size changes
    useEffect(() => {
        const newMatrixA = Array.from({ length: sizematrix }, () =>
            Array.from({ length: sizematrix }, () => "")
        );
        setmatrixA(newMatrixA);

        const newMatrixB = Array.from({ length: sizematrix }, () => "");
        setMatrixB(newMatrixB);

        const newMatrixX = Array.from({ length: sizematrix }, () => "");
        setMatrixX(newMatrixX);
    }, [sizematrix]);

    const handleMatrixChange = (rowIndex, colIndex, value) => {  // อัพเดตค่า A
        const numericValue = parseFloat(value);
        const validValue = Number.isNaN(numericValue) ? 0 : numericValue; 
        const newMatrix = [...matrixA];
        newMatrix[rowIndex][colIndex] = validValue;
        setmatrixA(newMatrix);
    };

    const handleMatrixChangeB = (rowIndex, value) => {   // อัพเดตค่า B
        const numericValue = parseFloat(value);
        const validValue = Number.isNaN(numericValue) ? 0 : numericValue; 
        const newMatrix = [...matrixB];
        newMatrix[rowIndex] = validValue;
        setMatrixB(newMatrix);
    };

    const handleMatrixSizeChange = (e) => {  // อัพเดตขนาดของ Matrix
        setMatrixSize(parseInt(e.target.value));
    };



    function findDet(col) {
        let temp = Array.from({ length: sizematrix }, () => Array(sizematrix).fill(0));
        for(let i = 0 ; i < sizematrix ; i++){
            for(let j = 0 ; j <sizematrix ; j++){
                if(j == col){
                    temp[i][j] = matrixB[i];
                }
                else{
                    temp[i][j] = matrixA[i][j];
                }
            }
        }
        console.log(temp);
        
        return math.det(temp);
    }

    function Calcramer() {
        const A = matrixA;
        const B = matrixB;

        const detA = math.det(A);
        setDet(detA);
        // console.log(detA);
        
        const xResults = [];

        if (detA === 0) {
            console.error("Determinant is zero, the system may have no unique solution.");
            setResults([]); // เคลียร์ผลลัพธ์ถ้าไม่สามารถคำนวณได้
            return;
        }

        for (let i = 0; i < sizematrix; i++) {
            const detAi = findDet(i);
            const xi = detAi / detA; // คำนวณค่า xi
            xResults.push(xi);
            console.log(xi);
            
        }
        
        setResults(xResults);
    }

    function submitValue() {
        const isMatrixAComplete = matrixA.every(row => row.every(value => value !== ""));
        const isMatrixBComplete = matrixB.every(value => value !== "");
    
        if (!isMatrixAComplete || !isMatrixBComplete) {
            return; 
        }
    
        Calcramer();
        setIsCalculated(true);
     
  
    };
    function clearValue() {
        setMatrixSize(3)
        setmatrixA(Array.from({ length: sizematrix }, () =>
            Array.from({ length: sizematrix }, () => "")
        ));
        setMatrixB(Array.from({ length: sizematrix }, () => ""));
        setMatrixX(Array.from({ length: sizematrix }, () => ""));
        setResults([]); // เคลียร์ผลลัพธ์
        setIsCalculated(false); 
    }

    return (
        <div>
            <div className='mt-8 text-center text-4xl header'>Cramer's Rule</div>
            <div className='flex flex-col justify-items-center'>
                <div className="xL mt-4 flex justify-center">
                    <div className="mr-5">
                        <label className='mr-2'>Matrix size (NxN)</label>
                        <input
                            type="number"
                            value={sizematrix}
                            onChange={handleMatrixSizeChange}
                            className="border-2 border-gray-200 rounded hover:bg-sky-100 hover:border-sky-500 w-20 h-12 text-center"
                            placeholder='3'
                        />
                    </div>
                </div>

                <div className="error mt-4 flex justify-center">
                    <label className='mr-2 mt-4'>Error Tolerance</label>
                    <input
                        type="number"
                        value={error} // แสดงค่า error
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
                        <div className="">
                            {/* <div className='grid grid-cols-3 gap-4 p-4'>
                                <div className="text-center">{'{A}'}</div>
                                <div className="text-center">{'{X}'}</div>
                                
                                <div className="text-center">{'{B}'}</div>
                            </div> */}
                          
                            <div className='flex'>
                                
                                <div className="grid" style={{ gridTemplateColumns: `repeat(${sizematrix}, minmax(0, 1fr))`, gap: '10px' }}>
                                    
                                    {matrixA.map((row, rowIndex) =>
                                        row.map((value, colIndex) => (
                                            <input
                                                key={`${rowIndex}-${colIndex}`}
                                                type="number"
                                                value={matrixA[rowIndex][colIndex]}
                                                onChange={(e) =>
                                                    handleMatrixChange(rowIndex, colIndex, e.target.value)
                                                }
                                                className="border p-2 w-full text-center rounded hover:bg-sky-100 hover:border-sky-500 w-auto h-20 text-center"
                                                placeholder= {"a"+(rowIndex+1)+""+(colIndex+1)}
                                            />
                                        ))
                                    )}
                                </div>
                                <div className="flex place-items-center ml-8 mr-8">X</div>
                                <div className="grid" style={{ gridTemplateColumns: `repeat(${sizematrix}, min(0,1fr))`, gap: '10px' }}> 
                                    {matrixX.map((value, rowIndex) => (
                                        <input
                                            key={rowIndex}
                                            type="text"
                                            value={`x${rowIndex+1}`} readOnly
                                            className="border p-2 w-20 text-center rounded hover:bg-sky-100 hover:border-sky-500 w-16 h-20 text-center"
                                        />
                                    ))}
                                </div>
                                    <div className="flex place-items-center ml-12">=</div>

                                <div className="grid ml-12" style={{ gridTemplateRows: `repeat(${sizematrix}, minmax(0, 1fr))`, gap: '2px' }}> 
                                    {matrixB.map((value, rowIndex) => (
                                        <input
                                            key={rowIndex}
                                            type="number"
                                            value={value}
                                            onChange={(e) => handleMatrixChangeB(rowIndex, e.target.value)}
                                            className="border p-2 w-20 text-center rounded hover:bg-sky-100 hover:border-sky-500 w-16 h-20 text-center"
                                            placeholder={"b"+(rowIndex+1)+""}
                                        />
                                    ))}
                                </div>

                            </div>
                        </div>
                    )}
                </div>           
                
                {isCalculated && (
                    <div className="flex flex-col items-center mt-8">
                        <div className="text-3xl mb-2">Result</div>
                        <div className="flex flex-col items-center">
                            {/* แสดงสมาชิกใน Matrix A */}
                            <BlockMath math={`det(A) = \\begin{bmatrix} ${matrixA.map(row => row.join(' & ')).join(' \\\\ ')} \\end{bmatrix} = ${detMatrix}`} />
                            <div className="mt-4">
                                {/* แสดงค่า x1, x2, x3 */}
                                <BlockMath math={`${result.map((r, i) => `x_${i + 1} = ${r}`).join(', ')}`} />
                            </div>
                        </div>
                    </div>
                )}

        
               
            </div>
        </div>
    );
}
