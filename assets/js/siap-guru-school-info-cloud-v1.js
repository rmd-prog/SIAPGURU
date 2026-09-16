(() => {
  const KEY = 'siapguru_school_info_v1';
  const API_BASE = 'https://siapguru.adm-sd.workers.dev/api';

  const getUser = () => {
    try {
      return JSON.parse(sessionStorage.getItem('siapguru_user') || 'null');
    } catch (_) {
      return null;
    }
  };

  const getRemote = async () => {
    const user = getUser();
    if (!user?.id) return null;
    try {
      const response = await fetch(`${API_BASE}/sync?user_id=${encodeURIComponent(user.id)}`, {
        cache: 'no-store'
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok || !data.ok) return null;
      const item = (data.items || []).find(entry => entry.key === KEY);
      return item?.value || null;
    } catch (_) {
      return null;
    }
  };

  const saveRemote = async value => {
    const user = getUser();
    if (!user?.id) return false;
    try {
      const response = await fetch(`${API_BASE}/sync`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: String(user.id),
          key: KEY,
          value: String(value)
        })
      });
      const data = await response.json().catch(() => ({}));
      return !!(response.ok && data.ok);
    } catch (_) {
      return false;
    }
  };

  const patch = () => {
    const api = window.SiapGuruSchoolInfo;
    if (!api || api.__schoolInfoCloudPatched) return !!api;

    api.__schoolInfoCloudPatched = true;
    const originalOpen = api.open;
    const originalSave = api.save;

    api.save = function (data) {
      const value = originalSave.call(api, data);
      saveRemote(JSON.stringify(value)).then(ok => {
        window.dispatchEvent(new CustomEvent('siapguru:school-info-cloud-status', {
          detail: { ok }
        }));
      });
      return value;
    };

    api.open = async function () {
      const remote = await getRemote();
      if (remote) {
        try {
          const parsed = JSON.parse(remote);
          localStorage.setItem(KEY, JSON.stringify(parsed));
        } catch (_) {}
      }
      return originalOpen.call(api);
    };

    return true;
  };

  const timer = setInterval(() => {
    if (patch()) clearInterval(timer);
  }, 100);

  setTimeout(() => clearInterval(timer), 10000);
})();
