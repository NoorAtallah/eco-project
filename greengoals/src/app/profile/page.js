// File: app/profile/page.js
'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import Image from 'next/image'
import Link from 'next/link'

export default function UserProfile() {
  const [profile, setProfile] = useState(null)
  const [error, setError] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [updatedProfile, setUpdatedProfile] = useState(null)

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const response = await axios.get('/api/users', {
        withCredentials: true
      })
      setProfile(response.data)
      setUpdatedProfile(response.data)
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred')
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setUpdatedProfile(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.put('/api/users', updatedProfile, {
        withCredentials: true
      })
      setProfile(response.data)
      setIsEditing(false)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update profile')
    }
  }

  if (error) return <ErrorDisplay message={error} />
  if (!profile) return <LoadingDisplay />

  return (
    <div className="min-h-screen bg-[#FFF8E8]">
      <main className="container mx-auto px-4 py-8">
        {isEditing ? (
          <EditProfileForm 
            profile={updatedProfile} 
            onInputChange={handleInputChange} 
            onSubmit={handleSubmit} 
            onCancel={() => setIsEditing(false)}
          />
        ) : (
          <>
            <ProfileHeader profile={profile} />
            <div className="grid md:grid-cols-2 gap-8 mt-8">
              <EcoImpactCard profile={profile} />
              <FriendsCard friendCount={profile.friends?.length || 0} />
            </div>
            <RecentActivityCard activities={profile.recentActivities || []} />
            <EditProfileButton onClick={() => setIsEditing(true)} />
          </>
        )}
      </main>
      
    </div>
  )
}

const ErrorDisplay = ({ message }) => (
  <div className="flex items-center justify-center h-screen bg-[#FFF8E8]">
    <div className="text-center p-8 bg-[#F7EED3] rounded-lg shadow-md">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-[#674636] mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <h2 className="text-2xl font-bold text-[#674636] mb-2">Error</h2>
      <p className="text-[#674636]">{message}</p>
    </div>
  </div>
)

const LoadingDisplay = () => (
  <div className="flex items-center justify-center h-screen bg-[#FFF8E8]">
    <div className="text-center">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#674636] mx-auto"></div>
      <p className="mt-4 text-xl font-semibold text-[#674636]">Loading...</p>
    </div>
  </div>
)

const ProfileHeader = ({ profile }) => (
  <div className="bg-[#F7EED3] rounded-lg shadow-md p-6 mb-8">
    <div className="flex flex-col md:flex-row items-center md:items-start">
      <Image
        src={profile.avatar || "/placeholder.svg"}
        alt={profile.name}
        width={120}
        height={120}
        className="rounded-full mb-4 md:mb-0 md:mr-6"
      />
      <div className="text-center md:text-left">
        <h1 className="text-3xl font-bold text-[#674636] mb-2">{profile.name}</h1>
        <p className="text-[#674636] mb-1">{profile.email}</p>
        <p className="text-[#674636] mb-1">{profile.location}</p>
        <p className="text-[#674636] mb-2">Joined: {new Date(profile.createdAt).toLocaleDateString()}</p>
        <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${profile.isActive ? 'bg-[#AAB396] text-[#FFF8E8]' : 'bg-[#674636] text-[#FFF8E8]'}`}>
          {profile.isActive ? 'Active' : 'Inactive'}
        </span>
      </div>
    </div>
  </div>
)

const EcoImpactCard = ({ profile }) => (
  <div className="bg-[#F7EED3] rounded-lg shadow-md p-6">
    <h2 className="text-2xl font-semibold text-[#674636] mb-4">Eco Impact</h2>
    <div className="space-y-4">
      <div>
        <p className="text-[#674636] font-medium">Eco Points</p>
        <p className="text-3xl font-bold text-[#674636]">{profile.ecoPoints || 0}</p>
      </div>
      <div>
        <p className="text-[#674636] font-medium">Trees Planted</p>
        <p className="text-3xl font-bold text-[#674636]">{profile.treesPlanted || 0}</p>
      </div>
      <div>
        <p className="text-[#674636] font-medium">Carbon Saved</p>
        <p className="text-3xl font-bold text-[#674636]">{profile.carbonSaved || 0} kg</p>
      </div>
    </div>
  </div>
)

const FriendsCard = ({ friendCount }) => (
  <div className="bg-[#F7EED3] rounded-lg shadow-md p-6">
    <h2 className="text-2xl font-semibold text-[#674636] mb-4">Friends</h2>
    <p className="text-3xl font-bold text-[#674636] mb-4">{friendCount}</p>
    <Link href="/friends" className="text-[#674636] hover:text-[#AAB396] underline">View all friends</Link>
  </div>
)

const RecentActivityCard = ({ activities }) => (
  <div className="mt-8 bg-[#F7EED3] rounded-lg shadow-md p-6">
    <h2 className="text-2xl font-semibold text-[#674636] mb-4">Recent Activity</h2>
    <ul className="space-y-4">
      {activities.map((activity, index) => (
        <li key={index} className="flex justify-between items-center border-b border-[#AAB396] pb-2">
          <span className="text-[#674636]">{activity.description}</span>
          <span className="text-sm text-[#674636]">{new Date(activity.date).toLocaleDateString()}</span>
        </li>
      ))}
    </ul>
  </div>
)

const EditProfileButton = ({ onClick }) => (
  <div className="mt-8 text-center">
    <button 
      onClick={onClick}
      className="bg-[#674636] text-[#FFF8E8] hover:bg-[#AAB396] px-6 py-3 rounded-lg text-lg inline-flex items-center"
    >
      Edit Profile
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 ml-2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
      </svg>
    </button>
  </div>
)

const EditProfileForm = ({ profile, onInputChange, onSubmit, onCancel }) => (
  <form onSubmit={onSubmit} className="bg-[#F7EED3] rounded-lg shadow-md p-6 mb-8">
    <h2 className="text-2xl font-semibold text-[#674636] mb-4">Edit Profile</h2>
    <div className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-[#674636] font-medium mb-1">Name</label>
        <input
          type="text"
          id="name"
          name="name"
          value={profile.name}
          onChange={onInputChange}
          className="w-full px-3 py-2 border border-[#AAB396] rounded-md focus:outline-none focus:ring-2 focus:ring-[#674636]"
        />
      </div>
      <div>
        <label htmlFor="email" className="block text-[#674636] font-medium mb-1">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          value={profile.email}
          onChange={onInputChange}
          className="w-full px-3 py-2 border border-[#AAB396] rounded-md focus:outline-none focus:ring-2 focus:ring-[#674636]"
        />
      </div>
      <div>
        <label htmlFor="location" className="block text-[#674636] font-medium mb-1">Location</label>
        <input
          type="text"
          id="location"
          name="location"
          value={profile.location}
          onChange={onInputChange}
          className="w-full px-3 py-2 border border-[#AAB396] rounded-md focus:outline-none focus:ring-2 focus:ring-[#674636]"
        />
      </div>
    </div>
    <div className="mt-6 flex justify-end space-x-4">
      <button
        type="button"
        onClick={onCancel}
        className="px-4 py-2 border border-[#674636] text-[#674636] rounded-md hover:bg-[#674636] hover:text-[#FFF8E8]"
      >
        Cancel
      </button>
      <button
        type="submit"
        className="px-4 py-2 bg-[#674636] text-[#FFF8E8] rounded-md hover:bg-[#AAB396]"
      >
        Save Changes
      </button>
    </div>
  </form>
)

