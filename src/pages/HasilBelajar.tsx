import { useState } from 'react';

interface Hasil {
  nama: string;
  pelajaran: string;
  nilai: number;
}

export default function HasilBelajar() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isOrangTua = user.role === 'orangtua';
  const isGuru = user.role === 'guru';

  const [data] = useState<Hasil[]>([
    { nama: 'Ahmad', pelajaran: "Al-Qur'an", nilai: 90 },
    { nama: 'Fatimah', pelajaran: 'Fiqih', nilai: 85 },
    { nama: 'Zaid', pelajaran: 'Akidah', nilai: 88 },
  ]);

  const displayedData = isOrangTua
    ? data.filter((d) => d.nama === user.kodeSantri)
    : data;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold text-purple-600 mb-2">Hasil Belajar Santri</h1>
      <p className="text-gray-700 mb-4">
        {isOrangTua
          ? `Berikut adalah hasil belajar dari ${user.kodeSantri}`
          : 'Berikut adalah rekap hasil belajar santri.'}
      </p>

      <table className="min-w-full bg-white border border-gray-300 shadow-md">
        <thead>
          <tr className="bg-gray-200 text-left">
            <th className="py-2 px-4 border-b">Nama</th>
            <th className="py-2 px-4 border-b">Pelajaran</th>
            <th className="py-2 px-4 border-b">Nilai</th>
          </tr>
        </thead>
        <tbody>
          {displayedData.map((d, index) => (
            <tr key={index} className="border-t">
              <td className="py-2 px-4">{d.nama}</td>
              <td className="py-2 px-4">{d.pelajaran}</td>
              <td className="py-2 px-4">{d.nilai}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
