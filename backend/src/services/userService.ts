// src/services/userService.ts
import { v4 as uuidv4 } from 'uuid';
import db from '../database';
import { User, UserInput } from '../types';

export class UserService {
  // Get all friends of a user
  private getFriends(userId: string): string[] {
    const stmt = db.prepare(`
      SELECT user1_id, user2_id FROM friendships 
      WHERE user1_id = ? OR user2_id = ?
    `);
    const rows = stmt.all(userId, userId) as Array<{ user1_id: string; user2_id: string }>;
    
    return rows.map(row => row.user1_id === userId ? row.user2_id : row.user1_id);
  }

  // Get raw user data from database without calculating popularity
  private getRawUser(id: string): any {
    const stmt = db.prepare('SELECT * FROM users WHERE id = ?');
    return stmt.get(id);
  }

  // Calculate popularity score
  private calculatePopularityScore(userId: string): number {
    const userRow = this.getRawUser(userId);
    if (!userRow) return 0;

    const friends = this.getFriends(userId);
    const friendCount = friends.length;

    // Calculate shared hobbies
    let sharedHobbiesCount = 0;
    const userHobbies = new Set(JSON.parse(userRow.hobbies));

    friends.forEach(friendId => {
      const friendRow = this.getRawUser(friendId);
      if (friendRow) {
        const friendHobbies = JSON.parse(friendRow.hobbies);
        friendHobbies.forEach((hobby: string) => {
          if (userHobbies.has(hobby)) {
            sharedHobbiesCount++;
          }
        });
      }
    });

    return friendCount + (sharedHobbiesCount * 0.5);
  }

  // Get user by ID
  getUserById(id: string): User | null {
    const row = this.getRawUser(id);
    
    if (!row) return null;

    const friends = this.getFriends(id);
    const hobbies = JSON.parse(row.hobbies);
    
    return {
      id: row.id,
      username: row.username,
      age: row.age,
      hobbies,
      friends,
      createdAt: new Date(row.createdAt),
      popularityScore: this.calculatePopularityScore(id)
    };
  }

  // Get all users
  getAllUsers(): User[] {
    const stmt = db.prepare('SELECT * FROM users');
    const rows = stmt.all() as any[];
    
    return rows.map(row => {
      const friends = this.getFriends(row.id);
      const hobbies = JSON.parse(row.hobbies);
      
      return {
        id: row.id,
        username: row.username,
        age: row.age,
        hobbies,
        friends,
        createdAt: new Date(row.createdAt),
        popularityScore: this.calculatePopularityScore(row.id)
      };
    });
  }

  // Create user
  createUser(input: UserInput): User {
    const id = uuidv4();
    const createdAt = new Date().toISOString();
    
    const stmt = db.prepare(
      'INSERT INTO users (id, username, age, hobbies, createdAt) VALUES (?, ?, ?, ?, ?)'
    );
    
    stmt.run(id, input.username, input.age, JSON.stringify(input.hobbies), createdAt);
    
    return this.getUserById(id)!;
  }

  // Update user
  updateUser(id: string, input: Partial<UserInput>): User | null {
    const user = this.getUserById(id);
    if (!user) return null;

    const updates: string[] = [];
    const values: any[] = [];

    if (input.username !== undefined) {
      updates.push('username = ?');
      values.push(input.username);
    }
    if (input.age !== undefined) {
      updates.push('age = ?');
      values.push(input.age);
    }
    if (input.hobbies !== undefined) {
      updates.push('hobbies = ?');
      values.push(JSON.stringify(input.hobbies));
    }

    if (updates.length === 0) return user;

    values.push(id);
    const stmt = db.prepare(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`);
    stmt.run(...values);

    return this.getUserById(id);
  }

  // Delete user
  deleteUser(id: string): boolean {
    const friends = this.getFriends(id);
    
    if (friends.length > 0) {
      throw new Error('Cannot delete user with existing friendships. Remove friendships first.');
    }

    const stmt = db.prepare('DELETE FROM users WHERE id = ?');
    const result = stmt.run(id);
    
    return result.changes > 0;
  }

  // Create friendship
  createFriendship(userId1: string, userId2: string): void {
    if (userId1 === userId2) {
      throw new Error('Cannot create friendship with self');
    }

    const user1 = this.getUserById(userId1);
    const user2 = this.getUserById(userId2);

    if (!user1 || !user2) {
      throw new Error('One or both users not found');
    }

    // Ensure user1_id < user2_id for consistency
    const [smallerId, largerId] = userId1 < userId2 ? [userId1, userId2] : [userId2, userId1];

    try {
      const stmt = db.prepare(
        'INSERT INTO friendships (user1_id, user2_id) VALUES (?, ?)'
      );
      stmt.run(smallerId, largerId);
    } catch (error: any) {
      if (error.message.includes('UNIQUE constraint failed')) {
        throw new Error('Friendship already exists');
      }
      throw error;
    }
  }

  // Remove friendship
  removeFriendship(userId1: string, userId2: string): boolean {
    const [smallerId, largerId] = userId1 < userId2 ? [userId1, userId2] : [userId2, userId1];

    const stmt = db.prepare(
      'DELETE FROM friendships WHERE user1_id = ? AND user2_id = ?'
    );
    const result = stmt.run(smallerId, largerId);

    return result.changes > 0;
  }
}