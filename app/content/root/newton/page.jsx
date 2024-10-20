"use client";
import React, { useState } from 'react';
import { evaluate } from 'mathjs';
import dynamic from 'next/dynamic';

import { derivative } from 'mathjs';

// Dynamic import for the MathGraph component

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
            return; 
        }
    }

        // function fixfx(equation) {
        
    //     equation = equation.replace(/(\d)([a-zA-Z])/g, '$1*$2');
    //     equation = equation.replace(/(\d)\(/g, '$1*(');
    //     equation = equation.replace(/\)([a-zA-Z])/g, ')*$1');
    //     equation = equation.replace(/([a-zA-Z])(\d+)/g, '$1**$2'); 
    
    //     return equation;
    // }
    

    const errorX = (xold, xnew) => Math.abs(xnew - xold);

    const Calnewton = () => {
        let x_sum = 0
        let x_start = xStart
        let ea = 1
        let iter = 0
        let fxm
        const MAX = 50
        const data = []
        // const equation = fixfx(fx)
        const equation = fx;
        const diff_eqaution = derivative(fx,'x').toString();


         do{
            x_sum = x_start - (findx(equation,x_start) / findx(diff_eqaution,x_start))
            console.log(fxm);
            
            ea = errorX(x_sum,x_start)
            data.push({iteration : iter , xk : x_start , result : findx(equation,x_start) , error : ea})
            x_start = x_sum
            iter++
        }while (iter < MAX && ea > error);

        setResults(data);
        console.log(results);
        setIsCalculated(true);
       
        //Add Graphs data
        const graphPoints = data.map(result => ({
            x: result.xk,
            y: result.result,
        }));
        setGraphData(graphPoints);
  
    }

    



    function submitValue() {
        Calnewton();
    }

    return (
        <div>
            <div className='mt-8 text-center text-4xl header'>Newton-Raphson Method</div>

            <div className='flex flex-col justify-items-center'>
                <div className="xL mt-4 flex justify-center">
                    <div>
                        <label className='mr-2'>x(Start)</label>
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
                    <label className='mr-2 mt-4'>f(x)</label>
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
                    <div>f(x)</div>
                    <div>error(%)</div>
                </div>
                {results.map((results, index) => (
                    <div key={index} className='grid grid-cols-4 gap-4 p-2'>
                        <div>{results.iteration}</div>
                        <div>{results.xk}</div>
                        <div>{results.result}</div>
                        <div>{results.error.toFixed(6)} %</div>
                    </div>
                ))}
            </div>

            {isCalculated && (
                <div className="grid justify-center">
                    <MathGraph dataPoints={graphData} />
                </div>
            )}
        </div>
    );
}
