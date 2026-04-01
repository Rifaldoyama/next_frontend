export default function ForbiddenPage() {
  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold text-red-600">403</h1>
      <p className="text-gray-600 mt-2">
        Kamu tidak punya akses ke halaman ini
      </p>
    </div>
  );
}
