module.exports = {
  slides: [
    { type: 'image', src: '/periyar_birth.jpg', alt: 'Periyar', orderIndex: 0 },
    { type: 'image', src: '/teachers.jpg', alt: 'Teachers Day', orderIndex: 1 },
    { type: 'video', src: '/Antiragging.mp4', alt: 'Anti Ragging', orderIndex: 2 },
    { type: 'image', src: '/krc1.jpg', alt: 'KRC', orderIndex: 3 },
    { type: 'image', src: '/pasumai.jpg', alt: 'Pasumai', orderIndex: 4 },
    { type: 'image', src: '/sip.jpg', alt: 'SIP', orderIndex: 5 }
  ],
  news: [
    { date: '24 APR 2026', title: 'CDOE (PUCODE) - Feb 2026 Examinations – Hall Ticket', url: 'http://pridecoe.periyaruniversity.ac.in/CDOE_feb26_hall_ticket/' },
    { date: '24 APR 2026', title: 'CDOE (PUCODE) - Feb 2026 Examinations – Time Table', url: 'http://pridecoe.periyaruniversity.ac.in/schme-CDOE_feb2026.pdf' },
    { date: '21 APR 2026', title: 'Admission Notification - Advertisement', url: 'https://www.periyaruniversity.ac.in/Documents/2026/Advt/ad14.pdf' }
  ],
  settings: {
    navbarMenu: [
      {
        label: 'University',
        links: [
          { name: 'About University', url: 'https://www.periyaruniversity.ac.in/AboutUs.php' },
          { name: 'VC Desk', url: 'https://www.periyaruniversity.ac.in' },
          { name: 'Services', url: 'https://www.periyaruniversity.ac.in/services.php' },
          { name: 'Facilities', url: 'https://www.periyaruniversity.ac.in/Facilities.php' },
          { name: '2(f) - 12 (B)', links: [{ name: '2(f)', url: 'https://www.periyaruniversity.ac.in/Documents/2025/Ranking/2f.jpg' }, { name: '12(B)', url: 'https://www.periyaruniversity.ac.in/Documents/2025/Ranking/12b.jpg' }] },
          { name: 'Approval', url: 'https://www.periyaruniversity.ac.in/Documents/2025/Ranking/tnapproval.pdf' },
          { name: 'Schools and Departments', url: '/Dept' },
        ]
      }
      // ... more can be added, but this is enough to show it works
    ],
    footerAcademic: [
      { name: 'Affiliated Colleges', url: 'https://www.periyaruniversity.ac.in/Affiliated_Colleges.php' },
      { name: 'Community Colleges', url: 'https://www.periyaruniversity.ac.in/Community_Colleges.php' },
      { name: 'Schools and Departments', url: '/Dept' }
    ]
  }
};
