import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
    ArrowLeft,
    Shield,
    Mail,
    Phone,
    CreditCard,
    CheckCircle,
    Loader2,
    Upload,
    FileCheck,
    X,
} from 'lucide-react';

export default function VerificationPage() {
    // ── Verification states ──────────────────────────────────────
    const [isEmailVerified, setIsEmailVerified] = useState(false);
    const [isPhoneVerified, setIsPhoneVerified] = useState(false);
    const [isIdCardVerified, setIsIdCardVerified] = useState(false);

    // ── UI flow states ───────────────────────────────────────────
    const [emailLoading, setEmailLoading] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [otpCode, setOtpCode] = useState('');
    const [phoneLoading, setPhoneLoading] = useState(false);
    const [idFile, setIdFile] = useState(null);
    const [idLoading, setIdLoading] = useState(false);
    const [dragOver, setDragOver] = useState(false);
    const fileInputRef = useRef(null);

    // ── Trust Score ──────────────────────────────────────────────
    const trustScore =
        (isEmailVerified ? 20 : 0) +
        (isPhoneVerified ? 30 : 0) +
        (isIdCardVerified ? 50 : 0);

    const getTrustLabel = () => {
        if (trustScore >= 80) return { text: 'สูงมาก', color: 'text-emerald-600' };
        if (trustScore >= 40) return { text: 'ปานกลาง', color: 'text-yellow-600' };
        if (trustScore > 0) return { text: 'ต่ำ', color: 'text-red-500' };
        return { text: 'ยังไม่ยืนยัน', color: 'text-gray-400' };
    };
    const label = getTrustLabel();

    const barColor =
        trustScore >= 80
            ? 'from-green-500 to-emerald-500'
            : trustScore >= 40
                ? 'from-yellow-400 to-yellow-500'
                : trustScore > 0
                    ? 'from-red-400 to-red-500'
                    : 'from-gray-300 to-gray-300';

    // ── Handlers ─────────────────────────────────────────────────
    const handleEmailVerify = () => {
        setEmailLoading(true);
        setTimeout(() => {
            setIsEmailVerified(true);
            setEmailLoading(false);
        }, 1000);
    };

    const handleRequestOtp = () => {
        if (!phoneNumber.trim()) return;
        setPhoneLoading(true);
        setTimeout(() => {
            setOtpSent(true);
            setPhoneLoading(false);
        }, 800);
    };

    const handleVerifyOtp = () => {
        if (!otpCode.trim()) return;
        setPhoneLoading(true);
        setTimeout(() => {
            setIsPhoneVerified(true);
            setPhoneLoading(false);
        }, 800);
    };

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (file) setIdFile(file);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragOver(false);
        const file = e.dataTransfer.files?.[0];
        if (file) setIdFile(file);
    };

    const handleIdSubmit = () => {
        if (!idFile) return;
        setIdLoading(true);
        setTimeout(() => {
            setIsIdCardVerified(true);
            setIdLoading(false);
        }, 2000);
    };

    // ── Shared card wrapper ──────────────────────────────────────
    const Card = ({ icon: Icon, iconColor, title, verified, children }) => (
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl ${iconColor} flex items-center justify-center`}>
                        <Icon className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="font-semibold text-gray-800">{title}</h3>
                </div>
                {verified && (
                    <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                        <CheckCircle className="w-3.5 h-3.5" />
                        ยืนยันแล้ว
                    </span>
                )}
            </div>
            <div className="p-5">{children}</div>
        </div>
    );

    // ── Render ────────────────────────────────────────────────────
    return (
        <div className="min-h-screen bg-gray-50 font-kanit">
            {/* Top Bar */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 text-gray-600 hover:text-navy text-sm transition-colors group"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        กลับหน้าหลัก
                    </Link>
                </div>
            </div>

            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
                {/* ── Trust Score Header ────────────────────────── */}
                <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
                    <div className="flex items-center gap-3 mb-5">
                        <div className="w-11 h-11 rounded-xl bg-navy flex items-center justify-center">
                            <Shield className="w-6 h-6 text-accent" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-gray-800">ยืนยันตัวตน</h1>
                            <p className="text-sm text-gray-400">เพิ่มความน่าเชื่อถือของบัญชีคุณ</p>
                        </div>
                    </div>

                    <div className="flex items-end justify-between mb-2">
                        <span className="text-sm font-semibold text-gray-600">คะแนนความน่าเชื่อถือ</span>
                        <span className={`text-sm font-bold ${label.color}`}>
                            {trustScore}% — {label.text}
                        </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                            className={`bg-gradient-to-r ${barColor} h-3 rounded-full transition-all duration-700 ease-out`}
                            style={{ width: `${trustScore}%` }}
                        />
                    </div>
                    <div className="flex justify-between text-[11px] text-gray-400 mt-1.5">
                        <span>0%</span>
                        <span>อีเมล 20%</span>
                        <span>โทรศัพท์ 50%</span>
                        <span>บัตร ปชช. 100%</span>
                    </div>
                </div>

                {/* ── 1. Email Verification ─────────────────────── */}
                <Card icon={Mail} iconColor="bg-blue-500" title="ยืนยันอีเมล" verified={isEmailVerified}>
                    {isEmailVerified ? (
                        <p className="text-sm text-emerald-600 flex items-center gap-2">
                            <CheckCircle className="w-4 h-4" />
                            อีเมลของคุณได้รับการยืนยันเรียบร้อยแล้ว
                        </p>
                    ) : (
                        <div className="space-y-3">
                            <p className="text-sm text-gray-500">
                                กดปุ่มด้านล่างเพื่อส่งลิงก์ยืนยันไปยังอีเมลที่ลงทะเบียน
                            </p>
                            <button
                                onClick={handleEmailVerify}
                                disabled={emailLoading}
                                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-navy hover:bg-navy-dark text-white px-6 py-2.5 rounded-xl font-medium text-sm transition-colors shadow-md disabled:opacity-60"
                            >
                                {emailLoading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        กำลังส่ง...
                                    </>
                                ) : (
                                    <>
                                        <Mail className="w-4 h-4" />
                                        ส่งลิงก์ยืนยันไปที่อีเมล
                                    </>
                                )}
                            </button>
                        </div>
                    )}
                </Card>

                {/* ── 2. Phone Verification ─────────────────────── */}
                <Card icon={Phone} iconColor="bg-violet-500" title="ยืนยันเบอร์โทรศัพท์" verified={isPhoneVerified}>
                    {isPhoneVerified ? (
                        <p className="text-sm text-emerald-600 flex items-center gap-2">
                            <CheckCircle className="w-4 h-4" />
                            เบอร์โทรศัพท์ของคุณได้รับการยืนยันเรียบร้อยแล้ว
                        </p>
                    ) : !otpSent ? (
                        <div className="space-y-3">
                            <p className="text-sm text-gray-500">กรอกเบอร์โทรศัพท์เพื่อรับรหัส OTP</p>
                            <div className="flex flex-col sm:flex-row gap-2">
                                <input
                                    type="tel"
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                    placeholder="0XX-XXX-XXXX"
                                    className="flex-1 px-4 py-2.5 rounded-xl bg-gray-100 border border-gray-200 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-navy/30"
                                />
                                <button
                                    onClick={handleRequestOtp}
                                    disabled={phoneLoading || !phoneNumber.trim()}
                                    className="flex items-center justify-center gap-2 bg-navy hover:bg-navy-dark text-white px-6 py-2.5 rounded-xl font-medium text-sm transition-colors shadow-md disabled:opacity-60"
                                >
                                    {phoneLoading ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <Phone className="w-4 h-4" />
                                    )}
                                    ขอ OTP
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            <p className="text-sm text-gray-500">
                                กรอกรหัส OTP ที่ส่งไปยัง <span className="font-semibold text-navy">{phoneNumber}</span>
                            </p>
                            <div className="flex flex-col sm:flex-row gap-2">
                                <input
                                    type="text"
                                    value={otpCode}
                                    onChange={(e) => setOtpCode(e.target.value)}
                                    placeholder="กรอกรหัส OTP 6 หลัก"
                                    maxLength={6}
                                    className="flex-1 px-4 py-2.5 rounded-xl bg-gray-100 border border-gray-200 text-sm text-gray-700 tracking-[0.3em] text-center font-semibold focus:outline-none focus:ring-2 focus:ring-navy/30"
                                />
                                <button
                                    onClick={handleVerifyOtp}
                                    disabled={phoneLoading || !otpCode.trim()}
                                    className="flex items-center justify-center gap-2 bg-accent hover:bg-yellow-400 text-navy-dark px-6 py-2.5 rounded-xl font-medium text-sm transition-colors shadow-md disabled:opacity-60"
                                >
                                    {phoneLoading ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <CheckCircle className="w-4 h-4" />
                                    )}
                                    ยืนยัน OTP
                                </button>
                            </div>
                        </div>
                    )}
                </Card>

                {/* ── 3. National ID Card ──────────────────────── */}
                <Card icon={CreditCard} iconColor="bg-amber-500" title="ยืนยันบัตรประชาชน" verified={isIdCardVerified}>
                    {isIdCardVerified ? (
                        <p className="text-sm text-emerald-600 flex items-center gap-2">
                            <CheckCircle className="w-4 h-4" />
                            บัตรประชาชนของคุณได้รับการยืนยันเรียบร้อยแล้ว
                        </p>
                    ) : (
                        <div className="space-y-4">
                            <p className="text-sm text-gray-500">
                                อัปโหลดรูปถ่ายบัตรประชาชนเพื่อยืนยันตัวตน ข้อมูลจะถูกเก็บรักษาอย่างปลอดภัย
                            </p>

                            {/* Drop zone */}
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                onDragOver={(e) => {
                                    e.preventDefault();
                                    setDragOver(true);
                                }}
                                onDragLeave={() => setDragOver(false)}
                                onDrop={handleDrop}
                                className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${dragOver
                                        ? 'border-navy bg-navy/5'
                                        : idFile
                                            ? 'border-green-400 bg-green-50'
                                            : 'border-gray-300 bg-gray-50 hover:border-navy/40 hover:bg-gray-100'
                                    }`}
                            >
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="hidden"
                                />
                                {idFile ? (
                                    <div className="flex flex-col items-center gap-2">
                                        <FileCheck className="w-10 h-10 text-green-500" />
                                        <p className="text-sm font-medium text-green-700">{idFile.name}</p>
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setIdFile(null);
                                            }}
                                            className="text-xs text-gray-400 hover:text-red-500 flex items-center gap-1"
                                        >
                                            <X className="w-3 h-3" />
                                            เลือกไฟล์ใหม่
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center gap-2">
                                        <Upload className="w-10 h-10 text-gray-400" />
                                        <p className="text-sm text-gray-500 font-medium">
                                            ลากไฟล์มาวางที่นี่ หรือ{' '}
                                            <span className="text-navy font-semibold">เลือกไฟล์</span>
                                        </p>
                                        <p className="text-xs text-gray-400">รองรับ JPG, PNG (สูงสุด 5MB)</p>
                                    </div>
                                )}
                            </div>

                            {/* Submit */}
                            <button
                                onClick={handleIdSubmit}
                                disabled={!idFile || idLoading}
                                className="w-full flex items-center justify-center gap-2 bg-accent hover:bg-yellow-400 text-navy-dark py-3 rounded-xl font-medium text-sm transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {idLoading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        กำลังตรวจสอบเอกสาร...
                                    </>
                                ) : (
                                    <>
                                        <CreditCard className="w-4 h-4" />
                                        ส่งเอกสารยืนยัน
                                    </>
                                )}
                            </button>
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
}
