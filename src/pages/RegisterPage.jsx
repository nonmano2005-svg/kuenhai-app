import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { auth, db } from '../firebase'; // 👈 เรียกใช้ระบบ Auth และฐานข้อมูล
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'; // 👈 เครื่องมือส่งข้อมูลเข้าฐานข้อมูล
import { User, Mail, Lock, Phone, UserPlus, Loader2 } from 'lucide-react'; // 👈 เพิ่มไอคอน Phone

export default function RegisterPage() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '', email: '', password: '', confirmPassword: '', phone: '' // 👈 เพิ่มตัวเก็บค่าเบอร์โทร
    });
    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setErrorMsg('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // ดักจับรหัสผ่านว่าตรงกันไหม และยาวพอไหม
        if (formData.password.length < 6) {
            setErrorMsg('รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษรครับ');
            return;
        }
        if (formData.password !== formData.confirmPassword) {
            setErrorMsg('รหัสผ่านและการยืนยันรหัสผ่านไม่ตรงกันครับ');
            return;
        }
        if (formData.phone.length < 9) {
            setErrorMsg('กรุณากรอกเบอร์โทรศัพท์ให้ถูกต้องด้วยครับ');
            return;
        }

        setIsLoading(true);
        try {
            // 1. สร้างบัญชีใหม่ใน Firebase Auth
            const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
            const user = userCredential.user;

            // 2. อัปเดตชื่อในโพรไฟล์หลัก
            await updateProfile(user, {
                displayName: formData.name
            });

            // 3. 💾 สร้างแฟ้มประวัติใน Firestore (เก็บชื่อ อีเมล และเบอร์โทร)
            // ใช้ user.uid เป็นชื่อเอกสาร เพื่อให้ผูกกับบัญชีคนนั้นๆ
            await setDoc(doc(db, 'users', user.uid), {
                uid: user.uid,
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                createdAt: serverTimestamp()
            });

            alert('✅ สมัครสมาชิกพร้อมบันทึกเบอร์โทรสำเร็จ! ยินดีต้อนรับเข้าสู่ระบบครับ');
            navigate('/login'); // เด้งไปหน้าเข้าสู่ระบบ

        } catch (error) {
            console.error("Registration Error:", error);
            if (error.code === 'auth/email-already-in-use') {
                setErrorMsg('อีเมลนี้ถูกใช้งานไปแล้วครับ');
            } else if (error.code === 'auth/invalid-email') {
                setErrorMsg('รูปแบบอีเมลไม่ถูกต้องครับ (หากไม่มีอีเมล ให้ใส่ ชื่อ@email.com ได้ครับ)');
            } else {
                setErrorMsg('เกิดข้อผิดพลาดในการสมัครสมาชิก กรุณาลองใหม่ครับ');
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
                    <h2 className="text-2xl font-bold text-gray-800">สร้างบัญชีผู้ใช้ใหม่</h2>
                    <p className="text-sm text-gray-500 mt-1">สมัครสมาชิกเพื่อใช้งานระบบแบบเต็มรูปแบบ</p>
                </div>

                {errorMsg && (
                    <div className="bg-red-50 text-red-500 text-sm p-3 rounded-lg mb-4 text-center border border-red-100">
                        {errorMsg}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">ชื่อ-นามสกุล</label>
                        <div className="relative">
                            <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                            <input type="text" name="name" required value={formData.name} onChange={handleChange}
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none"
                                placeholder="นนทวัฒน์"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">อีเมล (ใช้อีเมลสมมติได้ เช่น non@mail.com)</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                            <input type="email" name="email" required value={formData.email} onChange={handleChange}
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none"
                                placeholder="you@email.com"
                            />
                        </div>
                    </div>

                    {/* 👇 ช่องกรอกเบอร์โทรศัพท์ที่เพิ่มเข้ามาใหม่ */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">เบอร์โทรศัพท์ (ไว้ติดต่อตอนของหาย)</label>
                        <div className="relative">
                            <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                            <input type="tel" name="phone" required value={formData.phone} onChange={handleChange}
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none"
                                placeholder="08X-XXX-XXXX"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">รหัสผ่าน (6 ตัวอักษรขึ้นไป)</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                            <input type="password" name="password" required value={formData.password} onChange={handleChange}
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none"
                                placeholder="••••••"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">ยืนยันรหัสผ่านอีกครั้ง</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                            <input type="password" name="confirmPassword" required value={formData.confirmPassword} onChange={handleChange}
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none"
                                placeholder="••••••"
                            />
                        </div>
                    </div>

                    <button type="submit" disabled={isLoading}
                        className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3.5 rounded-xl flex justify-center items-center gap-2 mt-6 transition-colors disabled:bg-gray-300">
                        {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <UserPlus className="h-5 w-5" />}
                        {isLoading ? 'กำลังสร้างบัญชี...' : 'ยืนยันการสมัครสมาชิก'}
                    </button>

                </form>

                <div className="mt-6 text-center text-sm text-gray-600">
                    มีบัญชีอยู่แล้วใช่ไหม?{' '}
                    <Link to="/login" className="text-yellow-600 font-bold hover:underline">
                        เข้าสู่ระบบเลย
                    </Link>
                </div>

            </div>
        </div>
    );
}