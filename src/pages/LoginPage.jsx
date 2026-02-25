import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { auth } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { Mail, Lock, Eye, EyeOff, LogIn, Loader2 } from 'lucide-react';

export default function LoginPage() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg('');
        setIsLoading(true);

        try {
            await signInWithEmailAndPassword(auth, email, password);
            alert('🎉 เข้าสู่ระบบสำเร็จ!');
            navigate('/');
        } catch (error) {
            console.error('Login Error:', error);
            if (error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
                setErrorMsg('อีเมลหรือรหัสผ่านไม่ถูกต้อง กรุณาลองใหม่ครับ');
            } else if (error.code === 'auth/invalid-email') {
                setErrorMsg('รูปแบบอีเมลไม่ถูกต้องครับ');
            } else if (error.code === 'auth/too-many-requests') {
                setErrorMsg('มีการพยายามเข้าสู่ระบบมากเกินไป กรุณารอสักครู่แล้วลองใหม่ครับ');
            } else {
                setErrorMsg('เกิดข้อผิดพลาด: ' + error.message);
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#2D3142] flex flex-col justify-center items-center p-4">
            <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md">

                <div className="text-center mb-8">
                    <div className="bg-yellow-400 text-gray-900 text-2xl font-black py-2 px-6 rounded-xl inline-block mb-4">
                        KUEN HAI
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800">ยินดีต้อนรับกลับมา</h2>
                    <p className="text-sm text-gray-500 mt-1">เข้าสู่ระบบเพื่อจัดการรายการของคุณ</p>
                </div>

                {errorMsg && (
                    <div className="bg-red-50 text-red-500 text-sm p-3 rounded-lg mb-4 text-center border border-red-100">
                        {errorMsg}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">อีเมล</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => { setEmail(e.target.value); setErrorMsg(''); }}
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none"
                                placeholder="you@email.com"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">รหัสผ่าน</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                required
                                value={password}
                                onChange={(e) => { setPassword(e.target.value); setErrorMsg(''); }}
                                className="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none"
                                placeholder="••••••"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            >
                                {showPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3.5 rounded-xl flex justify-center items-center gap-2 mt-6 transition-colors disabled:bg-gray-300"
                    >
                        {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <LogIn className="h-5 w-5" />}
                        {isLoading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
                    </button>

                </form>

                <div className="mt-6 text-center text-sm text-gray-600">
                    ยังไม่มีบัญชีใช่ไหม?{' '}
                    <Link to="/register" className="text-yellow-600 font-bold hover:underline">
                        สมัครสมาชิก
                    </Link>
                </div>

            </div>
        </div>
    );
}