import { auth } from './firebase-config.js';
import { signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";

// Kalau sudah login, langsung lempar ke dashboard (jangan tampilkan form login lagi)
onAuthStateChanged(auth, (user) => {
  if (user) {
    window.location.href = 'dashboard.html';
  }
});

const form = document.getElementById('loginForm');
const errorMsg = document.getElementById('errorMsg');
const loginBtn = document.getElementById('loginBtn');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  errorMsg.classList.add('hidden');

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  loginBtn.disabled = true;
  loginBtn.textContent = 'Memproses...';

  try {
    await signInWithEmailAndPassword(auth, email, password);
    window.location.href = 'dashboard.html';
  } catch (err) {
    let pesan = 'Login gagal. Periksa email dan password.';
    if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password') {
      pesan = 'Email atau password salah.';
    } else if (err.code === 'auth/user-not-found') {
      pesan = 'Akun tidak ditemukan.';
    } else if (err.code === 'auth/too-many-requests') {
      pesan = 'Terlalu banyak percobaan. Coba lagi nanti.';
    }
    errorMsg.textContent = pesan;
    errorMsg.classList.remove('hidden');
  } finally {
    loginBtn.disabled = false;
    loginBtn.textContent = 'Login';
  }
});