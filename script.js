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

// Upcoming Events grid
// 1. Create a plain Google Sheet (not a Form) with columns: Date, Title, Description.
// 2. Fill in one row per event (Description can be left blank).
// 3. File > Share > Publish to web > select the sheet > CSV, then paste that URL below.
// If this fetch fails or the sheet is empty, the events already written into
// index.html are left alone, so the section never looks broken.
const EVENTS_SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vS26SNVhK9y9AOalc-BBwlz4OQtQzv4Ju45_EgxC7X_8nU6KFE9kHBN8X9TWBjWgqqJo8bzXsBgUAco/pub?output=csv';

function loadEventsGrid() {
  const grid = document.getElementById('eventsGrid');
  if (!grid || EVENTS_SHEET_CSV_URL.startsWith('[PLACEHOLDER')) return;

  fetch(EVENTS_SHEET_CSV_URL)
    .then((res) => res.text())
    .then((text) => {
      const rows = parseCsv(text);
      if (rows.length < 2) return;

      const headers = rows[0].map((h) => h.trim().toLowerCase());
      const dateCol = headers.findIndex((h) => h.includes('date'));
      const titleCol = headers.findIndex((h) => h.includes('title'));
      const descCol = headers.findIndex((h) => h.includes('desc'));

      const events = rows.slice(1)
        .map((r) => ({
          date: dateCol > -1 ? (r[dateCol] || '').trim() : '',
          title: titleCol > -1 ? (r[titleCol] || '').trim() : '',
          description: descCol > -1 ? (r[descCol] || '').trim() : '',
        }))
        .filter((ev) => ev.title.length > 0);

      if (events.length === 0) return;

      grid.innerHTML = '';
      events.forEach((ev) => {
        const card = document.createElement('div');
        card.className = 'card event-card';

        if (ev.date) {
          const dateSpan = document.createElement('span');
          dateSpan.className = 'event-date';
          dateSpan.textContent = ev.date;
          card.appendChild(dateSpan);
        }

        const h3 = document.createElement('h3');
        h3.textContent = ev.title;
        card.appendChild(h3);

        if (ev.description) {
          const p = document.createElement('p');
          p.textContent = ev.description;
          card.appendChild(p);
        }

        grid.appendChild(card);
      });
    })
    .catch(() => {
      // Leave the existing static event cards in place on failure.
    });
}

loadBeeGallery();
loadEventsGrid();
