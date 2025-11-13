import { useState } from 'react';
import { Home, Users, Calendar, User } from 'lucide-react';
import { HomePage } from './components/HomePage';
import { ProfilePage } from './components/ProfilePage';
import { EditProfilePage } from './components/EditProfilePage';
import { ActivityPage } from './components/ActivityPage';
import { CommunityPage } from './components/CommunityPage';
import { PointsPage } from './components/PointsPage';

type Page = 'home' | 'organization' | 'activity' | 'profile' | 'editProfile' | 'points' | 'community';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={setCurrentPage} />;
      case 'profile':
        return <ProfilePage onNavigate={setCurrentPage} />;
      case 'editProfile':
        return <EditProfilePage onNavigate={setCurrentPage} />;
      case 'activity':
        return <ActivityPage onNavigate={setCurrentPage} />;
      case 'points':
        return <PointsPage onNavigate={setCurrentPage} />;
      case 'community':
        return <CommunityPage onNavigate={setCurrentPage} />;
      default:
        return <HomePage onNavigate={setCurrentPage} />;
    }
  };

  const showBottomNav = currentPage !== 'editProfile' && currentPage !== 'points' && currentPage !== 'community';

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-md mx-auto bg-white min-h-screen relative pb-20">
        {renderPage()}
        
        {showBottomNav && (
          <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white border-t border-gray-200">
            <div className="flex justify-around items-center h-16">
              <button
                onClick={() => setCurrentPage('home')}
                className={`flex flex-col items-center justify-center gap-1 flex-1 ${
                  currentPage === 'home' ? 'text-blue-600' : 'text-gray-500'
                }`}
              >
                <Home className="w-6 h-6" />
                <span className="text-xs">首页</span>
              </button>
              <button
                onClick={() => setCurrentPage('organization')}
                className={`flex flex-col items-center justify-center gap-1 flex-1 ${
                  currentPage === 'organization' ? 'text-blue-600' : 'text-gray-500'
                }`}
              >
                <Users className="w-6 h-6" />
                <span className="text-xs">组织</span>
              </button>
              <button
                onClick={() => setCurrentPage('activity')}
                className={`flex flex-col items-center justify-center gap-1 flex-1 ${
                  currentPage === 'activity' ? 'text-blue-600' : 'text-gray-500'
                }`}
              >
                <Calendar className="w-6 h-6" />
                <span className="text-xs">已参加</span>
              </button>
              <button
                onClick={() => setCurrentPage('profile')}
                className={`flex flex-col items-center justify-center gap-1 flex-1 ${
                  currentPage === 'profile' ? 'text-blue-600' : 'text-gray-500'
                }`}
              >
                <User className="w-6 h-6" />
                <span className="text-xs">我的</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
