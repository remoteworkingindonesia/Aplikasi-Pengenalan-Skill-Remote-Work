import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Download, FileText } from 'lucide-react';
import jsPDF from 'jspdf';
import rwiLogo from 'figma:asset/214befc0a30b37591d5cdd5bf205e4680254c89a.png';

interface AssessmentData {
  background: string;
  experience: string[];
  skills: string[];
  timeAvailability: string;
  workPreference: string[];  // Changed to array
  englishLevel: string;
  challenges: string[];
  tools: string[];
  interests: string[];
  freeDescription: string;
  availableHours?: string;
}

interface PDFGeneratorProps {
  data: AssessmentData;
  userName: string;
  userEmail: string;
}

export function PDFGenerator({ data, userName, userEmail }: PDFGeneratorProps) {
  const generatePDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    const margin = 20;
    const usableWidth = pageWidth - (2 * margin);
    let yPosition = 30;
    
    // Generate results using the same logic as ResultsDisplay
    const results = generateAIResults(data);
    
    // Set font
    doc.setFont('helvetica', 'normal');
    
    // Helper function to add text with automatic line wrapping
    const addWrappedText = (text: string, x: number, y: number, maxWidth: number, fontSize: number = 10, style: 'normal' | 'bold' = 'normal') => {
      doc.setFontSize(fontSize);
      doc.setFont('helvetica', style);
      
      const lines = doc.splitTextToSize(text, maxWidth);
      let currentY = y;
      
      lines.forEach((line: string) => {
        if (currentY > pageHeight - 30) {
          doc.addPage();
          currentY = 30;
        }
        doc.text(line, x, currentY);
        currentY += fontSize * 0.4;
      });
      
      return currentY + 5;
    };
    
    // Helper function to check if we need a new page
    const checkNewPage = (requiredSpace: number) => {
      if (yPosition + requiredSpace > pageHeight - 30) {
        doc.addPage();
        yPosition = 30;
      }
    };

    // Helper function to add logo
    const addLogo = (x: number, y: number, width: number, height: number) => {
      try {
        doc.addImage(rwiLogo, 'PNG', x, y, width, height);
      } catch (error) {
        // Fallback jika logo tidak bisa ditambahkan
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('RWI', x, y + height/2);
      }
    };

    // Header
    doc.setFillColor(30, 64, 175);
    doc.rect(0, 0, pageWidth, 50, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('Hasil Assessment Remote Work Skill', pageWidth / 2, 25, { align: 'center' });
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('Remote Working Indonesia Community', pageWidth / 2, 35, { align: 'center' });
    
    doc.setFontSize(10);
    doc.text(`Tanggal: ${new Date().toLocaleDateString('id-ID')}`, pageWidth / 2, 42, { align: 'center' });
    
    doc.setTextColor(0, 0, 0);
    yPosition = 70;

    // Section 1: Informasi Peserta
    checkNewPage(80);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('INFORMASI PESERTA', margin, yPosition);
    yPosition += 10;
    
    doc.setDrawColor(59, 130, 246);
    doc.setLineWidth(1);
    doc.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 15;
    
    const participantInfo = [
      `Nama: ${userName}`,
      `Email: ${userEmail}`,
      `Latar Belakang: ${data.background}`,
      `Waktu Tersedia: ${data.timeAvailability}`,
      `Preferensi Kerja: ${data.workPreference.join(', ')}`,
      `Level Bahasa Inggris: ${data.englishLevel}`,
      `Jam Kerja Tersedia: ${data.availableHours || 'Tidak ditentukan'}`
    ];
    
    participantInfo.forEach(info => {
      yPosition = addWrappedText(info, margin, yPosition, usableWidth, 10);
    });
    
    yPosition += 10;

    // Section 2: Analisis Time Zone
    checkNewPage(100);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('ANALISIS TIME ZONE OPTIMAL', margin, yPosition);
    yPosition += 10;
    
    doc.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 15;
    
    yPosition = addWrappedText('Rekomendasi Time Zone:', margin, yPosition, usableWidth, 11, 'bold');
    yPosition = addWrappedText(results.timeZoneAnalysis.zones.join(', '), margin + 10, yPosition, usableWidth - 10, 9);
    yPosition += 5;
    
    yPosition = addWrappedText('Analisis:', margin, yPosition, usableWidth, 11, 'bold');
    yPosition = addWrappedText(results.timeZoneAnalysis.reasoning, margin + 10, yPosition, usableWidth - 10, 9);
    yPosition += 5;
    
    yPosition = addWrappedText('Tips Pencarian Kerja:', margin, yPosition, usableWidth, 11, 'bold');
    results.timeZoneAnalysis.jobSearchTips.forEach((tip, index) => {
      yPosition = addWrappedText(`${index + 1}. ${tip}`, margin + 10, yPosition, usableWidth - 10, 9);
    });
    yPosition += 10;

    // Section 3: Skill Analysis dengan Reasoning (ENHANCED)
    checkNewPage(120);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('ANALISIS SKILL TERSEMBUNYI', margin, yPosition);
    yPosition += 10;
    
    doc.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 15;
    
    if (results.detectedSkills.length > 0) {
      results.detectedSkills.forEach((skillItem, index) => {
        checkNewPage(40);
        yPosition = addWrappedText(`${index + 1}. ${skillItem.skill}`, margin, yPosition, usableWidth, 11, 'bold');
        yPosition = addWrappedText(`Alasan: ${skillItem.reasoning}`, margin + 10, yPosition, usableWidth - 10, 9);
        yPosition += 5;
      });
    } else {
      yPosition = addWrappedText('Skill tersembunyi sedang dianalisis berdasarkan background dan pengalaman Anda.', margin, yPosition, usableWidth, 10);
    }
    yPosition += 10;

    // Section 4: Hard Skills & Pengalaman
    checkNewPage(80);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('HARD SKILLS & PENGALAMAN', margin, yPosition);
    yPosition += 10;
    
    doc.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 15;
    
    yPosition = addWrappedText('Pengalaman:', margin, yPosition, usableWidth, 11, 'bold');
    if (data.experience.length > 0) {
      yPosition = addWrappedText(data.experience.join(', '), margin + 10, yPosition, usableWidth - 10, 9);
    } else {
      yPosition = addWrappedText('Belum ada pengalaman yang dipilih', margin + 10, yPosition, usableWidth - 10, 9);
    }
    yPosition += 5;
    
    yPosition = addWrappedText('Tools & Software:', margin, yPosition, usableWidth, 11, 'bold');
    if (data.tools.length > 0) {
      yPosition = addWrappedText(data.tools.join(', '), margin + 10, yPosition, usableWidth - 10, 9);
    } else {
      yPosition = addWrappedText('Belum ada tools yang dipilih', margin + 10, yPosition, usableWidth - 10, 9);
    }
    yPosition += 5;
    
    yPosition = addWrappedText('Soft Skills:', margin, yPosition, usableWidth, 11, 'bold');
    if (data.skills.length > 0) {
      yPosition = addWrappedText(data.skills.join(', '), margin + 10, yPosition, usableWidth - 10, 9);
    } else {
      yPosition = addWrappedText('Belum ada soft skills yang dipilih', margin + 10, yPosition, usableWidth - 10, 9);
    }
    yPosition += 10;

    // Section 5: Analisis Bahasa Inggris
    checkNewPage(80);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('ANALISIS KEMAMPUAN BAHASA INGGRIS', margin, yPosition);
    yPosition += 10;
    
    doc.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 15;
    
    yPosition = addWrappedText(`Level: ${data.englishLevel}`, margin, yPosition, usableWidth, 10, 'bold');
    yPosition = addWrappedText(getEnglishAnalysis(data.englishLevel), margin, yPosition, usableWidth, 10);
    
    if (results.englishBasedJobs.length > 0) {
      yPosition += 5;
      yPosition = addWrappedText('Rekomendasi pekerjaan sesuai level bahasa:', margin, yPosition, usableWidth, 10, 'bold');
      yPosition = addWrappedText(results.englishBasedJobs.join(', '), margin + 10, yPosition, usableWidth - 10, 9);
    }
    yPosition += 10;

    // Section 6: Rekomendasi Pekerjaan
    checkNewPage(120);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('REKOMENDASI PEKERJAAN REMOTE', margin, yPosition);
    yPosition += 10;
    
    doc.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 15;
    
    results.recommendedJobs.forEach((job, index) => {
      checkNewPage(50);
      yPosition = addWrappedText(`${index + 1}. ${job}`, margin, yPosition, usableWidth, 11, 'bold');
      yPosition = addWrappedText(getJobDescription(job), margin + 10, yPosition, usableWidth - 10, 9);
      yPosition = addWrappedText(`Mengapa cocok: ${getJobReasoning(job, data)}`, margin + 10, yPosition, usableWidth - 10, 8);
      yPosition += 5;
    });

    // Section 7: Tipe Remote Work
    checkNewPage(60);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('TIPE REMOTE WORK YANG COCOK', margin, yPosition);
    yPosition += 10;
    
    doc.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 15;
    
    yPosition = addWrappedText('Rekomendasi:', margin, yPosition, usableWidth, 11, 'bold');
    yPosition = addWrappedText(results.workTypes.join(' + ').replace(/[🎯⏰💼🚀🎓]/g, ''), margin, yPosition, usableWidth, 12, 'bold');
    yPosition = addWrappedText(results.reasoning, margin, yPosition, usableWidth, 10);
    yPosition += 10;

    // Section 8: Deskripsi Pengalaman LENGKAP (ditampilkan)
    checkNewPage(60);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('DESKRIPSI PENGALAMAN LENGKAP', margin, yPosition);
    yPosition += 10;
    
    doc.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 15;
    
    if (data.freeDescription && data.freeDescription.trim()) {
      yPosition = addWrappedText(`"${data.freeDescription}"`, margin, yPosition, usableWidth, 10);
    } else {
      yPosition = addWrappedText('Tidak ada deskripsi pengalaman yang diberikan.', margin, yPosition, usableWidth, 10);
    }
    yPosition += 10;

    // Section 9: Tantangan DENGAN SOLUSI
    if (data.challenges.length > 0) {
      checkNewPage(120);
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('TANTANGAN YANG PERLU DIATASI', margin, yPosition);
      yPosition += 10;
      
      doc.line(margin, yPosition, pageWidth - margin, yPosition);
      yPosition += 15;
      
      const challengeSolutions = getChallengeSolutions();
      
      data.challenges.forEach((challenge, index) => {
        checkNewPage(35);
        yPosition = addWrappedText(`${index + 1}. ${challenge}`, margin, yPosition, usableWidth, 10, 'bold');
        const solution = challengeSolutions[challenge] || 'Konsultasikan dengan mentor atau komunitas RWI untuk mendapatkan guidance yang tepat.';
        yPosition = addWrappedText(`Solusi: ${solution}`, margin + 10, yPosition, usableWidth - 10, 9);
        yPosition += 5;
      });
      yPosition += 10;
    }

    // Section 10: Langkah Selanjutnya
    checkNewPage(100);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(`LANGKAH SELANJUTNYA UNTUK ${userName.toUpperCase()}`, margin, yPosition);
    yPosition += 10;
    
    doc.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 15;
    
    results.nextSteps.forEach((step, index) => {
      checkNewPage(25);
      yPosition = addWrappedText(`${index + 1}. ${step}`, margin, yPosition, usableWidth, 10);
    });

    // Footer dengan LOGO RWI dan kontak yang benar
    checkNewPage(120);
    yPosition += 15;
    
    // Add RWI Logo
    addLogo(margin, yPosition, 30, 15);
    yPosition += 25;
    
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('BERGABUNG DENGAN KOMUNITAS RWI', margin, yPosition);
    yPosition += 15;
    
    yPosition = addWrappedText('Remote Working Indonesia adalah komunitas yang mendukung profesional Indonesia untuk sukses dalam karir remote work di berbagai bidang.', margin, yPosition, usableWidth, 10);
    yPosition += 10;
    
    // Kontak info yang sudah direvisi sesuai permintaan
    const contactInfo = [
      'Email: remoteworkingindonesia@gmail.com', 
      'Instagram: @remoteworkingindonesia',
      'Threads: @remoteworkingindonesia'
    ];
    
    contactInfo.forEach(contact => {
      yPosition = addWrappedText(contact, margin, yPosition, usableWidth, 10);
    });
    
    yPosition += 20;
    
    // Disclaimer text yang direvisi sesuai permintaan - ukuran lebih kecil
    yPosition = addWrappedText(`Penilaian komprehensif ini disusun khusus untuk ${userName}, menggabungkan analisis keterampilan tersembunyi, zona waktu, dan berbagai preferensi kerja. Panduan personal ini dihasilkan dengan bantuan AI untuk mendukung langkah awal Anda dalam menapaki karir remote working. Informasi di dalamnya bersifat umum dan tidak menggantikan nasihat profesional. Untuk rekomendasi yang lebih spesifik dan mendalam, silakan berkonsultasi dengan konsultan karir berlisensi.`, margin, yPosition, usableWidth, 8);
    
    yPosition += 15;
    yPosition = addWrappedText('(c) 2025 Remote Working Indonesia. All rights reserved.', pageWidth / 2, yPosition, usableWidth, 7);
    
    // Save the PDF
    const filename = `RWI-Assessment-${userName.replace(/\s+/g, '-')}-${new Date().getTime()}.pdf`;
    doc.save(filename);
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-green-600" />
          Download Hasil Assessment - {userName}
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Dapatkan laporan lengkap hasil assessment Anda dalam format PDF
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-green-50 p-4 rounded-lg">
          <h4 className="font-medium text-green-700 mb-2">📊 Yang Akan Anda Dapatkan:</h4>
          <ul className="text-sm text-green-600 space-y-1">
            <li>• Analisis skill tersembunyi dengan reasoning yang jelas</li>
            <li>• Analisis time zone optimal untuk pencarian kerja</li>
            <li>• Rekomendasi pekerjaan remote detail (termasuk bidang teknik)</li>
            <li>• Multiple work preferences analysis</li>
            <li>• Solusi untuk tantangan yang dihadapi</li>
            <li>• Langkah-langkah konkret dan personal untuk memulai</li>
            <li>• Kontak lengkap RWI untuk konsultasi lanjutan</li>
          </ul>
        </div>
        
        <Button 
          onClick={generatePDF} 
          className="w-full bg-green-600 hover:bg-green-700"
          size="lg"
        >
          <Download className="w-4 h-4 mr-2" />
          Download PDF Lengkap
        </Button>
        
        <p className="text-xs text-muted-foreground text-center">
          File PDF akan berisi semua informasi yang ditampilkan di web plus analisis time zone dan reasoning skill tersembunyi. 
          Dapat dibuka dengan Adobe Reader atau browser modern.
        </p>
      </CardContent>
    </Card>
  );
}

