'use strict'; 
// Mengaktifkan mode ketat di JavaScript untuk membantu menangkap kesalahan dan memastikan penggunaan kode yang aman. (Catatan)

const { DataTypes } = require('sequelize'); 
// Mengimpor `DataTypes` dari Sequelize untuk mendefinisikan tipe data kolom dalam model.

const sequelize = require('../config/db'); 
// Mengimpor instance Sequelize yang sudah dikonfigurasi untuk koneksi ke database.

module.exports = (sequelize, DataTypes) => {
    // Mengekspor model `Absen` sehingga dapat digunakan di file lain.
    
    const Absen = sequelize.define('Absen', {
        // Mendefinisikan model `Absen` yang mewakili tabel `presensi_absen` di database.

        id_presensi: {
            type: DataTypes.INTEGER, // Tipe data kolom adalah integer.
            primaryKey: true,        // Menjadikan kolom ini sebagai primary key.
            autoIncrement: true      // Nilai akan bertambah secara otomatis setiap kali data baru ditambahkan.
        },
        id_user: {
            type: DataTypes.INTEGER, // Tipe data kolom adalah integer.
            allowNull: false         // Kolom ini wajib diisi (tidak boleh null).
        },
        date: {
            type: DataTypes.DATEONLY, // Tipe data kolom adalah tanggal (tanpa waktu).
            allowNull: false          // Kolom ini wajib diisi.
        },
        time: {
            type: DataTypes.TIME,    // Tipe data kolom adalah waktu (tanpa tanggal).
            allowNull: false         // Kolom ini wajib diisi.
        },
        status: {
            type: DataTypes.ENUM('hadir', 'izin', 'sakit', 'alpha'), 
            // Tipe data kolom adalah ENUM, hanya menerima salah satu dari nilai yang disebutkan ('hadir', 'izin', 'sakit', 'alpha').

            allowNull: false         // Kolom ini wajib diisi.
        }
    }, {
        tableName: 'presensi_absen', 
        // Nama tabel di database adalah `presensi_absen`.

        timestamps: true 
        // Menambahkan kolom `createdAt` dan `updatedAt` secara otomatis untuk mencatat waktu pembuatan dan pembaruan data.
    });

    Absen.associate = function(models) {
        // Mendefinisikan asosiasi (relasi) antara model `Absen` dan model lain.
        
        Absen.belongsTo(models.User, {
            // Relasi dengan tabel `User`.
            
            foreignKey: 'id_user', 
            // `id_user` di model `Absen` menjadi foreign key yang merujuk ke model `User`.
            
            as: 'user' 
            // Alias untuk akses data relasi, contohnya `Absen.user`.
        });
    };

    return Absen; 
    // Mengembalikan model `Absen` agar dapat digunakan di bagian lain aplikasi.
};
