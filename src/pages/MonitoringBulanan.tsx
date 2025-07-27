import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
// @ts-ignore → abaikan error TypeScript untuk autoTable()
import 'jspdf-autotable';

export default function MonitoringBulanan() {
  const [data, setData] = useState<any[]>([]);
  const [bulan, setBulan] = useState("Juli");
  const [tahun, setTahun] = useState(2025);

  const bulanList = [
    "Januari", "Februari", "Maret", "April",
    "Mei", "Juni", "Juli", "Agustus",
    "September", "Oktober", "November", "Desember"
  ];

  useEffect(() => {
    try {
      const semua = JSON.parse(localStorage.getItem("absensi") || "[]");
      const filter = semua.filter((d: any) => d.bulan === bulan && d.tahun === tahun);
      setData(filter);
    } catch (err) {
      console.error("Gagal membaca data absensi:", err);
      setData([]);
    }
  }, [bulan, tahun]);

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.text(`Laporan Monitoring - ${bulan} ${tahun}`, 10, 10);

    // @ts-ignore
    doc.autoTable({
      head: [["Nama", "Hadir", "Sakit", "Izin", "Alfa"]],
      body: data.map((item) => [
        item.nama, item.hadir, item.sakit, item.izin, item.alfa
      ])
    });

    doc.save(`monitoring-${bulan}-${tahun}.pdf`);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Monitoring Bulanan</h1>

      {/* Filter Bulan & Tahun */}
      <div className="flex gap-4 mb-4 items-center flex-wrap">
        <label className="font-medium">Bulan:</label>
        <select
          value={bulan}
          onChange={(e) => setBulan(e.target.value)}
          className="border px-2 py-1 rounded"
        >
          {bulanList.map((b) => (
            <option key={b} value={b}>{b}</option>
          ))}
        </select>

        <label className="font-medium">Tahun:</label>
        <input
          type="number"
          value={tahun}
          onChange={(e) => setTahun(parseInt(e.target.value))}
          className="border px-2 py-1 w-24 rounded"
        />

        <button
          onClick={handleExportPDF}
          className="bg-purple-600 text-white px-3 py-1 rounded hover:bg-purple-700"
        >
          Ekspor PDF
        </button>
      </div>

      {/* Tabel Hasil */}
      {data.length === 0 ? (
        <p className="text-gray-500 italic">Tidak ada data untuk bulan ini.</p>
      ) : (
        <table className="w-full border text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-2 py-1">Nama</th>
              <th className="border px-2 py-1">Hadir</th>
              <th className="border px-2 py-1">Sakit</th>
              <th className="border px-2 py-1">Izin</th>
              <th className="border px-2 py-1">Alfa</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, i) => (
              <tr key={i}>
                <td className="border px-2 py-1">{item.nama}</td>
                <td className="border px-2 py-1 text-center">{item.hadir}</td>
                <td className="border px-2 py-1 text-center">{item.sakit}</td>
                <td className="border px-2 py-1 text-center">{item.izin}</td>
                <td className="border px-2 py-1 text-center">{item.alfa}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
