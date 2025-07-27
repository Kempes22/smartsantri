import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale } from 'chart.js';
import { useEffect, useState } from 'react';

ChartJS.register(BarElement, CategoryScale, LinearScale);

interface Santri {
  nama: string;
  hadir: boolean;
}

export default function Statistik() {
  const [data, setData] = useState<Santri[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('absensi');
    if (saved) {
      setData(JSON.parse(saved));
    }
  }, []);

  const chartData = {
    labels: data.map((d) => d.nama),
    datasets: [
      {
        label: 'Kehadiran',
        data: data.map((d) => (d.hadir ? 1 : 0)),
        backgroundColor: 'rgba(99, 102, 241, 0.6)',
        borderRadius: 5,
      },
    ],
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
        ticks: { stepSize: 1 },
      },
    },
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold text-indigo-600 mb-4">Statistik Kehadiran Santri</h1>
      <Bar data={chartData} options={options} />
    </div>
  );
}
