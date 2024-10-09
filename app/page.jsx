import Link from "next/link"

export default function Home() {
  return (
    <div>
      
      <div className ="header flex justify-center mt-10 text-4xl	mb-10 hover:text-blue-400">Numerical Method</div>
      <div className="grid gap-4 grid-cols-4">
            <div id="grapihcal">
              <div className="ml-10">
                <div className="text-3xl mb-5 ">Root of Equation</div>
                <Link href="content/root/graphical" className="hover:text-sky-800 hover:font-semibold	 text-xl block mb-2"> Graphical Method</Link>
                <Link href="content/root/bisection" className="hover:text-sky-800 hover:font-semibold	 text-xl block mb-2"> Bisection Method</Link>
                <Link href="content/root/false" className="hover:text-sky-800 hover:font-semibold	 text-xl block mb-2"> False Position Method</Link>
                <Link href="content/root/onepoint" className="hover:text-sky-800 hover:font-semibold	 text-xl block mb-2"> One-point Position Method</Link>
                <Link href="content/root/newton" className="hover:text-sky-800 hover:font-semibold	 text-xl block mb-2"> Newton-Raphson Method</Link>
                <Link href="#" className="hover:text-sky-800 hover:font-semibold	 text-xl block mb-2"> Secant Method</Link>

              </div>
            </div>

            <div id="linear">
              <div className="ml-10">
                <div className="text-3xl mb-5 ">Linear Equation</div>
                <Link href="content/linear/cramer" className="hover:text-sky-800 hover:font-semibold	 text-xl block mb-2">Cramer's Rule</Link>
                <Link href="content/linear/gauss" className="hover:text-sky-800 hover:font-semibold	 text-xl block mb-2">Gauss Elimination Method</Link>
                <Link href="content/linear/gaussjordan" className="hover:text-sky-800 hover:font-semibold	 text-xl block mb-2">Gauss-Jordan Method</Link>
                <Link href="content/linear/inversion" className="hover:text-sky-800 hover:font-semibold	 text-xl block mb-2">Matrix Inversion Method</Link>
                <Link href="#" className="hover:text-sky-800 hover:font-semibold	 text-xl block mb-2">LU Decomposition Method</Link>
                <Link href="#" className="hover:text-sky-800 hover:font-semibold	 text-xl block mb-2">Cholesky Decomposition Method</Link>
                <Link href="#" className="hover:text-sky-800 hover:font-semibold	 text-xl block mb-2">Jacobi Iteration Method</Link>
                <Link href="#" className="hover:text-sky-800 hover:font-semibold	 text-xl block mb-2">Gauss-Seidel Iteration Method</Link>
                <Link href="#" className="hover:text-sky-800 hover:font-semibold	 text-xl block mb-2">Conjugate Gradient Method</Link>

              </div>
            </div>
            
            <div id="interpolation">
                <div className="ml-10">
                    <div className="text-3xl mb-5 ">Interpolation</div>
                      <Link href="#" className="hover:text-sky-800 hover:font-semibold	 text-xl block mb-2">Newton divided-diff</Link>
                      <Link href="#" className="hover:text-sky-800 hover:font-semibold	 text-xl block mb-2">Lagrange</Link>
                      <Link href="#" className="hover:text-sky-800 hover:font-semibold	 text-xl block mb-2">Spline</Link>
                </div>   

                <div className="ml-10 mt-10">
                    <div className="text-3xl mb-5 ">Extrapolation</div>
                      <Link href="#" className="hover:text-sky-800 hover:font-semibold	 text-xl block mb-2">Simple Regression</Link>
                      <Link href="#" className="hover:text-sky-800 hover:font-semibold	 text-xl block mb-2">Multiple Regression</Link>
                </div>  


            </div>
      
      
      </div>
      
      
      
      </div>


  
    

    
  );
}
