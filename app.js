// ================== KONFIGURASI ==================
const CSV_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vRk1xqC3HBySnV1gltkCvue2u17fmfAXJESrnyzeXMXu7BkRTsX8fDQPPUu8lXdwuVg7Pog0ck4yYhJ/pub?gid=0&single=true&output=csv";

const IDLE_LIMIT = 5 * 60 * 1000;

// ================== CEK LOGIN ==================
if (sessionStorage.getItem("aksesOK") !== "1") {
  window.location.href = "login.html";
}

// ================== VARIABEL ==================
let kodeValid = "";
let idleTimer;
let idleListenerAktif = false;

// ================== AMBIL KODE ==================
fetch(CSV_URL)
  .then((res) => {
    if (!res.ok) throw new Error("HTTP " + res.status);
    return res.text();
  })
  .then((csv) => {
    const rows = csv.trim().split(/\r?\n/);
    kodeValid = rows[1].split(",")[0].trim();
    mulaiIdle();
  })
  .catch((err) => {
    alert("Gagal mengambil kode akses");
    console.error(err);
  });

// ================== LOCK SCREEN ==================
function tampilkanLock() {
  document.body.style.overflow = "hidden";
  document.getElementById("lockScreen").style.display = "flex";
}

function bukaLock() {
  document.body.style.overflow = "auto";
  document.getElementById("lockScreen").style.display = "none";
  mulaiIdle();
}

window.cekKode = function () {
  const inputEl = document.getElementById("kodeInput");
  const msg = document.getElementById("lockMsg");
  const btn = document.querySelector("#lockScreen button");
  const input = inputEl.value.trim();

  // reset tampilan
  inputEl.classList.remove("input-error", "input-success", "shake");
  msg.textContent = "";

  // disable tombol saat proses
  btn.disabled = true;
  btn.textContent = "Memproses...";

  setTimeout(() => {
    if (input === kodeValid) {
      inputEl.classList.add("input-success");
      msg.style.color = "#2ecc71";
      msg.textContent = "✅ Akses diterima";

      setTimeout(() => {
        sessionStorage.setItem("aksesOK", "1");
        bukaLock();

        // reset form
        inputEl.value = "";
        btn.disabled = false;
        btn.textContent = "Masuk";
      }, 500);
    } else {
      // GAGAL
      inputEl.classList.add("input-error", "shake");
      msg.style.color = "red";
      msg.textContent = "❌ Kode salah";

      // aktifkan kembali tombol
      btn.disabled = false;
      btn.textContent = "Masuk";

      inputEl.addEventListener(
        "animationend",
        () => inputEl.classList.remove("shake"),
        { once: true },
      );
    }
  }, 300); // delay kecil biar terasa "diproses"
};

function mulaiIdle() {
  resetIdle();
  if (!window._idleListenerAktif) {
    ["mousemove", "keydown", "click", "scroll"].forEach((evt) =>
      document.addEventListener(evt, resetIdle),
    );
    window._idleListenerAktif = true;
  }
}

function resetIdle() {
  clearTimeout(idleTimer);
  idleTimer = setTimeout(
    () => {
      sessionStorage.removeItem("aksesOK");
      location.reload();
    },
    5 * 60 * 1000,
  );
}
