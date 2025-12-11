
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';

const UpdatePasswordPage = () => {
    const { updatePassword, user } = useAuth();
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        // If no user is logged in (magic link didn't work or expired), redirect to home
        // Delay slightly to allow auth state to settle
        const timer = setTimeout(() => {
            if (!user) {
                // Optional: You could redirect to sign-in, but home is safe
                // navigate('/'); 
            }
        }, 1000);
        return () => clearTimeout(timer);
    }, [user, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await updatePassword(password);
            setSuccess(true);
            setTimeout(() => {
                navigate('/home');
            }, 2000);
        } catch (err) {
            console.error(err);
            setError(err.message || 'Failed to update password');
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen bg-[#FAFAF9] relative flex items-center justify-center p-4">
                {/* Background Atmosphere */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#FF9A9E] via-[#FECFEF] to-[#E0C3FC] opacity-50 pointer-events-none"></div>

                <div className="relative bg-white/90 backdrop-blur-xl border border-white/60 p-8 rounded-[2rem] shadow-2xl w-full max-w-md flex flex-col items-center text-center animate-bump">
                    <div className="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mb-4">
                        <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <h2 className="text-2xl font-black text-[#503C5C] mb-2">Password Updated!</h2>
                    <p className="text-gray-600">Redirecting you to home...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FAFAF9] relative flex items-center justify-center p-4 overflow-hidden">
            {/* Background Atmosphere (Simplified SignInPage style) */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#FF9A9E] via-[#FECFEF] to-[#E0C3FC] pointer-events-none"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] pointer-events-none">
                <div className="w-full h-full bg-gradient-to-t from-[#FFECD2] to-[#FCB69F] rounded-full animate-sun-glow opacity-60"></div>
            </div>

            <div className="relative bg-white/90 backdrop-blur-xl border border-white/60 p-8 rounded-[2rem] shadow-2xl w-full max-w-md animate-bump z-10">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-100 text-amber-500 flex items-center justify-center mb-4">
                        <Lock className="w-8 h-8" />
                    </div>
                    <h2 className="text-2xl font-black text-[#503C5C]">New Password</h2>
                    <p className="text-gray-500 mt-2">Enter your new password below to secure your account.</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 shrink-0" />
                        <p>{error}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">New Password</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-white/50 border border-gray-200 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-amber-400/50 transition-all font-medium text-gray-700 placeholder:text-gray-400"
                                placeholder="Min. 6 characters"
                                required
                                minLength={6}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-4 rounded-xl font-bold text-white shadow-lg shadow-amber-200 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-amber-400 to-orange-500'}`}
                    >
                        {loading ? 'Updating...' : 'Set New Password'}
                        {!loading && <ArrowRight className="w-5 h-5" />}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default UpdatePasswordPage;
