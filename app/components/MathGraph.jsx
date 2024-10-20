import dynamic from "next/dynamic"
const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });


const MathGraph = ({ dataPoints }) => {
  const xData = dataPoints.map(point => point.x);
  const yData = dataPoints.map(point => point.y);

  return (
    <Plot
      data={[
        {
          x: xData,
          y: yData,
          mode: 'lines+markers',
          type: 'scatter',
          marker: { color: 'red' },
          line: { color: 'blue', width: 2 },
        },
      ]}
      layout={{
        title: 'Graph of Function',
        xaxis: {
          title: 'x',
          range: [-7, 7],
          zeroline: true,
          zerolinecolor: 'black',
        },
        yaxis: {
          title: 'f(x)',
          range: [-7, 7],
          zeroline: true,
          zerolinecolor: 'black',
        },
        showlegend: false,
        plot_bgcolor: 'rgba(255, 255, 255, 0.8)',
        margin: { t: 80, b: 80, l: 80, r: 80 },
      }}
      config={{
        scrollZoom: true,
        responsive: true,
      }}
    />
  );
};

export default MathGraph;