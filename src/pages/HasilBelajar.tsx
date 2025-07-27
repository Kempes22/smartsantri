import { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

// Ambil data santri dari localStorage untuk akses nomor WA orang tua
const santriList = JSON.parse(localStorage.getItem("santri") || "[]");

const cariNomorWA = (nama: string) => {
  const santri = santriList.find((s: any) => s.nama === nama);
  return santri?.waOrangTua || null;
};

const kirimWhatsApp = (nama: string, pelajaran: string, nilai: number, keterangan: string) => {
  const nomor = cariNomorWA(nama);
  if (!nomor) {
    alert("Nomor WhatsApp orang tua tidak ditemukan.");
    return;
  }

  const pesan = `Assalamu'alaikum. Berikut hasil belajar ananda ${nama}:\n\n📚 Pelajaran: ${pelajaran}\n📊 Nilai: ${nilai}\n📝 Keterangan: ${keterangan || '-'}\n\nTerima kasih.`;
  const url = `https://wa.me/${nomor}?text=${encodeURIComponent(pesan)}`;
  window.open(url, '_blank');
};

interface Hasil {
  nama: string;
  pelajaran: string;
  nilai: number;
  keterangan?: string;
}

export default function HasilBelajar() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isOrangTua = user.role === 'orangtua';
  const isGuru = user.role === 'guru';

  const [data, setData] = useState<Hasil[]>([]);
  const [semuaPelajaran, setSemuaPelajaran] = useState<string[]>([]);
  const [pelajaranBaru, setPelajaranBaru] = useState('');
  const [selectedNama, setSelectedNama] = useState('');
  const [selectedPelajaran, setSelectedPelajaran] = useState('');
  const [newNilai, setNewNilai] = useState('');
  const [newKeterangan, setNewKeterangan] = useState('');
  const [filterNama, setFilterNama] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('hasilBelajar');
    if (saved) {
      setData(JSON.parse(saved));
    } else {
      const defaultData: Hasil[] = [
        { nama: 'Ahmad', pelajaran: "Al-Qur'an", nilai: 90, keterangan: 'Sangat Baik' },
        { nama: 'Fatimah', pelajaran: 'Fiqih', nilai: 85, keterangan: 'Baik' },
        { nama: 'Zaid', pelajaran: 'Akidah', nilai: 88, keterangan: 'Baik' },
      ];
      setData(defaultData);
      localStorage.setItem('hasilBelajar', JSON.stringify(defaultData));
    }

    const pelajaranLS = JSON.parse(localStorage.getItem('mataPelajaran') || '[]');
    if (pelajaranLS.length === 0) {
      const defaultPelajaran = ["Al-Qur'an", 'Fiqih', 'Akidah'];
      localStorage.setItem('mataPelajaran', JSON.stringify(defaultPelajaran));
      setSemuaPelajaran(defaultPelajaran);
    } else {
      setSemuaPelajaran(pelajaranLS);
    }
  }, []);

  const displayedData = isOrangTua
    ? data.filter((d) => d.nama.toLowerCase() === (user.nama || '').toLowerCase())
    : data;

  const namaOptions = data.map((d) => d.nama).filter((v, i, a) => a.indexOf(v) === i);
  const filteredData = displayedData.filter((d) => (filterNama ? d.nama === filterNama : true));

  const handleTambahPelajaran = () => {
    const trimmed = pelajaranBaru.trim();
    if (!trimmed) return;
    if (semuaPelajaran.includes(trimmed)) {
      alert('Pelajaran sudah ada!');
      return;
    }
    const updated = [...semuaPelajaran, trimmed];
    localStorage.setItem('mataPelajaran', JSON.stringify(updated));
    setSemuaPelajaran(updated);
    setPelajaranBaru('');
  };

  const handleUpdateNilai = () => {
    if (!selectedNama || !selectedPelajaran || !newNilai) {
      alert('Nama, pelajaran, dan nilai wajib diisi.');
      return;
    }
    let updated = [...data];
    const existingIndex = updated.findIndex(
      (item) => item.nama === selectedNama && item.pelajaran === selectedPelajaran
    );
    if (existingIndex !== -1) {
      updated[existingIndex] = {
        ...updated[existingIndex],
        nilai: parseInt(newNilai),
        keterangan: newKeterangan,
      };
    } else {
      updated.push({
        nama: selectedNama,
        pelajaran: selectedPelajaran,
        nilai: parseInt(newNilai),
        keterangan: newKeterangan,
      });
    }
    setData(updated);
    localStorage.setItem('hasilBelajar', JSON.stringify(updated));
    alert('Nilai dan keterangan berhasil disimpan!');
    setSelectedNama('');
    setSelectedPelajaran('');
    setNewNilai('');
    setNewKeterangan('');
  };

  const eksporPDF = () => {
    const doc = new jsPDF();
    const title = filterNama ? `Laporan Hasil Belajar - ${filterNama}` : 'Laporan Hasil Belajar Semua Santri';
    doc.text(title, 14, 16);
    autoTable(doc, {
      head: [['Nama', 'Pelajaran', 'Nilai', 'Keterangan']],
      body: filteredData.map((item) => [item.nama, item.pelajaran, item.nilai, item.keterangan || '-']),
    });
    doc.save('hasil-belajar.pdf');
  };

  const eksporExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Hasil Belajar');
    worksheet.columns = [
      { header: 'Nama', key: 'nama', width: 20 },
      { header: 'Pelajaran', key: 'pelajaran', width: 20 },
      { header: 'Nilai', key: 'nilai', width: 10 },
      { header: 'Keterangan', key: 'keterangan', width: 30 },
    ];
    filteredData.forEach((item) => worksheet.addRow(item));
    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), 'hasil-belajar.xlsx');
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold text-purple-600 mb-2">Hasil Belajar Santri</h1>
      <p className="text-gray-700 mb-4">
        {isOrangTua ? `Berikut adalah hasil belajar dari ${user.nama || 'anak Anda'}` : 'Berikut adalah rekap hasil belajar santri.'}
      </p>

      {isGuru && (
        <div className="mb-6 p-4 bg-white rounded shadow">
          <h2 className="text-lg font-semibold mb-3">Update Keterangan & Nilai</h2>
          <div className="flex mb-3 gap-2">
            <input
              type="text"
              value={pelajaranBaru}
              onChange={(e) => setPelajaranBaru(e.target.value)}
              placeholder="Tambahkan mata pelajaran baru"
              className="border px-3 py-2 w-full rounded"
            />
            <button
              onClick={handleTambahPelajaran}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Tambah Pelajaran
            </button>
          </div>
          <select value={selectedNama} onChange={(e) => setSelectedNama(e.target.value)} className="border px-3 py-2 mb-3 w-full rounded">
            <option value="">-- Pilih Nama Santri --</option>
            {namaOptions.map((n, i) => <option key={i} value={n}>{n}</option>)}
          </select>
          <select value={selectedPelajaran} onChange={(e) => setSelectedPelajaran(e.target.value)} className="border px-3 py-2 mb-3 w-full rounded">
            <option value="">-- Pilih Pelajaran --</option>
            {semuaPelajaran.map((p, i) => <option key={i} value={p}>{p}</option>)}
          </select>
          <input type="number" placeholder="Masukkan nilai" value={newNilai} onChange={(e) => setNewNilai(e.target.value)} className="border px-3 py-2 mb-3 w-full rounded" />
          <input type="text" placeholder="Masukkan keterangan" value={newKeterangan} onChange={(e) => setNewKeterangan(e.target.value)} className="border px-3 py-2 mb-3 w-full rounded" />
          <button onClick={handleUpdateNilai} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full">
            Simpan Keterangan & Nilai
          </button>
        </div>
      )}

      <div className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <select value={filterNama} onChange={(e) => setFilterNama(e.target.value)} className="border px-3 py-2 rounded w-full md:w-1/3">
          <option value="">-- Tampilkan Semua Santri --</option>
          {namaOptions.map((n, i) => <option key={i} value={n}>{n}</option>)}
        </select>
        <div className="flex gap-3">
          <button onClick={eksporPDF} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded w-full md:w-auto">
            Ekspor PDF
          </button>
          <button onClick={eksporExcel} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded w-full md:w-auto">
            Ekspor Excel
          </button>
        </div>
      </div>

      {filteredData.length > 0 ? (
        <table className="min-w-full bg-white border border-gray-300 shadow-md">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="py-2 px-4 border-b">Nama</th>
              <th className="py-2 px-4 border-b">Pelajaran</th>
              <th className="py-2 px-4 border-b">Nilai</th>
              <th className="py-2 px-4 border-b">Keterangan</th>
              {isGuru && <th className="py-2 px-4 border-b text-center">Kirim WA</th>}
            </tr>
          </thead>
          <tbody>
            {filteredData.map((d, index) => (
              <tr key={index} className="border-t">
                <td className="py-2 px-4">{d.nama}</td>
                <td className="py-2 px-4">{d.pelajaran}</td>
                <td className="py-2 px-4">{d.nilai}</td>
                <td className="py-2 px-4">{d.keterangan || '-'}</td>
                {isGuru && (
                  <td className="py-2 px-4 text-center">
                    <button
                      onClick={() => kirimWhatsApp(d.nama, d.pelajaran, d.nilai, d.keterangan || '')}
                      className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                    >
                      Kirim
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-gray-500">Belum ada data untuk ditampilkan.</p>
      )}
    </div>
  );
}
