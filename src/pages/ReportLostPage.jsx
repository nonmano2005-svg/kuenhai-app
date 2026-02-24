import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Megaphone, MapPin, Calendar, Upload, Image, ChevronDown, CheckCircle, X } from 'lucide-react';
import { CATEGORY_LABELS } from '../data/mockItems';

export default function ReportLostPage() {
    const [formData, setFormData] = useState({
        name: '',
        category: '',
        description: '',
        location: '',
        date: '',
    });
    const [imagePreview, setImagePreview] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const fileInputRef = useRef(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleRemoveImage = () => {
        setImagePreview(null);
        setSelectedFile(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
    };

    // Success state
    if (submitted) {
        return (
            <div className="min-h-screen bg-gray-50 font-kanit flex items-center justify-center px-4">
                <div className="text-center max-w-md">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="w-10 h-10 text-green-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">แจ้งของหายสำเร็จ!</h2>
                    <p className="text-gray-500 text-sm mb-8">
                        ระบบได้รับข้อมูลของคุณแล้ว เราจะแจ้งเตือนเมื่อมีคนพบสิ่งของที่ตรงกับรายละเอียดของคุณ
                    </p>
                    <div className="flex gap-3 justify-center">
                        <Link
                            to="/"
                            className="inline-flex items-center gap-2 bg-navy hover:bg-navy-dark text-white px-6 py-3 rounded-full font-medium text-sm transition-colors shadow-lg"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            กลับหน้าหลัก
                        </Link>
                        <button
                            onClick={() => { setSubmitted(false); setFormData({ name: '', category: '', description: '', location: '', date: '' }); setImagePreview(null); setSelectedFile(null); }}
                            className="inline-flex items-center gap-2 bg-accent hover:bg-yellow-400 text-navy-dark px-6 py-3 rounded-full font-medium text-sm transition-colors shadow-lg"
                        >
                            <Megaphone className="w-4 h-4" />
                            แจ้งรายการอื่น
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 font-kanit">
            {/* Hero Banner */}
            <div className="bg-gradient-to-br from-navy to-navy-dark py-12 sm:py-16">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 text-white/80 hover:text-white text-sm mb-4 transition-colors group"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        กลับหน้าหลัก
                    </Link>
                    <div className="flex items-center gap-3 mb-2">
                        <Megaphone className="w-8 h-8 text-accent" />
                        <h1 className="text-3xl sm:text-4xl font-bold text-white">
                            แจ้งของหาย
                        </h1>
                    </div>
                    <p className="text-white/60 mt-2 text-sm sm:text-base">
                        กรอกรายละเอียดสิ่งของที่หาย เพื่อให้ผู้พบสามารถติดต่อกลับได้
                    </p>
                </div>
            </div>

            {/* Form */}
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sm:p-8 space-y-6">

                    {/* Item Name */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            ชื่อสิ่งของ <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            placeholder="เช่น กระเป๋าสตางค์สีน้ำตาล"
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-navy/30 focus:border-navy/30 transition-shadow"
                        />
                    </div>

                    {/* Category */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            หมวดหมู่ <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-navy/30 focus:border-navy/30 transition-shadow appearance-none bg-white"
                            >
                                <option value="" disabled>เลือกหมวดหมู่</option>
                                {Object.entries(CATEGORY_LABELS)
                                    .filter(([key]) => key !== 'settings')
                                    .map(([key, label]) => (
                                        <option key={key} value={key}>{label}</option>
                                    ))
                                }
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            รายละเอียด <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                            rows={4}
                            placeholder="อธิบายลักษณะสิ่งของ เช่น สี ขนาด ยี่ห้อ สิ่งที่อยู่ภายใน..."
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-navy/30 focus:border-navy/30 transition-shadow resize-none"
                        />
                    </div>

                    {/* Location & Date Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                <MapPin className="w-3.5 h-3.5 inline mr-1" />
                                สถานที่ที่หาย <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                required
                                placeholder="เช่น สยามพารากอน ชั้น 2"
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-navy/30 focus:border-navy/30 transition-shadow"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                <Calendar className="w-3.5 h-3.5 inline mr-1" />
                                วันที่หาย <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="date"
                                name="date"
                                value={formData.date}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-navy/30 focus:border-navy/30 transition-shadow"
                            />
                        </div>
                    </div>

                    {/* Image Upload */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            <Image className="w-3.5 h-3.5 inline mr-1" />
                            อัปโหลดรูปภาพ
                        </label>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                        />
                        <div
                            onClick={() => !imagePreview && fileInputRef.current?.click()}
                            className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors relative ${imagePreview
                                    ? 'border-green-300 bg-green-50/50'
                                    : 'border-gray-200 hover:border-navy/30 cursor-pointer'
                                }`}
                        >
                            {imagePreview ? (
                                <div className="space-y-3">
                                    <img
                                        src={imagePreview}
                                        alt="Preview"
                                        className="max-h-52 mx-auto rounded-lg object-contain"
                                    />
                                    <p className="text-xs text-gray-500">
                                        {selectedFile?.name}
                                    </p>
                                    <div className="flex gap-2 justify-center">
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                fileInputRef.current?.click();
                                            }}
                                            className="text-xs text-navy hover:text-navy-dark font-medium transition-colors"
                                        >
                                            เปลี่ยนรูปภาพ
                                        </button>
                                        <span className="text-gray-300">|</span>
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleRemoveImage();
                                            }}
                                            className="text-xs text-red-500 hover:text-red-600 font-medium transition-colors flex items-center gap-1"
                                        >
                                            <X className="w-3 h-3" />
                                            ลบรูปภาพ
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    <Upload className="w-10 h-10 text-gray-300 mx-auto" />
                                    <p className="text-sm text-gray-500">คลิกหรือลากไฟล์มาวางที่นี่</p>
                                    <p className="text-xs text-gray-400">รองรับ JPG, PNG ขนาดไม่เกิน 5MB</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-2">
                        <button
                            type="submit"
                            className="w-full bg-navy hover:bg-navy-dark text-white py-3.5 rounded-xl font-semibold text-sm transition-colors shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                        >
                            <Megaphone className="w-5 h-5" />
                            ส่งแจ้งของหาย
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
