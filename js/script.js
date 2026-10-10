const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = document.getElementById('email').value.trim();
        const pass = document.getElementById('password').value.trim();
        
        if (typeof dataPengguna !== 'undefined') {
            const user = dataPengguna.find(u => u.email === email && u.password === pass);
            if (user) {
                localStorage.setItem('sitta_user', JSON.stringify(user));
                Swal.fire({
                    icon: 'success',
                    title: 'Login Berhasil!',
                    text: `Memasuki sistem sebagai ${user.nama}`,
                    confirmButtonColor: '#0284c7'
                }).then(() => window.location.href = "dashboard.html");
            } else {
                Swal.fire({ icon: 'error', title: 'Akses Ditolak', text: 'Email atau password salah.' });
            }
        }
    });
}

const modalLupa = document.getElementById('modalLupa');
const modalDaftar = document.getElementById('modalDaftar');
const btnLupa = document.getElementById('btnLupaPassword');
const btnDaftar = document.getElementById('btnDaftar');
const closeLupa = document.getElementById('closeLupa');
const closeDaftar = document.getElementById('closeDaftar');

if (btnLupa && modalLupa) btnLupa.onclick = (e) => { e.preventDefault(); modalLupa.style.display = "block"; };
if (btnDaftar && modalDaftar) btnDaftar.onclick = (e) => { e.preventDefault(); modalDaftar.style.display = "block"; };
if (closeLupa && modalLupa) closeLupa.onclick = () => modalLupa.style.display = "none";
if (closeDaftar && modalDaftar) closeDaftar.onclick = () => modalDaftar.style.display = "none";

const greetingText = document.getElementById('greetingText');
if (greetingText) {
    const now = new Date();
    const jam = now.getHours();
    
    let ucapan = "Selamat Malam";
    if (jam >= 5 && jam < 11) ucapan = "Selamat Pagi";
    else if (jam >= 11 && jam < 15) ucapan = "Selamat Siang";
    else if (jam >= 15 && jam < 18) ucapan = "Selamat Sore";
    
    const userData = JSON.parse(localStorage.getItem('sitta_user'));
    const namaUser = userData ? userData.nama : "Admin SITTA";
    
    greetingText.innerText = `${ucapan}, ${namaUser}`;
    
    if (userData && document.getElementById('roleText')) {
        document.getElementById('roleText').innerText = `Login sebagai ${userData.role} - ${userData.lokasi}`;
    }

    const totalStokDOM = document.getElementById('totalStokDashboard');
    if (totalStokDOM && typeof dataBahanAjar !== 'undefined') {
        totalStokDOM.innerText = dataBahanAjar.reduce((sum, item) => sum + item.stok, 0);
    }

    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const dateDOM = document.getElementById('currentDate');
    if (dateDOM) {
        dateDOM.innerText = now.toLocaleDateString('id-ID', options);
    }
}


