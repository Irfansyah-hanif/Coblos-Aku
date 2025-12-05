import { supabase } from '../config/supabaseClient';

export class ApiService {
  constructor(userId) {
    this.userId = userId;
  }

  // --- FOTO KANDIDAT ---
  async uploadCandidatePhoto(file, candidateName) {
    if (!file) return null;

    const cleanName = candidateName.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
    const fileExt = file.name.split('.').pop();
    const fileName = `${cleanName}-${Date.now()}.${fileExt}`;
    const filePath = `candidates/${fileName}`;

    try {
      const { error: uploadError } = await supabase.storage
        .from('candidate_photos') 
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        if (uploadError.statusCode === '403' || uploadError.error === 'Unauthorized') {
             throw new Error("Akses ditolak. Cek Login atau Policy Storage.");
        }
        throw uploadError;
      }

      const { data: publicUrlData } = supabase.storage
        .from('candidate_photos')
        .getPublicUrl(filePath);

      return publicUrlData.publicUrl;

    } catch (error) {
      throw new Error(`Gagal mengunggah foto: ${error.message || error}`);
    }
  }

  // --- KANDIDAT ---
  async getCandidates() {
    const { data, error } = await supabase
      .from('candidates')
      .select('*')
      .order('number', { ascending: true });
      
    if (error) throw error;
    return { data };
  }
  
  async addCandidate(candidateData) {
    const { data, error } = await supabase
      .from('candidates')
      .insert([candidateData])
      .select();

    if (error) throw error;
    return { data };
  }

  async updateCandidate(id, updates) {
    const { data, error } = await supabase
      .from('candidates')
      .update(updates)
      .eq('id', id)
      .select();

    if (error) throw error;
    return { data };
  }

  async deleteCandidate(id) {
    const { error } = await supabase
      .from('candidates')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  }

  // --- VOTING ---
  async getUserVotingStatus() {
    if (!this.userId) return { hasVoted: false, candidateId: null };
    
    const { data, error } = await supabase
      .from('votes')
      .select('candidate_id')
      .eq('user_id', this.userId)
      .limit(1)
      .single(); 
    
    if (error) {
       if (error.code !== 'PGRST116' && error.code !== '204') {
           console.error("Error getUserVotingStatus:", error);
       }
       return { hasVoted: false, candidateId: null };
    }

    if (data) {
       return { hasVoted: true, candidateId: data.candidate_id };
    }
    return { hasVoted: false, candidateId: null };
  }

  async castVote(candidateId, userRole) {
    if (userRole !== 'voter' && userRole !== 'admin') {
        throw new Error("Akses ditolak. Hanya Voter/Admin terdaftar.");
    }

    const status = await this.getUserVotingStatus();
    if (status.hasVoted) {
        throw new Error("Anda sudah menggunakan hak suara!");
    }

    const { error: insertError } = await supabase
      .from('votes')
      .insert([{ user_id: this.userId, candidate_id: candidateId, role: userRole }]);
    
    if (insertError) throw insertError;

    const { error: updateError } = await supabase.rpc('increment_vote', { 
        row_id: candidateId 
    });
    
    if (updateError) {
        try {
            const { data: current, error: fetchError } = await supabase
                .from('candidates')
                .select('vote_count')
                .eq('id', candidateId)
                .single();
            
            if (fetchError) throw fetchError;

            const newCount = (current?.vote_count || 0) + 1;
            const { error: manualUpdateError } = await supabase
                .from('candidates')
                .update({ vote_count: newCount })
                .eq('id', candidateId);

            if (manualUpdateError) throw manualUpdateError;
            
        } catch (manualError) {
             throw new Error(`Gagal update suara: ${manualError.message}`);
        }
    }
    
    return true;
  }

  // --- RESET PEMILIHAN (ADMIN) ---
  async resetElection() {
    // 1. Hapus SEMUA data di tabel votes
    // Menggunakan .not('id', 'is', null) untuk menghapus semua baris
    const { error: deleteError } = await supabase
      .from('votes')
      .delete()
      .not('id', 'is', null); 

    if (deleteError) {
      console.error("Reset Error (Delete Votes):", deleteError);
      throw new Error("Gagal mengosongkan tabel suara.");
    }

    // 2. Reset vote_count di tabel candidates menjadi 0
    const { error: updateError } = await supabase
      .from('candidates')
      .update({ vote_count: 0 })
      .not('id', 'is', null); 

    if (updateError) {
      console.error("Reset Error (Update Candidates):", updateError);
      throw new Error("Gagal mereset skor kandidat.");
    }

    return true;
  }

  // --- BERITA ---
  async getNews() {
    const { data, error } = await supabase
      .from('news')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { data };
  }
  
  async addNews(newsData) {
    const { data, error } = await supabase
      .from('news')
      .insert([newsData])
      .select();

    if (error) throw error;
    return { data };
  }
  
  async updateNews(id, updates) {
    const { data, error } = await supabase
      .from('news')
      .update(updates)
      .eq('id', id)
      .select();

    if (error) throw error;
    return { data };
  }
  
  async deleteNews(id) {
    const { error } = await supabase
      .from('news')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  }
}