// Function untuk memberikan solusi spesifik untuk setiap tantangan
function getChallengeSolutions(): { [key: string]: string } {
  return {
    'Tidak tahu cara memulai': 'Mulai dengan membuat profile di platform freelance seperti Upwork atau Fiverr. Buat portfolio sederhana dengan project personal atau volunteer work. Join komunitas RWI untuk mendapat guidance dari member yang sudah berpengalaman.',
    'Kurang percaya diri': 'Mulai dengan project kecil dan murah untuk membangun confidence. Fokus pada strength yang sudah Anda miliki. Buat testimoni dari client pertama meski bayarannya kecil. Practice pitch dan communication skills secara rutin.',
    'Keterbatasan waktu': 'Manfaatkan time blocking method dan prioritaskan project yang high-value. Mulai dengan part-time remote work atau project weekend. Delegasikan tugas non-essential di kehidupan sehari-hari.',
    'Skill kurang memadai': 'Ikuti online course gratis di Coursera, edX, atau YouTube. Focus pada 1-2 skill yang paling marketable terlebih dahulu. Practice dengan project personal sambil belajar. Join bootcamp atau workshop RWI.',
    'Tidak ada pengalaman remote work': 'Volunteer untuk project remote di NGO atau startup. Tawarkan jasa gratis untuk 1-2 client pertama dengan syarat mendapat testimonial. Simulate remote work environment di rumah untuk beradaptasi.',
    'Kesulitan mencari klien/perusahaan': 'Optimize profile di LinkedIn dan platform freelance. Network aktif di grup remote worker Indonesia. Cold email dengan value proposition yang jelas. Manfaatkan referral dari network yang ada.',
    'Technology/tools baru': 'Dedikasikan 30 menit per hari untuk explore tools baru. Follow tutorial YouTube step-by-step. Join online community untuk tanya jawab. Practice hands-on dengan project dummy.',
    'Work-life balance': 'Set boundaries yang jelas antara work time dan personal time. Buat dedicated workspace di rumah. Use time tracking apps untuk monitor productivity. Communicate expectations dengan family/housemates.',
    'Bahasa Inggris kurang lancar': 'Use Grammarly untuk writing assistance. Practice conversation dengan apps seperti HelloTalk. Fokus pada vocabulary yang specific untuk bidang Anda. Start dengan client lokal terlebih dahulu.',
    'Networking terbatas': 'Join LinkedIn groups related to your field. Attend virtual networking events. Engage actively di social media dengan share insights. Offer help ke orang lain tanpa mengharapkan balasan immediate.'
  };
}

