import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppSelector, useAppDispatch } from '../../../../hooks/storeHook'
import { Button } from '../../../../components/common/Button'
import { InputField } from '../../../../components/common/InputField'
import { accountServices } from '../services/accountServices'
import toast from 'react-hot-toast'
import { updateUser } from '../../../auth/store/authSlice'
import { Camera, Save, X, Edit2 } from 'lucide-react'
import { getPresignedDisplayUrl, uploadFileToS3 } from '../../../../services/imageService'

const Profile = () => {
  const { user, isLoading } = useAppSelector((state) => state.auth)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const [isEditing, setIsEditing] = useState(false)
  const [editName, setEditName] = useState('')
  const [editPhone, setEditPhone] = useState('')
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isEditing && user) {
      setEditName(user.name || '')
      setEditPhone(user.phone || '')
      setImagePreview(user.profilePhotoUrl || "https://placehold.net/default.png")
      setSelectedImage(null)
    }
  }, [isEditing, user])

  useEffect(() => {
    const updateProfileUrl = async () => {
      if(!user) return
      try {
        const updatedImageUrl = await getPresignedDisplayUrl(user?.profileKey || user.profilePhotoUrl)
        dispatch(updateUser({...user, profilePhotoUrl:updatedImageUrl.data.data}))
      } catch (error) {
        console.log(error)
      }
    }

    updateProfileUrl()
  },[])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setSelectedImage(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  

  const handleSave = async () => {
    try {
      if (!editName.trim()) {
        toast.error("Name cannot be empty")
        return
      }

      setIsSaving(true)
      let profilePhotoUrl = user?.profilePhotoUrl;

      if (selectedImage) {
        toast.loading("Uploading photo...", { id: "upload" })
        const key = await uploadFileToS3(selectedImage, "/auth/profile-upload-url")
        profilePhotoUrl = key
        toast.success("Photo uploaded successfully", { id: "upload" })
      }

      
      const response = await accountServices.updateProfile({
        name: editName,
        phone: editPhone,
        profilePhotoUrl
      })

      
      if (response && response.data.user) {
        console.log(response.data.user.profilePhotoUrl)
        const profileUrl = await getPresignedDisplayUrl(response.data.user.profilePhotoUrl)
        const updatedUser = {
          ...response.data.user,
          profileKey:response.data.user.profilePhotoUrl,
          profilePhotoUrl:profileUrl.data.data
        }

        dispatch(updateUser(updatedUser))
        toast.success('Profile updated successfully!')
        setIsEditing(false)
      }
    } catch (error: any) {
      toast.dismiss("upload")
      toast.error(error.message || 'Failed to update profile')
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) return <div>Loadin...</div>

  return (
    <div className="flex-1 bg-gradient-to-br from-[#d4f0ff] via-[#e4f6fb] to-[#f6fbe3] rounded-[2.5rem] p-8 md:p-12 relative shadow-sm">

      {/* Edit/Action Buttons */}
      {isEditing ? (
        <div className="absolute top-8 right-8 flex gap-3">
          <button onClick={() => setIsEditing(false)} className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-xl text-sm font-medium transition-colors shadow-sm flex items-center gap-2">
            <X size={16} /> Cancel
          </button>
          <button onClick={handleSave} disabled={isSaving} className={`bg-[#2A2A2A] hover:bg-black text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors shadow-sm flex items-center gap-2 ${isSaving ? 'opacity-70 cursor-not-allowed' : ''}`}>
            <Save size={16} /> {isSaving ? 'Saving...' : 'Save'}
          </button>
        </div>
      ) : (
        <button onClick={() => setIsEditing(true)} className="absolute top-8 right-8 bg-[#2A2A2A] hover:bg-black text-white px-6 py-2 rounded-xl text-sm font-medium transition-colors shadow-sm flex items-center gap-2 cursor-pointer">
          <Edit2 size={16} /> Edit
        </button>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center gap-6 mb-10 mt-4 sm:mt-0">

        {/* Avatar block */}
        <div className="relative w-24 h-24 shrink-0">
          <div className="w-full h-full rounded-full bg-gray-300 overflow-hidden shadow-sm border-2 border-white">
            <img src={isEditing ? (imagePreview ?? "https://placehold.net/default.png") : (user?.profilePhotoUrl ?? "https://placehold.net/default.png")} alt="Profile" className="w-full h-full object-cover" />
          </div>

          {isEditing ? (
            <button onClick={() => fileInputRef.current?.click()} className="absolute bottom-0 right-0 bg-blue-500 hover:bg-blue-600 cursor-pointer text-white rounded-full p-2 border-2 border-[#e4f6fb] transition-colors shadow-md z-10">
              <Camera size={14} />
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageChange} />
            </button>
          ) : (
            <div className="absolute bottom-0 right-0 bg-[#007BFF] text-white rounded-full p-1 border-2 border-[#e4f6fb]">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
          )}
        </div>

        <div className="flex-1 max-w-md w-full">
          {isEditing ? (
            <InputField inputLabel="" value={editName} onChange={(e) => setEditName(e.target.value)} placeholder="Your Name" className="text-xl font-bold py-2" />
          ) : (
            <>
              <h2 className="text-3xl font-bold text-gray-900 tracking-tight">{user?.name}</h2>
              <p className="text-gray-700 font-medium mt-1">At.Hand Client</p>
            </>
          )}
        </div>
      </div>

      {/* User Details List */}
      <div className="space-y-6 max-w-md mt-6">
        <div>
          <p className="text-gray-500 text-sm mb-1 font-medium">Email</p>
          <p className="font-semibold text-gray-900 text-lg">{user?.email}</p>
        </div>

        {!user?.googleId && (
          <>
            <div>
              <p className="text-gray-500 text-sm mb-1 font-medium">Phone</p>
              {isEditing ? (
                <InputField inputLabel="" value={editPhone} onChange={(e) => setEditPhone(e.target.value)} placeholder="Your Phone Number" />
              ) : (
                <p className="font-semibold text-gray-900 text-lg">{user?.phone || 'Not provided'}</p>
              )}
            </div>
            {!isEditing && (
              <div>
                <p className="text-gray-500 text-sm mb-1 font-medium">Password</p>
                <div className="flex items-center justify-between bg-white/95 rounded-2xl p-2.5 shadow-sm max-w-[320px]">
                  <span className="text-2xl tracking-[0.2em] text-gray-800 leading-none pl-4 translate-y-1">
                    ••••••••••
                  </span>
                  <Button onClick={() => navigate('/update-password')} className="h-9">Change</Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default Profile