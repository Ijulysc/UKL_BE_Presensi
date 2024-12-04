const { Absen } = require('../models'); // Menggunakan model Absen yang sudah didefinisikan
const { Op } = require('sequelize'); // Mengimpor operator Sequelize untuk query kompleks

/** Get attendance history for a user */
exports.getAbsenHistory = async (request, response) => {
    const userId = request.params.id; // Mendapatkan id_user dari parameter URL

    try {
        // Mengambil semua absensi berdasarkan id_user
        const absens = await Absen.findAll({
            where: { id_user: userId }, // Filter berdasarkan id_user
            order: [['date', 'DESC']]  // Mengurutkan hasil berdasarkan tanggal terbaru
        });

        // Jika data tidak ditemukan, kembalikan status 404
        if (absens.length === 0) {
            return response.status(404).json({
                success: false,
                message: 'No attendance records found for this user'
            });
        }

        // Jika data ditemukan, kembalikan hasil dengan status 200
        return response.json({
            success: true,
            data: absens,
            message: 'Attendance history fetched successfully'
        });

    } catch (error) {
        // Tangani error dan kembalikan status 500
        console.error('Error fetching attendance history:', error);
        return response.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/** Get all attendance data */
exports.getAllAbsen = async (request, response) => {
    try {
        // Mengambil semua data absensi tanpa filter
        const absens = await Absen.findAll();
        return response.json({
            success: true,
            data: absens,
            message: 'All attendance records have been loaded'
        });
    } catch (error) {
        // Tangani error dan kembalikan status 500
        return response.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/** Filter attendance records */
exports.findAbsen = async (request, response) => {
    const { keyword } = request.body; // Mendapatkan keyword dari request body

    try {
        // Mencari data absensi berdasarkan keyword pada status, date, atau time
        const absens = await Absen.findAll({
            where: {
                [Op.or]: [
                    { status: { [Op.substring]: keyword } }, // Pencarian substring pada status
                    { date: { [Op.substring]: keyword } },   // Pencarian substring pada tanggal
                    { time: { [Op.substring]: keyword } }    // Pencarian substring pada waktu
                ]
            }
        });

        // Mengembalikan data yang ditemukan
        return response.json({
            success: true,
            data: absens,
            message: 'Attendance records have been filtered'
        });
    } catch (error) {
        // Tangani error dan kembalikan status 500
        return response.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/** Add new attendance record */
exports.addAbsen = async (request, response) => {
    const { id_user, date, time, status } = request.body; // Mengambil data absensi dari request body

    try {
        // Membuat objek absensi baru
        let newAbsen = {
            id_user,
            date,
            time,
            status,
        };

        // Menyimpan data absensi baru ke database
        const result = await Absen.create(newAbsen);
        return response.json({
            success: true,
            data: result,
            message: 'New attendance record has been added'
        });
    } catch (error) {
        // Tangani error dan kembalikan status 500
        return response.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/** Update attendance data */
exports.updateAbsen = async (request, response) => {
    const { date, time, status } = request.body; // Data baru yang akan di-update
    const absenId = request.params.id; // ID absensi yang akan di-update

    try {
        // Membuat objek data yang akan diupdate
        let dataToUpdate = { date, time, status };

        // Melakukan update berdasarkan id_presensi
        const result = await Absen.update(dataToUpdate, { where: { id_presensi: absenId } });

        // Jika data tidak ditemukan, kembalikan status 404
        if (result[0] === 0) {
            return response.status(404).json({
                success: false,
                message: 'Attendance record not found'
            });
        }

        // Jika data berhasil diupdate
        return response.json({
            success: true,
            message: 'Attendance record has been updated'
        });
    } catch (error) {
        // Tangani error dan kembalikan status 500
        return response.status(500).json({  //Status 500 adalah Internal Server Error, artinya kesalahan terjadi di sisi server.
            success: false,
            message: error.message
        }); // Memberikan umpan balik kepada klien bahwa ada masalah.
    }
};

/** Delete attendance record */
exports.deleteAbsen = async (request, response) => {
    const absenId = request.params.id; // ID absensi yang akan dihapus

    try {
        // Menghapus data absensi berdasarkan id_presensi
        const result = await Absen.destroy({ where: { id_presensi: absenId } });

        // Jika data tidak ditemukan
        if (result === 0) {
            return response.status(404).json({
                success: false,
                message: 'Attendance record not found'
            });
        }

        // Jika data berhasil dihapus
        return response.json({
            success: true,
            message: 'Attendance record has been deleted'
        });
    } catch (error) {
        return response.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.getSummary = async (req, res) => {
    try {
        const absens = await Absen.findAll();

        const summary = {
            hadir: absens.filter(absen => absen.status === 'hadir').length,
            izin: absens.filter(absen => absen.status === 'izin').length,
            sakit: absens.filter(absen => absen.status === 'sakit').length,
            alpha: absens.filter(absen => absen.status === 'alpha').length,
        };

        return res.json({
            success: true,
            data: summary,
            message: 'Attendance summary successfully fetched'
        });
    } catch (error) {
        console.error('Error fetching attendance summary:', error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.postAnalysis = async (req, res) => {
    const { start_date, end_date, group_by } = req.body; 

    // Validasi input
    if (!start_date || !end_date || !group_by) {
        return res.status(400).json({
            status: "error",
            message: 'start_date, end_date, and group_by are required'
        });
    }

    try {
        const whereConditions = {
            date: {
                [Op.between]: [start_date, end_date],
            },
        };

        const absens = await Absen.findAll({
            where: whereConditions
        });

        if (absens.length === 0) {
            return res.status(404).json({
                status: "error",
                message: 'No attendance records found for the given criteria'
            });
        }

        const groupedData = absens.reduce((acc, absen) => {
            const group = absen[group_by];
            if (!acc[group]) {
                acc[group] = {
                    group: group,
                    total_users: 0,
                    total_attendance: {
                        hadir: 0,
                        izin: 0,
                        sakit: 0,
                        alpha: 0
                    }
                };
            }

            // Menambah jumlah pengguna di grup
            acc[group].total_users += 1;

            // Menambah jumlah berdasarkan status
            switch (absen.status) {
                case 'hadir': acc[group].total_attendance.hadir += 1; break;
                case 'izin': acc[group].total_attendance.izin += 1; break;
                case 'sakit': acc[group].total_attendance.sakit += 1; break;
                case 'alpha': acc[group].total_attendance.alpha += 1; break;
            }

            return acc;
        }, {});

        // Mengubah grouped data ke array
        const groupedAnalysis = Object.values(groupedData).map(group => {
            const totalAttendance = group.total_attendance;
            const total = totalAttendance.hadir + totalAttendance.izin + totalAttendance.sakit + totalAttendance.alpha;

            // Menghitung persentase kehadiran
            const attendanceRate = {
                hadir_percentage: (totalAttendance.hadir / total) * 100,
                izin_percentage: (totalAttendance.izin / total) * 100,
                sakit_percentage: (totalAttendance.sakit / total) * 100,
                alpha_percentage: (totalAttendance.alpha / total) * 100,
            };

            return {
                ...group,
                total,
                attendance_rate: attendanceRate
            };
        });

        // Mengembalikan hasil analisis
        return res.json({
            status: "success",
            data: groupedAnalysis,
            message: 'Attendance analysis successfully fetched'
        });
    } catch (error) {
        // Tangani error dan kembalikan status 500
        console.error('Error fetching attendance analysis:', error);
        return res.status(500).json({
            status: "error",
            message: error.message
        });
    }
};
