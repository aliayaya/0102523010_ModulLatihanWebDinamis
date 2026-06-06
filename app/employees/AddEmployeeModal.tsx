'use client';

import { useState } from 'react';
import EmployeeForm from './EmployeeForm';

type Department = { id: number; name: string };
type Position   = { id: number; name: string; departmentId: number };
type Skill      = { id: number; name: string };

type Props = {
  departments: Department[];
  positions:   Position[];
  skills:      Skill[];
};

export default function AddEmployeeModal({ departments, positions, skills }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 bg-gradient-to-r from-[#fb8f90] to-[#f472b6] text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:brightness-105 transition-all shadow-md active:scale-[0.98] cursor-pointer"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        Tambah Karyawan
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-[#4f3e3d]/30 backdrop-blur-[2px] transition-opacity animate-fadeIn"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Modal Content */}
          <div className="relative bg-white rounded-2xl shadow-xl border border-[#fcebe9] max-w-lg w-full max-h-[90vh] overflow-y-auto z-10 p-6 sm:p-7 animate-fadeIn">
            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors p-1.5 rounded-lg hover:bg-slate-100 cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <EmployeeForm 
              departments={departments}
              positions={positions}
              skills={skills}
              onSuccess={() => {
                // Tunda sedikit penutupan agar user bisa melihat toast sukses
                setTimeout(() => setIsOpen(false), 1200);
              }}
            />
          </div>
        </div>
      )}
    </>
  );
}
