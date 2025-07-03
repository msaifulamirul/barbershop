// testing.js - Animated real barber icons (SVG) in black & white only

const SVG_ICONS = [
  // Gunting (scissors)
  `<svg viewBox="0 0 64 64" width="1em" height="1em" fill="none" stroke="#111" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="16" cy="48" r="8"/><circle cx="48" cy="48" r="8"/><line x1="16" y1="48" x2="58" y2="6"/><line x1="48" y1="48" x2="6" y2="6"/><line x1="30" y1="30" x2="34" y2="34"/></svg>`,
  // Razor
  `<svg viewBox="0 0 64 64" width="1em" height="1em" fill="none" stroke="#222" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="8" y="28" width="48" height="8" rx="2"/><rect x="44" y="20" width="12" height="24" rx="3"/><rect x="8" y="24" width="8" height="16" rx="2"/><rect x="20" y="30" width="24" height="4" rx="1.5"/></svg>`,
  // Clipper (machine)
  `<svg viewBox="0 0 64 64" width="1em" height="1em" fill="#fff" stroke="#111" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="18" y="10" width="28" height="44" rx="10"/><rect x="24" y="4" width="16" height="8" rx="3"/><rect x="24" y="52" width="16" height="8" rx="3"/><line x1="32" y1="18" x2="32" y2="46"/><line x1="26" y1="18" x2="26" y2="46"/><line x1="38" y1="18" x2="38" y2="46"/></svg>`
];
const ICON_COUNT = 14;

function randomBetween(a, b) {
  return a + Math.random() * (b - a);
}

function createSvgIcon() {
  const iconWrap = document.createElement('div');
  iconWrap.className = 'bg-icon-svg';
  iconWrap.innerHTML = SVG_ICONS[Math.floor(Math.random() * SVG_ICONS.length)];
  iconWrap.style.position = 'absolute';
  iconWrap.style.left = randomBetween(0, 95) + 'vw';
  iconWrap.style.top = randomBetween(100, 130) + 'vh';
  iconWrap.style.width = randomBetween(2.5, 5.2) + 'rem';
  iconWrap.style.height = iconWrap.style.width;
  iconWrap.style.opacity = randomBetween(0.10, 0.19);
  iconWrap.dataset.speed = randomBetween(0.18, 0.38); // vh per frame
  iconWrap.dataset.direction = Math.random() > 0.5 ? 1 : -1; // kiri/kanan
  iconWrap.dataset.drift = randomBetween(0.05, 0.16); // drift per frame
  iconWrap.dataset.angle = randomBetween(-30, 30);
  iconWrap.style.transform = `rotate(${iconWrap.dataset.angle}deg)`;
  return iconWrap;
}

function animateSvgIcons() {
  const icons = document.querySelectorAll('.bg-icon-svg');
  icons.forEach(icon => {
    let top = parseFloat(icon.style.top);
    let left = parseFloat(icon.style.left);
    let angle = parseFloat(icon.dataset.angle);
    const speed = parseFloat(icon.dataset.speed);
    const drift = parseFloat(icon.dataset.drift) * parseInt(icon.dataset.direction);
    // Move up
    top -= speed;
    left += drift;
    angle += drift * 0.7;
    // Respawn if out of top or out of side
    if (top < -15 || left < -10 || left > 105) {
      top = randomBetween(100, 130);
      left = randomBetween(0, 95);
      icon.style.width = icon.style.height = randomBetween(2.5, 5.2) + 'rem';
      icon.style.opacity = randomBetween(0.10, 0.19);
      icon.dataset.speed = randomBetween(0.18, 0.38);
      icon.dataset.direction = Math.random() > 0.5 ? 1 : -1;
      icon.dataset.drift = randomBetween(0.05, 0.16);
      angle = randomBetween(-30, 30);
    }
    icon.style.top = top + 'vh';
    icon.style.left = left + 'vw';
    icon.dataset.angle = angle;
    icon.style.transform = `rotate(${angle}deg)`;
  });
  requestAnimationFrame(animateSvgIcons);
}