const btnCariDO = document.getElementById('btnCariDO');
if (btnCariDO) {
    btnCariDO.addEventListener('click', function() {
        const noDO = document.getElementById('inputDO').value.trim();
        const resultDiv = document.getElementById('trackingResult');
        
        if (noDO !== "" && typeof dataTracking !== 'undefined' && dataTracking[noDO]) {
            const data = dataTracking[noDO];
            
            document.getElementById("resNama").innerText = data.nama;
            document.getElementById("resDO").innerText = data.nomorDO;
            document.getElementById("resEkspedisi").innerText = data.ekspedisi;
            document.getElementById("resPaket").innerText = data.paket;
            document.getElementById("resTotal").innerText = data.total;
            
            const tanggalObj = new Date(data.tanggalKirim);
            const opsiFormat = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
            document.getElementById("resTanggal").innerText = tanggalObj.toLocaleDateString('id-ID', opsiFormat);

            const statusBadge = document.getElementById("resStatusBadge");
            const statusText = data.status.toLowerCase();
            let statusHtml = '';
            let statusClass = '';

            if (statusText.includes('selesai') || statusText.includes('diterima') || statusText.includes('sampai')) {
                statusClass = 'badge-success';
                statusHtml = `<i class="fa-solid fa-circle-check"></i> ${data.status}`;
            } else if (statusText.includes('perjalanan') || statusText.includes('dikirim') || statusText.includes('proses')) {
                statusClass = 'badge-warning';
                statusHtml = `<i class="fa-solid fa-truck-fast"></i> ${data.status}`;
            } else {
                statusClass = 'badge-info';
                statusHtml = `<i class="fa-solid fa-box"></i> ${data.status}`;
            }
            statusBadge.innerHTML = `<span class="status-badge ${statusClass}">${statusHtml}</span>`;

            const progressBarFill = document.getElementById('progressBarFill');
            ['step1', 'step2', 'step3', 'step4'].forEach(id => {
                const el = document.getElementById(id);
                if (el) el.className = 'step-node';
            });

            if (progressBarFill) {
                if (statusText.includes('selesai') || statusText.includes('diterima') || statusText.includes('sampai')) {
                    ['step1', 'step2', 'step3', 'step4'].forEach(id => {
                        const el = document.getElementById(id);
                        if (el) el.classList.add('completed');
                    });
                    progressBarFill.style.width = 'calc(100% - 80px)';
                    progressBarFill.style.background = '#10b981';
                } else if (statusText.includes('perjalanan')) {
                    document.getElementById('step1')?.classList.add('completed');
                    document.getElementById('step2')?.classList.add('completed');
                    document.getElementById('step3')?.classList.add('active');
                    progressBarFill.style.width = 'calc(66% - 50px)';
                    progressBarFill.style.background = '#0284c7';
                } else if (statusText.includes('dikirim')) {
                    document.getElementById('step1')?.classList.add('completed');
                    document.getElementById('step2')?.classList.add('active');
                    progressBarFill.style.width = 'calc(33% - 25px)';
                    progressBarFill.style.background = '#0284c7';
                } else {
                    document.getElementById('step1')?.classList.add('active');
                    progressBarFill.style.width = '0%';
                    progressBarFill.style.background = '#0284c7';
                }
            }
            
            const ul = document.getElementById('timelineList');
            ul.innerHTML = "";
            data.perjalanan.forEach(item => {
                const li = document.createElement('li');
                li.innerHTML = `<strong>${item.keterangan}</strong><br><span style="color:#64748b; font-size:0.9em;">${item.waktu}</span>`;
                ul.appendChild(li);
            });
            
            resultDiv.classList.remove('hidden');
        } else {
            resultDiv.classList.add('hidden');
            Swal.fire({ 
                icon: 'warning', 
                title: 'Oops!', 
                text: 'Nomor DO tidak ditemukan atau kosong.' 
            });
        }
    });
}


