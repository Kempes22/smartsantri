import { useEffect, useState } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface Santri {
  nama: string;
  status: string;
}

export default function Absensi() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [data, setData] = useState<Santri[]>([]);
  const [semuaSantri, setSemuaSantri] = useState<string[]>([]);
  const [namaBaru, setNamaBaru] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem("absensi");
    const parsed = saved ? JSON.parse(saved) : [];

    const semua = JSON.parse(localStorage.getItem("santri") || "[]");
    const daftarNama = semua.map((s: any) => s.nama);
    setSemuaSantri(daftarNama);

    let initial: Santri[];
    if (parsed.length > 0) {
      initial = user.role === 'santri'
        ? parsed.filter((s: Santri) => s.nama === user.nama)
        : parsed;
    } else {
      initial = daftarNama.map((nama: string) => ({ nama, status: 'Tidak Hadir' }));
    }

    setData(initial);
    localStorage.setItem("absensi", JSON.stringify(initial));
  }, []);

  useEffect(() => {
    localStorage.setItem("absensi", JSON.stringify(data));
  }, [data]);

  const updateStatus = (index: number, newStatus: string) => {
    const updated = [...data];
    updated[index].status = newStatus;
    setData(updated);
  };

  const tambahSantri = () => {
    if (!namaBaru) return;

    const duplikat = data.find((s) => s.nama === namaBaru);
    if (duplikat) {
      alert("Santri sudah ada dalam daftar absensi.");
      return;
    }

    const baru = { nama: namaBaru, status: 'Tidak Hadir' };
    setData([...data, baru]);
    setNamaBaru('');
  };

  const reset = () => {
    const resetData = data.map((s) => ({ ...s, status: 'Tidak Hadir' }));
    setData(resetData);
  };

  const eksporPDF = () => {
    const doc = new jsPDF();
    doc.text('Laporan Absensi', 14, 16);
    autoTable(doc, {
      head: [['Nama', 'Status']],
      body: data.map((s) => [s.nama, s.status]),
    });
    doc.save('absensi.pdf');
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold text-green-700 mb-4">Absensi Santri</h1>

      {user.role === 'guru' && (
        <>
          <div className="mb-4 flex gap-3">
            <button onClick={reset} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded">
              Reset Absensi
            </button>
            <button onClick={eksporPDF} className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded">
              Ekspor PDF
            </button>
          </div>

          <div className="mb-6 flex gap-3 items-center">
            <select
              value={namaBaru}
              onChange={(e) => setNamaBaru(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 w-64"
            >
              <option value="">Pilih santri...</option>
              {semuaSantri.map((nama, idx) => (
                <option key={idx} value={nama}>{nama}</option>
              ))}
            </select>
            <button
              onClick={tambahSantri}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
            >
              Tambah Santri
            </button>
          </div>
        </>
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
              <td className="px-4 py-2">{santri.status}</td>
              {user.role === 'guru' && (
                <td className="px-4 py-2">
                  <select
                    value={santri.status}
                    onChange={(e) => updateStatus(index, e.target.value)}
                    className="border px-2 py-1 rounded"
                  >
                    <option value="Hadir">Hadir</option>
                    <option value="Izin">Izin</option>
                    <option value="Sakit">Sakit</option>
                    <option value="Alpha">Alpha</option>
                    <option value="Tidak Hadir">Tidak Hadir</option>
                  </select>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
