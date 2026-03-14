/**
 * API Test Script for Profile System
 * 
 * This script tests the profile API endpoints to ensure they work correctly.
 * Run this after setting up the database migrations.
 */

const TEST_WALLET_ADDRESS = '0x1234567890123456789012345678901234567890'
const API_BASE_URL = 'http://localhost:3000/api'

async function testProfileAPI() {
  console.log('🧪 Testing Profile API Endpoints\n')

  // Test 1: GET non-existent user (should return null with wallet address)
  console.log('Test 1: Fetching non-existent user profile...')
  try {
    const response = await fetch(`${API_BASE_URL}/users/${TEST_WALLET_ADDRESS}`)
    const data = await response.json()
    
    console.log('✅ Response:', JSON.stringify(data, null, 2))
    
    if (data.user === null && data.walletAddress === TEST_WALLET_ADDRESS) {
      console.log('✅ Test 1 PASSED: Correctly returns null user with wallet address\n')
    } else {
      console.log('❌ Test 1 FAILED: Unexpected response structure\n')
    }
  } catch (error) {
    console.error('❌ Test 1 FAILED:', error)
  }

  // Test 2: CREATE new profile (PATCH with wallet address)
  console.log('Test 2: Creating new profile...')
  try {
    const profileData = {
      display_name: 'Test User',
      bio: 'This is a test profile',
      avatar_url: 'https://api.dicebear.com/9.x/adventurer/svg?seed=test'
    }

    const response = await fetch(`${API_BASE_URL}/users/${TEST_WALLET_ADDRESS}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profileData)
    })
    
    const data = await response.json()
    
    console.log('✅ Response:', JSON.stringify(data, null, 2))
    
    if (data.success && data.user && data.user.wallet_address === TEST_WALLET_ADDRESS) {
      console.log('✅ Test 2 PASSED: Successfully created profile\n')
      
      // Store user ID for next tests
      global.testUserId = data.user.id
    } else {
      console.log('❌ Test 2 FAILED: Profile creation failed\n')
    }
  } catch (error) {
    console.error('❌ Test 2 FAILED:', error)
  }

  // Test 3: GET existing user (should return full profile)
  console.log('Test 3: Fetching existing user profile...')
  try {
    const response = await fetch(`${API_BASE_URL}/users/${TEST_WALLET_ADDRESS}`)
    const data = await response.json()
    
    console.log('✅ Response:', JSON.stringify(data, null, 2))
    
    if (data.user && data.user.display_name === 'Test User') {
      console.log('✅ Test 3 PASSED: Successfully fetched existing profile\n')
    } else {
      console.log('❌ Test 3 FAILED: Profile data incorrect\n')
    }
  } catch (error) {
    console.error('❌ Test 3 FAILED:', error)
  }

  // Test 4: UPDATE existing profile
  console.log('Test 4: Updating existing profile...')
  try {
    const updatedData = {
      display_name: 'Updated Test User',
      bio: 'This profile has been updated',
      avatar_url: 'https://api.dicebear.com/9.x/adventurer/svg?seed=updated'
    }

    const response = await fetch(`${API_BASE_URL}/users/${TEST_WALLET_ADDRESS}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedData)
    })
    
    const data = await response.json()
    
    console.log('✅ Response:', JSON.stringify(data, null, 2))
    
    if (data.success && data.user && data.user.display_name === 'Updated Test User') {
      console.log('✅ Test 4 PASSED: Successfully updated profile\n')
    } else {
      console.log('❌ Test 4 FAILED: Profile update failed\n')
    }
  } catch (error) {
    console.error('❌ Test 4 FAILED:', error)
  }

  // Test 5: GET by UUID (if we have one)
  if (global.testUserId) {
    console.log('Test 5: Fetching profile by UUID...')
    try {
      const response = await fetch(`${API_BASE_URL}/users/${global.testUserId}`)
      const data = await response.json()
      
      console.log('✅ Response:', JSON.stringify(data, null, 2))
      
      if (data.user && data.user.id === global.testUserId) {
        console.log('✅ Test 5 PASSED: Successfully fetched by UUID\n')
      } else {
        console.log('❌ Test 5 FAILED: UUID lookup failed\n')
      }
    } catch (error) {
      console.error('❌ Test 5 FAILED:', error)
    }
  }

  console.log('\n🎉 API Tests Complete!\n')
  console.log('Note: You can clean up the test data in your Supabase dashboard')
  console.log(`Test wallet address: ${TEST_WALLET_ADDRESS}`)
}

// Run tests if this file is executed directly
if (typeof window === 'undefined' && require.main === module) {
  testProfileAPI().catch(console.error)
}

// Export for use in other test files
export { testProfileAPI }
