"use client";
import React, { useState } from 'react';
import { evaluate } from 'mathjs';
// import Plot from 'react-plotly.js';
import dynamic from 'next/dynamic';



export default function Graphical() {
    const [XL, setXL] = useState(0);
    const [XR, setXR] = useState(0);
    const [error, setError] = useState(0.00001);
    const [fx, setfx] = useState();
    const [results, setResults] = useState([]);
    const [isCalculated, setIsCalculated] = useState(false);
    const [graphData, setGraphData] = useState([]);
    const MathGraph = dynamic(() => import('@/app/components/MathGraph'), { ssr: false });


    function findx(fx, x0) {
        try {
            const x = { x: x0 };
            return evaluate(fx, x);
        } catch (error) {
            console.error("Error evaluating the function:", error);
            return NaN; 
        }
    }


    // function fixfx(equation) {
        
    //     equation = equation.replace(/(\d)([a-zA-Z])/g, '$1*$2');
    //     equation = equation.replace(/(\d)\(/g, '$1*(');
    //     equation = equation.replace(/\)([a-zA-Z])/g, ')*$1');
    //     equation = equation.replace(/([a-zA-Z])(\d+)/g, '$1**$2'); 
    
    //     return equation;
    // }

    const calGraphical = () => {
        let newxl = parseFloat(XL);
        let newxr = parseFloat(XR);
        let tolerance = parseFloat(error);
        // let equation = fixfx(fx);
        let equation = fx;
        let temp = 1;
        const maxItr = 100;
        let itr = 0;
        let data = [];
        let found = false;

        const addedEntries = new Set();

        while (itr < maxItr) {
            for (let i = newxl; i <= newxr; i += temp) {
                const fxi = findx(equation, i);
                const fxiNext = findx(equation, i + temp);

                itr++;

                const entryKey = `${i},${fxi}`;
                
                if (!addedEntries.has(entryKey)) {
                    data.push({ iteration: itr - 1, xk: i.toFixed(5), result: fxi.toFixed(5) });
                    addedEntries.add(entryKey);
                }

                if (Math.abs(fxi) <= tolerance || Math.abs(fxiNext) <= tolerance) {
                    found = true;
                    data.push({ iteration: itr, xk: (i + temp).toFixed(5), result: fxiNext.toFixed(5) });
                    addedEntries.add(`${i + temp},${fxiNext}`);
                    break;
                }

                if (fxi * fxiNext < 0) {
                    newxl = i;
                    newxr = i + temp;
                    temp *= 0.1;
                    data.push({ iteration: itr, xk: newxr.toFixed(5), result: fxiNext.toFixed(5) });
                    addedEntries.add(`${newxr},${fxiNext}`);
                    break;
                }
            }

            if (found) {
                break;
            }
        }

        setResults(data);
        setIsCalculated(true); 
        //Add Graph data
        const graphPoints = data.map(result => ({
            x: result.xk,
            y: result.result,
        }));
        setGraphData(graphPoints);
        console.log("out", data);
        console.log(`Total Iterations: ${itr}`);
    }

    // ฟังก์ชันสำหรับสร้างข้อมูลกราฟ
    // const plotData = () => {
    //     const xValues = [];
    //     const yValues = [];
        
    //     for (let i = parseFloat(XL); i <= parseFloat(XR); i += 0.1) {
    //         xValues.push(i);
    //         yValues.push(findx(fx, i)); 
    //     }

    //     return {
    //         x: xValues,
    //         y: yValues,
    //         mode: 'lines',
    //         type: 'scatter',
    //         name: 'f(x)',
    //     };
    // };

    function submitValue() {
        calGraphical();
    }

    return (
        <div>
            <div className='mt-8 text-center text-4xl header'>Graphical Method</div>
            <div className='flex flex-col justify-items-center'>
                <div className="xL mt-4 flex justify-center">
                    <div className="mr-5">
                    <label className='mr-2'>xL</label>
                        <input
                            type="number"
                            value={XL}
                            onChange={(e) => setXL(e.target.value)}
                            className="border-2 border-gray-200 rounded hover:bg-sky-100 hover:border-sky-500 w-20 h-12 "
                            placeholder='0'
                        />
                    </div>
                    <div>
                    <label className='mr-2'>xR</label>
                        <input
                            type="number"
                            value={XR}
                            onChange={(e) => setXR(e.target.value)}
                            className="border-2 border-gray-200 rounded  hover:bg-sky-100 hover:border-sky-500 w-20 h-12"
                            placeholder='10'
                        />
                    </div>
                </div>
          
                {/* Error */}
                <div className="error mt-4 flex justify-center">
                    <label className='mr-2 mt-4'>Error Tolerance</label>
                    <input
                        type="number"
                        value={error}
                        onChange={(e) => setError(e.target.value)}
                        className="border-2 border-gray-200 rounded  hover:bg-sky-100 hover:border-sky-500 w-26 h-12"
                    />
                </div>
                {/* Function */}
                <div className="fx mt-4 flex justify-center">
                    <label className='mr-2 mt-4'>f(x)</label>
                    <input
                        type="text"
                        value={fx}
                        onChange={(e) => setfx(e.target.value)}
                        className="border-2 border-gray-200 rounded  hover:bg-sky-100 hover:border-sky-500 w-30 h-12"
                        placeholder="Enter function... Ex. 2x-7"
                    />
                </div>
                <div className='flex justify-center'>
                    <button className='bg-blue-400 m-4 border-2 border-blue-950 rounded pl-4 pr-4 w-28 h-14 text-white-400 hover:bg-blue-600 '
                    onClick={submitValue} type="button">Evaluate</button>
                </div>
                <div className='text-center text-2xl'>
                    <div>Error = {error}</div>
                    <div>f(x) = {fx}</div>
                    <div> xL = {XL} xR = {XR}</div>
                    
                </div>
            </div>
            <div className='bg-white-300 m-10 p-4 h-auto '> 
                <div className='grid grid-cols-4 gap-4 p-4 border-b-2 bg-gray-100'>
                    <div>iter</div>
                    <div>x</div>
                    <div>f(x)</div>
                    <div>error(%)</div>
                </div>
                {results.map((result, index) => (
                    <div key={index} className='grid grid-cols-4 gap-4 p-2'>
                        <div>{result.iteration}</div>
                        <div>{result.xk}</div>
                        <div>{result.result}</div>
                        <div>{(Math.abs(result.result) * 100).toFixed(6)} %</div>
                    </div>
                ))}
            </div>
            {isCalculated && (
                <div className="grid justify-center">
                    <MathGraph dataPoints={graphData} />


                    {/* <Plot
                        data={[plotData()]} 
                        layout={{ title: 'Graph of f(x)', xaxis: { title: 'x' }, yaxis: { title: 'f(x)' } }}
                    /> */}
                </div>
            )}
        </div>
    );
}



// {(Math.abs(result.result) * 100).toFixed(5)} %