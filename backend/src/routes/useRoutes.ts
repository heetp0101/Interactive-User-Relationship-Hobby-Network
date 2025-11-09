// src/routes/userRoutes.ts
import { Router, Request, Response } from 'express';
import { UserService } from '../services/userService';
import { GraphData } from '../types';

const router = Router();
const userService = new UserService();

// GET /api/users - Fetch all users
router.get('/users', (req: Request, res: Response) => {
  try {
    const users = userService.getAllUsers();
    res.json(users);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/users - Create new user
router.post('/users', (req: Request, res: Response) => {
  try {
    const { username, age, hobbies } = req.body;

    // Validation
    if (!username || typeof username !== 'string') {
      return res.status(400).json({ error: 'Username is required and must be a string' });
    }
    if (!age || typeof age !== 'number' || age < 0) {
      return res.status(400).json({ error: 'Age is required and must be a positive number' });
    }
    if (!Array.isArray(hobbies)) {
      return res.status(400).json({ error: 'Hobbies must be an array' });
    }

    const user = userService.createUser({ username, age, hobbies });
    res.status(201).json(user);
  } catch (error: any) {
    if (error.message.includes('UNIQUE constraint failed')) {
      return res.status(409).json({ error: 'Username already exists' });
    }
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/users/:id - Update user
router.put('/users/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const user = userService.updateUser(id, updates);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error: any) {
    if (error.message.includes('UNIQUE constraint failed')) {
      return res.status(409).json({ error: 'Username already exists' });
    }
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/users/:id - Delete user
router.delete('/users/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = userService.deleteUser(id);
    
    if (!deleted) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'User deleted successfully' });
  } catch (error: any) {
    if (error.message.includes('Cannot delete user with existing friendships')) {
      return res.status(409).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
});

// POST /api/users/:id/link - Create friendship
router.post('/users/:id/link', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { friendId } = req.body;

    if (!friendId) {
      return res.status(400).json({ error: 'friendId is required' });
    }

    userService.createFriendship(id, friendId);
    
    const user = userService.getUserById(id);
    res.json(user);
  } catch (error: any) {
    if (error.message.includes('not found')) {
      return res.status(404).json({ error: error.message });
    }
    if (error.message.includes('already exists')) {
      return res.status(409).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/users/:id/unlink - Remove friendship
router.delete('/users/:id/unlink', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { friendId } = req.body;

    if (!friendId) {
      return res.status(400).json({ error: 'friendId is required' });
    }

    const removed = userService.removeFriendship(id, friendId);
    
    if (!removed) {
      return res.status(404).json({ error: 'Friendship not found' });
    }

    const user = userService.getUserById(id);
    res.json(user);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/graph - Return graph data
router.get('/graph', (req: Request, res: Response) => {
  try {
    const users = userService.getAllUsers();
    
    const nodes = users.map(user => ({
      id: user.id,
      username: user.username,
      age: user.age,
      hobbies: user.hobbies,
      popularityScore: user.popularityScore
    }));

    const edges: GraphData['edges'] = [];
    const processedPairs = new Set<string>();

    users.forEach(user => {
      user.friends.forEach(friendId => {
        const pairKey = [user.id, friendId].sort().join('-');
        if (!processedPairs.has(pairKey)) {
          edges.push({
            id: `${user.id}-${friendId}`,
            source: user.id,
            target: friendId
          });
          processedPairs.add(pairKey);
        }
      });
    });

    res.json({ nodes, edges });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;