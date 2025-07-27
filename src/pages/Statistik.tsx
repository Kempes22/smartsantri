import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Legend, Tooltip } from 'chart.js';
import { useEffect, useState } from 'react';

ChartJS.register(BarElement, CategoryScale, LinearScale, Legend, Tooltip);

interface Rekap {
  nama: string;
  hadir: number;
  sakit: number;
  izin: number;
  alfa: number;
  bulan: string;
  tahun: number;
}

export default function Statistik() {
  const [data, setData] = useState<Rekap[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("absensi");
    if (stored) {
      const parsed: Rekap[] = JSON.parse(stored);

      // Gabungkan rekap berdasarkan nama
      const rekapGabungan: Record<string, Rekap> = {};

      parsed.forEach((item) => {
        if (!rekapGabungan[item.nama]) {
          rekapGabungan[item.nama] = {
            nama: item.nama,
            hadir: 0,
            sakit: 0,
            izin: 0,
            alfa: 0,
            bulan: item.bulan,
            tahun: item.tahun
          };
        }

        rekapGabungan[item.nama].hadir += item.hadir || 0;
        rekapGabungan[item.nama].sakit += item.sakit || 0;
        rekapGabungan[item.nama].izin += item.izin || 0;
        rekapGabungan[item.nama].alfa += item.alfa || 0;
      });

      setData(Object.values(rekapGabungan));
    }
  }, []);

  const chartData = {
    labels: data.map((d) => d.nama),
    datasets: [
      {
        label: 'Hadir',
        data: data.map((d) => d.hadir),
        backgroundColor: '#10B981'
      },
      {
        label: 'Sakit',
        data: data.map((d) => d.sakit),
        backgroundColor: '#F59E0B'
      },
      {
        label: 'Izin',
        data: data.map((d) => d.izin),
        backgroundColor: '#3B82F6'
      },
      {
        label: 'Alfa',
        data: data.map((d) => d.alfa),
        backgroundColor: '#EF4444'
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold text-purple-700 mb-4">Statistik Kehadiran Santri</h1>
      {data.length === 0 ? (
        <p className="text-gray-500 italic">Tidak ada data statistik yang tersedia.</p>
      ) : (
        <Bar data={chartData} options={options} />
      )}
    </div>
  );
}
