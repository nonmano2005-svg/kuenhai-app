import { Package, Key, Smartphone, PawPrint, FileText, MoreHorizontal } from 'lucide-react';

const categoryConfig = {
    general: { icon: Package, label: 'ของใช้ทั่วไป', sublabel: 'General', color: 'from-blue-500 to-blue-600', count: '1,234 รายการ' },
    keys: { icon: Key, label: 'กุญแจ', sublabel: 'Keys', color: 'from-amber-500 to-amber-600', count: '567 รายการ' },
    electronics: { icon: Smartphone, label: 'อุปกรณ์อิเล็กทรอนิกส์', sublabel: 'Electronics', color: 'from-emerald-500 to-emerald-600', count: '892 รายการ' },
    documents: { icon: FileText, label: 'เอกสารสำคัญ', sublabel: 'Documents', color: 'from-purple-500 to-purple-600', count: '678 รายการ' },
    pets: { icon: PawPrint, label: 'สัตว์เลี้ยง', sublabel: 'Pets', color: 'from-pink-500 to-pink-600', count: '345 รายการ' },
    others: { icon: MoreHorizontal, label: 'อื่นๆ', sublabel: 'Others', color: 'from-gray-500 to-gray-600', count: '123 รายการ' },
};

export const CATEGORY_TYPES = Object.keys(categoryConfig);

export function getCategoryById(type) {
    return categoryConfig[type] || null;
}

export function saveRecentCategory(type) {
    try {
        const stored = localStorage.getItem('recentCategories');
        let recent = stored ? JSON.parse(stored) : [];

        // Remove if already exists (avoid duplicates)
        recent = recent.filter((t) => t !== type);

        // Add to front
        recent.unshift(type);

        // Limit to 6
        recent = recent.slice(0, 6);

        localStorage.setItem('recentCategories', JSON.stringify(recent));
    } catch (e) {
        // Silently fail if localStorage is unavailable
    }
}

export function getRecentCategories() {
    try {
        const stored = localStorage.getItem('recentCategories');
        if (stored) {
            const ids = JSON.parse(stored);
            return ids
                .map((id) => {
                    const config = getCategoryById(id);
                    return config ? { ...config, type: id } : null;
                })
                .filter(Boolean);
        }
    } catch (e) {
        // Silently fail
    }
    return [];
}

export default categoryConfig;