const tableBodyStok = document.getElementById('tableBodyStok');
if (tableBodyStok && typeof dataBahanAjar !== 'undefined') {
    let dtInstance = null;

    function renderTabel() {
        if (window.jQuery && $.fn.DataTable && $.fn.DataTable.isDataTable('#tabelStok')) {
            $('#tabelStok').DataTable().destroy();
        }

        tableBodyStok.innerHTML = "";
        dataBahanAjar.forEach((item, index) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>
                    <img src="${item.cover || 'https://via.placeholder.com/45x65?text=No+Img'}" 
                         class="thumbnail-buku" 
                         alt="Cover ${item.kodeBarang}" 
                         onerror="this.src='https://via.placeholder.com/45x65?text=No+Img'">
                </td>
                <td>${item.kodeLokasi}</td>
                <td><strong>${item.kodeBarang}</strong></td>
                <td>${item.namaBarang}</td>
                <td>Edisi ${item.edisi}</td>
                <td><span class="badge-stok">${item.stok}</span></td>
                <td><button class="btn-primary" style="padding: 5px 15px; width:auto;" onclick="bukaDetail(${index})">Detail</button></td>
            `;
            tableBodyStok.appendChild(tr);
        });

        if (window.jQuery && $.fn.DataTable) {
            dtInstance = $('#tabelStok').DataTable({
                pageLength: 5,
                responsive: true,
                language: {
                    search: "Cari Bahan Ajar:",
                    lengthMenu: "Tampilkan _MENU_ data",
                    zeroRecords: "Data bahan ajar tidak ditemukan",
                    info: "Menampilkan _START_ sampai _END_ dari _TOTAL_ data",
                    infoEmpty: "Menampilkan 0 sampai 0 dari 0 data",
                    infoFiltered: "(disaring dari _MAX_ total data)",
                    paginate: {
                        first: "Awal",
                        last: "Akhir",
                        next: "Lanjut",
                        previous: "Kembali"
                    }
                },
                columnDefs: [
                    { orderable: false, targets: [0, 6] }
                ]
            });
        }
    }

    renderTabel();

    window.bukaDetail = function(index) {
        const item = dataBahanAjar[index];
        document.getElementById('detailCover').src = item.cover || 'https://via.placeholder.com/400x300?text=No+Image';
        document.getElementById('detailLokasi').innerText = item.kodeLokasi;
        document.getElementById('detailKode').innerText = item.kodeBarang;
        document.getElementById('detailNama').innerText = item.namaBarang;
        document.getElementById('detailJenis').innerText = item.jenisBarang;
        document.getElementById('detailEdisi').innerText = item.edisi;
        document.getElementById('detailStok').innerText = item.stok;
        document.getElementById('modalDetail').style.display = 'block';
    };

    const btnShowAdd = document.getElementById('btnShowAdd');
    if (btnShowAdd) {
        btnShowAdd.onclick = () => document.getElementById('modalAdd').style.display = 'block';
    }
    
    const btnTambahStok = document.getElementById('btnTambahStok');
    if (btnTambahStok) {
        btnTambahStok.addEventListener('click', function() {
            const lokasi = document.getElementById('inputKodeLokasi').value.trim();
            const kode = document.getElementById('inputKode').value.trim();
            const judul = document.getElementById('inputJudul').value.trim();
            const stok = document.getElementById('inputStok').value.trim();
            const fileInput = document.getElementById('inputCover');

            if (lokasi && kode && judul && stok) {
                const simpanKeArray = (imageSource) => {
                    dataBahanAjar.push({ 
                        kodeLokasi: lokasi, 
                        kodeBarang: kode, 
                        namaBarang: judul, 
                        jenisBarang: "BMP", 
                        edisi: "1", 
                        stok: parseInt(stok), 
                        cover: imageSource 
                    });
                    
                    renderTabel();
                    
                    document.getElementById('modalAdd').style.display = 'none';
                    document.getElementById('inputKodeLokasi').value = "";
                    document.getElementById('inputKode').value = "";
                    document.getElementById('inputJudul').value = "";
                    document.getElementById('inputStok').value = "";
                    fileInput.value = ""; 

                    Swal.fire({ icon: 'success', title: 'Tersimpan', text: 'Data stok dan cover berhasil ditambahkan!' });
                };

                if (fileInput.files && fileInput.files[0]) {
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        simpanKeArray(e.target.result); 
                    };
                    reader.readAsDataURL(fileInput.files[0]);
                } else {
                    simpanKeArray('https://via.placeholder.com/400x300?text=No+Image');
                }
            } else {
                Swal.fire({ 
                    icon: 'error', 
                    title: 'Data Tidak Lengkap', 
                    text: 'Isi semua data teks sebelum menyimpan!' 
                });
            }
        });
    }
}


const devFeatures = document.querySelectorAll('.dev-feature');
devFeatures.forEach(menu => {
    menu.addEventListener('click', (e) => {
        e.preventDefault(); 
        Swal.fire({ 
            icon: 'info', 
            title: 'Fitur Terkunci', 
            text: 'Menu ini akan aktif pada versi Backend.' 
        });
    });
});

const btnLogout = document.getElementById('btnLogout');
if (btnLogout) {
    btnLogout.addEventListener('click', function(e) {
        e.preventDefault();
        Swal.fire({
            title: 'Konfirmasi Logout',
            text: "Apakah Anda yakin ingin keluar dari sistem?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#dc3545',
            cancelButtonColor: '#64748b',
            confirmButtonText: 'Ya, Keluar!',
            cancelButtonText: 'Batal'
        }).then((result) => {
            if (result.isConfirmed) {
                localStorage.removeItem('sitta_user');
                Swal.fire({
                    icon: 'success',
                    title: 'Berhasil Logout',
                    showConfirmButton: false,
                    timer: 1000
                }).then(() => {
                    window.location.href = "index.html";
                });
            }
        });
    });
}