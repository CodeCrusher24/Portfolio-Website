/* ── FOOTER YEAR (live from system clock) ── */
document.getElementById('footerYear').textContent = new Date().getFullYear();

/* ── NAV SCROLL ── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 24);
}, { passive: true });

/* ── REVEAL ON SCROLL ── */
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 65);
    }
  });
}, { threshold: 0.08 });
document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

/* ── INTERACTIVE TYPEWRITER CODE WINDOW ── */
// Each line is an array of [text, cssClass] token pairs. Empty array = blank line.
const CODE_LINES = [
  [['@RestController', 'an']],
  [['@RequestMapping', 'an'], ['("/api/v1")', 'cm']],
  [['public ', 'kw'], ['class ', 'kw'], ['ParagKumar', 'cl'], [' {', '']],
  [],
  [['  @Autowired', 'an']],
  [['  private ', 'kw'], ['Passion', 'cl'], [' backendEngineering;', '']],
  [['  private ', 'kw'], ['Passion', 'cl'], [' genAI;', '']],
  [],
  [['  @GetMapping', 'an'], ['("/skills")', 'cm']],
  [['  public ', 'kw'], ['List', 'cl'], ['<', ''], ['String', 'fn'], ['> getSkills() {', '']],
  [['    return ', 'kw'], ['List.of(', ''], ['"Spring Boot"', 'st'], [',', '']],
  [['               ', ''], ['"PostgreSQL"', 'st'], [', ', ''], ['"Gemini API"', 'st'], [', ', ''], ['"JWT"', 'st'], [');', '']],
  [['  }', '']],
  [],
  [['  ', ''], ['// ', 'cm'], ['currently building: UniHire 🚀', 'cm']],
  [['}', '']],
];

const codeBody    = document.getElementById('codeBody');
const editingPill = document.getElementById('editingPill');
const codeCard    = document.getElementById('codeCard');

let visibleLines = 0;
let userText     = '';
let typingDone   = false;
let focused      = false;
let userLineEls  = [];
let hintEl       = null;

function buildLineEl(tokens, lineNum, withCursor) {
  const row  = document.createElement('div');
  row.className = 'code-line';

  const ln = document.createElement('span');
  ln.className = 'ln';
  ln.textContent = lineNum;
  row.appendChild(ln);

  const code = document.createElement('span');
  if (!tokens || tokens.length === 0) {
    code.innerHTML = '&nbsp;';
  } else {
    tokens.forEach(([txt, cls]) => {
      const s = document.createElement('span');
      if (cls) s.className = cls;
      s.textContent = txt;
      code.appendChild(s);
    });
  }
  if (withCursor) {
    const cur = document.createElement('span');
    cur.className = 'cursor';
    cur.id = 'typeCursor';
    code.appendChild(cur);
  }
  row.appendChild(code);
  return row;
}

function removeCursor() {
  const c = document.getElementById('typeCursor');
  if (c) c.remove();
}

function scrollToBottom() {
  codeBody.scrollTop = codeBody.scrollHeight;
}

function typeNextLine() {
  if (visibleLines >= CODE_LINES.length) {
    typingDone = true;
    renderUserSection();
    return;
  }

  removeCursor();

  const tokens = CODE_LINES[visibleLines];
  const row = document.createElement('div');
  row.className = 'code-line';

  const ln = document.createElement('span');
  ln.className = 'ln';
  ln.textContent = visibleLines + 1;
  row.appendChild(ln);

  const code = document.createElement('span');
  row.appendChild(code);
  codeBody.appendChild(row);

  let tokenIndex = 0;
  let charIndex = 0;

  function typeChar() {
    if (!tokens || tokens.length === 0) {
      code.innerHTML = '&nbsp;';
      finishLine();
      return;
    }

    if (tokenIndex >= tokens.length) {
      finishLine();
      return;
    }

    const [text, cls] = tokens[tokenIndex];

    if (charIndex === 0) {
      const span = document.createElement('span');
      if (cls) span.className = cls;
      span.dataset.fullText = text;
      span.dataset.index = "0";
      code.appendChild(span);
    }

    const span = code.lastChild;
    span.textContent += text[charIndex];
    charIndex++;

    // typing speed per character
    const speed = 18 + Math.random() * 25;

    if (charIndex < text.length) {
      setTimeout(typeChar, speed);
    } else {
      tokenIndex++;
      charIndex = 0;
      setTimeout(typeChar, 20);
    }
  }

  function finishLine() {
    const cursor = document.createElement('span');
    cursor.className = 'cursor';
    cursor.id = 'typeCursor';
    code.appendChild(cursor);

    visibleLines++;
    scrollToBottom();

    // pause between lines (important for realism)
    setTimeout(typeNextLine, 250 + Math.random() * 200);
  }

  typeChar();
}

function renderUserSection() {
  // Remove old user lines and hint
  userLineEls.forEach(el => el.remove());
  if (hintEl) hintEl.remove();
  userLineEls = [];

  const lines = userText.split('\n');
  lines.forEach((line, i) => {
    const row = document.createElement('div');
    row.className = 'code-line';

    const ln = document.createElement('span');
    ln.className = 'ln';
    ln.textContent = CODE_LINES.length + i + 1;
    row.appendChild(ln);

    const code = document.createElement('span');
    const pre  = document.createElement('span');
    pre.className = 'cm';
    pre.textContent = '// ';
    const txt = document.createElement('span');
    txt.className = 'cm';
    txt.textContent = line;
    code.appendChild(pre);
    code.appendChild(txt);

    // Cursor on last line
    if (i === lines.length - 1) {
      const cur = document.createElement('span');
      cur.className = 'cursor';
      code.appendChild(cur);
    }
    row.appendChild(code);
    codeBody.appendChild(row);
    userLineEls.push(row);
  });

  hintEl = document.createElement('div');
  hintEl.className = 'code-hint';
  hintEl.textContent = focused ? '← type your own comment' : '← click to type';
  codeBody.appendChild(hintEl);
  scrollToBottom();
}

// Start typewriter
typeNextLine();

// Focus / blur
codeCard.addEventListener('click', () => {
  if (!typingDone) return;
  focused = true;
  editingPill.style.display = '';
  codeCard.focus();
  if (hintEl) hintEl.textContent = '← type your own comment';
});

codeCard.addEventListener('blur', () => {
  focused = false;
  editingPill.style.display = 'none';
  if (hintEl) hintEl.textContent = '← click to type';
});

// Keydown — capture typing
codeCard.addEventListener('keydown', (e) => {
  if (!typingDone || !focused) return;
  if (e.key === 'Enter') {
    e.preventDefault();
    userText += '\n';
  } else if (e.key === 'Backspace') {
    e.preventDefault();
    if (userText.length > 0) userText = userText.slice(0, -1);
  } else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
    e.preventDefault();
    userText += e.key;
  } else {
    return;
  }
  renderUserSection();
});
