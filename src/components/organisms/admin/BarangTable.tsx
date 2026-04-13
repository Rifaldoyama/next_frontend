import { Button } from "../../atoms/Buttons";

const IMAGE_BASE_URL = process.env.NEXT_PUBLIC_IMAGE_URL;

export function BarangTable({
  data,
  onDelete,
  onEdit,
}: {
  data: any[];
  onDelete: (id: string, name: string) => void;
  onEdit: (item: any) => void;
}) {
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
      <table className="min-w-full divide-y divide-gray-200 bg-white">
        <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
          <tr>
            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-700">
              Gambar
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-700">
              Nama
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-700">
              Stok
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-700">
              Aksi
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-200">
          {data.length === 0 ? (
            <tr>
              <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                <div className="flex flex-col items-center justify-center space-y-3">
                  <div className="rounded-full bg-gray-100 p-4">
                    <svg
                      className="h-8 w-8 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                      />
                    </svg>
                  </div>
                  <p className="text-lg font-medium text-gray-400">
                    Belum ada barang
                  </p>
                  <p className="text-sm text-gray-500">
                    Mulai tambah barang dengan menekan tombol "Tambah Barang"
                  </p>
                </div>
              </td>
            </tr>
          ) : (
            data.map((item) => {
              const stok = Number(item.stok_tersedia || 0);

              return (
                <tr
                  key={item.id}
                  className="transition-colors hover:bg-gray-50"
                >
                  <td className="whitespace-nowrap px-6 py-4">
                    {item.gambar ? (
                      <div className="relative">
                        <img
                          src={`${IMAGE_BASE_URL}${item.gambar}`}
                          alt={item.nama}
                          className="h-16 w-16 rounded-lg border-2 border-gray-200 object-cover shadow-sm transition-transform hover:scale-105"
                        />
                        <div className="absolute -right-1 -top-1 h-3 w-3 rounded-full border-2 border-white bg-green-500"></div>
                      </div>
                    ) : (
                      <div className="flex h-16 w-16 items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50">
                        <svg
                          className="h-6 w-6 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                    )}
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-medium text-gray-900">
                        {item.nama}
                      </span>
                      {item.deskripsi && (
                        <span className="mt-1 text-sm text-gray-500">
                          {item.deskripsi.length > 50
                            ? `${item.deskripsi.substring(0, 50)}...`
                            : item.deskripsi}
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <div className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium">
                      {stok === 0 ? (
                        <span className="flex items-center">
                          <span className="mr-2 h-2 w-2 rounded-full bg-red-500"></span>
                          <span className="text-red-700">Habis</span>
                        </span>
                      ) : stok <= 10 ? (
                        <span className="flex items-center">
                          <span className="mr-2 h-2 w-2 rounded-full bg-yellow-500"></span>
                          <span className="text-yellow-700">{stok}</span>
                        </span>
                      ) : (
                        <span className="flex items-center">
                          <span className="mr-2 h-2 w-2 rounded-full bg-green-500"></span>
                          <span className="text-green-700">{stok}</span>
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <Button
                        onClick={() => onEdit(item)}
                        className="flex items-center space-x-2 bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-blue-700 hover:shadow-md"
                      >
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                        <span>Edit</span>
                      </Button>

                      <Button
                      onClick={() => onDelete(item.id, item.nama)}
                        className="flex items-center space-x-2 bg-gradient-to-r from-red-600 to-red-700 px-4 py-2 text-sm font-medium text-white transition-all hover:from-red-700 hover:to-red-800 hover:shadow-md"
                      >
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                        <span>Hapus</span>
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
