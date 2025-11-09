// src/components/CustomNode.tsx
import React, { useState } from "react";
import { Handle, Position, type NodeProps } from "reactflow";
import { User, Trash2, Star, Plus, Activity } from "lucide-react";

interface CustomNodeData {
  username: string;
  age: number;
  popularityScore: number;
  hobbies: string[];
  onDelete: (id: string) => void;
  onHobbyDrop: (userId: string, hobby: string) => void;
}

const sectionCard =
  "rounded-xl bg-white/5 px-4 py-3 flex items-center justify-between shadow-sm";

const baseContainer =
  "relative rounded-2xl min-w-[260px] max-w-[300px] shadow-lg backdrop-blur-md transition-all duration-300 border-2";

/* ---------------------- HIGH SCORE NODE ---------------------- */
export const HighScoreNode: React.FC<NodeProps<CustomNodeData>> = ({
  data,
  id,
}) => {
  const { username, age, popularityScore, onDelete, onHobbyDrop } = data;
  const hobbies = data.hobbies || [];
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(false);
    const hobby = e.dataTransfer.getData("hobby");
    if (hobby && onHobbyDrop) onHobbyDrop(id, hobby);
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`${baseContainer}
        bg-gradient-to-br from-emerald-600/10 to-green-500/10 
        ${
          isDraggingOver
            ? "border-emerald-400 bg-emerald-500/20 scale-105 shadow-2xl"
            : "border-emerald-500/30 hover:border-emerald-400 hover:shadow-xl"
        }`}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!w-3 !h-3 !bg-emerald-400 !border-2 !border-white !shadow-lg"
      />

      {/* Inner content wrapper adds breathing space on left/right */}
      <div className="px-4 pt-4 pb-5">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-500 rounded-xl shadow-md">
              <User className="w-5 h-5 text-white" />
            </div>
            <div className="leading-snug">
              <h3 className="font-semibold text-white text-base">{username}</h3>
              <p className="text-emerald-200 text-sm mt-0.5">Age: {age}</p>
            </div>
          </div>
          <button
            onClick={() => onDelete(id)}
            className="p-2 hover:bg-red-500/20 rounded-lg transition-colors group"
            title="Delete user"
          >
            <Trash2 className="w-4 h-4 text-red-400 group-hover:text-red-300" />
          </button>
        </div>

        <div className="h-[1px] bg-emerald-500/20 mb-5" />

        {/* Popularity Section */}
        <div className={`${sectionCard} mb-5`}>
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-300" />
            <span className="text-emerald-200 text-sm font-medium">
              Popularity
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span className="text-white font-semibold text-lg">
              {popularityScore.toFixed(1)}
            </span>
          </div>
        </div>

        {/* Hobbies Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-emerald-200 text-sm font-medium">
              Hobbies & Interests
            </span>
            {isDraggingOver && (
              <Plus className="w-4 h-4 text-emerald-400 animate-pulse" />
            )}
          </div>

          {hobbies.length > 0 ? (
            <div className="flex flex-wrap gap-2 mt-1">
              {hobbies.map((hobby, index) => (
                <span
                  key={index}
                  className="px-2.5 py-1 bg-emerald-500/20 border border-emerald-400/30 text-emerald-100 text-xs rounded-md backdrop-blur-sm hover:bg-emerald-500/30 transition-colors"
                >
                  {hobby}
                </span>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 border-2 border-dashed border-emerald-400/20 rounded-xl">
              <p className="text-emerald-400/60 text-sm">Drop hobbies here</p>
            </div>
          )}
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="!w-3 !h-3 !bg-emerald-400 !border-2 !border-white !shadow-lg"
      />
    </div>
  );
};

/* ---------------------- LOW SCORE NODE ---------------------- */
export const LowScoreNode: React.FC<NodeProps<CustomNodeData>> = ({
  data,
  id,
}) => {
  const { username, age, popularityScore, onDelete, onHobbyDrop } = data;
  const hobbies = data.hobbies || [];
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(false);
    const hobby = e.dataTransfer.getData("hobby");
    if (hobby && onHobbyDrop) onHobbyDrop(id, hobby);
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`${baseContainer}
        bg-gradient-to-br from-blue-600/10 to-cyan-500/10 
        ${
          isDraggingOver
            ? "border-blue-400 bg-blue-500/20 scale-105 shadow-2xl"
            : "border-blue-500/30 hover:border-blue-400 hover:shadow-xl"
        }`}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!w-3 !h-3 !bg-blue-400 !border-2 !border-white !shadow-lg"
      />

      {/* Inner Wrapper Adds Horizontal Padding */}
      <div className="flex-col space-y-2.5 px-4 pt-4 pb-5">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-500 rounded-xl shadow-md">
              <User className="w-5 h-5 text-white" />
            </div>
            <div className="leading-snug">
              <h3 className="font-semibold text-white text-base">{username}</h3>
              <p className="text-blue-200 text-sm mt-0.5">Age: {age}</p>
            </div>
          </div>
          <button
            onClick={() => onDelete(id)}
            className="p-2 hover:bg-red-500/20 rounded-lg transition-colors group"
            title="Delete user"
          >
            <Trash2 className="w-4 h-4 text-red-400 group-hover:text-red-300" />
          </button>
        </div>

        <div className="h-2px bg-blue-500/20 mb-5" />

        {/* Popularity */}
        <div className={`${sectionCard} mb-5`}>
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-blue-300" />
            <span className="text-blue-200 text-sm font-medium">
              Popularity
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span className="text-white font-semibold text-lg">
              {popularityScore.toFixed(1)}
            </span>
          </div>
        </div>

        {/* Hobbies */}
        <div className="space-y-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-blue-200 text-sm font-medium">
              Hobbies & Interests
            </span>
            {isDraggingOver && (
              <Plus className="w-4 h-4 text-blue-400 animate-pulse" />
            )}
          </div>

          {hobbies.length > 0 ? (
            <div className="flex flex-wrap gap-2 mt-1">
              {hobbies.map((hobby, index) => (
                <span
                  key={index}
                  className="px-2.5 py-1 bg-blue-500/20 border border-blue-400/30 text-blue-100 text-xs rounded-md backdrop-blur-sm hover:bg-blue-500/30 transition-colors"
                >
                  {hobby}
                </span>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 border-2 border-dashed border-blue-400/20 rounded-xl">
              <p className="text-blue-400/60 text-sm">Drop hobbies here</p>
            </div>
          )}
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="!w-3 !h-3 !bg-blue-400 !border-2 !border-white !shadow-lg"
      />
    </div>
  );
};
