// src/components/HobbySidebar.tsx
import React, { useState, useMemo } from 'react';
import { useApp } from '../context/appContext';
import { Search, Users, Link, TrendingUp, Plus, Sparkles } from 'lucide-react';

const allHobbies = [
  'Reading', 'Gaming', 'Cooking', 'Photography', 'Travel',
  'Music', 'Sports', 'Art', 'Dancing', 'Writing',
  'Gardening', 'Hiking', 'Swimming', 'Cycling', 'Yoga',
  'Chess', 'Programming', 'Movies', 'Fashion', 'Fishing'
];

export const HobbySidebar: React.FC = () => {
  const { addHobbyToUser, graphData } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [draggedHobby, setDraggedHobby] = useState<string | null>(null);
  const [recentlyAdded, setRecentlyAdded] = useState<{userId: string, hobby: string} | null>(null);

  const filteredHobbies = useMemo(() => {
    return allHobbies.filter(hobby =>
      hobby.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const handleDragStart = (hobby: string) => (e: React.DragEvent) => {
    setDraggedHobby(hobby);
    e.dataTransfer.setData('hobby', hobby);
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleDragEnd = () => {
    setDraggedHobby(null);
  };

  const showAddFeedback = (userId: string, hobby: string) => {
    setRecentlyAdded({ userId, hobby });
    setTimeout(() => setRecentlyAdded(null), 3000);
  };

  const totalUsers = graphData?.nodes?.length || 0;
  const totalConnections = graphData?.edges?.length || 0;
  const avgPopularity = graphData?.nodes?.length 
    ? graphData.nodes.reduce((sum, node) => sum + node.popularityScore, 0) / graphData.nodes.length 
    : 0;

  return (
    <div className="w-80 bg-gradient-to-b from-slate-900 to-slate-800 border-r border-slate-700 flex flex-col h-full shadow-2xl">
      {/* Header Section */}
      <div className="p-6 border-b border-slate-700 space-y-4 ">
        {/* Logo and Title */}
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500 rounded-xl shadow-lg">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-lg font-bold text-white leading-tight">Social Network</h1>
            <p className="text-slate-400 text-xs leading-tight">Workflow Dashboard</p>
          </div>
        </div>
        
        {/* Search Bar */}
        <div className="space-y-2 mt-4">
          <div className="relative">
            {/* <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" /> */}
            <input
              type="text"
              placeholder="Search hobbies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 bg-slate-800 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-slate-400 text-sm transition-all duration-200"
            />
          </div>

          {/* Success Notification */}
          {recentlyAdded && (
            <div className="p-2 bg-green-500/20 border border-green-500/30 rounded-lg backdrop-blur-sm">
              <div className="flex items-center gap-1.5 text-green-400 text-xs">
                <Plus className="w-3 h-3" />
                <span>Added <strong>"{recentlyAdded.hobby}"</strong> to user</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Hobbies Content Section */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {/* Section Header */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Available Hobbies</h3>
            <span className="text-xs text-slate-500 bg-slate-700 px-2 py-1 rounded-full">
              {filteredHobbies.length}
            </span>
          </div>
          
          <div className="flex items-center gap-1.5 text-slate-400 text-xs">
            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></div>
            <span>Drag & drop onto user nodes</span>
          </div>
        </div>
        
        {/* Hobbies Grid */}
        <div className="grid grid-cols-2 gap-2">
          {filteredHobbies.map((hobby) => (
            <div
              key={hobby}
              draggable
              onDragStart={handleDragStart(hobby)}
              onDragEnd={handleDragEnd}
              className={`
                p-2.5 rounded-lg border cursor-grab active:cursor-grabbing transition-all duration-200 group
                ${draggedHobby === hobby 
                  ? 'border-blue-500 bg-blue-500/20 shadow-lg scale-105' 
                  : 'border-slate-600 bg-slate-800/50 hover:border-blue-400 hover:bg-slate-700/50'
                }
              `}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-white group-hover:text-blue-200 transition-colors truncate">
                  {hobby}
                </span>
                <div className={`
                  w-1.5 h-1.5 rounded-full transition-all duration-200 flex-shrink-0 ml-1
                  ${draggedHobby === hobby ? 'bg-blue-400 scale-150' : 'bg-slate-600 group-hover:bg-blue-400'}
                `} />
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredHobbies.length === 0 && (
          <div className="text-center py-8 space-y-3">
            <div className="w-12 h-12 mx-auto bg-slate-700 rounded-xl flex items-center justify-center">
              <Search className="w-5 h-5 text-slate-500" />
            </div>
            <div className="space-y-1">
              <p className="text-slate-400 text-sm">No hobbies found</p>
              <p className="text-slate-500 text-xs">Try a different search term</p>
            </div>
          </div>
        )}
      </div>

      {/* Statistics Footer */}
      <div className="p-6 border-t border-slate-700 bg-slate-800/50 backdrop-blur-sm space-y-4">
        <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Network Analytics</h3>
        
        {/* Stats List */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-400" />
              <span className="text-slate-400 text-sm">Total Users</span>
            </div>
            <span className="text-white font-semibold text-sm">{totalUsers}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Link className="w-4 h-4 text-green-400" />
              <span className="text-slate-400 text-sm">Connections</span>
            </div>
            <span className="text-white font-semibold text-sm">{totalConnections}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-purple-400" />
              <span className="text-slate-400 text-sm">Avg. Popularity</span>
            </div>
            <span className="text-white font-semibold text-sm">{avgPopularity.toFixed(1)}</span>
          </div>
        </div>

        {/* Network Health */}
        <div className="p-3 bg-slate-700/50 rounded-lg space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-xs">Network Health</span>
            <span className={`text-xs font-medium ${
              totalConnections / Math.max(totalUsers, 1) > 0.5 ? 'text-green-400' : 'text-yellow-400'
            }`}>
              {totalConnections / Math.max(totalUsers, 1) > 0.5 ? 'Strong' : 'Developing'}
            </span>
          </div>
          <div className="w-full bg-slate-600 rounded-full h-1.5">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-1.5 rounded-full transition-all duration-500"
              style={{ 
                width: `${Math.min((totalConnections / Math.max(totalUsers * 2, 1)) * 100, 100)}%` 
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};