// Helper functions - enhanced untuk include freeDescription analysis
function generateAIResults(data: AssessmentData) {
  const detectedSkills: { skill: string; reasoning: string }[] = [];
  const recommendedJobs: string[] = [];
  const englishBasedJobs: string[] = [];
  const workTypes: string[] = [];
  let reasoning = '';
  
  // Background skills dengan reasoning
  const backgroundSkills: { [key: string]: { skill: string; reasoning: string }[] } = {
    'Ibu rumah tangga': [
      { skill: 'Manajemen Multitasking', reasoning: 'Sebagai ibu rumah tangga, Anda terbiasa mengelola banyak tugas sekaligus - mengurus anak, rumah, belanja, dan jadwal keluarga. Skill ini sangat dibutuhkan untuk project management remote.' },
      { skill: 'Budget Management', reasoning: 'Anda sudah berpengalaman mengelola anggaran rumah tangga, berhemat, dan mengalokasikan dana untuk berbagai kebutuhan. Skill ini berharga untuk cost management dan financial analysis.' }
    ],
    'Karyawan swasta': [
      { skill: 'Professional Communication', reasoning: 'Pengalaman bekerja di lingkungan formal mengasah kemampuan komunikasi profesional, email etiquette, dan workplace diplomacy yang sangat dibutuhkan remote work.' },
      { skill: 'Deadline Management', reasoning: 'Terbiasa dengan target dan deadline perusahaan membuat Anda ahli dalam time management dan delivery yang tepat waktu - essential skill untuk freelancer.' }
    ],
    'Fresh graduate': [
      { skill: 'Learning Agility', reasoning: 'Sebagai fresh graduate, Anda memiliki mindset belajar yang fresh dan adaptif. Kemampuan menyerap informasi baru dengan cepat sangat berharga di dunia remote work yang dinamis.' },
      { skill: 'Tech Literacy', reasoning: 'Generasi digital native dengan kemampuan teknologi yang mumpuni. Anda lebih mudah menguasai tools dan platform baru yang dibutuhkan untuk remote work.' }
    ],
    'Freelancer': [
      { skill: 'Self Management', reasoning: 'Pengalaman freelance membuktikan kemampuan mengatur diri sendiri tanpa supervisi langsung - inti dari successful remote work.' },
      { skill: 'Client Relations', reasoning: 'Mengelola hubungan dengan berbagai client, negosiasi fee, dan maintain satisfaction menunjukkan business development skills yang mature.' }
    ],
    'Mahasiswa': [
      { skill: 'Research Excellence', reasoning: 'Kebiasaan riset untuk tugas kuliah, skripsi, dan project akademik melatih kemampuan research yang mendalam - skill berharga untuk content creation dan analysis.' },
      { skill: 'Presentation Skills', reasoning: 'Sering presentasi di kelas dan seminar mengasah communication skills dan confidence dalam menyampaikan ide.' }
    ],
    'Pengusaha': [
      { skill: 'Strategic Thinking', reasoning: 'Pengalaman menjalankan bisnis mengembangkan kemampuan berpikir strategis, perencanaan jangka panjang, dan business acumen.' },
      { skill: 'Leadership & Delegation', reasoning: 'Mengelola tim dan operasional bisnis melatih leadership skills dan kemampuan mendelegasikan tugas secara efektif.' }
    ],
    'Pensiunan': [
      { skill: 'Mentoring & Knowledge Transfer', reasoning: 'Pengalaman kerja puluhan tahun memberikan wisdom dan kemampuan mentoring yang sangat berharga untuk consulting atau training roles.' },
      { skill: 'Industry Expertise', reasoning: 'Deep knowledge di bidang tertentu dari pengalaman bertahun-tahun menjadi aset berharga untuk specialized consulting.' }
    ]
  };

  if (backgroundSkills[data.background]) {
    detectedSkills.push(...backgroundSkills[data.background]);
  }

  // ENHANCED: Analisis dari freeDescription
  if (data.freeDescription && data.freeDescription.trim()) {
    const freeDescSkills = analyzeFromFreeDescription(data.freeDescription);
    detectedSkills.push(...freeDescSkills);
  }

  // Experience mapping
  const experienceMapping: { [key: string]: string[] } = {
    'Event organizing': ['Virtual Event Planner', 'Project Coordinator'],
    'Marketing/Sales': ['Digital Marketing Specialist', 'Sales Development Rep'],
    'Civil Engineering/Sipil': ['Remote Civil Engineer', 'CAD Drafter', 'Construction Consultant'],
    'Teaching/Training': ['Online Tutor', 'Course Creator', 'Corporate Trainer'],
    'Programming/IT': ['Remote Developer', 'Technical Writer', 'Software Consultant']
  };

  // Process experiences
  data.experience.forEach(exp => {
    if (experienceMapping[exp]) {
      recommendedJobs.push(...experienceMapping[exp]);
    }
  });

  // Work preferences analysis
  data.workPreference.forEach(pref => {
    switch (pref) {
      case 'freelance': workTypes.push('Freelancer'); break;
      case 'part-time': workTypes.push('Part-time Remote Worker'); break;
      case 'full-time': workTypes.push('Full-time Remote Employee'); break;
      case 'entrepreneur': workTypes.push('Digital Entrepreneur'); break;
      case 'consultant': workTypes.push('Consultant/Expert'); break;
    }
  });

  // Time zone analysis
  const timeZoneAnalysis = analyzeTimeZone(data);

  // Generate reasoning
  if (data.workPreference.length > 1) {
    reasoning = `Anda memiliki fleksibilitas tinggi dengan minat pada ${workTypes.join(' dan ')}. Ini menunjukkan mindset yang adaptif dan membuka berbagai peluang income stream.`;
  } else {
    reasoning = `Fokus Anda pada ${workTypes[0]} menunjukkan clarity yang baik dalam career direction.`;
  }

  // Default jobs
  if (recommendedJobs.length === 0) {
    recommendedJobs.push('Virtual Assistant', 'Content Writer', 'Social Media Manager');
  }

  // English based jobs
  const englishLevelMapping: { [key: string]: string[] } = {
    'pemula': ['Data Entry', 'Virtual Assistant (Local)', 'Graphic Designer'],
    'menengah': ['Customer Service', 'Social Media Manager', 'Content Writer'],
    'baik': ['Project Manager', 'Business Analyst', 'Technical Writer'],
    'sangat-baik': ['International Consultant', 'Global Account Manager', 'Technical Lead']
  };

  if (englishLevelMapping[data.englishLevel]) {
    englishBasedJobs.push(...englishLevelMapping[data.englishLevel]);
  }

  const nextSteps = [
    'Mulai membangun portfolio online yang showcase skills Anda',
    `Target pencarian kerja di time zone ${timeZoneAnalysis.zones.slice(0, 2).join(' atau ')} untuk work-life balance optimal`,
    'Join platform freelance dan set availability sesuai time zone analysis',
    'Bergabung dengan komunitas Remote Working Indonesia untuk networking'
  ];

  return {
    detectedSkills: detectedSkills.slice(0, 8),
    recommendedJobs: [...new Set(recommendedJobs)].slice(0, 4),
    workTypes,
    reasoning,
    nextSteps: nextSteps.slice(0, 6),
    englishBasedJobs: [...new Set(englishBasedJobs)].slice(0, 4),
    timeZoneAnalysis
  };
}

