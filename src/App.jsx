import React from "react";

// Controller Hook
import useAppController from "./hooks/useAppController";

// Layout Components
import HeaderNavigation from "./components/HeaderNavigation";
import BottomNavigation from "./components/BottomNavigation";
import GlobalModal from "./components/GlobalModal"; 

// Pages
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import CandidatesPage from "./pages/CandidatesPage";
import VotingPage from "./pages/VotingPage";
import NewsPage from "./pages/NewsPage";
import ProfilePage from "./pages/ProfilePage";
import CandidateDetailPage from "./pages/CandidateDetailPage";
import NewsDetailPage from "./pages/NewsDetailPage";
// ---------------------------------------------------------------------

export default function App() {
  const {
    role,
    user,
    activeTab,
    setActiveTab,
    candidates,
    news,
    userVoteStatus,

    // State Kandidat
    selectedCandidateId, 
    setSelectedCandidateId, 

    // State untuk Berita
    selectedNews,
    setSelectedNews,
    
    isLoading,
    handleLogin,
    // Handler Auth
    handleRegister, 
    handleGuestLogin,
    handleLogout,

    // Handler Vote & Kandidat
    handleVote,
    handleAddCandidate,
    handleDeleteCandidate,
    handleEditCandidate,
    
    // Handler Berita
    handleAddNews,
    handleEditNews, 
    handleDeleteNews,
    
    // MODAL STATE DARI HOOK
    modalState, 
    closeModal, 
    
    // Props untuk HomePage
    electionEndDate,
    handleSetEndDate,

    // FITUR RESET
    handleResetElection,

    // FITUR PROFILE
    handleUpdateProfile
  } = useAppController();

  const currentCandidate = candidates.find(c => c.id === selectedCandidateId);
  
  const handleViewCandidateDetail = (candidateId) => {
    setSelectedCandidateId(candidateId);
  };
  
  const handleCloseCandidateDetail = () => {
    setSelectedCandidateId(null);
  };
  
  const handleViewNewsDetail = (newsItem) => {
    setSelectedNews(newsItem);
  };

  const handleCloseNewsDetail = () => {
    setSelectedNews(null);
  };

  const isViewingDetailPage = !!selectedNews || !!selectedCandidateId;

  return (
    <>
      <GlobalModal 
          isOpen={modalState.isOpen}
          type={modalState.type}
          title={modalState.title}
          message={modalState.message}
          onClose={closeModal}
          isConfirm={modalState.isConfirm}
          onConfirmAction={modalState.onConfirmAction}
      />
      
      {!role ? (
        <LoginPage 
          onLogin={handleLogin} 
          onRegister={handleRegister} 
          onGuestLogin={handleGuestLogin}
        />
      ) : (
        <div className="min-h-screen bg-slate-50 font-sans">
          
          {!isViewingDetailPage && ( 
            <HeaderNavigation
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              role={role}
              user={user}
              onLogout={handleLogout}
            />
          )}

          <main className="md:pt-20 pb-safe md:pb-10 w-full md:max-w-7xl md:mx-auto p-4 md:p-6">

            {selectedCandidateId && (
                <CandidateDetailPage 
                  candidate={currentCandidate} 
                  onBack={handleCloseCandidateDetail} 
                  onVote={handleVote} 
                  role={role}
                  hasVoted={userVoteStatus.hasVoted}
                  isLoading={isLoading}
                />
            )}
            
            {!selectedCandidateId && selectedNews && ( 
                <NewsDetailPage 
                  newsItem={selectedNews} 
                  onBack={handleCloseNewsDetail} 
                  role={role} 
                  onEditNews={handleEditNews} 
                  onDeleteNews={handleDeleteNews} 
                />
            )}
            
            {!isViewingDetailPage && ( 
              <>
                {activeTab === "home" && (
                  <HomePage
                    role={role}
                    userVoteStatus={userVoteStatus}
                    setActiveTab={setActiveTab}
                    news={news}
                    onViewNewsDetail={handleViewNewsDetail}
                    electionEndDate={electionEndDate}
                    handleSetEndDate={handleSetEndDate}
                  />
                )}

                {activeTab === "candidates" && (
                  <CandidatesPage
                    candidates={candidates}
                    role={role}
                    onVote={handleVote}
                    onViewDetail={handleViewCandidateDetail} 
                    onAddCandidate={handleAddCandidate}
                    onEditCandidate={handleEditCandidate}
                    hasVoted={userVoteStatus.hasVoted}
                    isLoading={isLoading}
                    onDelete={handleDeleteCandidate}
                  />
                )}

                {activeTab === "voting" && (
                  <VotingPage 
                    candidates={candidates} 
                    role={role}
                    onResetElection={handleResetElection}
                  />
                )}

                {activeTab === "news" && (
                  <NewsPage 
                    news={news} 
                    role={role} 
                    onAddNews={handleAddNews}
                    onViewDetail={handleViewNewsDetail}
                    onEditNews={handleEditNews} 
                    onDeleteNews={handleDeleteNews} 
                  />
                )}

                {activeTab === "profile" && (
                  <ProfilePage
                    user={user}
                    role={role}
                    onLogout={handleLogout}
                    // Pass fungsi update profile
                    onUpdateProfile={handleUpdateProfile}
                  />
                )}
              </>
            )}
          </main>

          {!isViewingDetailPage && ( 
            <BottomNavigation 
              activeTab={activeTab} 
              setActiveTab={setActiveTab} 
              onLogout={handleLogout} 
              role={role} 
            />
          )}
        </div>
      )}
    </>
  );
}