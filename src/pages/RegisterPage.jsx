import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { auth, db } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { User, Phone, Mail, Lock, Eye, EyeOff, UserPlus, Loader2 } from 'lucide-react';

export default function RegisterPage() {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
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
            // 1. สร้างบัญชีด้วย Email + Password
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // 2. บันทึกข้อมูลโปรไฟล์ลง Firestore (users collection)
            await setDoc(doc(db, 'users', user.uid), {
                name: name,
                phone: phone,
                email: email,
                createdAt: serverTimestamp(),
            });

            alert('🎉 สมัครสมาชิกสำเร็จ! กรุณาเข้าสู่ระบบครับ');
            navigate('/login');
        } catch (error) {
            console.error('Register Error:', error);
            if (error.code === 'auth/email-already-in-use') {
                setErrorMsg('อีเมลนี้ถูกใช้งานแล้ว กรุณาใช้อีเมลอื่นครับ');
            } else if (error.code === 'auth/invalid-email') {
                setErrorMsg('รูปแบบอีเมลไม่ถูกต้องครับ');
            } else if (error.code === 'auth/weak-password') {
                setErrorMsg('รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษรครับ');
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

                {/* Header */}
                <div className="text-center mb-8">
                    <div className="bg-yellow-400 text-gray-900 text-2xl font-black py-2 px-6 rounded-xl inline-block mb-4">
                        KUEN HAI
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800">สมัครสมาชิก</h2>
                    <p className="text-sm text-gray-500 mt-1">สร้างบัญชีเพื่อเริ่มใช้งาน</p>
                </div>

                {/* Error Message */}
                {errorMsg && (
                    <div className="bg-red-50 text-red-500 text-sm p-3 rounded-lg mb-4 text-center border border-red-100">
                        {errorMsg}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">

                    {/* ชื่อ-นามสกุล */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">ชื่อ-นามสกุล</label>
                        <div className="relative">
                            <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                            <input
                                type="text"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none"
                                placeholder="สมชาย ใจดี"
                            />
                        </div>
                    </div>

                    {/* เบอร์โทร */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">เบอร์โทรศัพท์</label>
                        <div className="relative">
                            <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                            <input
                                type="tel"
                                required
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none"
                                placeholder="0812345678"
                            />
                        </div>
                    </div>

                    {/* อีเมล */}
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

                    {/* รหัสผ่าน */}
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
                                placeholder="อย่างน้อย 6 ตัวอักษร"
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
                        {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <UserPlus className="h-5 w-5" />}
                        {isLoading ? 'กำลังสมัคร...' : 'สมัครสมาชิก'}
                    </button>

                </form>

                <div className="mt-6 text-center text-sm text-gray-600">
                    มีบัญชีอยู่แล้ว?{' '}
                    <Link to="/login" className="text-yellow-600 font-bold hover:underline">
                        เข้าสู่ระบบ
                    </Link>
                </div>

            </div>
        </div>
    );
}