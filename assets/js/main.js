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
const sections = ['hero', 'skills', 'projects', 'about'];
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

const searchInput = document.getElementById('search-input');
const searchMap = [
  { terms: ['skill','python','r','spark','xgboost','scikit','ml','machine','learning','random forest','svm','logistic','association'], target: 'skills' },
  { terms: ['spark','pyspark','big data','health','eda','population','scale','distributed','income','healthcare spending','snowflake'], target: 'project-1' },
  { terms: ['osteoporosis','bone','classification','roc','auc','imbalance','prediction'], target: 'project-2' },
  { terms: ['covid','vaccine','vaers','adverse','symptom','moderna','pfizer','cdc','fda','mining','rule'], target: 'project-3' },
  { terms: ['maude','device','shiny','dashboard','harm','trend'], target: 'project-4' },
  { terms: ['iscvam','single cell','multiomics','genomics','rna','atac','hci','bioinformatics','interactive'], target: 'project-5' },
  { terms: ['about','bio','background','contact','email','linkedin','github'], target: 'about' },
];
if(searchInput) {
  searchInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      const val = searchInput.value.toLowerCase().trim();
      if (!val) return;
      for (const entry of searchMap) {
        if (entry.terms.some(t => val.includes(t) || t.includes(val))) {
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

// project-1=spark, 2=osteo, 3=vaers, 4=maude, 5=iscvam
const catMap = {
  'ml':            ['project-2', 'project-3'],
  'health':        ['project-1', 'project-2', 'project-3', 'project-4'],
  'bioinformatics':['project-5'],
  'visualization': ['project-4', 'project-5'],
  'bigdata':       ['project-1'],
  'all':           ['project-1','project-2','project-3','project-4','project-5'],
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
