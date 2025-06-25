const kategoriPengaduan = [
    "Rasa",
    "Kemasan",
    "Keterlambatan",
    "Kualitas Roti",
    "Pelayanan Pegawai",
    "Kesalahan Pesanan",
    "Harga Tidak Sesuai",
    "Kebersihan Toko",
    "Promo / Diskon Bermasalah",
    "Stok Sering Kosong",
    "Waktu Pelayanan Lama",
    "Pengemasan Kurang Aman",
    "Pengiriman Bermasalah",
    "Perbedaan Tampilan Produk",
    "Lainnya"
];

const kodeKategoriMap = {
    "Rasa": "RSA",
    "Kemasan": "KMS",
    "Keterlambatan": "KTL",
    "Kualitas Roti": "KRT",
    "Pelayanan Pegawai": "PLP",
    "Kesalahan Pesanan": "KSP",
    "Harga Tidak Sesuai": "HTS",
    "Kebersihan Toko": "KBT",
    "Promo / Diskon Bermasalah": "PRM",
    "Stok Sering Kosong": "SSK",
    "Waktu Pelayanan Lama": "WPL",
    "Pengemasan Kurang Aman": "PKA",
    "Pengiriman Bermasalah": "PGB",
    "Perbedaan Tampilan Produk": "PTP",
    "Lainnya": "LNS"
};
const allowedStatus = ['Masuk', 'Diproses', 'Selesai', 'Ditolak'];

module.exports = { kategoriPengaduan, kodeKategoriMap, allowedStatus };