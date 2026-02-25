import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, LogIn, UserPlus, User } from 'lucide-react';
import { auth } from '../firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';

export default function LoginPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [name, setName] = useState(''); // เก็บชื่อผู้ใช้
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState(''); // เก็บรหัสผ่านครั้งที่ 2
    const [showPassword, setShowPassword] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg('');

        // 1. ตรวจสอบก่อนส่งข้อมูลไป Firebase
        if (!isLogin) {
            if (password.length < 6) {
                setErrorMsg('รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษรครับ');
                return;
            }
            if (password !== confirmPassword) {
                setErrorMsg('รหัสผ่านทั้ง 2 ช่องไม่ตรงกัน กรุณาตรวจสอบอีกครั้งครับ');
                return;
            }
        }

        try {
            if (isLogin) {
                // --- ระบบเข้าสู่ระบบ ---
                await signInWithEmailAndPassword(auth, email, password);
                alert('🎉 เข้าสู่ระบบสำเร็จ!');
                window.location.href = '/'; // เด้งไปหน้าหลัก

            } else {
                // --- ระบบสมัครสมาชิก ---
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);

                // อัปเดตชื่อผู้ใช้เข้าไปในระบบ Firebase ทันที
                await updateProfile(userCredential.user, {
                    displayName: name
                });

                alert(`✅ สมัครสมาชิกสำเร็จ! ยินดีต้อนรับคุณ ${name}`);
                window.location.href = '/'; // Firebase จะล็อกอินให้อัตโนมัติหลังสมัครเสร็จ เด้งไปหน้าหลักได้เลย
            }
        } catch (error) {
            // ดักจับ Error จาก Firebase มาแปลเป็นไทย
            if (error.code === 'auth/email-already-in-use') {
                setErrorMsg('อีเมลนี้มีผู้ใช้งานแล้วครับ กรุณาใช้อีเมลอื่น');
            } else if (error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
                setErrorMsg('อีเมลหรือรหัสผ่านไม่ถูกต้อง กรุณาลองใหม่ครับ');
            } else {
                setErrorMsg('เกิดข้อผิดพลาด: ' + error.message);
            }
        }
    };

    return (
        <div className="min-h-screen bg-[#1e293b] flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-md p-8 shadow-xl transition-all duration-300">

                <div className="flex flex-col items-center mb-8">
                    <div className="bg-yellow-400 p-3 rounded-xl mb-4">
                        <h1 className="text-2xl font-bold text-[#1e293b]">KUEN HAI</h1>
                    </div>
                    <h2 className="text-xl font-bold text-gray-800">
                        {isLogin ? 'ยินดีต้อนรับกลับมา' : 'สร้างบัญชีผู้ใช้ใหม่'}
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                        {isLogin ? 'เข้าสู่ระบบเพื่อจัดการรายการของคุณ' : 'สมัครสมาชิกเพื่อใช้งานระบบแบบเต็มรูปแบบ'}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {errorMsg && (
                        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 rounded text-sm">
                            {errorMsg}
                        </div>
                    )}

                    {/* ช่องกรอกชื่อ (แสดงเฉพาะตอนสมัครสมาชิก) */}
                    {!isLogin && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">ชื่อ-นามสกุล</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                                    <User className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-yellow-400 focus:border-yellow-400"
                                    placeholder="เช่น สมชาย ใจดี"
                                />
                            </div>
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
                            <label className="block text-sm font-medium text-gray-700">รหัสผ่าน (6 ตัวอักษรขึ้นไป)</label>
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

                    {/* ช่องยืนยันรหัสผ่าน (แสดงเฉพาะตอนสมัครสมาชิก) */}
                    {!isLogin && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">ยืนยันรหัสผ่านอีกครั้ง</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-yellow-400 focus:border-yellow-400"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>
                    )}

                    <button
                        type="submit"
                        className="w-full flex justify-center items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 rounded-lg transition-colors mt-4"
                    >
                        {isLogin ? <LogIn className="h-5 w-5" /> : <UserPlus className="h-5 w-5" />}
                        {isLogin ? 'เข้าสู่ระบบ' : 'ยืนยันการสมัครสมาชิก'}
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-gray-600">
                    {isLogin ? 'ยังไม่มีบัญชีใช่ไหม? ' : 'มีบัญชีอยู่แล้วใช่ไหม? '}
                    <button
                        onClick={() => {
                            setIsLogin(!isLogin);
                            setErrorMsg('');
                            setPassword('');
                            setConfirmPassword('');
                        }}
                        className="font-bold text-yellow-600 hover:underline"
                    >
                        {isLogin ? 'สมัครสมาชิกใหม่' : 'เข้าสู่ระบบเลย'}
                    </button>
                </div>

            </div>
        </div>
    );
}