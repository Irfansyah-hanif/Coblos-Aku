import React, { useState } from 'react'; 
import { Plus, X, Save, Image as ImageIcon, Edit, Briefcase } from 'lucide-react'; 
import CandidateCard from '../components/CandidateCard';

const CandidatesPage = ({ candidates, role, onVote, onViewDetail, onDelete, onAddCandidate, onEditCandidate, hasVoted, isLoading }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCandidate, setEditingCandidate] = useState(null);
  const [candidatePhoto, setCandidatePhoto] = useState(null); 

  const handleEditClick = (candidate) => {
    setEditingCandidate(candidate);
    setShowAddForm(true);
    setCandidatePhoto(null);
  };

  const handleCloseForm = () => {
    setShowAddForm(false);
    setEditingCandidate(null);
    setCandidatePhoto(null);
  }
    
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const candidateData = Object.fromEntries(formData.entries());
    delete candidateData.photo_url;
    
    const finalData = {
      ...candidateData,
      photoFile: candidatePhoto, 
    };

    if (editingCandidate) {
      onEditCandidate({ id: editingCandidate.id, ...finalData });
    } else {
      onAddCandidate(finalData);
    }
    handleCloseForm();
  };
    
  const isEditMode = !!editingCandidate;

  return (
    <div className="p-6 animate-fade-in pb-24 md:pb-10">
      <div className="flex justify-between items-start mb-8">
        <div className="border-l-4 border-amber-500 pl-4">
          <h2 className="text-3xl font-bold text-slate-900 font-serif">Kandidat</h2>
          <p className="text-slate-500 text-sm mt-1">Daftar calon pemimpin masa depan.</p>
        </div>
        
        {role === 'admin' && (
          <button 
            onClick={() => { setEditingCandidate(null); setShowAddForm(true); }}
            className="bg-slate-900 text-amber-500 px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 shadow-lg hover:bg-slate-800 transition"
          >
            <Plus size={18} /> Tambah
          </button>
        )}
      </div>

      {showAddForm && (
        <div className="fixed inset-0 bg-slate-900/80 z-[60] flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="bg-slate-900 p-4 flex justify-between items-center border-b border-slate-800 shrink-0">
              <h3 className="text-amber-500 font-bold flex items-center gap-2">
                {isEditMode ? <Edit size={18}/> : <Plus size={18}/>} {isEditMode ? 'Edit Data' : 'Tambah Kandidat'}
              </h3>
              <button onClick={handleCloseForm} className="text-slate-400 hover:text-white transition"><X size={20}/></button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <form onSubmit={handleSubmit} className="space-y-4">
                {isEditMode && <input type="hidden" name="id" value={editingCandidate.id} />}

                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Nama Kandidat</label>
                  <input name="name" required defaultValue={editingCandidate?.name || ''} className="w-full p-3 border border-slate-200 rounded-xl text-sm focus:border-amber-500" />
                </div>

                {/* FITUR: Input Posisi / Jabatan (Editable) */}
                <div>
                   <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block flex items-center gap-1">
                      <Briefcase size={12}/> Posisi / Jabatan
                   </label>
                   <input 
                      name="position" 
                      placeholder="Contoh: Calon Ketua, Calon Wakil" 
                      defaultValue={editingCandidate?.position || 'Calon Ketua'} 
                      className="w-full p-3 border border-slate-200 rounded-xl text-sm focus:border-amber-500" 
                   />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Nomor Urut</label>
                  <input name="number" type="number" required defaultValue={editingCandidate?.number || ''} className="w-full p-3 border border-slate-200 rounded-xl text-sm focus:border-amber-500" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">NIM</label>
                      <input name="nim" required defaultValue={editingCandidate?.nim || ''} className="w-full p-3 border border-slate-200 rounded-xl text-sm focus:border-amber-500" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Fakultas</label>
                      <input name="fakultas" required defaultValue={editingCandidate?.fakultas || ''} className="w-full p-3 border border-slate-200 rounded-xl text-sm focus:border-amber-500" />
                    </div>
                </div>

                 <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Prodi</label>
                      <input name="prodi" required defaultValue={editingCandidate?.prodi || ''} className="w-full p-3 border border-slate-200 rounded-xl text-sm focus:border-amber-500" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Status</label>
                      <input name="status" required defaultValue={editingCandidate?.status || ''} className="w-full p-3 border border-slate-200 rounded-xl text-sm focus:border-amber-500" />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                     <div>
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Tempat Lahir</label>
                      <input name="tempat_lahir" required defaultValue={editingCandidate?.tempat_lahir || ''} className="w-full p-3 border border-slate-200 rounded-xl text-sm focus:border-amber-500" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Tanggal Lahir</label>
                      <input name="tanggal_lahir" type="date" required defaultValue={editingCandidate?.tanggal_lahir || ''} className="w-full p-3 border border-slate-200 rounded-xl text-sm focus:border-amber-500" />
                    </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Jenis Kelamin</label>
                  <select name="jenis_kelamin" required defaultValue={editingCandidate?.jenis_kelamin || ''} className="w-full p-3 border border-slate-200 rounded-xl text-sm focus:border-amber-500">
                    <option value="" disabled>Pilih</option>
                    <option value="Laki-laki">Laki-laki</option>
                    <option value="Perempuan">Perempuan</option>
                  </select>
                </div>

                <div className="border p-4 rounded-xl border-slate-200 bg-slate-50">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block flex items-center gap-2">
                    <ImageIcon size={14}/> Foto Kandidat
                  </label>
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={(e) => setCandidatePhoto(e.target.files[0])} 
                    required={!isEditMode} 
                    className="w-full text-sm" 
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Visi</label>
                  <textarea name="vision" required defaultValue={editingCandidate?.vision || ''} className="w-full p-3 border border-slate-200 rounded-xl text-sm focus:border-amber-500" rows="2" />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Misi</label>
                  <textarea name="mission" required defaultValue={editingCandidate?.mission || ''} className="w-full p-3 border border-slate-200 rounded-xl text-sm focus:border-amber-500" rows="3" />
                </div>

                <button type="submit" className="w-full bg-slate-900 text-white py-3 rounded-xl text-sm font-bold hover:bg-slate-800 transition flex items-center justify-center gap-2 mt-4 shadow-lg cursor-pointer">
                  <Save size={18}/> Simpan Data
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {candidates.map(c => (
            <CandidateCard 
                key={c.id} 
                candidate={c} 
                role={role} 
                onVote={onVote} 
                onViewDetail={() => onViewDetail(c.id)} 
                onDelete={onDelete} 
                onEdit={handleEditClick}
                hasVoted={hasVoted} 
              />
          ))}
      </div>
    </div>
  );
};

export default CandidatesPage;