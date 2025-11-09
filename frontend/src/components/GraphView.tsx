// src/components/GraphView.tsx
import React, { useCallback, useEffect } from 'react';
import ReactFlow, {
  type Node,
  type Edge,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  type Connection,
  BackgroundVariant,
  type NodeTypes,
  type EdgeMouseHandler,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { useApp } from '../context/appContext';
import { HighScoreNode, LowScoreNode } from './CustomNode';

const nodeTypes: NodeTypes = {
  highScore: HighScoreNode,
  lowScore: LowScoreNode,
};

export const GraphView: React.FC = () => {
  const { graphData, createFriendship, deleteUser, removeFriendship, addHobbyToUser } = useApp();
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  // Enhanced handleDelete function
  const handleDelete = useCallback(async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this user?')) {
      return;
    }

    try {
      const userNode = graphData.nodes.find(node => node.id === id);
      if (!userNode) return;

      const connectedEdges = graphData.edges.filter(
        edge => edge.source === id || edge.target === id
      );

      if (connectedEdges.length > 0) {
        const shouldRemoveFriendships = window.confirm(
          `This user has ${connectedEdges.length} friendship(s). ` +
          `All friendships will be removed before deletion. Continue?`
        );
        
        if (!shouldRemoveFriendships) {
          return;
        }

        for (const edge of connectedEdges) {
          const otherUserId = edge.source === id ? edge.target : edge.source;
          try {
            await removeFriendship(id, otherUserId);
          } catch (error) {
            console.error(`Failed to remove friendship: ${error}`);
          }
        }
      }

      await deleteUser(id);
      
    } catch (error: any) {
      console.error('Error in handleDelete:', error);
    }
  }, [graphData, deleteUser, removeFriendship]);

  // Enhanced hobby drop handler
  const handleHobbyDrop = useCallback(async (userId: string, hobby: string) => {
    try {
      await addHobbyToUser(userId, hobby);
      console.log(`Added hobby "${hobby}" to user ${userId}`);
    } catch (error) {
      console.error('Failed to add hobby:', error);
    }
  }, [addHobbyToUser]);

  // Enhanced edge click handler
  const onEdgeClick: EdgeMouseHandler = useCallback((event, edge) => {
    event.stopPropagation();
    
    const sourceNode = graphData.nodes.find(node => node.id === edge.source);
    const targetNode = graphData.nodes.find(node => node.id === edge.target);
    
    if (sourceNode && targetNode) {
      alert(
        `🔗 Friendship Connection\n\n` +
        `👤 From: ${sourceNode.username}\n` +
        `🎯 To: ${targetNode.username}\n` +
        `📊 Combined Popularity: ${(sourceNode.popularityScore + targetNode.popularityScore).toFixed(1)}`
      );
    }
  }, [graphData.nodes]);

  // Enhanced node positioning with better layout
  useEffect(() => {
    if (!graphData || !graphData.nodes || !graphData.edges) {
      setNodes([]);
      setEdges([]);
      return;
    }

    if (graphData.nodes.length === 0) {
      setNodes([]);
      setEdges([]);
      return;
    }

    // Improved node positioning algorithm
    const flowNodes: Node[] = graphData.nodes.map((node, index) => {
      const row = Math.floor(index / 3);
      const col = index % 3;
      const x = col * 280 + 150;
      const y = row * 350 + 120;
      
      return {
        id: node.id,
        type: node.popularityScore > 5 ? 'highScore' : 'lowScore',
        position: { x, y },
        data: {
          username: node.username,
          age: node.age,
          popularityScore: node.popularityScore,
          hobbies: node.hobbies || [],
          onDelete: handleDelete,
          onHobbyDrop: handleHobbyDrop,
        },
      };
    });

    // Enhanced edges with gradient colors
    const flowEdges: Edge[] = graphData.edges.map(edge => ({
      id: edge.id,
      source: edge.source,
      target: edge.target,
      animated: true,
      style: { 
        stroke: '#3b82f6',
        strokeWidth: 3,
        strokeOpacity: 0.7,
      },
      className: 'cursor-pointer',
    }));

    setNodes(flowNodes);
    setEdges(flowEdges);
  }, [graphData, setNodes, setEdges, handleDelete, handleHobbyDrop]);

  const onConnect = useCallback(
    (params: Connection) => {
      if (params.source && params.target && params.source !== params.target) {
        createFriendship(params.source, params.target);
      }
    },
    [createFriendship]
  );

  // Enhanced empty state
  const hasNodes = graphData && graphData.nodes && graphData.nodes.length > 0;

  if (!hasNodes) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="text-center max-w-md mx-auto">
          <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center shadow-2xl">
            <div className="text-3xl">👥</div>
          </div>
          <h3 className="text-2xl font-bold text-white mb-3">No Users Yet</h3>
          <p className="text-slate-400 text-lg mb-6">
            Start building your social network by creating the first user
          </p>
          <div className="flex items-center justify-center gap-2 text-slate-500">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <span className="text-sm">Click the + button to begin</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onEdgeClick={onEdgeClick}
        nodeTypes={nodeTypes}
        fitView
        className="bg-transparent"
        minZoom={0.2}
        maxZoom={2}
      >
        {/* Enhanced Background */}
        <Background 
          variant={BackgroundVariant.Dots} 
          gap={50} 
          size={1} 
          color="#334155"
          className="opacity-30"
        />
        
        {/* Enhanced Controls - Fixed syntax */}
        <Controls 
          className="bg-slate-800/80 backdrop-blur-sm border border-slate-700 rounded-xl p-1"
        />
      </ReactFlow>
    </div>
  );
};