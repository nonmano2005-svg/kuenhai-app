import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    ArrowLeft,
    User,
    ShieldCheck,
    Bell,
    Lock,
    Globe,
    Save,
    Eye,
    EyeOff,
    ChevronRight,
    CheckCircle,
    AlertTriangle,
} from 'lucide-react';

const TABS = [
    { id: 'account', label: 'โปรไฟล์และบัญชี', icon: User },
    { id: 'verification', label: 'การยืนยันตัวตน', icon: ShieldCheck },
    { id: 'notifications', label: 'การแจ้งเตือน', icon: Bell },
    { id: 'privacy', label: 'ความเป็นส่วนตัว', icon: Lock },
    { id: 'general', label: 'ทั่วไป', icon: Globe },
];

// ── Toggle Switch Component ─────────────────────────────────────
function Toggle({ enabled, onToggle }) {
    return (
        <button
            type="button"
            onClick={onToggle}
            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${enabled ? 'bg-navy' : 'bg-gray-300'
                }`}
        >
            <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${enabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
            />
        </button>
    );
}

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState('account');

    // ── Account state ────────────────────────────────────────────
    const [name, setName] = useState('ผู้ใช้ KUEN HAI');
    const [email, setEmail] = useState('user@kuenhai.com');
    const [phone, setPhone] = useState('098-765-4321');
    const [showPassword, setShowPassword] = useState(false);
    const [saved, setSaved] = useState(false);

    // ── Notification state ───────────────────────────────────────
    const [notifChat, setNotifChat] = useState(true);
    const [notifMatch, setNotifMatch] = useState(true);
    const [notifNews, setNotifNews] = useState(false);

    // ── Privacy state ────────────────────────────────────────────
    const [showPhone, setShowPhone] = useState(false);
    const [showEmail, setShowEmail] = useState(false);

    // ── General state ────────────────────────────────────────────
    const [language, setLanguage] = useState('th');

    // ── Save handler ─────────────────────────────────────────────
    const handleSave = () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    // ── Panel renderers ──────────────────────────────────────────
    const renderAccount = () => (
        <div className="space-y-5">
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">ชื่อ-นามสกุล</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-navy/30 transition-shadow"
                />
            </div>
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">อีเมล</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-navy/30 transition-shadow"
                />
            </div>
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">เบอร์โทรศัพท์</label>
                <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-navy/30 transition-shadow"
                />
            </div>
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">รหัสผ่าน</label>
                <div className="relative">
                    <input
                        type={showPassword ? 'text' : 'password'}
                        value="••••••••"
                        readOnly
                        className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-sm text-gray-400 focus:outline-none"
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                </div>
                <button className="mt-2 text-sm text-navy hover:text-navy-dark font-medium transition-colors">
                    เปลี่ยนรหัสผ่าน →
                </button>
            </div>
        </div>
    );

    const renderVerification = () => {
        // Simulated trust score for display — hardcoded for now
        const trustScore = 0;
        return (
            <div className="space-y-5">
                {/* Trust score banner */}
                <div className="bg-gradient-to-br from-navy to-navy-dark rounded-2xl p-6 text-white">
                    <div className="flex items-center gap-3 mb-4">
                        <ShieldCheck className="w-8 h-8 text-accent" />
                        <div>
                            <h3 className="font-bold text-lg">สถานะการยืนยันตัวตน</h3>
                            <p className="text-white/60 text-sm">เพิ่มความน่าเชื่อถือของบัญชีคุณ</p>
                        </div>
                    </div>
                    <div className="flex items-end justify-between mb-2">
                        <span className="text-sm text-white/70">คะแนนความน่าเชื่อถือ</span>
                        <span className="text-sm font-bold text-accent">{trustScore}%</span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-2.5">
                        <div
                            className="bg-accent h-2.5 rounded-full transition-all duration-700"
                            style={{ width: `${trustScore}%` }}
                        />
                    </div>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="text-sm font-semibold text-amber-800">ยังไม่ได้ยืนยันตัวตน</p>
                        <p className="text-xs text-amber-600 mt-1">
                            การยืนยันตัวตนจะช่วยเพิ่มความน่าเชื่อถือและทำให้ผู้อื่นไว้ใจคุณมากขึ้น
                        </p>
                    </div>
                </div>

                <Link
                    to="/verification"
                    className="w-full flex items-center justify-center gap-2 bg-accent hover:bg-yellow-400 text-navy-dark py-3 rounded-xl font-semibold text-sm transition-colors shadow-md hover:shadow-lg"
                >
                    <ShieldCheck className="w-4 h-4" />
                    จัดการการยืนยันตัวตน
                    <ChevronRight className="w-4 h-4" />
                </Link>
            </div>
        );
    };

    const renderNotifications = () => (
        <div className="space-y-1">
            {[
                {
                    label: 'แจ้งเตือนเมื่อมีคนทักแชท',
                    desc: 'รับการแจ้งเตือนเมื่อมีข้อความใหม่',
                    enabled: notifChat,
                    toggle: () => setNotifChat(!notifChat),
                },
                {
                    label: 'แจ้งเตือนเมื่อพบของที่ตรงกัน',
                    desc: 'แจ้งเมื่อระบบพบรายการที่ตรงกับของที่คุณหาย',
                    enabled: notifMatch,
                    toggle: () => setNotifMatch(!notifMatch),
                },
                {
                    label: 'รับข่าวสารจากระบบ',
                    desc: 'อัปเดตฟีเจอร์ใหม่และข่าวสารจาก KUEN HAI',
                    enabled: notifNews,
                    toggle: () => setNotifNews(!notifNews),
                },
            ].map((item) => (
                <div
                    key={item.label}
                    className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 transition-colors"
                >
                    <div className="pr-4">
                        <p className="text-sm font-semibold text-gray-700">{item.label}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{item.desc}</p>
                    </div>
                    <Toggle enabled={item.enabled} onToggle={item.toggle} />
                </div>
            ))}
        </div>
    );

    const renderPrivacy = () => (
        <div className="space-y-1">
            {[
                {
                    label: 'แสดงเบอร์โทรศัพท์ให้ผู้พบเห็น',
                    desc: 'ผู้พบของจะเห็นเบอร์โทรศัพท์ของคุณ',
                    enabled: showPhone,
                    toggle: () => setShowPhone(!showPhone),
                },
                {
                    label: 'แสดงอีเมลสาธารณะ',
                    desc: 'อีเมลของคุณจะแสดงในโปรไฟล์สาธารณะ',
                    enabled: showEmail,
                    toggle: () => setShowEmail(!showEmail),
                },
            ].map((item) => (
                <div
                    key={item.label}
                    className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 transition-colors"
                >
                    <div className="pr-4">
                        <p className="text-sm font-semibold text-gray-700">{item.label}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{item.desc}</p>
                    </div>
                    <Toggle enabled={item.enabled} onToggle={item.toggle} />
                </div>
            ))}
        </div>
    );

    const renderGeneral = () => (
        <div className="space-y-5">
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">ภาษา / Language</label>
                <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-navy/30 appearance-none cursor-pointer"
                >
                    <option value="th">🇹🇭 ภาษาไทย</option>
                    <option value="en">🇺🇸 English</option>
                </select>
            </div>
        </div>
    );

    const panels = {
        account: renderAccount,
        verification: renderVerification,
        notifications: renderNotifications,
        privacy: renderPrivacy,
        general: renderGeneral,
    };

    const activeTabData = TABS.find((t) => t.id === activeTab);

    return (
        <div className="min-h-screen bg-gray-50 font-kanit">
            {/* Top Bar */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 text-gray-600 hover:text-navy text-sm transition-colors group"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        กลับหน้าหลัก
                    </Link>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Page Header */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-800">ตั้งค่า</h1>
                    <p className="text-sm text-gray-400 mt-1">จัดการบัญชีและการตั้งค่าต่าง ๆ ของคุณ</p>
                </div>

                <div className="flex flex-col lg:flex-row gap-6">
                    {/* ── Sidebar / Mobile list ──────────────────── */}
                    <nav className="lg:w-64 flex-shrink-0">
                        <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
                            {TABS.map((tab) => {
                                const Icon = tab.icon;
                                const isActive = activeTab === tab.id;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`w-full flex items-center gap-3 px-5 py-3.5 text-sm font-medium transition-colors text-left ${isActive
                                                ? 'bg-navy text-white'
                                                : 'text-gray-600 hover:bg-gray-50'
                                            }`}
                                    >
                                        <Icon className={`w-4 h-4 ${isActive ? 'text-accent' : 'text-gray-400'}`} />
                                        {tab.label}
                                        <ChevronRight
                                            className={`w-4 h-4 ml-auto ${isActive ? 'text-white/50' : 'text-gray-300'
                                                }`}
                                        />
                                    </button>
                                );
                            })}
                        </div>
                    </nav>

                    {/* ── Content Panel ───────────────────────────── */}
                    <div className="flex-1">
                        <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
                            {/* Panel header */}
                            <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
                                {activeTabData && (
                                    <>
                                        <div className="w-9 h-9 rounded-xl bg-navy/10 flex items-center justify-center">
                                            <activeTabData.icon className="w-5 h-5 text-navy" />
                                        </div>
                                        <h2 className="font-semibold text-gray-800">{activeTabData.label}</h2>
                                    </>
                                )}
                            </div>

                            {/* Panel body */}
                            <div className="p-6">{panels[activeTab]()}</div>

                            {/* Save button (skip for verification tab which has its own CTA) */}
                            {activeTab !== 'verification' && (
                                <div className="px-6 pb-6">
                                    <button
                                        onClick={handleSave}
                                        className="w-full sm:w-auto flex items-center justify-center gap-2 bg-accent hover:bg-yellow-400 text-navy-dark px-8 py-3 rounded-xl font-semibold text-sm transition-all shadow-md hover:shadow-lg active:scale-[0.98]"
                                    >
                                        {saved ? (
                                            <>
                                                <CheckCircle className="w-4 h-4" />
                                                บันทึกแล้ว!
                                            </>
                                        ) : (
                                            <>
                                                <Save className="w-4 h-4" />
                                                บันทึกการเปลี่ยนแปลง
                                            </>
                                        )}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