// ========== LOCALSTORAGE CUSTOMER CRUD ========== //
function getCustomers() {
  return JSON.parse(localStorage.getItem('customerList') || '[]');
}
function saveCustomers(list) {
  localStorage.setItem('customerList', JSON.stringify(list));
}
let customerSearchTerm = '';
let customerFilterToday = false;

function renderCustomerList() {
  let list = getCustomers();
  // Filter ikut search
  if (customerSearchTerm) {
    const term = customerSearchTerm.toLowerCase();
    list = list.filter(c =>
      c.nama.toLowerCase().includes(term) ||
      c.telefon.toLowerCase().includes(term)
    );
  }
  // Filter ikut hari ini
  if (customerFilterToday) {
    const today = new Date().toISOString().slice(0, 10);
    list = list.filter(c => c.tarikh === today);
  }
  const tbody = document.getElementById('customer-list-body');
  tbody.innerHTML = '';
  list.forEach((c, i) => {
    tbody.innerHTML += `<tr>
      <td>${c.nama}</td>
      <td>${c.telefon}</td>
      <td>${c.tarikh}</td>
      <td>${c.masa}</td>
      <td>
        <button onclick="editCustomer(${i})">Edit</button>
        <button onclick="deleteCustomer(${i})">Hapus</button>
      </td>
    </tr>`;
  });
}
function addCustomer(cust) {
  const list = getCustomers();
  list.push(cust);
  saveCustomers(list);
  renderCustomerList();
}
function deleteCustomer(idx) {
  if (!confirm('Padam customer ini?')) return;
  const list = getCustomers();
  list.splice(idx, 1);
  saveCustomers(list);
  renderCustomerList();
}
function editCustomer(idx) {
  const list = getCustomers();
  const c = list[idx];
  const nama = prompt('Nama:', c.nama);
  if (nama === null) return;
  const telefon = prompt('Telefon:', c.telefon);
  if (telefon === null) return;
  const tarikh = prompt('Tarikh:', c.tarikh);
  if (tarikh === null) return;
  const masa = prompt('Masa:', c.masa);
  if (masa === null) return;
  list[idx] = { nama, telefon, tarikh, masa };
  saveCustomers(list);
  renderCustomerList();
}
window.deleteCustomer = deleteCustomer;
window.editCustomer = editCustomer;

document.addEventListener('DOMContentLoaded', function() {
  const bg = document.querySelector('.bg-icons');
  if (!bg) return;
  bg.innerHTML = '';
  for (let i = 0; i < ICON_COUNT; i++) {
    bg.appendChild(createSvgIcon());
  }
  animateSvgIcons();
  renderCustomerList();

  // Supabase booking form handler
  const bookingForm = document.querySelector('.booking-form');
  if (bookingForm && typeof supabase !== 'undefined') {
    bookingForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      const nama = this.nama.value;
      const telefon = this.telefon.value;
      const tarikh = this.tarikh.value;
      const masa = this.masa.value;
      const { data, error } = await supabase
        .from('booking')
        .insert([{ nama, telefon, tarikh, masa }]);
      if (!error) {
        alert('Tempahan berjaya! Kami akan hubungi anda.');
        this.reset();
        addCustomer({ nama, telefon, tarikh, masa });
      } else {
        alert('Ralat tempahan! Sila cuba lagi.');
      }
    });
  }

  // Search & filter event
  const searchInput = document.getElementById('customer-search');
  if (searchInput) {
    searchInput.addEventListener('input', function() {
      customerSearchTerm = this.value;
      renderCustomerList();
    });
  }
  const filterBtn = document.getElementById('customer-filter-btn');
  if (filterBtn) {
    filterBtn.addEventListener('click', function() {
      customerFilterToday = true;
      renderCustomerList();
    });
  }
  const resetBtn = document.getElementById('customer-reset-btn');
  if (resetBtn) {
    resetBtn.addEventListener('click', function() {
      customerSearchTerm = '';
      customerFilterToday = false;
      if (searchInput) searchInput.value = '';
      renderCustomerList();
    });
  }
}); 