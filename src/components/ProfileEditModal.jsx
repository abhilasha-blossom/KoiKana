import React, { useState, useEffect } from 'react';
import { X, User, Loader2, AlertCircle, CheckCircle2, CloudUpload, Camera, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';
import useProgress from '../hooks/useProgress';
import { useNavigate } from 'react-router-dom';

const AVATAR_PRESETS = [
    '/avatars/avatar_koi.png',
    '/avatars/avatar_shiba.png',
    '/avatars/avatar_kitsune.png',
    '/avatars/avatar_sakura.png',
    '/avatars/avatar_ninja.png',
    '/avatars/avatar_neko.png',
    '/avatars/avatar_daruma.png',
    '/avatars/avatar_crane.png'
];

const ProfileEditModal = ({ onClose }) => {
    const { user, signOut } = useAuth();
    const { username, avatar, updateUsername, updateAvatar } = useProgress();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    const [newUsername, setNewUsername] = useState(username || '');
    const [selectedAvatar, setSelectedAvatar] = useState(null); // If null, means keep current or use upload
    const [uploadFile, setUploadFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(avatar);

    useEffect(() => {
        setNewUsername(username || '');
        // Only update preview if user hasn't selected something new yet
        if (!selectedAvatar && !uploadFile) {
            setPreviewUrl(avatar);
        }
    }, [username, avatar]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                setError("File is too big! Max 2MB.");
                return;
            }
            setUploadFile(file);
            const objectUrl = URL.createObjectURL(file);
            setPreviewUrl(objectUrl);
            setSelectedAvatar(null);
        }
    };

    const handlePresetSelect = (preset) => {
        setSelectedAvatar(preset);
        setUploadFile(null);
        setPreviewUrl(preset);
    };

    const uploadToSupabase = async (file) => {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
        const filePath = `${fileName}`;

        // 1. Upload
        const { error: uploadError } = await supabase.storage
            .from('avatars')
            .upload(filePath, file, { upsert: true });

        if (uploadError) throw uploadError;

        // 2. Get Public URL
        const { data: { publicUrl } } = supabase.storage
            .from('avatars')
            .getPublicUrl(filePath);

        return publicUrl;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMsg('');
        setLoading(true);

        try {
            // 1. Update Username
            if (newUsername.trim() !== username) {
                await updateUsername(newUsername.trim());
            }

            // 2. Update Avatar
            let finalAvatarUrl = null;

            if (uploadFile) {
                finalAvatarUrl = await uploadToSupabase(uploadFile);
            } else if (selectedAvatar) {
                finalAvatarUrl = selectedAvatar;
            }

            if (finalAvatarUrl) {
                await updateAvatar(finalAvatarUrl);
            }

            setSuccessMsg('Profile updated!');

            // Force reload to sync state across all hook instances (Simple Global State fix)
            setTimeout(() => {
                window.location.reload();
            }, 1000);

        } catch (err) {
            console.error(err);
            setError(err.message || 'Failed to update profile.');
        } finally {
            setLoading(false);
        }
    };

    const handleSignOut = async () => {
        try {
            await signOut();
            navigate('/');
            onClose();
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

            <div className="relative bg-white/95 backdrop-blur-xl border border-white/60 p-8 rounded-[2rem] shadow-2xl w-full max-w-md animate-bump flex flex-col max-h-[90vh] overflow-y-auto no-scrollbar">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 rounded-full hover:bg-black/5 text-gray-500 transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="text-center mb-6">
                    <h2 className="text-2xl font-black text-[#503C5C]">Edit Profile</h2>
                    <p className="text-gray-500 text-sm">Update your look and legend</p>
                </div>

                {error && (
                    <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" />
                        {error}
                    </div>
                )}

                {successMsg && (
                    <div className="mb-4 p-3 rounded-xl bg-green-50 border border-green-100 text-green-600 text-sm flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4" />
                        {successMsg}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* AVATAR SECTION */}
                    <div className="flex flex-col items-center gap-4">
                        <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg bg-pink-50 group">
                            {previewUrl ? (
                                <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-pink-200">
                                    <User className="w-12 h-12" />
                                </div>
                            )}
                            <label htmlFor="modal-upload" className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                                <Camera className="w-8 h-8 text-white drop-shadow-md" />
                            </label>
                            <input
                                type="file"
                                id="modal-upload"
                                className="hidden"
                                accept="image/*"
                                onChange={handleFileChange}
                            />
                        </div>
                        <p className="text-xs text-gray-400">Tap image to upload (max 2MB)</p>
                    </div>

                    {/* PRESETS */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Or Choose a Preset</label>
                        <div className="grid grid-cols-4 gap-2">
                            {AVATAR_PRESETS.map((p) => (
                                <button
                                    key={p}
                                    type="button"
                                    onClick={() => handlePresetSelect(p)}
                                    className={`aspect-square rounded-xl overflow-hidden border-2 transition-all p-1 ${previewUrl === p ? 'border-pink-500 scale-105 bg-pink-50' : 'border-transparent hover:bg-gray-100'}`}
                                >
                                    <img src={p} alt="Preset" className="w-full h-full object-contain" />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* USERNAME */}
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Username</label>
                        <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                value={newUsername}
                                onChange={(e) => setNewUsername(e.target.value)}
                                className="w-full bg-white/50 border border-gray-200 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-pink-400/50 transition-all font-medium text-gray-700 placeholder:text-gray-400"
                                placeholder="Display Name"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-4 rounded-xl font-bold text-white shadow-lg shadow-pink-200 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-pink-500 to-rose-500'}`}
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Save Changes'}
                    </button>

                    <button
                        type="button"
                        onClick={handleSignOut}
                        className="w-full py-2 text-sm text-red-400 hover:text-red-500 font-bold flex items-center justify-center gap-2 hover:bg-red-50 rounded-lg transition-colors"
                    >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                    </button>

                </form>
            </div>
        </div>
    );
};

export default ProfileEditModal;
