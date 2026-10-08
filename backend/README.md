# Laravel MongoDB Setup dengan Laragon

Tutorial untuk menghubungkan **Laravel/PHP di Laragon dengan MongoDB** pada Windows, sehingga package `mongodb/laravel-mongodb` dapat di-install menggunakan Composer.

> **Environment contoh:** Windows + Laragon + PHP 8.5 + MongoDB

---

## 📋 Daftar Isi

- [1. Masalah yang Terjadi](https://chatgpt.com/c/6ac706f7-1134-83e8-95b7-b37ba1250d60#1-masalah-yang-terjadi)
- [2. Cek Versi PHP](https://chatgpt.com/c/6ac706f7-1134-83e8-95b7-b37ba1250d60#2-cek-versi-php)
- [3. Cek Architecture dan Thread Safety](https://chatgpt.com/c/6ac706f7-1134-83e8-95b7-b37ba1250d60#3-cek-architecture-dan-thread-safety)
- [4. Download MongoDB PHP Extension](https://chatgpt.com/c/6ac706f7-1134-83e8-95b7-b37ba1250d60#4-download-mongodb-php-extension)
- [5. Pasang php_mongodb.dll](https://chatgpt.com/c/6ac706f7-1134-83e8-95b7-b37ba1250d60#5-pasang-php_mongodbdll)
- [6. Aktifkan Extension di php.ini](https://chatgpt.com/c/6ac706f7-1134-83e8-95b7-b37ba1250d60#6-aktifkan-extension-di-phpini)
- [7. Restart Laragon](https://chatgpt.com/c/6ac706f7-1134-83e8-95b7-b37ba1250d60#7-restart-laragon)
- [8. Verifikasi Extension MongoDB](https://chatgpt.com/c/6ac706f7-1134-83e8-95b7-b37ba1250d60#8-verifikasi-extension-mongodb)
- [9. Install Laravel MongoDB](https://chatgpt.com/c/6ac706f7-1134-83e8-95b7-b37ba1250d60#9-install-laravel-mongodb)
- [10. Konfigurasi Laravel](https://chatgpt.com/c/6ac706f7-1134-83e8-95b7-b37ba1250d60#10-konfigurasi-laravel)
- [11. Test Koneksi MongoDB](https://chatgpt.com/c/6ac706f7-1134-83e8-95b7-b37ba1250d60#11-test-koneksi-mongodb)
- [12. Troubleshooting](https://chatgpt.com/c/6ac706f7-1134-83e8-95b7-b37ba1250d60#12-troubleshooting)

---

# 1. Masalah yang Terjadi

Ketika menjalankan:

```bash
composer require mongodb/laravel-mongodb
```

bisa muncul error:

```text
requires ext-mongodb ^1.21|^2 which is missing from your platform
```

atau:

```text
require ext-mongodb ... it is missing from your system.
Install or enable PHP's mongodb extension.
```

Artinya, **PHP yang digunakan oleh Laragon belum memiliki atau belum mengaktifkan MongoDB extension**.

Composer membutuhkan extension tersebut agar package Laravel MongoDB dapat digunakan.

---

# 2. Cek Versi PHP

Buka **Laragon Terminal** atau Git Bash.

Jalankan:

```bash
php -v
```

Contoh:

```text
PHP 8.5.11 (cli)
```

Pastikan PHP yang digunakan adalah PHP yang ada di Laragon.

Untuk mengetahui lokasi PHP yang sedang digunakan:

```bash
where php
```

Contoh:

```text
C:\laragon\bin\php\php-8.5.11-nts-Win32-vs17-x64\php.exe
```

---

# 3. Cek Architecture dan Thread Safety

Sebelum mendownload extension MongoDB, kita harus mengetahui:

- Versi PHP
- Architecture
- Thread Safety

### Cek Architecture

Jalankan:

```bash
php -r "echo PHP_INT_SIZE == 8 ? 'x64' : 'x86';"
```

Jika hasilnya:

```text
x64
```

berarti PHP menggunakan architecture **64-bit**.

### Cek Thread Safety

Jalankan:

```bash
php -r "echo PHP_ZTS ? 'TS' : 'NTS';"
```

Jika hasilnya:

```text
NTS
```

berarti PHP menggunakan **Non Thread Safe**.

### Contoh Environment

Jika hasilnya:

```text
PHP 8.5
x64
NTS
```

maka extension MongoDB yang dibutuhkan adalah:

```text
PHP 8.5
NTS
x64
```

---

# 4. Download MongoDB PHP Extension

Download extension MongoDB untuk PHP dari PECL:

**[https://pecl.php.net/package/mongodb](https://pecl.php.net/package/mongodb)**

Pada halaman PECL MongoDB:

1. Pilih versi MongoDB extension yang sesuai.
2. Pilih bagian **DLL**.
3. Cari file yang sesuai dengan PHP kamu.

Untuk contoh environment ini:

```text
PHP 8.5
NTS
x64
```

> Jangan asal memilih DLL. Versi PHP, Thread Safety, dan Architecture harus sesuai dengan PHP yang digunakan Laragon.

File yang dibutuhkan adalah:

```text
php_mongodb.dll
```

---

# 5. Pasang `php_mongodb.dll`

Setelah file ZIP selesai didownload:

1. Extract file ZIP.
2. Cari:

```text
php_mongodb.dll
```

3. Copy file tersebut.

Kemudian buka folder extension PHP Laragon.

Contoh:

```text
C:\laragon\bin\php\php-8.5.11-nts-Win32-vs17-x64\ext\
```

Paste:

```text
php_mongodb.dll
```

Sehingga hasil akhirnya kurang lebih:

```text
C:\laragon
└── bin
    └── php
        └── php-8.5.11-nts-Win32-vs17-x64
            ├── php.exe
            ├── php.ini
            └── ext
                └── php_mongodb.dll
```

---

# 6. Aktifkan Extension di `php.ini`

Selanjutnya buka file:

```text
C:\laragon\bin\php\php-8.5.11-nts-Win32-vs17-x64\php.ini
```

Cari bagian extension atau tambahkan di bagian paling bawah:

```ini
extension=mongodb
```

Simpan file tersebut.

> Jangan menambahkan `.dll` pada konfigurasi. Gunakan `extension=mongodb`.

---

# 7. Restart Laragon

Setelah mengubah `php.ini`:

1. Buka Laragon.
2. Klik **Stop**.
3. Kemudian klik **Start All**.

Setelah itu buka **terminal baru** agar environment PHP yang digunakan kembali terbaca dengan benar.

---

# 8. Verifikasi Extension MongoDB

Jalankan:

```bash
php -m
```

Cari:

```text
mongodb
```

Cara lebih cepat:

### Git Bash

```bash
php -m | grep mongodb
```

Jika muncul:

```text
mongodb
```

berarti extension MongoDB sudah aktif.

Konfigurasi Laravel

Ulangi:

```bash
composer require mongodb/laravel-mongodb
```

Setelah package berhasil di-install, konfigurasi koneksi MongoDB pada file:

```text
.env
```

Contoh koneksi MongoDB lokal:

```env
DB_CONNECTION=mongodb
DB_HOST=127.0.0.1
DB_PORT=27017
DB_DATABASE=db_iris
DB_USERNAME=
DB_PASSWORD=
```

Jika menggunakan MongoDB yang membutuhkan username dan password, isi:

```env
DB_USERNAME=your_username
DB_PASSWORD=your_password
```

Ganti juga beberapa variabel

```env
SESSION_DRIVER=database
CACHE_STORE=database
QUEUE_CONNECTION=database
```

Menjadi:

```env
SESSION_DRIVER=file
CACHE_STORE=file
QUEUE_CONNECTION=sync
```

Lalu di config/database.php, tambahkan di connections dengan ini:

```
'mongodb' => [
    'driver'   => 'mongodb',
    'host'     => env('DB_HOST', '127.0.0.1'),
    'port'     => env('DB_PORT', 27017),
    'database' => env('DB_DATABASE', 'forge'),
    'username' => env('DB_USERNAME', ''),
    'password' => env('DB_PASSWORD', ''),
    'options'  => [
        'database' => env('DB_AUTHENTICATION_DATABASE', 'admin'), // opsional untuk auth
    ],
],
```

Lalu cara ceknya bagini:

```
<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\DB;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/test-mongo', function () {
    try {
        DB::connection('mongodb')->getPdo();
        return "Status: Terkoneksi ke MongoDB!";
    } catch (\Exception $e) {
        return "Gagal terkoneksi: " . $e->getMessage();
    }
});

```
