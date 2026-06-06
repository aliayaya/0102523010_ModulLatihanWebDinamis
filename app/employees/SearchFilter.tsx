'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function SearchFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [status, setStatus] = useState(searchParams.get('status') || '');

  useEffect(() => {
    setSearch(searchParams.get('search') || '');
    setStatus(searchParams.get('status') || '');
  }, [searchParams]);

  function handleFilter() {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (status) params.set('status', status);
    params.set('page', '1'); // Reset ke halaman 1 saat filter berubah
    router.push(`/employees?${params.toString()}`);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function handleReset() {
    setSearch('');
    setStatus('');
    router.push('/employees');
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function handleKeyDown(e: any) {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleFilter();
    }
  }

  return (
    <div className="bg-white p-5 rounded-2xl border border-[#fcebe9] shadow-sm">
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search Input */}
        <div className="flex-1 relative">
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Cari berdasarkan nama..."
            className="w-full border border-[#f9d8d5] rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#fb8f90]/10 focus:border-[#fb8f90] transition-all bg-slate-50/50 hover:bg-white"
          />
        </div>

        {/* Status Filter */}
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border border-[#f9d8d5] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#fb8f90]/10 focus:border-[#fb8f90] transition-all bg-slate-50/50 hover:bg-white min-w-[160px]"
        >
          <option value="">Semua Status</option>
          <option value="active">Aktif</option>
          <option value="probation">Masa Percobaan</option>
          <option value="inactive">Tidak Aktif</option>
        </select>

        {/* Buttons */}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleFilter}
            className="bg-gradient-to-r from-[#fb8f90] to-[#f472b6] text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:brightness-105 transition-all shadow-sm active:scale-[0.98]"
          >
            Cari
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="bg-slate-50 border border-[#f9d8d5]/60 text-slate-600 px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-slate-100 transition-all active:scale-[0.98]"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
