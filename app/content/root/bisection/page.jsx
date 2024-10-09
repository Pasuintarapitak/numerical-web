"use client";
import React, { useState } from 'react';
import { evaluate } from 'mathjs';
import dynamic from 'next/dynamic';
// import MathGraph from '@/app/components/MathGraph';
// Dynamic import for the MathGraph component

export default function Bisection() {
    const [XL, setXL] = useState(0);
    const [XR, setXR] = useState(10);
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
            return NaN; 
        }
    }

    // function fixfx(equation) {
    //     try {
    //         equation = equation.replace(/(\d)([a-zA-Z])/g, '$1*$2');
    //         equation = equation.replace(/(\d)\(/g, '$1*(');
    //         equation = equation.replace(/\)([a-zA-Z])/g, ')*$1');
    //         equation = equation.replace(/([a-zA-Z])(\d+)/g, '$1**$2'); 
    //         return equation;
    //     } catch (error) {
    //         console.error("Error fixing the function:", error);
    //     }
    // }

    const errorX = (xold, xnew) => Math.abs(xnew - xold);

    const Calbisection = () => {
        let xm, fXm, fXr, ea;
        let xl = XL;
        let xr = XR;
        let iter = 0;
        const MAX = 50;
        const data = [];
        // const equation = fixfx(fx);
        const equation = fx;

        while (iter < MAX) {
            xm = (xl + xr) / 2.0;
            fXr = findx(equation, xr);
            fXm = findx(equation, xm);

            if (fXm * fXr > 0) {
                ea = errorX(xr, xm);
                xr = xm; // Update xr
            } else {
                ea = errorX(xl, xm);
                xl = xm; // Update xl
            }
            if (ea <= error) {
                break;
            }
            data.push({
                iteration: iter,
                Xl: xl,
                Xm: xm,
                Xr: xr,
                fxm: fXm,
                error: ea,
            });

            iter++;
        }

        setResults(data);
        setIsCalculated(true);

        //Add Graphs data
        const graphPoints = data.map(result => ({
            x: result.Xm,
            y: result.fxm,
        }));
        setGraphData(graphPoints);
    };

    function submitValue() {
        Calbisection();
    }

    return (
        <div>
            <div className='mt-8 text-center text-4xl header'>Bisection Method</div>
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
                            className="border-2 border-gray-200 rounded hover:bg-sky-100 hover:border-sky-500 w-20 h-12"
                            placeholder='10'
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

                <div className='flex justify-center'>
                    <button className='bg-blue-400 m-4 border-2 border-blue-950 rounded pl-4 pr-4 w-28 h-14 text-white-400 hover:bg-blue-600'
                        onClick={submitValue} type="button">Evaluate</button>
                </div>

                <div className='text-center text-2xl'>
                    <div>Error = {error}</div>
                    <div>f(x) = {fx}</div>
                    <div>xL = {XL} xR = {XR}</div>
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
                        <div>{result.Xm}</div>
                        <div>{result.fxm}</div>
                        <div>{result.error.toFixed(5)} %</div>
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