// NEW: Function untuk menganalisis skill dari freeDescription
function analyzeFromFreeDescription(description: string): { skill: string; reasoning: string }[] {
  const skills: { skill: string; reasoning: string }[] = [];
  const lowercaseDesc = description.toLowerCase();

  // Keywords dan skill mapping
  const skillKeywords = {
    'Event Organization': {
      keywords: ['mengorganisir', 'acara', 'event', 'perencanaan', 'koordinasi', 'liburan keluarga'],
      reasoning: 'Dari pengalaman mengorganisir acara dan aktivitas, Anda telah mengembangkan kemampuan project management, koordinasi stakeholder, dan timeline planning yang sangat berharga untuk virtual event planning.'
    },
    'Community Management': {
      keywords: ['group whatsapp', 'grup', 'komunitas', 'mengelola grup', 'admin grup'],
      reasoning: 'Pengalaman mengelola grup WhatsApp dan komunitas menunjukkan kemampuan community management, moderasi, dan engagement yang essential untuk social media management.'
    },
    'Design Skills': {
      keywords: ['undangan', 'design', 'desain', 'poster', 'banner', 'grafis'],
      reasoning: 'Kemampuan membuat undangan dan material visual menunjukkan creative skills dan design thinking yang bisa dikembangkan menjadi graphic design services.'
    },
    'Technical Drawing': {
      keywords: ['gambar teknik', 'cad', 'autocad', 'drawing', 'sketsa teknis'],
      reasoning: 'Pengalaman dengan gambar teknik menunjukkan precision, attention to detail, dan technical skills yang sangat dibutuhkan untuk CAD drafting dan technical illustration remote work.'
    },
    'Teaching & Training': {
      keywords: ['mengajar', 'melatih', 'tutorial', 'bimbingan', 'mentoring'],
      reasoning: 'Pengalaman mengajar atau membimbing orang lain mengembangkan kemampuan knowledge transfer dan communication yang perfect untuk online tutoring atau course creation.'
    },
    'Financial Management': {
      keywords: ['keuangan', 'anggaran', 'budgeting', 'mengelola uang', 'pembukuan'],
      reasoning: 'Pengalaman mengelola keuangan menunjukkan analytical thinking dan attention to detail yang berharga untuk bookkeeping, budget analysis, dan financial planning services.'
    },
    'Customer Relations': {
      keywords: ['pelayanan', 'customer', 'klien', 'pelanggan', 'service'],
      reasoning: 'Pengalaman memberikan pelayanan kepada customer mengasah communication skills, empathy, dan problem-solving yang essential untuk customer support remote work.'
    },
    'Digital Literacy': {
      keywords: ['online', 'digital', 'internet', 'aplikasi', 'platform'],
      reasoning: 'Kemampuan menggunakan platform digital dan adaptasi dengan teknologi baru menunjukkan digital literacy yang menjadi foundation untuk berbagai remote work opportunities.'
    }
  };

  // Check each skill category
  Object.entries(skillKeywords).forEach(([skill, data]) => {
    const hasKeyword = data.keywords.some(keyword => lowercaseDesc.includes(keyword));
    if (hasKeyword) {
      skills.push({
        skill: skill,
        reasoning: data.reasoning
      });
    }
  });

  // Jika deskripsi panjang tapi tidak match keyword specific, tambah general skills
  if (description.length > 50 && skills.length === 0) {
    skills.push({
      skill: 'Self Reflection & Communication',
      reasoning: 'Kemampuan Anda mendeskripsikan pengalaman dengan detail menunjukkan self-awareness dan communication skills yang baik - aset penting untuk client relationship dan project briefing dalam remote work.'
    });
  }

  return skills;
}

