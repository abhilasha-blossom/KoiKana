import React, { useState } from 'react';
import { X, Mail, Lock, User, LogIn, Loader2, AlertCircle, CheckCircle2, Upload, CloudUpload } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { supabase } from '../lib/supabaseClient';

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

const AuthModal = ({ onClose }) => {
    const { signIn, signUp } = useAuth();
    const { theme } = useTheme();
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showSuccess, setShowSuccess] = useState(false);

    // Form States
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');

    // Avatar States
    const [selectedAvatar, setSelectedAvatar] = useState(AVATAR_PRESETS[0]);
    const [uploadFile, setUploadFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setUploadFile(file);
            // Create local preview
            const objectUrl = URL.createObjectURL(file);
            setPreviewUrl(objectUrl);
            setSelectedAvatar(null); // Clear preset if uploading
        }
    };

    const uploadAvatar = async (file) => {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { data, error } = await supabase.storage
            .from('avatars')
            .upload(filePath, file, { upsert: true });

        if (error) throw error;

        const { data: { publicUrl } } = supabase.storage
            .from('avatars')
            .getPublicUrl(filePath);

        return publicUrl;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (isLogin) {
                await signIn(email, password);
                onClose(); // Close on login success
            } else {
                let finalAvatarUrl = selectedAvatar;

                if (uploadFile) {
                    try {
                        finalAvatarUrl = await uploadAvatar(uploadFile);
                    } catch (uploadErr) {
                        console.error('Upload failed:', uploadErr);
                        throw new Error('Failed to upload profile picture. Please try again.');
                    }
                }

                await signUp(email, password, username, finalAvatarUrl);

                setShowSuccess(true);
            }
        } catch (err) {
            console.error(err);
            setError(err.message || 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    if (showSuccess) {
        return (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
                <div className="relative bg-white/90 backdrop-blur-xl border border-white/60 p-8 rounded-[2rem] shadow-2xl w-full max-w-md animate-bump flex flex-col items-center text-center">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 rounded-full hover:bg-black/5 text-gray-500 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    <div className="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mb-4">
                        <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <h2 className="text-2xl font-black text-[#503C5C] mb-2">Check your inbox!</h2>
                    <p className="text-gray-600 mb-6">
                        We've sent a verification link to <span className="font-bold text-pink-500">{email}</span>. Please confirm your email to activate your account.
                    </p>

                    <button
                        onClick={() => { setShowSuccess(false); setIsLogin(true); }}
                        className="w-full py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl font-bold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all"
                    >
                        Back to Log In
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-y-auto">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

            <div className="relative bg-white/90 backdrop-blur-xl border border-white/60 p-6 md:p-8 rounded-[2rem] shadow-2xl w-full max-w-md animate-bump my-8">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 rounded-full hover:bg-black/5 text-gray-500 transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="text-center mb-6">
                    <div className={`w-16 h-16 mx-auto rounded-2xl ${isLogin ? 'bg-pink-100 text-pink-500' : 'bg-purple-100 text-purple-500'} flex items-center justify-center mb-4 transition-colors duration-300`}>
                        {isLogin ? <LogIn className="w-8 h-8" /> : <User className="w-8 h-8" />}
                    </div>
                    <h2 className={`text-2xl font-black ${theme.colors.primary}`}>
                        {isLogin ? 'Welcome Back' : 'Create Account'}
                    </h2>
                    <p className="text-gray-500 text-sm mt-1">
                        {isLogin ? 'Continue your Japanese journey' : 'Start your adventure today'}
                    </p>
                </div>

                {error && (
                    <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 shrink-0" />
                        <p>{error}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {!isLogin && (
                        <>
                            <div className="space-y-3">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Choose an Avatar</label>

                                <div className="grid grid-cols-4 gap-2">
                                    {AVATAR_PRESETS.map((avatar) => (
                                        <button
                                            key={avatar}
                                            type="button"
                                            onClick={() => { setSelectedAvatar(avatar); setUploadFile(null); setPreviewUrl(null); }}
                                            className={`aspect-square rounded-xl overflow-hidden border-2 transition-all p-1 ${selectedAvatar === avatar ? 'border-pink-500 scale-105 shadow-md bg-pink-50' : 'border-transparent hover:bg-gray-100'}`}
                                        >
                                            <img
                                                src={avatar}
                                                alt="Avatar"
                                                className="w-full h-full object-contain"
                                                onError={(e) => { e.target.style.display = 'none'; e.target.parentElement.style.backgroundColor = '#F0F0F0'; }}
                                            />
                                        </button>
                                    ))}
                                </div>

                                <div className="relative">
                                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"></div></div>
                                    <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-gray-400 font-bold">Or upload photo</span></div>
                                </div>

                                <div className="relative">
                                    <input
                                        type="file"
                                        id="avatar-upload"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                    />
                                    <label
                                        htmlFor="avatar-upload"
                                        className={`w-full py-2 border-2 border-dashed rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all ${uploadFile ? 'border-green-400 bg-green-50 text-green-700' : 'border-gray-200 hover:border-pink-300 hover:bg-pink-50 text-gray-500'}`}
                                    >
                                        {previewUrl ? (
                                            <>
                                                <img src={previewUrl} className="w-6 h-6 rounded-full object-cover" alt="Preview" />
                                                <span className="text-sm font-bold truncate max-w-[150px]">{uploadFile.name}</span>
                                                <CheckCircle2 className="w-4 h-4 ml-auto mr-2" />
                                            </>
                                        ) : (
                                            <>
                                                <CloudUpload className="w-5 h-5" />
                                                <span className="text-sm font-bold">Upload Custom Photo</span>
                                            </>
                                        )}
                                    </label>
                                </div>
                            </div>

                            <div className="space-y-1 pt-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Username</label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="text"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        className="w-full bg-white/50 border border-gray-200 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-purple-400/50 transition-all font-medium text-gray-700 placeholder:text-gray-400"
                                        placeholder="NinjaName123"
                                        required
                                    />
                                </div>
                            </div>
                        </>
                    )}

                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Email</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-white/50 border border-gray-200 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-pink-400/50 transition-all font-medium text-gray-700 placeholder:text-gray-400"
                                placeholder="name@example.com"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-white/50 border border-gray-200 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-pink-400/50 transition-all font-medium text-gray-700 placeholder:text-gray-400"
                                placeholder="••••••••"
                                required // minLength={6}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-4 rounded-xl font-bold text-white shadow-lg shadow-pink-200 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-pink-500 to-rose-500'}`}
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (isLogin ? 'Log In' : 'Sign Up')}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <button
                        onClick={() => { setIsLogin(!isLogin); setError(''); }}
                        className="text-sm font-medium text-gray-500 hover:text-pink-600 transition-colors"
                    >
                        {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Log In"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AuthModal;
