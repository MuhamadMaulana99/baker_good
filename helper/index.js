const kategoriPengaduan = [
    "Selai",
    "Mini Size (Cinnamon)",
    "Regular Size (Cinnamon)",
    "Non Cinnamon Sweet",
    "Non Cinnamon Savoury",
    "Paket Mix 2 Varian",
    "Paket Mix 4 Varian",
    "Paket Hampers",
    "Roti Isi",
    "Extra Topping",
    "Minuman",
    "Additional",
    "Produk"
];

const kodeKategoriMap = {
    "Selai": "SLI",
    "Mini Size (Cinnamon)": "MSC",
    "Regular Size (Cinnamon)": "RSC",
    "Non Cinnamon Sweet": "NCS",
    "Non Cinnamon Savoury": "NCV",
    "Paket Mix 2 Varian": "PM2",
    "Paket Mix 4 Varian": "PM4",
    "Paket Hampers": "PHM",
    "Roti Isi": "RTI",
    "Extra Topping": "ETP",
    "Minuman": "MNM",
    "Additional": "ADD",
    "Produk": "PRD"
};
const allowedStatus = ['Masuk', 'Diproses', 'Selesai', 'Ditolak'];

module.exports = { kategoriPengaduan, kodeKategoriMap, allowedStatus };