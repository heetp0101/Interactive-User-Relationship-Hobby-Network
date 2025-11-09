// src/App.tsx
import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { AppProvider, useApp } from './context/AppContext';
import { GraphView } from './components/GraphView';
import { HobbySidebar } from './components/HobbySidebar';
import { UserPanel } from './components/UserPanel';
import { Loader2 } from 'lucide-react';

function AppContent() {
  const { fetchGraphData, loading, graphData } = useApp();

  useEffect(() => {
    fetchGraphData();
  }, [fetchGraphData]);

  const isInitialLoad = loading && (!graphData || !graphData.nodes || graphData.nodes.length === 0);

  return (
    <div className="flex h-screen bg-gray-100">
      <HobbySidebar />
      
      <div className="flex-1 relative">
        {isInitialLoad && (
          <div className="absolute inset-0 bg-white flex items-center justify-center z-40">
            <div className="text-center">
              <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
              <p className="text-gray-600">Loading network data...</p>
            </div>
          </div>
        )}
        
        <div className="h-full">
          <div className="bg-white border-b border-gray-200 px-6 py-4">
            <h1 className="text-2xl font-bold text-gray-800">User Relationship Network</h1>
            <p className="text-sm text-gray-600 mt-1">
              Connect users by dragging nodes together • Add hobbies by dragging from sidebar
            </p>
          </div>
          
          <div className="h-[calc(100%-80px)]">
            <GraphView />
          </div>
        </div>
      </div>

      <UserPanel />
      <Toaster position="bottom-right" />
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;