const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 60);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

const nav = document.querySelector('.left-sidebar');
const sections = ['hero', 'projects', 'about', 'skills', 'contact'];
const navLinks = {};
document.querySelectorAll('.sidebar-nav a[data-section]').forEach(a => {
  navLinks[a.dataset.section] = a;
});
const sectionEls = sections.map(id => document.getElementById(id)).filter(Boolean);
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      Object.values(navLinks).forEach(a => a.classList.remove('active'));
      const active = navLinks[entry.target.id];
      if (active) active.classList.add('active');
    }
  });
}, { threshold: 0.3 });
sectionEls.forEach(el => sectionObserver.observe(el));

const rsbProgress = document.getElementById('rsb-progress');
const progressPct = document.getElementById('progress-pct');
function updateProgress() {
  const docH = document.documentElement.scrollHeight - window.innerHeight;
  const pct = docH > 0 ? Math.round((window.scrollY / docH) * 100) : 0;
  if(rsbProgress) rsbProgress.style.width = pct + '%';
  if(progressPct) progressPct.textContent = pct + '%';
}
window.addEventListener('scroll', updateProgress, { passive: true });
updateProgress();

// project-1=clinical trial risk, 2=osteoporosis, 3=ISCVAM, 4=Hiring Intelligence, 5=MAUDE, 6=VAERS
const searchInput = document.getElementById('search-input');
const searchMap = [
  { terms: ['clinical trial','trial','aact','clinicaltrials','termination','nlp','cloud run','calibration'], target: 'project-1' },
  { terms: ['osteoporosis','bone','classification','roc','auc','imbalance','case-control','recall','ehr'], target: 'project-2' },
  { terms: ['iscvam','single cell','multiomics','genomics','rna','atac','hci','bioinformatics','pipeline','slurm','hpc','oncology'], target: 'project-3' },
  { terms: ['hiring','recruit','recruitment','streamlit','candidate','predictor'], target: 'project-4' },
  { terms: ['maude','device','shiny','dashboard','harm','trend','fda'], target: 'project-5' },
  { terms: ['covid','vaccine','vaers','adverse','symptom','moderna','pfizer','cdc','mining','rule','association'], target: 'project-6' },
  { terms: ['skill','python','sql','xgboost','scikit','machine','learning','random forest','svm','logistic','statistics','databricks','snowflake','docker','git'], target: 'skills' },
  { terms: ['about','bio','background','publication','publications','doi','journal','paper','author'], target: 'about' },
  { terms: ['contact','email','linkedin','github'], target: 'contact' },
];
// Short terms (<=3 chars) must match exactly so "r" or "ml" don't hijack every query.
function termMatches(val, t) {
  if (t.length <= 3) return val === t;
  return val.length >= 2 && (val.includes(t) || t.includes(val));
}
if(searchInput) {
  searchInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      const val = searchInput.value.toLowerCase().trim();
      if (!val) return;
      for (const entry of searchMap) {
        if (entry.terms.some(t => termMatches(val, t))) {
          const el = document.getElementById(entry.target);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            el.style.outline = '2px solid var(--teal)';
            el.style.outlineOffset = '4px';
            setTimeout(() => { el.style.outline = ''; el.style.outlineOffset = ''; }, 1800);
          }
          searchInput.value = '';
          return;
        }
      }
    }
  });
}

// Category filters (ids as above)
const catMap = {
  'ml':          ['project-1', 'project-2', 'project-4', 'project-6'],
  'health':      ['project-1', 'project-2', 'project-3', 'project-5', 'project-6'],
  'engineering': ['project-1', 'project-3', 'project-4'],
  'apps':        ['project-1', 'project-4', 'project-5'],
  'all':         ['project-1', 'project-2', 'project-3', 'project-4', 'project-5', 'project-6'],
};
document.querySelectorAll('.cat-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    const visible = catMap[filter] || catMap['all'];
    document.querySelectorAll('.project-card').forEach(card => {
      card.style.display = visible.includes(card.id) ? '' : 'none';
    });
    if (filter !== 'all') {
      const first = document.getElementById(visible[0]);
      if (first) first.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

document.querySelectorAll('.tag-chip[data-jump]').forEach(chip => {
  chip.addEventListener('click', () => {
    const el = document.getElementById(chip.dataset.jump);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});
