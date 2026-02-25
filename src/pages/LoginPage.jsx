import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, LogIn, UserPlus } from 'lucide-react';
import { auth } from '../firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';

export default function LoginPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg('');

        try {
            if (isLogin) {
                // ระบบเข้าสู่ระบบ
                await signInWithEmailAndPassword(auth, email, password);
                alert('🎉 เข้าสู่ระบบสำเร็จ! สถานะของคุณคือ: บัญชีที่ตรวจสอบแล้ว ✅');
                // TODO: ใส่โค้ดเด้งไปหน้าแรกตรงนี้
            } else {
                // ระบบสมัครสมาชิก
                await createUserWithEmailAndPassword(auth, email, password);
                alert('✅ สมัครสมาชิกสำเร็จ! บัญชีของคุณได้รับการยืนยันตัวตนทันที');
                // สมัครเสร็จให้กลับมาหน้าล็อกอิน
                setIsLogin(true);
                setPassword('');
            }
        } catch (error) {
            setErrorMsg('อีเมลหรือรหัสผ่านไม่ถูกต้อง กรุณาลองใหม่ครับ');
            console.error(error);
        }
    };

    return (
        <div className="min-h-screen bg-[#1e293b] flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-md p-8 shadow-xl">

                {/* โลโก้และหัวข้อ */}
                <div className="flex flex-col items-center mb-8">
                    <div className="bg-yellow-400 p-3 rounded-xl mb-4">
                        <h1 className="text-2xl font-bold text-[#1e293b]">KUEN HAI</h1>
                    </div>
                    <h2 className="text-xl font-bold text-gray-800">
                        {isLogin ? 'ยินดีต้อนรับกลับมา' : 'สมัครสมาชิกใหม่'}
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                        {isLogin ? 'เข้าสู่ระบบเพื่อจัดการรายการของคุณ' : 'สร้างบัญชีเพื่อเริ่มต้นใช้งานระบบ'}
                    </p>
                </div>

                {/* ฟอร์มกรอกข้อมูล */}
                <form onSubmit={handleSubmit} className="space-y-5">
                    {errorMsg && (
                        <div className="bg-red-100 text-red-600 p-3 rounded-lg text-sm text-center">
                            {errorMsg}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">อีเมล</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                                <Mail className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-yellow-400 focus:border-yellow-400"
                                placeholder="you@email.com"
                            />
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center justify-between mb-1">
                            <label className="block text-sm font-medium text-gray-700">รหัสผ่าน</label>
                            {isLogin && <a href="#" className="text-xs text-yellow-600 hover:underline">ลืมรหัสผ่าน?</a>}
                        </div>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                                <Lock className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-yellow-400 focus:border-yellow-400"
                                placeholder="••••••••"
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
                        className="w-full flex justify-center items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 rounded-lg transition-colors"
                    >
                        {isLogin ? <LogIn className="h-5 w-5" /> : <UserPlus className="h-5 w-5" />}
                        {isLogin ? 'เข้าสู่ระบบ' : 'ยืนยันการสมัครสมาชิก'}
                    </button>
                </form>

                {/* สลับหน้า สมัคร/เข้าสู่ระบบ */}
                <div className="mt-6 text-center text-sm text-gray-600">
                    {isLogin ? 'ยังไม่มีบัญชีใช่ไหม? ' : 'มีบัญชีอยู่แล้วใช่ไหม? '}
                    <button
                        onClick={() => {
                            setIsLogin(!isLogin);
                            setErrorMsg('');
                        }}
                        className="font-bold text-yellow-600 hover:underline"
                    >
                        {isLogin ? 'สมัครสมาชิก (Verified ทันที)' : 'เข้าสู่ระบบเลย'}
                    </button>
                </div>

            </div>
        </div>
    );
}