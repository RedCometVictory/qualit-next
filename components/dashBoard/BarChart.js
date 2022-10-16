import { useEffect, useState } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top'
    },
    title: {
      display: false,
      text: "Tickets by Status"
    }
  }
};

// const labels = ['New','Open','On Hold','In Progress','Closed','Unconfirmed'];

// const data = {
//   labels,
//   datasets: [
//     {
//       label: 'Tickets',
//       // data: labels.map(() => ),
//       backgroundColor: 'rgba(255, 99, 132, 0.5)',
//       borderColor: 'rgba(255, 99, 132, 0.5)',
//       borderWidth: 1,
//       data: [12, 59, 43, 29, 16, 4]
//     },
//     // {
//     //   label: 'Dataset 2',
//     //   data: labels.map(() => faker.datatype.number({ min: 0, max: 1000 })),
//     //   backgroundColor: 'rgba(53, 162, 235, 0.5)',
//     // }
//   ]
// };

const BarChart = ({statusCount}) => {
  const labels = ['New','Open','On Hold','In Progress','Closed','Unconfirmed'];

  const data = {
    labels,
    datasets: [
      {
        label: 'Tickets',
        // data: labels.map(() => ),
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        borderColor: 'rgba(255, 99, 132, 0.5)',
        borderWidth: 1,
        data: [
          statusCount.statusNew,
          statusCount.statusOpen,
          statusCount.statusOnHold,
          statusCount.statusInProgress,
          statusCount.statusClosed,
          statusCount.statusUnconfirmed
        ]
      },
      // {
      //   label: 'Dataset 2',
      //   data: labels.map(() => faker.datatype.number({ min: 0, max: 1000 })),
      //   backgroundColor: 'rgba(53, 162, 235, 0.5)',
      // }
    ]
  };

  return (
    <section className="bar">
      <Bar options={options} data={data} />
    </section>
  )
};
export default BarChart;