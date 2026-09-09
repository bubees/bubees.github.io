const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');

navToggle.addEventListener('click', () => {
  navMenu.classList.toggle('open');
});

navMenu.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    navMenu.classList.remove('open');
  });
});

const contactForm = document.getElementById('contactForm');
const formNote = document.getElementById('formNote');

const CONTACT_EMAIL = 'bubees@bu.edu';

contactForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const message = document.getElementById('message').value;

  const subject = `Message from ${name} via BU Beekeeping Club website`;
  const body = `${message}\n\nFrom ${name} (${email})`;
  const mailtoUrl = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  window.location.href = mailtoUrl;

  formNote.textContent = "Thanks for reaching out! We're buzzing to hear from you. This opened your email app so you can send us your message.";
  contactForm.reset();
});

// Adopt a Bee gallery
// 1. Create a Google Form with a "Bee Name" question, linked to a Google Sheet.
// 2. In the Sheet: File > Share > Publish to web > select the response sheet > CSV.
// 3. Paste that published CSV URL below, and the Google Form URL into the
//    "[PLACEHOLDER: Google Form URL]" link in index.html.
const BEE_SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTsUZRDhv0iK1rDUK-2tYDDn5luo-aCDLwVCQNLnDYLt9xvwXeE2dhDAkOJa6aScdPc8o7GGk19CwKB/pub?gid=355342610&single=true&output=csv';

function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (inQuotes) {
      if (char === '"' && text[i + 1] === '"') {
        field += '"';
        i++;
      } else if (char === '"') {
        inQuotes = false;
      } else {
        field += char;
      }
    } else if (char === '"') {
      inQuotes = true;
    } else if (char === ',') {
      row.push(field);
      field = '';
    } else if (char === '\n' || char === '\r') {
      if (field !== '' || row.length > 0) {
        row.push(field);
        rows.push(row);
        row = [];
        field = '';
      }
    } else {
      field += char;
    }
  }
  if (field !== '' || row.length > 0) {
    row.push(field);
    rows.push(row);
  }
  return rows;
}

function loadBeeGallery() {
  const gallery = document.getElementById('beeGallery');
  if (!gallery) return;

  if (BEE_SHEET_CSV_URL.startsWith('[PLACEHOLDER')) {
    gallery.innerHTML = '';
    gallery.appendChild(makeStatus('Adopted bees will show up here soon!'));
    return;
  }

  fetch(BEE_SHEET_CSV_URL)
    .then((res) => res.text())
    .then((text) => {
      const rows = parseCsv(text);
      if (rows.length < 2) {
        gallery.innerHTML = '';
        gallery.appendChild(makeStatus('Be the first to adopt a bee!'));
        return;
      }

      const headers = rows[0].map((h) => h.trim().toLowerCase());
      // Look for the bee-name column specifically, so an added "Venmo
      // username" column (which also contains "name") isn't picked instead.
      let nameCol = headers.findIndex((h) => h.includes('bee') && h.includes('name'));
      if (nameCol === -1) nameCol = headers.findIndex((h) => h.includes('name') && !h.includes('venmo') && !h.includes('username'));
      if (nameCol === -1) nameCol = headers.length > 1 ? 1 : 0;

      const names = rows.slice(1)
        .map((r) => (r[nameCol] || '').trim())
        .filter((name) => name.length > 0);

      gallery.innerHTML = '';
      if (names.length === 0) {
        gallery.appendChild(makeStatus('Be the first to adopt a bee!'));
        return;
      }

      names.forEach((name) => {
        const item = document.createElement('div');
        item.className = 'adopted-bee';

        const icon = document.createElement('img');
        icon.src = 'assets/cursor-bee.png';
        icon.alt = '';
        icon.className = 'adopted-bee-icon';

        const label = document.createElement('span');
        label.textContent = name;

        item.appendChild(icon);
        item.appendChild(label);
        gallery.appendChild(item);
      });
    })
    .catch(() => {
      gallery.innerHTML = '';
      gallery.appendChild(makeStatus('Could not load adopted bees right now.'));
    });
}

function makeStatus(text) {
  const p = document.createElement('p');
  p.className = 'bee-gallery-status';
  p.textContent = text;
  return p;
}

loadBeeGallery();
