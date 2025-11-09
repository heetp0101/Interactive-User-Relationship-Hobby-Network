// src/types.ts
export interface User {
  id: string;
  username: string;
  age: number;
  hobbies: string[];
  friends: string[];
  createdAt: Date;
  popularityScore: number;
}

export interface UserInput {
  username: string;
  age: number;
  hobbies: string[];
}

export interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export interface GraphNode {
  id: string;
  username: string;
  age: number;
  hobbies: string[];
  popularityScore: number;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
}