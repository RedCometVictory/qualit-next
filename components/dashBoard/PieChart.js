import { useEffect, useState } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = ({priorityCount}) => {
  console.log("PieCHART")
  console.log(priorityCount)
  const [graph, setGraph] = useState({
    labels: [], data: []
  });

  const graphData = [
    {
      label: 'Urgent',
      value: priorityCount.priorityUrgent
    },
    {
      label: 'High',
      value: priorityCount.priorityHigh
    },
    {
      label: 'Medium',
      value: priorityCount.priorityMedium
    },
    {
      label: 'Low',
      value: priorityCount.priorityLow
    },
    {
      label: 'None',
      value: priorityCount.priorityNone
    }
  ];

  useEffect(() => {
    const labels = [];
    const data = [];

    graphData.map(indx => {
      labels.push(indx.label);
      data.push(indx.value);
    });

    setGraph({
      labels: labels,
      data: data
    });
  }, []);

  const state = {
    labels: graph.labels,
    datasets: [
      {
        label: 'Rainfall',
        data: graph.data,
        backgroundColor: [
          '#B21F00',
          '#C9DE00',
          '#2FDE00',
          '#00A6B4',
          '#6800B4'
        ],
        hoverBackgroundColor: [
        '#501800',
        '#4B5000',
        '#175000',
        '#003350',
        '#35014F'
        ],
        borderColor: [
          '#B21F00',
          '#C9DE00',
          '#2FDE00',
          '#00A6B4',
          '#6800B4'
        ],
        borderWidth: 1
      }
    ]
  };

  const chartOptions = {
    title: {
      display: false,
      text: 'Priority',
      fontSize: 12
    },
    legend: {
      display: true,
      position: 'right',
      align: 'center'
    },
    maintainAspectRatio: true,
    responsive: true
  };
  return (
    <section
      className="pie"
      // style={{ marginTop: "-40px", width: "300px", height: "300px" }}
    >
      <Pie
        data={state}
        options={{
          plugins: chartOptions
        }}
        // height={400}
        // width={600}
      />
    </section>
  )
};
export default PieChart;