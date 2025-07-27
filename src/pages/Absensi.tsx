import { useEffect, useState } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface Santri {
  nama: string;
  hadir: boolean;
}

export default function Absensi() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [data, setData] = useState<Santri[]>([]);

  const defaultData: Santri[] = [
    { nama: 'Ahmad', hadir: false },
    { nama: 'Fatimah', hadir: false },
    { nama: 'Zaid', hadir: false },
  ];

  useEffect(() => {
    const saved = localStorage.getItem('absensi');
    const parsed = saved ? JSON.parse(saved) : [];

    if (parsed.length > 0) {
      setData(user.role === 'santri' ? parsed.filter((s: Santri) => s.nama === user.nama) : parsed);
    } else {
      const initial = user.role === 'santri'
        ? defaultData.filter((s) => s.nama === user.nama)
        : defaultData;
      setData(initial);
      localStorage.setItem('absensi', JSON.stringify(initial));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('absensi', JSON.stringify(data));
  }, [data]);

  const toggleHadir = (index: number) => {
    const updated = [...data];
    updated[index].hadir = !updated[index].hadir;
    setData(updated);
  };
  const tambahSantri = () => {
  if (!namaBaru.trim()) return;

  // Cek apakah sudah ada
  const duplikat = data.find((s) => s.nama.toLowerCase() === namaBaru.toLowerCase());
  if (duplikat) {
    alert("Santri sudah ada");
    return;
  }

  const baru = { nama: namaBaru.trim(), hadir: false };
  setData([...data, baru]);
  setNamaBaru('');
};

  const reset = () => {
    const resetData = data.map((s) => ({ ...s, hadir: false }));
    setData(resetData);
  };

  const eksporPDF = () => {
    const doc = new jsPDF();
    doc.text('Laporan Absensi', 14, 16);
    autoTable(doc, {
      head: [['Nama', 'Status']],
      body: data.map((s) => [s.nama, s.hadir ? 'Hadir' : 'Tidak Hadir']),
    });
    doc.save('absensi.pdf');
  };

  const [namaBaru, setNamaBaru] = useState('');

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold text-green-700 mb-4">Absensi Santri</h1>

      {user.role === 'guru' && (
        <div className="mb-4 flex gap-3">
          <button onClick={reset} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded">
            Reset Absensi
          </button>
          <button onClick={eksporPDF} className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded">
            Ekspor PDF
          </button>
        </div>
      )}

      {user.role === 'guru' && (
  <div className="mb-6 flex gap-3 items-center">
    <input
      type="text"
      placeholder="Nama santri baru"
      value={namaBaru}
      onChange={(e) => setNamaBaru(e.target.value)}
      className="border border-gray-300 rounded px-3 py-2 w-64"
    />
    <button
      onClick={tambahSantri}
      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
    >
      Tambah Santri
    </button>
  </div>
)}

      <table className="w-full bg-green-100">
        <thead>
          <tr className="bg-green-200">
            <th className="text-left px-4 py-2">Nama</th>
            <th className="text-left px-4 py-2">Status</th>
            {user.role === 'guru' && <th className="text-left px-4 py-2">Aksi</th>}
          </tr>
        </thead>
        <tbody>
          {data.map((santri, index) => (
            <tr key={index} className="border-t">
              <td className="px-4 py-2">{santri.nama}</td>
              <td className="px-4 py-2">{santri.hadir ? 'Hadir' : 'Tidak Hadir'}</td>
              {user.role === 'guru' && (
                <td className="px-4 py-2">
                  <button
                    onClick={() => toggleHadir(index)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                  >
                    {santri.hadir ? 'Tandai Tidak Hadir' : 'Tandai Hadir'}
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
