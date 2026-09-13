/* SIAP GURU — verified agama chapter overlay
   Only replaces religion seed placeholders where chapter titles have been verified.
   No token/API AI. Does not touch D1, Worker, login, Dashboard, or protected rooms.
*/
(()=>{
  const patches={
    'Pendidikan Agama Islam dan Budi Pekerti':{
      2:['Ayo Belajar Al-Qur’an','Mari Mengenal Allah Swt.','Ayo Berperilaku Terpuji','Alhamdulillah, Aku Bisa Salat']
    },
    'Pendidikan Agama Katolik dan Budi Pekerti':{
      1:['Aku Bangga Menjadi Diriku','Aku Berkembang dalam Lingkungan','Allah Sang Pencipta','Kisah Kelahiran Yesus Kristus','Doa dalam Gereja Katolik'],
      2:['Aku dan Lingkunganku','Tokoh-tokoh Iman dalam Perjanjian Lama','Masa Kanak-kanak Yesus','Beriman dan Berdoa kepada Allah','Mewujudkan Iman dalam Masyarakat']
    },
    'Pendidikan Agama Hindu dan Budi Pekerti':{
      2:['Tokoh-Tokoh Dharma dalam Mahabharata','Hyang Widhi Wasa sebagai Sumber Hidup','Orang Suci dalam Agama Hindu','Sarana Persembahyangan']
    },
    'Pendidikan Agama Buddha dan Budi Pekerti':{
      1:['Diriku','Aku dan Temanku','Menyayangi Diri Sendiri','Menghargai Sesama','Identitas Agama Buddha','Kita Adalah Saudara','Bersikap Sopan','Tertib dan Sopan','Pandai Berteman']
    }
  };
  const apply=()=>{
    const api=window.SiapGuruMasterBab;
    if(!api||typeof api.getAll!=='function')return false;
    const data=api.getAll();
    Object.entries(patches).forEach(([mapel,classes])=>Object.entries(classes).forEach(([kelas,titles])=>{
      const rows=data.filter(x=>x.mapel===mapel&&String(x.kelas)===String(kelas));
      titles.forEach((title,i)=>{
        const row=rows[i];
        if(row)row.bab=title;
      });
    }));
    try{
      const key='siapguru_master_bab_v1';
      const old=JSON.parse(localStorage.getItem(key)||'[]');
      const map=new Map(old.map(x=>[x.id,x]));
      data.forEach(x=>map.set(x.id,x));
      localStorage.setItem(key,JSON.stringify([...map.values()]));
    }catch(_){ }
    return true;
  };
  let tries=0;const timer=setInterval(()=>{if(apply()||++tries>80)clearInterval(timer)},100);
})();
