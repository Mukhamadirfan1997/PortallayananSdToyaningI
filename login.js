// ================== KONFIG ==================
const CSV_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vRk1xqC3HBySnV1gltkCvue2u17fmfAXJESrnyzeXMXu7BkRTsX8fDQPPUu8lXdwuVg7Pog0ck4yYhJ/pub?gid=0&single=true&output=csv";

let kodeValid = "";
let csvSiap = false;

// ================== CEK SESSION ==================
if (sessionStorage.getItem("aksesOK") === "1") {
  window.location.href = "index.html";
}

// ================== AMBIL CSV ==================
fetch(CSV_URL)
  .then((res) => res.text())
  .then((csv) => {
    const rows = csv.trim().split(/\r?\n/);
    kodeValid = rows[1].split(",")[0].trim();
    csvSiap = true;
  })
  .catch(() => {
    document.getElementById("loginMsg").textContent =
      "❌ Gagal mengambil kode akses";
  });

// ================== CEK KODE ==================
window.cekKode = function () {
  const inputEl = document.getElementById("kodeInput");
  const msg = document.getElementById("loginMsg");
  const btn = document.getElementById("loginBtn");
  const input = inputEl.value.trim();

  // CSV belum siap
  if (!csvSiap) {
    msg.style.color = "orange";
    msg.textContent = "⏳ Sistem belum siap, coba lagi...";
    return;
  }

  // reset tampilan
  inputEl.classList.remove("input-error", "input-success", "shake");
  msg.textContent = "";

  // disable tombol
  btn.disabled = true;
  btn.textContent = "Memproses...";

  setTimeout(() => {
    if (input === kodeValid) {
      inputEl.classList.add("input-success");
      msg.style.color = "#2ecc71";
      msg.textContent = "✅ Kode benar, masuk...";

      setTimeout(() => {
        sessionStorage.setItem("aksesOK", "1");
        window.location.href = "index.html";
      }, 500);
    } else {
      inputEl.classList.add("input-error", "shake");
      msg.style.color = "red";
      msg.textContent = "❌ Kode akses salah";

      btn.disabled = false;
      btn.textContent = "Masuk";

      inputEl.addEventListener(
        "animationend",
        () => inputEl.classList.remove("shake"),
        { once: true },
      );
    }
  }, 300);
};
