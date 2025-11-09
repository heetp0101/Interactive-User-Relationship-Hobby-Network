// src/tests/userService.test.ts
import { UserService } from '../services/userService';
import db from '../database';

const userService = new UserService();

// Helper to reset database
function resetDatabase() {
  db.exec('DELETE FROM friendships');
  db.exec('DELETE FROM users');
}

// Test 1: Popularity Score Calculation
function testPopularityScore() {
  resetDatabase();
  console.log('\n🧪 Test 1: Popularity Score Calculation');

  // Create users
  const user1 = userService.createUser({ username: 'Alice', age: 25, hobbies: ['reading', 'gaming'] });
  const user2 = userService.createUser({ username: 'Bob', age: 30, hobbies: ['gaming', 'cooking'] });
  const user3 = userService.createUser({ username: 'Charlie', age: 28, hobbies: ['reading', 'music'] });

  // Create friendships
  userService.createFriendship(user1.id, user2.id);
  userService.createFriendship(user1.id, user3.id);

  const updatedUser1 = userService.getUserById(user1.id)!;
  
  // Expected: 2 friends + (2 shared hobbies * 0.5) = 3.0
  const expected = 2 + (2 * 0.5);
  
  if (updatedUser1.popularityScore === expected) {
    console.log('✅ PASS: Popularity score correctly calculated:', updatedUser1.popularityScore);
  } else {
    console.log('❌ FAIL: Expected', expected, 'but got', updatedUser1.popularityScore);
  }
}

// Test 2: Circular Friendship Prevention
function testCircularFriendshipPrevention() {
  resetDatabase();
  console.log('\n🧪 Test 2: Circular Friendship Prevention');

  const user1 = userService.createUser({ username: 'David', age: 22, hobbies: ['sports'] });
  const user2 = userService.createUser({ username: 'Eve', age: 24, hobbies: ['art'] });

  userService.createFriendship(user1.id, user2.id);

  try {
    userService.createFriendship(user2.id, user1.id);
    console.log('❌ FAIL: Should have prevented duplicate friendship');
  } catch (error: any) {
    if (error.message.includes('already exists')) {
      console.log('✅ PASS: Circular friendship correctly prevented');
    } else {
      console.log('❌ FAIL: Wrong error:', error.message);
    }
  }
}

// Test 3: Cannot Delete User With Friendships
function testDeleteUserWithFriendships() {
  resetDatabase();
  console.log('\n🧪 Test 3: Cannot Delete User With Friendships');

  const user1 = userService.createUser({ username: 'Frank', age: 26, hobbies: ['travel'] });
  const user2 = userService.createUser({ username: 'Grace', age: 29, hobbies: ['photography'] });

  userService.createFriendship(user1.id, user2.id);

  try {
    userService.deleteUser(user1.id);
    console.log('❌ FAIL: Should have prevented deletion with friendships');
  } catch (error: any) {
    if (error.message.includes('Cannot delete user with existing friendships')) {
      console.log('✅ PASS: User deletion correctly prevented');
    } else {
      console.log('❌ FAIL: Wrong error:', error.message);
    }
  }

  // Now remove friendship and try again
  userService.removeFriendship(user1.id, user2.id);
  const deleted = userService.deleteUser(user1.id);
  
  if (deleted) {
    console.log('✅ PASS: User successfully deleted after removing friendships');
  } else {
    console.log('❌ FAIL: Could not delete user after removing friendships');
  }
}

// Run all tests
console.log('🚀 Running User Service Tests...');
testPopularityScore();
testCircularFriendshipPrevention();
testDeleteUserWithFriendships();
console.log('\n✨ Tests completed!\n');