import { Search, ChevronDown, HelpCircle, MapPin, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Header() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [category, setCategory] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}&category=${category}`);
            setSearchQuery('');
        }
    };

    return (
        <header className="bg-navy font-kanit sticky top-0 z-50 shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 lg:h-20 gap-4">
                    {/* Logo */}
                    <Link to="/" className="flex-shrink-0">
                        <img src="/lg.jpg" alt="Kuen Hai Logo" className="h-16 w-auto object-contain" />
                    </Link>

                    {/* Search Bar - Desktop */}
                    <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-2xl mx-4">
                        <div className="relative flex w-full">
                            <div className="flex-1 relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="ค้นหาของที่หาย..."
                                    className="w-full pl-10 pr-4 py-2.5 rounded-l-full bg-white text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-accent transition-shadow"
                                />
                            </div>
                            <div className="relative">
                                <select
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    className="h-full px-4 pr-8 bg-gray-100 border-l border-gray-200 text-gray-600 text-sm focus:outline-none appearance-none cursor-pointer hover:bg-gray-200 transition-colors"
                                >
                                    <option value="all">ทั้งหมด</option>
                                    <option value="general">ของใช้ทั่วไป</option>
                                    <option value="keys">กุญแจ</option>
                                    <option value="electronics">อิเล็กทรอนิกส์</option>
                                    <option value="pets">สัตว์เลี้ยง</option>
                                    <option value="documents">เอกสาร</option>
                                </select>
                                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                            </div>
                            <button type="submit" className="bg-accent hover:bg-yellow-400 text-navy-dark px-6 rounded-r-full font-medium text-sm transition-colors flex items-center gap-1">
                                <Search className="w-4 h-4" />
                                ค้นหา
                            </button>
                        </div>
                    </form>

                    {/* Nav Links - Desktop */}
                    <nav className="hidden lg:flex items-center gap-6">
                        <a href="#" className="flex items-center gap-1.5 text-white/80 hover:text-white text-sm transition-colors">
                            <HelpCircle className="w-4 h-4" />
                            ช่วยเหลือ
                        </a>
                        <a href="#" className="flex items-center gap-1.5 text-white/80 hover:text-white text-sm transition-colors">
                            <MapPin className="w-4 h-4" />
                            การติดตาม
                        </a>

                    </nav>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setMobileOpen(!mobileOpen)}
                        className="lg:hidden text-white p-1"
                    >
                        {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>

                {/* Mobile Search */}
                <form onSubmit={handleSearch} className="md:hidden pb-3">
                    <div className="relative flex">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="ค้นหาของที่หาย..."
                                className="w-full pl-9 pr-3 py-2 rounded-l-full bg-white text-gray-700 text-sm focus:outline-none"
                            />
                        </div>
                        <button type="submit" className="bg-accent text-navy-dark px-4 rounded-r-full text-sm font-medium">
                            ค้นหา
                        </button>
                    </div>
                </form>
            </div>

            {/* Mobile Nav Dropdown */}
            {mobileOpen && (
                <div className="lg:hidden bg-navy-dark/95 backdrop-blur-sm border-t border-white/10 animate-fadeIn">
                    <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-3">
                        <a href="#" className="flex items-center gap-2 text-white/80 hover:text-white text-sm py-2 transition-colors">
                            <HelpCircle className="w-4 h-4" /> ช่วยเหลือ
                        </a>
                        <a href="#" className="flex items-center gap-2 text-white/80 hover:text-white text-sm py-2 transition-colors">
                            <MapPin className="w-4 h-4" /> การติดตาม
                        </a>

                    </div>
                </div>
            )}
        </header>
    );
}
