import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

// Daftar akun pengguna
const users = [
  { username: 'admin', password: 'admin123', role: 'admin' },
  { username: 'guru', password: 'guru123', role: 'guru' },
  { username: 'ayah_ahmad', password: 'ortu123', role: 'orangtua', kodeSantri: 'Ahmad' },
  { username: 'ayah_fatimah', password: 'ortu123', role: 'orangtua', kodeSantri: 'Fatimah' },
  { username: 'ayah_zaid', password: 'ortu123', role: 'orangtua', kodeSantri: 'Zaid' },
];

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [kodeSantri, setKodeSantri] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = () => {
    setError('');

    const user = users.find(
      u => u.username === username && u.password === password
    );

    if (!user) {
      setError('Username atau password salah');
      return;
    }

    // Kalau role orangtua → validasi kodeSantri
    if (user.role === 'orangtua') {
      if (!kodeSantri) {
        setError('Kode santri wajib diisi');
        return;
      }

      // Cek apakah kodeSantri cocok dengan data akun orangtua
      if (user.kodeSantri !== kodeSantri) {
        setError('Kode santri tidak cocok dengan akun orangtua');
        return;
      }

      // Simpan login orangtua
      localStorage.setItem(
        'user',
        JSON.stringify({
          username: user.username,
          role: 'orangtua',
          nama: kodeSantri,
          kodeUnik: kodeSantri,
        })
      );

      navigate('/');
      return;
    }

    // Simpan login admin / guru
    localStorage.setItem('user', JSON.stringify(user));

    // Redirect sesuai role
    if (user.role === 'admin') {
      navigate('/admin/monitoring');
    } else {
      navigate('/');
    }
  };

  // Deteksi apakah role orangtua agar input kodeSantri muncul
  const isOrangtua = users.find(
    u => u.username === username && u.role === 'orangtua'
  );

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-md p-8 rounded w-full max-w-sm">
        <h2 className="text-xl font-bold mb-4 text-center text-blue-600">
          Login SmartSantri
        </h2>

        {error && <div className="text-red-500 mb-3">{error}</div>}

        <input
          className="w-full border px-3 py-2 mb-3 rounded"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
        />
        <input
          className="w-full border px-3 py-2 mb-3 rounded"
          placeholder="Password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />

        {isOrangtua && (
          <input
            className="w-full border px-3 py-2 mb-4 rounded"
            placeholder="Kode Santri (contoh: Ahmad)"
            value={kodeSantri}
            onChange={e => setKodeSantri(e.target.value)}
          />
        )}

        <button
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          onClick={handleLogin}
        >
          Login
        </button>
      </div>
    </div>
  );
}
