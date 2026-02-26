import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { auth, db } from '../firebase';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { Phone, KeyRound, LogIn, Loader2, ShieldCheck } from 'lucide-react';

export default function LoginPage() {
    const navigate = useNavigate();
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [confirmationResult, setConfirmationResult] = useState(null);
    const [step, setStep] = useState(1); // 1: กรอกเบอร์, 2: กรอก OTP
    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    // ตั้งค่า reCAPTCHA (ป้องกันสแปม)
    const setupRecaptcha = () => {
        if (!window.recaptchaVerifier) {
            window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
                'size': 'invisible',
            });
        }
    };

    // ขั้นตอนที่ 1: ส่ง OTP ไปที่เบอร์โทร
    const handleSendOTP = async (e) => {
        e.preventDefault();
        setErrorMsg('');
        setIsLoading(true);
        setupRecaptcha();

        const formatPhone = '+' + phone.replace(/\D/g, ''); // ฟอร์แมตเป็น +668xxxx

        try {
            const appVerifier = window.recaptchaVerifier;
            const confirmation = await signInWithPhoneNumber(auth, formatPhone, appVerifier);
            setConfirmationResult(confirmation);
            setStep(2);
        } catch (error) {
            console.error('Send OTP Error:', error);
            if (error.code === 'auth/too-many-requests') {
                setErrorMsg('ส่ง OTP มากเกินไป กรุณารอสักครู่แล้วลองใหม่ครับ');
            } else if (error.code === 'auth/invalid-phone-number') {
                setErrorMsg('รูปแบบเบอร์โทรไม่ถูกต้อง กรุณาใช้ฟอร์แมต 66812345678');
            } else {
                setErrorMsg('ส่ง OTP ไม่สำเร็จ: ' + error.message);
            }
            // รีเซ็ต reCAPTCHA เมื่อเกิด error
            if (window.recaptchaVerifier) {
                window.recaptchaVerifier.clear();
                window.recaptchaVerifier = null;
            }
        } finally {
            setIsLoading(false);
        }
    };

    // ขั้นตอนที่ 2: ยืนยัน OTP แล้วเช็ค Firestore
    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        setErrorMsg('');
        setIsLoading(true);

        try {
            const result = await confirmationResult.confirm(otp);
            const user = result.user;

            // เช็คว่าผู้ใช้ลงทะเบียนไว้ใน Firestore หรือยัง
            const userDocRef = doc(db, 'users', user.uid);
            const userDocSnap = await getDoc(userDocRef);

            if (userDocSnap.exists()) {
                const userData = userDocSnap.data();
                alert(`🎉 ยินดีต้อนรับกลับ คุณ${userData.name || ''}!`);
                navigate('/');
            } else {
                // ผู้ใช้ยังไม่เคยลงทะเบียน
                setErrorMsg('ไม่พบบัญชีผู้ใช้ กรุณาสมัครสมาชิกก่อนครับ');
                // ลบ auth state เพราะยังไม่ได้ลงทะเบียน
                await auth.signOut();
            }
        } catch (error) {
            console.error('Verify OTP Error:', error);
            if (error.code === 'auth/invalid-verification-code') {
                setErrorMsg('รหัส OTP ไม่ถูกต้อง กรุณาลองใหม่ครับ');
            } else if (error.code === 'auth/code-expired') {
                setErrorMsg('รหัส OTP หมดอายุ กรุณาส่งใหม่ครับ');
                setStep(1);
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
                    <h2 className="text-2xl font-bold text-gray-800">ยินดีต้อนรับกลับมา</h2>
                    <p className="text-sm text-gray-500 mt-1">เข้าสู่ระบบด้วยเบอร์โทรศัพท์</p>
                </div>

                {/* reCAPTCHA container (invisible) */}
                <div id="recaptcha-container"></div>

                {/* Error Message */}
                {errorMsg && (
                    <div className="bg-red-50 text-red-500 text-sm p-3 rounded-lg mb-4 text-center border border-red-100">
                        {errorMsg}
                    </div>
                )}

                {step === 1 ? (
                    /* ขั้นตอนที่ 1: กรอกเบอร์โทร */
                    <form onSubmit={handleSendOTP} className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">เบอร์โทรศัพท์</label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                <input
                                    type="tel"
                                    required
                                    value={phone}
                                    onChange={(e) => { setPhone(e.target.value); setErrorMsg(''); }}
                                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none"
                                    placeholder="66812345678 (ใส่ 66 แทนเลข 0)"
                                />
                            </div>
                            <p className="text-xs text-gray-400 mt-1">ตัวอย่าง: 66812345678</p>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3.5 rounded-xl flex justify-center items-center gap-2 mt-6 transition-colors disabled:bg-gray-300"
                        >
                            {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <LogIn className="h-5 w-5" />}
                            {isLoading ? 'กำลังส่ง OTP...' : 'ส่งรหัส OTP'}
                        </button>
                    </form>
                ) : (
                    /* ขั้นตอนที่ 2: กรอก OTP */
                    <form onSubmit={handleVerifyOTP} className="space-y-4">
                        <div className="text-center mb-2">
                            <ShieldCheck className="w-12 h-12 text-green-500 mx-auto mb-2" />
                            <p className="text-sm text-gray-600">ส่งรหัส OTP ไปที่ <span className="font-bold text-gray-800">+{phone}</span> แล้ว</p>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">รหัส OTP (6 หลัก)</label>
                            <div className="relative">
                                <KeyRound className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                <input
                                    type="text"
                                    required
                                    maxLength={6}
                                    value={otp}
                                    onChange={(e) => { setOtp(e.target.value); setErrorMsg(''); }}
                                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none text-center text-2xl tracking-widest"
                                    placeholder="••••••"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading || otp.length < 6}
                            className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3.5 rounded-xl flex justify-center items-center gap-2 mt-6 transition-colors disabled:bg-gray-300"
                        >
                            {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <ShieldCheck className="h-5 w-5" />}
                            {isLoading ? 'กำลังยืนยัน...' : 'ยืนยันรหัส OTP'}
                        </button>

                        <button
                            type="button"
                            onClick={() => { setStep(1); setOtp(''); setErrorMsg(''); }}
                            className="w-full text-gray-500 hover:text-gray-700 text-sm py-2 transition-colors"
                        >
                            ← กลับไปกรอกเบอร์ใหม่
                        </button>
                    </form>
                )}

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