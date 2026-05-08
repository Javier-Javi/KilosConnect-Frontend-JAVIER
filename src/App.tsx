import './App.css'
import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { LoadingPage } from './pages/Loading'
import { LoginPage } from './pages/Login'
import ProtectedRoute from './components/ProtectedRoute'
import  Logs  from './pages/LogsModule/LogsMain'
import ManageProfileMain from './pages/ManageProfile/ManageProfileMain'
import ProfileMain from './pages/Profile/ProfileMain'



function App() {
  const [isPageLoading, setIsPageLoading] = useState(true);

  useEffect(() => {
    const initApp = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 2000)); 
      } finally {
        setIsPageLoading(false);
      }
    };

    initApp();
  }, []);

  if (isPageLoading) {
    return <LoadingPage />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Navigate to="/login" replace />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/audit-logs' 
        element={
          <ProtectedRoute allowedRoles={['admin', 'custodian']}>
              <Logs />
            </ProtectedRoute>
          }
          />
          <Route path='/profile'
          element={
            <ProtectedRoute allowedRoles={['admin', 'custodian']}>
                <ProfileMain />
            </ProtectedRoute>
          }
        />
        <Route path='/manage-accounts'
        element={
          <ProtectedRoute allowedRoles={['admin']}>
              <ManageProfileMain />
          </ProtectedRoute>
        }
        />
      {/* redirects to login if not found or authenticated */}
      <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  
  );
}

export default App
 