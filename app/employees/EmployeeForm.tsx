'use client';

import { useState, useRef } from 'react';
import { createEmployee } from './actions';

type Department = { id: number; name: string };
type Position   = { id: number; name: string; departmentId: number };
type Skill      = { id: number; name: string };

type Props = {
  departments: Department[];
  positions:   Position[];
  skills:      Skill[];
  onSuccess?:  () => void;
};

export default function EmployeeForm({ departments, positions, skills, onSuccess }: Props) {
  const [selectedDeptId, setSelectedDeptId] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  // Filter position berdasarkan department yang dipilih
  const filteredPositions = positions.filter(
    (p) => p.departmentId === parseInt(selectedDeptId)
  );

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      await createEmployee(formData);
      setSuccess('Karyawan berhasil ditambahkan!');
      formRef.current?.reset();
      setSelectedDeptId('');
      if (onSuccess) {
        onSuccess();
      }
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Terjadi kesalahan saat menyimpan data.');
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form ref={formRef} action={handleSubmit} className="custom-card p-6 sm:p-7 rounded-2xl bg-white space-y-4">
      <div className="flex items-center gap-3 pb-3 border-b border-[#fcebe9]">
        <div className="w-10 h-10 bg-gradient-to-br from-[#fb8f90] to-[#f472b6] rounded-xl flex items-center justify-center shadow-md shadow-[#fb8f90]/10">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
        </div>
        <div>
          <h2 className="text-base font-bold text-slate-800 tracking-wide uppercase">Tambah Karyawan</h2>
          <p className="text-xs text-slate-400">Daftarkan data karyawan baru</p>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-xl text-xs flex items-center gap-2 animate-fadeIn">
          <svg className="w-5 h-5 flex-shrink-0 text-rose-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          <span className="font-semibold">{error}</span>
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div className="bg-[#fff0f0] border border-[#fddbd9] text-[#fb8f90] px-4 py-3 rounded-xl text-xs flex items-center gap-2 animate-fadeIn">
          <svg className="w-5 h-5 flex-shrink-0 text-[#fb8f90]" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span className="font-semibold">{success}</span>
        </div>
      )}

      {/* Nama */}
      <div>
        <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
          Nama Lengkap
        </label>
        <input
          type="text"
          name="name"
          required
          placeholder="Contoh: Budi Santoso"
          className="w-full custom-input rounded-xl px-4 py-2 text-sm focus:outline-none"
        />
      </div>

      {/* Email */}
      <div>
        <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
          Email
        </label>
        <input
          type="email"
          name="email"
          required
          placeholder="budi@email.com"
          className="w-full custom-input rounded-xl px-4 py-2 text-sm focus:outline-none"
        />
      </div>

      {/* Gender */}
      <div>
        <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
          Jenis Kelamin
        </label>
        <div className="flex gap-6 py-1">
          <label className="flex items-center gap-2 cursor-pointer group">
            <input type="radio" name="gender" value="male" required className="w-4 h-4 text-[#fb8f90] border-[#fae1de] focus:ring-offset-0 focus:ring-1 focus:ring-[#fb8f90] cursor-pointer" />
            <span className="text-sm text-slate-600 group-hover:text-slate-800 transition-colors">Laki-laki</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer group">
            <input type="radio" name="gender" value="female" className="w-4 h-4 text-[#fb8f90] border-[#fae1de] focus:ring-offset-0 focus:ring-1 focus:ring-[#fb8f90] cursor-pointer" />
            <span className="text-sm text-slate-600 group-hover:text-slate-800 transition-colors">Perempuan</span>
          </label>
        </div>
      </div>

      {/* Status */}
      <div>
        <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
          Status Karyawan
        </label>
        <select
          name="status"
          required
          className="w-full custom-input rounded-xl px-4 py-2 text-sm focus:outline-none cursor-pointer"
        >
          <option value="">-- Pilih Status --</option>
          <option value="active">Aktif</option>
          <option value="probation">Masa Percobaan</option>
          <option value="inactive">Tidak Aktif</option>
        </select>
      </div>

      {/* Departemen */}
      <div>
        <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
          Departemen
        </label>
        <select
          name="departmentId"
          value={selectedDeptId}
          onChange={(e) => setSelectedDeptId(e.target.value)}
          className="w-full custom-input rounded-xl px-4 py-2 text-sm focus:outline-none cursor-pointer"
        >
          <option value="">-- Pilih Departemen --</option>
          {departments.map((d) => (
            <option key={d.id} value={d.id}>{d.name}</option>
          ))}
        </select>
      </div>

      {/* Jabatan */}
      <div>
        <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
          Jabatan
        </label>
        <select
          name="positionId"
          required
          disabled={!selectedDeptId}
          className="w-full custom-input rounded-xl px-4 py-2 text-sm focus:outline-none cursor-pointer"
        >
          <option value="">
            {selectedDeptId ? '-- Pilih Jabatan --' : '(Pilih departemen dulu)'}
          </option>
          {filteredPositions.map((p) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
      </div>

      {/* Skills */}
      <div>
        <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
          Skill (boleh pilih lebih dari satu)
        </label>
        <div className="grid grid-cols-2 gap-2 p-2 bg-[#fffafa]/40 border border-[#fcebe9]/80 rounded-xl">
          {skills.map((skill) => (
            <label key={skill.id} className="flex items-center gap-1.5 cursor-pointer p-0.5 group">
              <input
                type="checkbox"
                name="skills"
                value={skill.id}
                className="w-4 h-4 text-[#fb8f90] border-[#fae1de] rounded focus:ring-offset-0 focus:ring-1 focus:ring-[#fb8f90] cursor-pointer"
              />
              <span className="text-xs text-slate-600 group-hover:text-slate-800 transition-colors">{skill.name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Foto Profil */}
      <div>
        <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
          Foto Profil
        </label>
        <input
          type="file"
          name="photo"
          accept="image/*"
          className="w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border file:border-[#fae1de] file:text-xs file:font-semibold file:bg-[#fffafa] file:text-[#fb8f90] hover:file:bg-[#fae1de] file:transition-colors file:cursor-pointer custom-input rounded-xl py-1.5 px-2"
        />
        <p className="text-[10px] text-slate-400 mt-1.5">Format: JPG, PNG, WEBP. Maks 2MB.</p>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-gradient-to-r from-[#fb8f90] to-[#f472b6] text-white py-2.5 px-4 rounded-xl text-sm font-bold hover:brightness-105 hover:shadow-md transition-all active:scale-[0.98] cursor-pointer"
      >
        {isSubmitting ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Menyimpan...
          </span>
        ) : (
          'Simpan Karyawan'
        )}
      </button>
    </form>
  );
}
