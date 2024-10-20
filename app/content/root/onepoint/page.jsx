"use client";
import React, { useState } from 'react';
import { evaluate } from 'mathjs';
import dynamic from 'next/dynamic';
const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });


export default function False_poistion() {
    const [xStart, set_xStart] = useState(0);
    const [error, setError] = useState(0.000001);
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
            return ; 
        }
    }

    function fixfx(equation) {
        try {
            // แทนที่ ^ ด้วย ** สำหรับการยกกำลัง
            equation = equation.replace(/\^/g, '**');
            
            // แก้ไขการเชื่อมต่อระหว่างตัวเลขและตัวแปร
            equation = equation.replace(/(\d)([a-zA-Z])/g, '$1*$2');
            equation = equation.replace(/(\d)\(/g, '$1*(');
            equation = equation.replace(/\)([a-zA-Z])/g, ')*$1');
            equation = equation.replace(/([a-zA-Z])(\d+)/g, '$1**$2'); 
            
            return equation;
        } catch (error) {
            console.error("Error fixing the function:", error);
        }
    }
    
    

    const errorX = (xold, xnew) => Math.abs(xnew - xold);

    const CalOne = () => {
        let x_new = 0
        let x_start = xStart
        let ea = 1
        let iter = 0
        const MAX = 50
        const data = []
        // const equation = fixfx(fx)

        while (iter < MAX && ea > error) {

            x_new = findx(fx,x_start)
            ea = errorX(x_start,x_new)
        
            console.log("do");
            
            data.push({
                iteration : iter,
                xk : x_start,
                fxm : x_new,
                error :  ea
            })
            x_start = x_new
            iter++
           
        }

        setResults(data);
        setIsCalculated(true);
        console.log(results);
    }

        //Add Graphs data
    //     const graphPoints = data.map(result => ({
    //         x: result.Xm,
    //         y: result.fxm,
    //     }));
    //     setGraphData(graphPoints);
    // };

    const chartData = {
        data: [
            {
                type: "scatter",
                mode: "markers",
                x: results.map((point) => point.xk),
                y: results.map((point) => point.fxm),
                marker: { color: 'blue' },
                name: 'f(X)',
            },
            {
                type: "scatter",
                mode: "lines",
                x: results.flatMap((point, index) => (index < results.length - 1) ? [point.xk, point.fxm, point.fxm] : [point.xk]),
                y: results.flatMap((point, index) => (index < results.length - 1) ? [point.fxm, point.fxm, results  [index + 1].fxm] : [point.fxm]),
                line: { color: 'red' },
                name: 'One-Point',
            },
            {
                type: "scatter",
                mode: "lines",
                x: results.map((point) => point.xk),
                y: results.map((point) => point.x),
                line: { color: 'cyan' },
                name: 'x = x',
            },
            
        ],
        layout: {
            title: "One-point Iteration Graph",
            xaxis: {
                title: 'X',
                zeroline: true,
            },
            yaxis: {
                title: 'f(X)',
                zeroline: true,
            }
        }
    };

    function submitValue() {
        CalOne();
    }

    return (
        <div>
            <div className='mt-8 text-center text-4xl header'>One-point Position Method</div>

            <div className='flex flex-col justify-items-center'>
                <div className="xL mt-4 flex justify-center">
                    <div>
                        <label className='mr-2'>xL</label>
                        <input
                            type="number"
                            value={xStart}
                            onChange={(e) => set_xStart(e.target.value)}
                            className="border-2 border-gray-200 rounded hover:bg-sky-100 hover:border-sky-500 w-20 h-12 "
                            placeholder='0'
                        />
                    </div>
                    
                </div>

                <div className="error mt-4 flex justify-center">
                    <label className='mr-2 mt-4'>Error Tolerance</label>
                    <input
                        type="number"
                        value={error}
                        onChange={(e) => setError(e.target.value)}
                        className="border-2 border-gray-200 rounded hover:bg-sky-100 hover:border-sky-500 w-26 h-12"
                    />
                </div>

                {/* Function */}
                <div className="fx mt-4 flex justify-center">
                    <label className='mr-2 mt-4'>X<sub>n+1</sub></label>
                    <input
                        type="text"
                        value={fx}
                        onChange={(e) => setfx(e.target.value)}
                        className="border-2 border-gray-200 rounded hover:bg-sky-100 hover:border-sky-500 w-30 h-12"
                        placeholder="Enter function... Ex. 2x-7"
                    />
                </div>

                {/* BUTTON */}
                <div className='flex justify-center'>
                    <button className='bg-blue-400 m-4 border-2 border-blue-950 rounded pl-4 pr-4 w-28 h-14 text-white-400 hover:bg-blue-600'
                        onClick={submitValue} type="button">Evaluate</button>
                </div>

                <div className='text-center text-2xl'>
                    <div>Error = {error}</div>
                    <div>f(x) = {fx}</div>
                    <div>x(Start) = {xStart} </div>
                </div>
            </div>

            <div className='bg-white-300 m-10 p-4 h-auto '>
                <div className='grid grid-cols-4 gap-4 p-4 border-b-2 bg-gray-100'>
                    <div>iter</div>
                    <div>x</div>
                    <div>error(%)</div>
                </div>
                {results.map((results, index) => (
                    <div key={index} className='grid grid-cols-4 gap-4 p-2'>
                        <div>{results.iteration}</div>
                        <div>{results.xk.toFixed(2)}</div>
                        <div>{results.error.toFixed(6)} %</div>
                    </div>
                ))}
            </div>

            {isCalculated && (
                <div className="grid justify-center">
                     <Plot data={chartData.data} layout={chartData.layout} />
                </div>
            )}
        </div>
    );
}
