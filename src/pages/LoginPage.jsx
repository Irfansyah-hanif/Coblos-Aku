import React, { useState } from 'react';
// import { Vote } from 'lucide-react'; // Ikon Vote dihapus karena diganti gambar

// Import komponen baru
import AuthForm from '../components/AuthForm'; 
import RoleSelectionButtons from '../components/RoleSelectionButtons'; 

const LoginPage = ({ onLogin, onRegister, onGuestLogin }) => { 
    const [selectedRole, setSelectedRole] = useState(null); 
    
    const handleSelectRole = (role) => {
        if (role === 'guest') {
            onGuestLogin();
        } else {
            setSelectedRole(role);
        }
    };
    
    // Komponen Header dan Background
    const Header = () => (
        <>
            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-amber-500/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl"></div>
            
            {/* Logo Area (Dimodifikasi menggunakan Image) */}
            <div className="w-28 h-28 bg-slate-800 rounded-3xl flex items-center justify-center mb-8 shadow-2xl relative z-10 border border-slate-700">
                <img 
                    src="/coblosaku.png" 
                    alt="Logo Coblos Aku" 
                    className="w-20 h-20 object-contain" 
                />
            </div>
            
            {/* Judul dengan Style yang Konsisten */}
            <h1 className="text-4xl font-bold mb-2 tracking-tight relative z-10 text-white">
                COBLOS <span className="text-amber-500 italic font-serif">AKU</span>
            </h1>
            <p className="text-slate-400 mb-12 text-center text-sm font-medium relative z-10 max-w-xs">Sistem Pemilihan Terpercaya & Elegan</p>
        </>
    );

    return (
        <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6 text-white relative overflow-hidden">
            <Header />

            {selectedRole ? (
                // Tampilan 2: Formulir Login/Register
                <AuthForm 
                    onLogin={onLogin}         
                    onRegister={onRegister}   
                    role={selectedRole}       
                    onBack={() => setSelectedRole(null)} 
                />
            ) : (
                // Tampilan 1: Tombol Pemilihan Peran
                <RoleSelectionButtons onSelectRole={handleSelectRole} />
            )}
        </div>
    );
};

export default LoginPage;