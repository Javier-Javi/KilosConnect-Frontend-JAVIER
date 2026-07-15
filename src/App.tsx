import './App.css'
import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { LoadingPage } from './pages/Loading'
import { LoginPage } from './pages/Login'
import ProtectedRoute from './components/ProtectedRoute'
import LogsMain from './pages/LogsModule/LogsMain'
import ManageProfileMain from './pages/ManageProfile/ManageProfileMain'
import ProfileMain from './pages/Profile/ProfileMain'
import ArchivesMain from './pages/ArchiveModule/ArchivesMain'

function App() {
  const [isPageLoading, setIsPageLoading] = useState(true);

  useEffect(() => {
    const initApp = async () => {
      try {
        // Simulating a backend network delay
        await new Promise(resolve => setTimeout(resolve, 1500)); 

        // 🌟 BACKEND MOCK: Automatically log in a fake admin for local testing
        // Change 'admin' to 'custodian' or remove it to test different access states.
        if (!localStorage.getItem('token')) {
          localStorage.setItem('token', 'fake-mock-jwt-token');
          localStorage.setItem('userRole', 'admin'); 
          // Adjust the keys above ('token', 'userRole') to match what your ProtectedRoute expects!
        }

      } catch (error) {
        console.error("Initialization failed", error);
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
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={["admin", "custodian"]}>
              <LogsMain />
            </ProtectedRoute>
          }
        />

        <Route
          path="/inventory"
          element={
            <ProtectedRoute allowedRoles={["admin", "custodian"]}>
              <LogsMain />
            </ProtectedRoute>
          }
        />

        <Route
          path="/live-task-monitor"
          element={
            <ProtectedRoute allowedRoles={["admin", "custodian"]}>
              <LogsMain />
            </ProtectedRoute>
          }
        />              
        <Route path='/' element={<Navigate to="/login" replace />} />
        <Route path='/login' element={<LoginPage />} />
        
        <Route path='/audit-logs' 
          element={
            <ProtectedRoute allowedRoles={['admin', 'custodian']}>
              <LogsMain/>
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

        <Route path='/archives'
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <ArchivesMain />
            </ProtectedRoute>
          }
        />

        {/* Redirects to login if route is not found */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;