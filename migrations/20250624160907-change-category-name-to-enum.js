"use strict";

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

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn("categories", "category_name", {
      type: Sequelize.ENUM(...kategoriPengaduan),
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn("categories", "category_name", {
      type: Sequelize.STRING,
      allowNull: true,
    });
  }
};
