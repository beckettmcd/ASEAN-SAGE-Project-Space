import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Layout } from './components/Layout';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { ToRListPage } from './pages/ToRListPage';
import { ToRDetailPage } from './pages/ToRDetailPage';
import { AssignmentListPage } from './pages/AssignmentListPage';
import { IndicatorListPage } from './pages/IndicatorListPage';
import { BudgetListPage } from './pages/BudgetListPage';
import { RiskListPage } from './pages/RiskListPage';
import { EvidenceListPage } from './pages/EvidenceListPage';
import { DonorProjectsPage } from './pages/DonorProjectsPage';
import { CalendarPage } from './pages/CalendarPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000 // 5 minutes
    }
  }
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Layout>
                    <DashboardPage />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/tors"
              element={
                <ProtectedRoute>
                  <Layout>
                    <ToRListPage />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/tors/:id"
              element={
                <ProtectedRoute>
                  <Layout>
                    <ToRDetailPage />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/assignments"
              element={
                <ProtectedRoute>
                  <Layout>
                    <AssignmentListPage />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/indicators"
              element={
                <ProtectedRoute>
                  <Layout>
                    <IndicatorListPage />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/budgets"
              element={
                <ProtectedRoute>
                  <Layout>
                    <BudgetListPage />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/risks"
              element={
                <ProtectedRoute>
                  <Layout>
                    <RiskListPage />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/evidence"
              element={
                <ProtectedRoute>
                  <Layout>
                    <EvidenceListPage />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/donor-projects"
              element={
                <ProtectedRoute>
                  <Layout>
                    <DonorProjectsPage />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/calendar"
              element={
                <ProtectedRoute>
                  <Layout>
                    <CalendarPage />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;

