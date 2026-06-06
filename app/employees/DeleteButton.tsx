'use client';

import { deleteEmployee } from './actions';
import { useState } from 'react';

type Props = {
  id: number;
  name: string;
};

export default function DeleteButton({ id, name }: Props) {
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    if (!confirm(`Hapus karyawan "${name}"?`)) return;

    setIsDeleting(true);
    try {
      await deleteEmployee(id);
    } catch {
      alert('Gagal menghapus karyawan.');
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="text-red-600 hover:text-red-700 hover:bg-red-50 border border-[#fcebe9] hover:border-red-200 px-3.5 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1 h-8 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
    >
      {isDeleting ? (
        <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      ) : (
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      )}
      Hapus
    </button>
  );
}
