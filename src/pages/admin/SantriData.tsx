import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface Santri {
  id: number;
  nama: string;
  ttl: string;
  orangTua: string;
  waOrangTua: string; // ➕ Tambahan kolom nomor WA
  wali: string;
  lembaga: string[];
}

export default function SantriData() {
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (!user || user.role !== "admin") {
      alert("Akses ditolak. Halaman ini hanya untuk admin.");
      navigate("/login");
    }
  }, []);

  const [data, setData] = useState<Santri[]>([]);
  const [form, setForm] = useState<Santri>({
    id: Date.now(),
    nama: '',
    ttl: '',
    orangTua: '',
    waOrangTua: '',
    wali: '',
    lembaga: [],
  });
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("santri") || "[]");
    setData(saved);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleLembagaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setForm(prev => ({
      ...prev,
      lembaga: checked
        ? [...prev.lembaga, value]
        : prev.lembaga.filter(l => l !== value),
    }));
  };

  const resetForm = () => {
    setForm({
      id: Date.now(),
      nama: '',
      ttl: '',
      orangTua: '',
      waOrangTua: '',
      wali: '',
      lembaga: [],
    });
    setEditMode(false);
  };

  const handleSubmit = () => {
    if (!form.nama || !form.ttl || !form.orangTua || !form.waOrangTua || !form.wali || form.lembaga.length === 0) {
      alert("Mohon lengkapi semua kolom dan pilih minimal satu lembaga.");
      return;
    }

    const sinkronKeAbsensiDanNilai = (santriBaru: Santri[]) => {
      const absensi = JSON.parse(localStorage.getItem("absensi") || "[]");
      const hasilBelajar = JSON.parse(localStorage.getItem("hasilBelajar") || "[]");

      const namaAbsensiLama = absensi.map((a: any) => a.nama);
      const namaNilaiLama = hasilBelajar.map((n: any) => n.nama);

      santriBaru.forEach(s => {
        if (!namaAbsensiLama.includes(s.nama)) {
          absensi.push({
            nama: s.nama,
            hadir: false,
            sakit: 0,
            izin: 0,
            alfa: 0
          });
        }
        if (!namaNilaiLama.includes(s.nama)) {
          hasilBelajar.push({
            nama: s.nama,
            pelajaran: "",
            nilai: 0,
            keterangan: ""
          });
        }
      });

      localStorage.setItem("absensi", JSON.stringify(absensi));
      localStorage.setItem("hasilBelajar", JSON.stringify(hasilBelajar));
    };

    const updated = editMode
      ? data.map(item => item.id === form.id ? form : item)
      : [...data, { ...form, id: Date.now() }];

    setData(updated);
    localStorage.setItem("santri", JSON.stringify(updated));
    sinkronKeAbsensiDanNilai([form]);
    resetForm();
  };

  const handleEdit = (item: Santri) => {
    setForm(item);
    setEditMode(true);
  };

  const handleDelete = (id: number) => {
    if (!window.confirm("Yakin ingin menghapus data ini?")) return;

    const updated = data.filter(item => item.id !== id);
    setData(updated);
    localStorage.setItem("santri", JSON.stringify(updated));
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Manajemen Data Santri</h1>

      {/* Form Input */}
      <div className="grid gap-4 mb-6 grid-cols-1 md:grid-cols-2">
        <input name="nama" value={form.nama} onChange={handleChange}
          placeholder="Nama Santri" className="border px-3 py-2 rounded" />
        <input name="ttl" value={form.ttl} onChange={handleChange}
          placeholder="Tempat Tanggal Lahir" className="border px-3 py-2 rounded" />
        <input name="orangTua" value={form.orangTua} onChange={handleChange}
          placeholder="Nama Orang Tua" className="border px-3 py-2 rounded" />
        <input name="waOrangTua" value={form.waOrangTua} onChange={handleChange}
          placeholder="Nomor WA Orang Tua (contoh: 6281234567890)" className="border px-3 py-2 rounded" />
        <input name="wali" value={form.wali} onChange={handleChange}
          placeholder="Nama Wali" className="border px-3 py-2 rounded" />
        <div className="col-span-2">
          <label className="font-semibold">Lembaga:</label>
          <div className="flex gap-4 mt-2">
            {['TPQ', 'Ponpes', 'Madin'].map(l => (
              <label key={l}>
                <input
                  type="checkbox"
                  value={l}
                  checked={form.lembaga.includes(l)}
                  onChange={handleLembagaChange}
                  className="mr-1"
                />
                {l}
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="flex gap-4 mb-6">
        <button onClick={handleSubmit} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          {editMode ? "Update" : "Tambah"}
        </button>
        {editMode && (
          <button onClick={resetForm} className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500">
            Batal
          </button>
        )}
      </div>

      {/* Tabel */}
      <table className="w-full border text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-2 py-1">Nama</th>
            <th className="border px-2 py-1">TTL</th>
            <th className="border px-2 py-1">Orang Tua</th>
            <th className="border px-2 py-1">WA Orang Tua</th>
            <th className="border px-2 py-1">Wali</th>
            <th className="border px-2 py-1">Lembaga</th>
            <th className="border px-2 py-1">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {data.map(s => (
            <tr key={s.id}>
              <td className="border px-2 py-1">{s.nama}</td>
              <td className="border px-2 py-1">{s.ttl}</td>
              <td className="border px-2 py-1">{s.orangTua}</td>
              <td className="border px-2 py-1">{s.waOrangTua}</td>
              <td className="border px-2 py-1">{s.wali}</td>
              <td className="border px-2 py-1">{s.lembaga.join(", ")}</td>
              <td className="border px-2 py-1 flex gap-2">
                <button onClick={() => handleEdit(s)} className="bg-yellow-500 text-white px-2 py-1 rounded">
                  Edit
                </button>
                <button onClick={() => handleDelete(s.id)} className="bg-red-500 text-white px-2 py-1 rounded">
                  Hapus
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
