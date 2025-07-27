export default function Profil() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold text-blue-600 mb-4">Profil Pengguna</h1>

      <div className="bg-white shadow rounded p-4 w-full md:w-1/2">
        <div className="mb-2">
          <span className="font-semibold text-gray-700">Username:</span>{' '}
          <span>{user.username || '-'}</span>
        </div>
        <div className="mb-2">
          <span className="font-semibold text-gray-700">Role:</span>{' '}
          <span className="capitalize">{user.role || '-'}</span>
        </div>
        {user.role === 'orangtua' && (
          <div className="mb-2">
            <span className="font-semibold text-gray-700">Kode Santri:</span>{' '}
            <span>{user.kodeSantri || '-'}</span>
          </div>
        )}
      </div>
    </div>
  );
}
