import React, { useState } from 'react';
import { Award, Info, User, ChevronLeft, Calendar, Mail, GraduationCap, CheckCircle, Clock, X, ZoomIn } from 'lucide-react'; 

const CandidateDetailPage = ({ candidate, onVote, role, hasVoted, isLoading, onBack }) => {
  // State untuk mengontrol modal gambar
  const [isImageOpen, setIsImageOpen] = useState(false);

  if (isLoading) return <div className="p-6">Loading...</div>;
  if (!candidate) return <div className="p-6">Kandidat tidak ditemukan.</div>;

  const formatMission = (missionString) => {
    if (!missionString) return [];
    return missionString
      .split('\n') 
      .map(m => m.trim())
      .filter(m => m !== '')
      .map(m => m.replace(/^[\d\.\-\*]+\s*/, '')); 
  };

  const missionsList = formatMission(candidate.mission);
  
  // Cek Waktu Habis untuk UI
  const electionEndDate = localStorage.getItem('electionEndDate');
  const isTimeUp = electionEndDate ? new Date() > new Date(electionEndDate) : false;

  return (
    <div className="p-6 animate-fade-in pb-24 max-w-3xl mx-auto">
      <button onClick={onBack} className="text-slate-600 flex items-center gap-1 mb-6 hover:text-slate-800 transition">
        <ChevronLeft size={20}/> Kembali
      </button>

      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
        {/* Header dengan Foto */}
        <div className="relative bg-slate-900/90 p-8 pt-16">
          <div className="absolute top-4 right-4 bg-amber-500 text-slate-900 px-4 py-1.5 rounded-full text-lg font-extrabold shadow-md">
            No. {candidate.number}
          </div>
          <div className="flex items-center gap-6">
            
            {/* FOTO KANDIDAT (Dapat diklik untuk Inspect) */}
            <div 
                className="relative w-28 h-28 rounded-full border-4 border-amber-500 bg-slate-200 overflow-hidden shadow-xl shrink-0 cursor-pointer group"
                onClick={() => setIsImageOpen(true)}
                title="Klik untuk memperbesar"
            >
              <img 
                src={candidate.photo_url || "https://placehold.co/150x150"} 
                alt={candidate.name} 
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/150x150?text=Foto"; }}
              />
              {/* Overlay Icon saat Hover */}
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <ZoomIn size={24} className="text-white drop-shadow-md"/>
              </div>
            </div>

            <div className='text-white'>
              <p className="text-sm font-light text-amber-300">{candidate.position || 'Calon Ketua'}</p>
              <h1 className="text-3xl font-bold leading-tight mt-1">{candidate.name}</h1>
            </div>
          </div>
        </div>
        
        <div className="p-6 space-y-8">
          {/* Data Diri */}
          <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2 text-lg uppercase tracking-wider border-b pb-2">
                <User size={20} className="text-amber-500"/> Data Diri
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 text-sm">
              <DetailItem icon={Mail} label="NIM" value={candidate.nim} />
              <DetailItem icon={Calendar} label="TTL" value={`${candidate.tempat_lahir || ''}, ${candidate.tanggal_lahir || ''}`} />
              <DetailItem icon={User} label="Jenis Kelamin" value={candidate.jenis_kelamin} />
              <DetailItem icon={GraduationCap} label="Fakultas" value={candidate.fakultas} />
              <DetailItem icon={GraduationCap} label="Prodi" value={candidate.prodi} />
            </div>
          </div>

          {/* Visi */}
          <div className="p-6 rounded-xl border border-amber-300 bg-amber-50/50">
            <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2 text-xl uppercase tracking-wider">
                <Award size={20} className="text-amber-700"/> Visi
            </h3>
            <p className="text-slate-800 leading-relaxed whitespace-pre-wrap">{candidate.vision}</p>
          </div>
          
          {/* Misi */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2 text-xl uppercase tracking-wider">
                <Info size={20} className="text-amber-500"/> Misi
            </h3>
            
            {missionsList.length > 0 ? (
                <ul className="space-y-3 list-none p-0">
                    {missionsList.map((m, i) => (
                        <li key={i} className="flex gap-3 text-base text-slate-700 items-start">
                            <span className="font-bold text-amber-600 shrink-0 mt-0.5 select-none">{i + 1}.</span>
                            <span className="leading-relaxed">{m}</span>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-slate-500 italic">Belum ada data misi.</p>
            )}
          </div>
          
          {/* Tombol Vote */}
          {role === 'voter' && !hasVoted && !isTimeUp && (
            <div className="sticky bottom-0 bg-white border-t border-slate-100 p-4 -mx-6 -mb-6 shadow-t-xl">
              <button 
                onClick={() => onVote(candidate.id)} 
                className="w-full py-3 bg-amber-500 text-slate-900 rounded-xl text-lg font-bold hover:bg-amber-400 shadow-lg shadow-amber-300 transition-all active:scale-[0.99] flex items-center justify-center gap-3"
              >
                <CheckCircle size={24} /> Coblos Kandidat Ini
              </button>
            </div>
          )}

          {/* Keterangan Waktu Habis */}
          {role === 'voter' && !hasVoted && isTimeUp && (
             <div className="sticky bottom-0 bg-red-50 border-t border-red-200 p-4 -mx-6 -mb-6 shadow-t-xl text-center">
                 <p className="text-red-600 font-bold flex items-center justify-center gap-2">
                     <Clock size={20}/> Waktu Pemilihan Sudah Habis
                 </p>
             </div>
          )}

          {/* Status Sudah Memilih */}
          {role === 'voter' && hasVoted && (
            <div className="p-3 bg-green-50 text-green-700 rounded-xl text-center font-bold">
              <CheckCircle size={20} className="inline-block mr-2"/> Anda SUDAH memilih.
            </div>
          )}
        </div>
      </div>

      {/* --- MODAL INSPECT GAMBAR --- */}
      {isImageOpen && (
        <div 
            className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in cursor-zoom-out"
            onClick={() => setIsImageOpen(false)}
        >
            {/* Tombol Close */}
            <button 
                onClick={() => setIsImageOpen(false)}
                className="absolute top-6 right-6 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition z-50"
            >
                <X size={32} />
            </button>

            {/* Gambar Full */}
            <img 
                src={candidate.photo_url || "https://placehold.co/150x150?text=Foto"} 
                alt={candidate.name}
                className="max-w-full max-h-[85vh] rounded-lg shadow-2xl object-contain cursor-default"
                onClick={(e) => e.stopPropagation()} // Mencegah modal tertutup saat klik gambar
            />
            
            <p className="absolute bottom-6 text-white/80 text-sm font-medium bg-black/50 px-4 py-2 rounded-full">
                {candidate.name}
            </p>
        </div>
      )}

    </div>
  );
};

const DetailItem = ({ icon: Icon, label, value }) => (
    <div className='flex items-start gap-3'>
        <Icon size={18} className='text-amber-500 mt-0.5 shrink-0'/>
        <div>
            <p className='text-xs font-bold text-slate-500 uppercase tracking-wider'>{label}</p>
            <p className='text-slate-700 font-medium leading-snug'>{value || '-'}</p>
        </div>
    </div>
);

export default CandidateDetailPage;