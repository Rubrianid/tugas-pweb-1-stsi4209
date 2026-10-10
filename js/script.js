const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const pass = document.getElementById('password').value;
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
    });
}

// Greeting
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
    
    if(userData && document.getElementById('roleText')) {
        document.getElementById('roleText').innerText = `Login sebagai ${userData.role} - ${userData.lokasi}`;
    }

    const totalStokDOM = document.getElementById('totalStokDashboard');
    if (totalStokDOM && typeof dataBahanAjar !== 'undefined') {
        totalStokDOM.innerText = dataBahanAjar.reduce((sum, item) => sum + item.stok, 0);
    }

    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const tanggalFormat = now.toLocaleDateString('id-ID', options);
    const dateDOM = document.getElementById('currentDate');
    if(dateDOM) {
        dateDOM.innerText = tanggalFormat;
    }
}

//HALAMAN TRACKING
const btnCariDO = document.getElementById('btnCariDO');
if (btnCariDO) {
    btnCariDO.addEventListener('click', function() {
        const noDO = document.getElementById('inputDO').value;
        const resultDiv = document.getElementById('trackingResult');
        
        if (dataTracking[noDO]) {
            const data = dataTracking[noDO];
            document.getElementById('resNama').innerText = data.nama;
            document.getElementById('resDO').innerText = data.nomorDO;
            document.getElementById('resEkspedisi').innerText = `Ekspedisi: ${data.ekspedisi} | Resi: ${data.paket}`;
            document.getElementById('resTanggal').innerText = data.tanggalKirim;
            
            const ul = document.getElementById('timelineList');
            ul.innerHTML = ""; 
            data.perjalanan.forEach(item => {
                const li = document.createElement('li');
                li.innerHTML = `<strong>${item.keterangan}</strong><br><span style="color:#64748b;">${item.waktu}</span>`;
                ul.appendChild(li);
            });
            
            resultDiv.classList.remove('hidden');
        } else {
            resultDiv.classList.add('hidden');
            Swal.fire({ icon: 'warning', title: 'Oops!', text: 'Nomor DO tidak ditemukan.' });
        }
    });
}

//HALAMAN STOK
const tableBodyStok = document.getElementById('tableBodyStok');
if (tableBodyStok) {
    function renderTabel() {
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
    }
    renderTabel();

    //Buka Detail Modal
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

    document.getElementById('btnShowAdd').onclick = () => document.getElementById('modalAdd').style.display = 'block';
    
    document.getElementById('btnTambahStok').addEventListener('click', function() {
        const lokasi = document.getElementById('inputKodeLokasi').value;
        const kode = document.getElementById('inputKode').value;
        const judul = document.getElementById('inputJudul').value;
        const stok = document.getElementById('inputStok').value;
        const fileInput = document.getElementById('inputCover');

        if(lokasi && kode && judul && stok) {
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

const modalLupa = document.getElementById('modalLupa');
const modalDaftar = document.getElementById('modalDaftar');
    
document.getElementById('btnLupaPassword')
    .onclick = (e) => { e.preventDefault(); 
        modalLupa.style.display = "block"; 
    };
document.getElementById('btnDaftar')
    .onclick = (e) => { e.preventDefault(); 
        modalDaftar.style.display = "block"; 
    };
    
document.getElementById('closeLupa')
    .onclick = () => modalLupa.style.display = "none";
document.getElementById('closeDaftar')
    .onclick = () => modalDaftar.style.display = "none";