function analyzeTimeZone(data: AssessmentData) {
  const availableHours = data.availableHours?.split(', ') || [];
  let zones: string[] = ['GMT+7 (Indonesia)', 'GMT+8 (Singapore)', 'GMT+6 (Myanmar)'];
  let reasoning = 'Berdasarkan jam kerja Anda, fokus pada zona waktu yang overlap optimal dengan schedule Anda.';
  let jobSearchTips = [
    'Filter job search berdasarkan timezone requirements',
    'Mention timezone availability di profile dan proposal',
    'Set expectations yang jelas tentang response time'
  ];

  if (availableHours.includes('Fleksibel sepanjang hari')) {
    zones = ['GMT+7 (Indonesia)', 'GMT+8 (Singapore)', 'GMT+6 (Myanmar)', 'GMT+9 (Japan)', 'GMT+5 (Pakistan)'];
    reasoning = 'Dengan fleksibilitas waktu penuh, Anda bisa target anywhere in the world. Fokus pada time zone GMT+5 hingga GMT+9 untuk work-life balance optimal.';
    jobSearchTips = [
      'Search dengan keyword "Anywhere in the world" atau "Global remote"',
      'Set profile availability 24/7 untuk maximum opportunities',
      'Target multinational companies yang butuh timezone coverage'
    ];
  }

  return { zones, reasoning, jobSearchTips };
}

