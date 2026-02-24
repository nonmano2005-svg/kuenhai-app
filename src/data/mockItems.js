export const TAG_COLORS = {
    'ของใช้ทั่วไป': 'bg-blue-100 text-blue-700',
    'กุญแจ': 'bg-amber-100 text-amber-700',
    'อิเล็กทรอนิกส์': 'bg-emerald-100 text-emerald-700',
    'สัตว์เลี้ยง': 'bg-pink-100 text-pink-700',
    'เอกสาร': 'bg-purple-100 text-purple-700',
};

export const CATEGORY_LABELS = {
    general: 'ของใช้ทั่วไป',
    keys: 'กุญแจ',
    electronics: 'อิเล็กทรอนิกส์',
    pets: 'สัตว์เลี้ยง',
    documents: 'เอกสาร',
    settings: 'การตั้งค่า',
};

const items = [
    // ─── General ───────────────────────────────────
    { id: 1, title: 'กระเป๋าสตางค์สีน้ำตาล', category: 'general', tag: 'ของใช้ทั่วไป', location: 'สยามพารากอน ชั้น 2 ใกล้ลิฟต์', date: '10 ก.พ. 2026', time: '14:30 น.', status: 'พบของ', image: 'https://loremflickr.com/400/300/purse,leather', description: 'กระเป๋าสตางค์หนังแท้สีน้ำตาลเข้ม ยี่ห้อ Coach มีบัตรประชาชน บัตรเครดิต และเงินสดประมาณ 2,000 บาท พบวางอยู่บนม้านั่งใกล้ลิฟต์ชั้น 2', finderName: 'สมชาย วงศ์สกุล', finderImage: 'https://loremflickr.com/100/100/portrait,man', phone: '08X-XXX-XXXX' },
    { id: 2, title: 'แก้ว Starbucks Tumbler', category: 'general', tag: 'ของใช้ทั่วไป', location: 'คาเฟ่ ทองหล่อ', date: '9 ก.พ. 2026', time: '10:15 น.', status: 'ยังไม่พบเจ้าของ', image: 'https://loremflickr.com/400/300/coffee,mug', description: 'แก้ว Starbucks Tumbler สีเขียว ขนาด Grande พบวางทิ้งไว้ที่โต๊ะในร้านกาแฟ', finderName: 'วิภา สุขใจ', finderImage: 'https://loremflickr.com/100/100/portrait,woman', phone: '09X-XXX-XXXX' },
    { id: 3, title: 'กระเป๋าเป้สีน้ำเงิน', category: 'general', tag: 'ของใช้ทั่วไป', location: 'สถานี MRT ลาดพร้าว', date: '8 ก.พ. 2026', time: '18:00 น.', status: 'ยังไม่พบเจ้าของ', image: 'https://loremflickr.com/400/300/schoolbag,hiking', description: 'กระเป๋าเป้สีน้ำเงินเข้ม มีโน้ตบุ๊คและหนังสือเรียนอยู่ภายใน พบที่ม้านั่งในสถานี', finderName: 'ธนกร แก้วมณี', finderImage: 'https://loremflickr.com/100/100/portrait,man', phone: '06X-XXX-XXXX' },
    { id: 4, title: 'แว่นตากันแดด Ray-Ban', category: 'general', tag: 'ของใช้ทั่วไป', location: 'ชายหาดบางแสน', date: '7 ก.พ. 2026', time: '16:00 น.', status: 'พบของ', image: 'https://loremflickr.com/400/300/sunglasses,rayban', description: 'แว่นตากันแดด Ray-Ban Aviator กรอบเงิน เลนส์สีเขียว พบบนเก้าอี้ชายหาด', finderName: 'นภา ทะเลสวย', finderImage: 'https://loremflickr.com/100/100/portrait,woman', phone: '08X-XXX-XXXX' },
    { id: 5, title: 'ร่มพับสีดำ', category: 'general', tag: 'ของใช้ทั่วไป', location: 'ป้ายรถเมล์หน้าตึก', date: '6 ก.พ. 2026', time: '08:30 น.', status: 'พบของ', image: 'https://loremflickr.com/400/300/umbrella', description: 'ร่มพับอัตโนมัติสีดำ พบลืมไว้ที่ป้ายรถเมล์หลังฝนตก', finderName: 'อนันต์ ฝนดี', finderImage: 'https://loremflickr.com/100/100/portrait,man', phone: '09X-XXX-XXXX' },

    // ─── Keys ──────────────────────────────────────
    { id: 6, title: 'กุญแจรถ Toyota', category: 'keys', tag: 'กุญแจ', location: 'เซ็นทรัลเวิลด์', date: '10 ก.พ. 2026', time: '12:00 น.', status: 'ยังไม่พบเจ้าของ', image: 'https://loremflickr.com/400/300/car,key', description: 'กุญแจรีโมทรถ Toyota สีดำ มีพวงกุญแจโลโก้ Toyota พบบนพื้นหน้าลิฟต์ชั้น 3', finderName: 'สมศักดิ์ รถดี', finderImage: 'https://loremflickr.com/100/100/portrait,man', phone: '08X-XXX-XXXX' },
    { id: 7, title: 'กุญแจบ้านพร้อมพวงกุญแจหมี', category: 'keys', tag: 'กุญแจ', location: 'ทางเดินอาคาร C', date: '9 ก.พ. 2026', time: '15:45 น.', status: 'ยังไม่พบเจ้าของ', image: 'https://loremflickr.com/400/300/keys,door', description: 'กุญแจบ้าน 3 ดอก พร้อมพวงกุญแจตุ๊กตาหมีสีน้ำตาล พบตกอยู่บนทางเดินอาคาร C', finderName: 'มาลี บ้านสวย', finderImage: 'https://loremflickr.com/100/100/portrait,woman', phone: '06X-XXX-XXXX' },
    { id: 8, title: 'คีย์การ์ดคอนโด', category: 'keys', tag: 'กุญแจ', location: 'ล็อบบี้ The Base', date: '7 ก.พ. 2026', time: '20:00 น.', status: 'พบของ', image: 'https://loremflickr.com/400/300/card,employee', description: 'คีย์การ์ดคอนโด The Base พระราม 9 พบตกอยู่ที่ล็อบบี้ชั้น 1 ใกล้ตู้ไปรษณีย์', finderName: 'กมล คอนโดดี', finderImage: 'https://loremflickr.com/100/100/portrait,man', phone: '09X-XXX-XXXX' },

    // ─── Electronics ───────────────────────────────
    { id: 9, title: 'iPhone 15 Pro Max', category: 'electronics', tag: 'อิเล็กทรอนิกส์', location: 'รถไฟฟ้า BTS สยาม', date: '10 ก.พ. 2026', time: '17:30 น.', status: 'พบของ', image: 'https://loremflickr.com/400/300/smartphone,iphone', description: 'iPhone 15 Pro Max สีไทเทเนียมธรรมชาติ ใส่เคสใส พบบนที่นั่งรถไฟฟ้า BTS สถานีสยาม', finderName: 'พิชัย โทรดี', finderImage: 'https://loremflickr.com/100/100/portrait,man', phone: '08X-XXX-XXXX' },
    { id: 10, title: 'โทรศัพท์มือถือ Samsung', category: 'electronics', tag: 'อิเล็กทรอนิกส์', location: 'ห้างเมกาบางนา', date: '9 ก.พ. 2026', time: '13:00 น.', status: 'ยังไม่พบเจ้าของ', image: 'https://loremflickr.com/400/300/smartphone,mobile', description: 'โทรศัพท์มือถือ Samsung Galaxy S24 สีดำ พบบนม้านั่งฟู้ดคอร์ท', finderName: 'สุดา มือถือดี', finderImage: 'https://loremflickr.com/100/100/portrait,woman', phone: '09X-XXX-XXXX' },
    { id: 11, title: 'AirPods Gen 3', category: 'electronics', tag: 'อิเล็กทรอนิกส์', location: 'ห้องสมุดชั้น 3', date: '8 ก.พ. 2026', time: '11:00 น.', status: 'พบของ', image: 'https://loremflickr.com/400/300/earphones', description: 'หูฟัง AirPods Gen 3 ในเคสสีขาว พบบนโต๊ะอ่านหนังสือห้องสมุดชั้น 3', finderName: 'ณัฐ หูฟังดี', finderImage: 'https://loremflickr.com/100/100/portrait,man', phone: '06X-XXX-XXXX' },
    { id: 12, title: 'Power Bank สีขาว', category: 'electronics', tag: 'อิเล็กทรอนิกส์', location: 'โรงอาหารมหาวิทยาลัย', date: '6 ก.พ. 2026', time: '12:30 น.', status: 'ยังไม่พบเจ้าของ', image: 'https://loremflickr.com/400/300/battery,charger', description: 'Power Bank ยี่ห้อ Anker สีขาว 20,000 mAh พร้อมสาย USB-C พบบนโต๊ะในโรงอาหาร', finderName: 'ปิยะ ชาร์จดี', finderImage: 'https://loremflickr.com/100/100/portrait,man', phone: '08X-XXX-XXXX' },

    // ─── Pets ──────────────────────────────────────
    { id: 13, title: 'แมวส้ม พันธุ์สก็อตติช', category: 'pets', tag: 'สัตว์เลี้ยง', location: 'ซอยสุขุมวิท 31', date: '9 ก.พ. 2026', time: '09:00 น.', status: 'ยังไม่พบเจ้าของ', image: 'https://loremflickr.com/400/300/cat,orange', description: 'แมวสีส้ม พันธุ์สก็อตติชโฟลด์ หูพับ สวมปลอกคอสีฟ้า ไม่มีเจ้าของมารับ พบเดินอยู่ในซอย', finderName: 'สมหญิง แมวน่ารัก', finderImage: 'https://loremflickr.com/100/100/portrait,woman', phone: '09X-XXX-XXXX' },
    { id: 14, title: 'สุนัขพุดเดิ้ลสีน้ำตาล', category: 'pets', tag: 'สัตว์เลี้ยง', location: 'สวนลุมพินี', date: '8 ก.พ. 2026', time: '07:00 น.', status: 'พบของ', image: 'https://loremflickr.com/400/300/poodle,puppy', description: 'สุนัขพุดเดิ้ลตัวเล็กสีน้ำตาล มีปลอกคอสีแดง พบวิ่งอยู่ในสวนลุมพินี', finderName: 'อดิศร สวนสวย', finderImage: 'https://loremflickr.com/100/100/portrait,man', phone: '06X-XXX-XXXX' },
    { id: 15, title: 'แมวเปอร์เซีย สีขาว', category: 'pets', tag: 'สัตว์เลี้ยง', location: 'หมู่บ้านเมืองทอง', date: '6 ก.พ. 2026', time: '19:00 น.', status: 'พบของ', image: 'https://loremflickr.com/400/300/persian,cat', description: 'แมวเปอร์เซียขนยาวสีขาว ดวงตาสีฟ้า พบเดินหลงอยู่ในหมู่บ้าน', finderName: 'จินดา แมวขาว', finderImage: 'https://loremflickr.com/100/100/portrait,woman', phone: '08X-XXX-XXXX' },

    // ─── Documents ─────────────────────────────────
    { id: 16, title: 'บัตรประชาชน', category: 'documents', tag: 'เอกสาร', location: 'ห้างเมกาบางนา', date: '10 ก.พ. 2026', time: '14:00 น.', status: 'พบของ', image: 'https://loremflickr.com/400/300/id,card', description: 'บัตรประชาชนไทย พบตกอยู่ใกล้เคาน์เตอร์แคชเชียร์ ภายในห้างเมกาบางนา', finderName: 'ประสิทธิ์ บัตรดี', finderImage: 'https://loremflickr.com/100/100/portrait,man', phone: '09X-XXX-XXXX' },
    { id: 17, title: 'ใบขับขี่', category: 'documents', tag: 'เอกสาร', location: 'ลานจอดรถ The Mall', date: '8 ก.พ. 2026', time: '16:30 น.', status: 'ยังไม่พบเจ้าของ', image: 'https://loremflickr.com/400/300/license', description: 'ใบขับขี่รถยนต์ไทย พบตกอยู่บนพื้นลานจอดรถชั้น B2 ห้าง The Mall', finderName: 'ชนะ ขับดี', finderImage: 'https://loremflickr.com/100/100/portrait,man', phone: '06X-XXX-XXXX' },
    { id: 18, title: 'กระเป๋าถือผู้หญิงสีแดง', category: 'general', tag: 'ของใช้ทั่วไป', location: 'เซ็นทรัลเวิลด์ ชั้น G', date: '5 ก.พ. 2026', time: '11:45 น.', status: 'พบของ', image: 'https://loremflickr.com/400/300/purse,red', description: 'กระเป๋าถือผู้หญิงสีแดง ยี่ห้อ Charles & Keith พบบนม้านั่งชั้น G', finderName: 'วรรณา สวยดี', finderImage: 'https://loremflickr.com/100/100/portrait,woman', phone: '08X-XXX-XXXX' },
];

export default items;