function getEnglishAnalysis(level: string): string {
  const analysis: { [key: string]: string } = {
    'pemula': 'Fokus pada proyek lokal berbahasa Indonesia terlebih dahulu. Mulai belajar bahasa Inggris secara bertahap untuk membuka peluang yang lebih luas.',
    'menengah': 'Kemampuan Anda cukup untuk email dan chat dasar. Cocok untuk customer support atau content creation.',
    'baik': 'Level yang sangat bagus untuk meeting dan presentasi. Anda bisa menargetkan klien internasional dengan percaya diri.',
    'sangat-baik': 'Kemampuan luar biasa! Anda bisa mengambil project high-level dengan rate premium dari klien global.'
  };
  
  return analysis[level] || 'Kemampuan bahasa Inggris mempengaruhi scope dan rate pekerjaan remote Anda.';
}

function getJobDescription(job: string): string {
  const descriptions: { [key: string]: string } = {
    'Virtual Assistant': 'Administrative support, email management, scheduling, data entry, customer service remote',
    'Content Writer': 'Menulis artikel, blog post, copy marketing, social media content untuk berbagai industri',
    'Social Media Manager': 'Mengelola akun media sosial, content planning, community management, engagement strategy',
    'Remote Civil Engineer': 'Konsultasi struktur, review design, analisis teknis untuk proyek konstruksi',
    'CAD Drafter': 'Membuat gambar teknik 2D/3D, shop drawing, as-built drawing untuk berbagai proyek',
    'Online Tutor': 'Mengajar secara online, membuat materi pembelajaran, evaluasi siswa'
  };
  
  return descriptions[job] || 'Pekerjaan remote yang sesuai dengan skill dan minat Anda';
}

function getJobReasoning(job: string, data: AssessmentData): string {
  return `Sesuai dengan profile dan minat remote work Anda dengan level English ${data.englishLevel} dan preferensi ${data.workPreference.join('/')}.`;
}