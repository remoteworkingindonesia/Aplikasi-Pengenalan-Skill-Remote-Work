import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import { CheckCircle, Target, Clock, Globe, TrendingUp, Users, FileText, MapPin, Instagram } from 'lucide-react';

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

interface ResultsDisplayProps {
  data: AssessmentData;
  userName: string;
  onGeneratePDF: () => void;
}

interface SkillWithReasoning {
  skill: string;
  reasoning: string;
}

interface TimeZoneRecommendation {
  zones: string[];
  reasoning: string;
  jobSearchTips: string[];
}

interface SkillMapping {
  detectedSkills: SkillWithReasoning[];
  recommendedJobs: string[];
  workTypes: string[];
  reasoning: string;
  nextSteps: string[];
  englishBasedJobs: string[];
  timeZoneAnalysis: TimeZoneRecommendation;
}

export function ResultsDisplay({ data, userName, onGeneratePDF }: ResultsDisplayProps) {
  const [results] = useState<SkillMapping>(() => generateAIResults(data));

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Assessment Summary */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-500" />
            Ringkasan Assessment - {userName}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
            <div className="space-y-1">
              <p className="font-medium text-gray-700">Background:</p>
              <p className="text-blue-600">{data.background}</p>
            </div>
            <div className="space-y-1">
              <p className="font-medium text-gray-700">Waktu Available:</p>
              <p className="text-blue-600">{data.timeAvailability}</p>
            </div>
            <div className="space-y-1">
              <p className="font-medium text-gray-700">Work Style:</p>
              <p className="text-blue-600">{data.workPreference.join(', ')}</p>
            </div>
            <div className="space-y-1">
              <p className="font-medium text-gray-700">English Level:</p>
              <p className="text-blue-600 capitalize">{data.englishLevel}</p>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div>
              <p className="font-medium text-gray-700 mb-1">Pengalaman ({data.experience.length}):</p>
              <p className="text-gray-600">{data.experience.slice(0, 3).join(', ')}{data.experience.length > 3 ? '...' : ''}</p>
            </div>
            <div>
              <p className="font-medium text-gray-700 mb-1">Tools ({data.tools.length}):</p>
              <p className="text-gray-600">{data.tools.slice(0, 3).join(', ')}{data.tools.length > 3 ? '...' : ''}</p>
            </div>
            <div>
              <p className="font-medium text-gray-700 mb-1">Jam Kerja:</p>
              <p className="text-gray-600">{data.availableHours || 'Belum ditentukan'}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Header */}
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-green-600">
            🎉 Hasil Assessment Skill Remote Work untuk {userName}
          </CardTitle>
          <p className="text-muted-foreground">
            Berdasarkan jawaban Anda, berikut adalah analisis dan rekomendasi untuk karir remote work
          </p>
        </CardHeader>
      </Card>

      {/* Time Zone Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-orange-500" />
            Analisis Time Zone Optimal
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-orange-50 rounded-lg">
              <h4 className="font-medium text-orange-700 mb-2">
                🌍 Rekomendasi Time Zone untuk {userName}
              </h4>
              <p className="text-sm text-orange-600 mb-3">
                {results.timeZoneAnalysis.reasoning}
              </p>
              <div className="mb-3">
                <p className="font-medium text-orange-700 mb-2">Time zone yang cocok:</p>
                <div className="flex flex-wrap gap-2">
                  {results.timeZoneAnalysis.zones.map(zone => (
                    <Badge key={zone} variant="outline" className="border-orange-300 text-orange-700">{zone}</Badge>
                  ))}
                </div>
              </div>
              <div>
                <p className="font-medium text-orange-700 mb-2">💡 Tips pencarian kerja:</p>
                <ul className="text-sm text-orange-600 space-y-1">
                  {results.timeZoneAnalysis.jobSearchTips.map((tip, index) => (
                    <li key={index}>• {tip}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detected Skills with Reasoning */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            Skill yang Anda Miliki
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div>
              <h4 className="font-medium mb-2">Hard Skills & Pengalaman:</h4>
              <div className="flex flex-wrap gap-2">
                {data.experience.length > 0 ? data.experience.map(skill => (
                  <Badge key={skill} variant="secondary">{skill}</Badge>
                )) : (
                  <p className="text-muted-foreground text-sm">Belum ada pengalaman yang dipilih</p>
                )}
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-2">Tools & Software:</h4>
              <div className="flex flex-wrap gap-2">
                {data.tools.length > 0 ? data.tools.map(tool => (
                  <Badge key={tool} variant="outline">{tool}</Badge>
                )) : (
                  <p className="text-muted-foreground text-sm">Belum ada tools yang dipilih</p>
                )}
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-2">Soft Skills:</h4>
              <div className="flex flex-wrap gap-2">
                {data.skills.length > 0 ? data.skills.map(skill => (
                  <Badge key={skill} variant="default">{skill}</Badge>
                )) : (
                  <p className="text-muted-foreground text-sm">Belum ada soft skills yang dipilih</p>
                )}
              </div>
            </div>
            {results.detectedSkills.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">💡 Skill Tersembunyi yang Terdeteksi:</h4>
                <div className="space-y-3">
                  {results.detectedSkills.map((skillItem, index) => (
                    <div key={index} className="p-3 bg-red-50 rounded-lg border border-red-200">
                      <div className="flex items-start gap-2">
                        <Badge variant="destructive" className="mt-0.5">{skillItem.skill}</Badge>
                        <div className="flex-1">
                          <p className="text-sm text-red-700">{skillItem.reasoning}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Skill ini terdeteksi dari latar belakang dan pengalaman hidup Anda yang mungkin tidak Anda sadari bernilai di dunia remote work.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* English Level Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-blue-500" />
            Analisis Berdasarkan Kemampuan Bahasa Inggris
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-700 mb-2">
                Level Bahasa Inggris: <span className="capitalize">{data.englishLevel}</span>
              </h4>
              <p className="text-sm text-blue-600 mb-3">
                {getEnglishLevelDescription(data.englishLevel)}
              </p>
              {results.englishBasedJobs.length > 0 && (
                <div>
                  <p className="font-medium text-blue-700 mb-2">Rekomendasi pekerjaan sesuai level bahasa:</p>
                  <div className="flex flex-wrap gap-2">
                    {results.englishBasedJobs.map(job => (
                      <Badge key={job} variant="outline" className="border-blue-300 text-blue-700">{job}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recommended Jobs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-blue-500" />
            Rekomendasi Pekerjaan Remote untuk Anda
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {results.recommendedJobs.map((job, index) => (
              <div key={index} className="p-4 border rounded-lg bg-blue-50">
                <h4 className="font-medium text-lg mb-2 text-blue-700">{job}</h4>
                <p className="text-sm text-blue-600 mb-2">
                  {getJobDescription(job)}
                </p>
                <div className="text-xs text-muted-foreground">
                  <strong>Mengapa cocok untuk Anda:</strong> {getJobReasoning(job, data)}
                </div>
              </div>
            ))}
          </div>
          {results.recommendedJobs.length === 0 && (
            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <p className="text-muted-foreground">
                Sistem sedang menganalisis profil Anda. Silakan coba lagi atau lengkapi informasi lebih detail.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Work Type Recommendation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-purple-500" />
            Tipe Remote Work yang Cocok
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-purple-50 rounded-lg">
              <h4 className="font-medium text-lg text-purple-700 mb-2">
                {results.workTypes.join(' + ')}
              </h4>
              <p className="text-sm text-purple-600">
                {results.reasoning}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="p-3 border rounded-lg">
                <Clock className="w-6 h-6 mx-auto mb-2 text-gray-500" />
                <p className="text-sm font-medium">Waktu Tersedia</p>
                <p className="text-xs text-muted-foreground">{data.timeAvailability}</p>
              </div>
              <div className="p-3 border rounded-lg">
                <Globe className="w-6 h-6 mx-auto mb-2 text-gray-500" />
                <p className="text-sm font-medium">Level English</p>
                <p className="text-xs text-muted-foreground capitalize">{data.englishLevel}</p>
              </div>
              <div className="p-3 border rounded-lg">
                <TrendingUp className="w-6 h-6 mx-auto mb-2 text-gray-500" />
                <p className="text-sm font-medium">Preferensi</p>
                <p className="text-xs text-muted-foreground">{data.workPreference.join(', ')}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Next Steps */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-orange-500" />
            Langkah Selanjutnya untuk {userName}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {results.nextSteps.map((step, index) => (
              <div key={index} className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-sm font-medium">
                  {index + 1}
                </span>
                <p className="text-sm">{step}</p>
              </div>
            ))}
          </div>
          
          <Separator className="my-6" />
          
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <Users className="w-5 h-5 text-blue-600" />
              <h4 className="font-medium text-blue-700">
                Bergabung dengan Komunitas Remote Working Indonesia
              </h4>
            </div>
            <p className="text-sm text-blue-600 mb-4">
              Dapatkan dukungan, tips, dan peluang kerja remote terbaru dari komunitas RWI. 
              Kami memiliki berbagai program mentoring, workshop, dan job board khusus untuk remote workers Indonesia.
            </p>
            <div className="flex gap-3 flex-wrap">
              <Button 
                size="sm" 
                className="bg-blue-600 hover:bg-blue-700" 
                onClick={() => window.open('https://lynk.id/ema.istia/LKJREKb', '_blank')}
              >
                Join Komunitas RWI
              </Button>
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => window.open('https://www.instagram.com/remoteworkingindonesia/', '_blank')}
                  className="flex items-center gap-1"
                >
                  <Instagram className="w-4 h-4" />
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => window.open('https://www.threads.com/@remoteworkingindonesia', '_blank')}
                  className="flex items-center gap-1"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.5 12.01c0-3.576.85-6.43 2.495-8.481C5.845 1.225 8.598.044 12.18.02h.014c3.582.024 6.334 1.205 8.184 3.509 1.645 2.051 2.495 4.905 2.495 8.481 0 3.576-.85 6.43-2.495 8.481-1.85 2.304-4.602 3.485-8.178 3.509zM12.184 2.02c-2.93.02-5.215.983-6.787 2.864-1.487 1.777-2.14 4.263-2.14 7.126 0 2.863.653 5.349 2.14 7.126 1.572 1.881 3.857 2.844 6.787 2.864h.007c2.93-.02 5.215-.983 6.787-2.864 1.487-1.777 2.14-4.263 2.14-7.126 0-2.863-.653-5.349-2.14-7.126C17.406 3.003 15.121 2.04 12.191 2.02h-.007z"/>
                    <path d="M15.691 13.268h-1.043V9.816c0-.77-.234-1.424-.698-1.947-.464-.523-1.043-.785-1.736-.785s-1.272.262-1.736.785c-.464.523-.698 1.177-.698 1.947v3.452H8.737V9.816c0-1.155.35-2.155 1.05-3.001.7-.845 1.572-1.268 2.616-1.268s1.916.423 2.616 1.268c.7.846 1.05 1.846 1.05 3.001v3.452h-.378zm-2.985 0h-1.412v2.526c0 .39.117.722.35.996.233.274.523.411.871.411s.638-.137.871-.411c.233-.274.35-.606.35-.996V13.268h-.03z"/>
                  </svg>
                </Button>
              </div>
            </div>
            <p className="text-xs text-blue-500 mt-2">Follow Us</p>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons - hanya download PDF */}
      <div className="flex gap-4 justify-center">
        <Button onClick={onGeneratePDF} size="lg">
          📄 Download Hasil PDF
        </Button>
      </div>
    </div>
  );
}

function generateAIResults(data: AssessmentData): SkillMapping {
  const detectedSkills: SkillWithReasoning[] = [];
  const recommendedJobs: string[] = [];
  const englishBasedJobs: string[] = [];
  const workTypes: string[] = [];
  let reasoning = '';
  
  // ANALISIS SKILL TERSEMBUNYI BERDASARKAN BACKGROUND DENGAN REASONING
  const backgroundSkills: { [key: string]: SkillWithReasoning[] } = {
    'Ibu rumah tangga': [
      { skill: 'Manajemen Multitasking', reasoning: 'Sebagai ibu rumah tangga, Anda terbiasa mengelola banyak tugas sekaligus - mengurus anak, rumah, belanja, dan jadwal keluarga. Skill ini sangat dibutuhkan untuk project management remote.' },
      { skill: 'Budget Management', reasoning: 'Anda sudah berpengalaman mengelola anggaran rumah tangga, berhemat, dan mengalokasikan dana untuk berbagai kebutuhan. Skill ini berharga untuk cost management dan financial analysis.' },
      { skill: 'Koordinasi Tim Keluarga', reasoning: 'Mengatur jadwal keluarga, mendelegasikan tugas, dan memastikan semua anggota keluarga terorganisir membuktikan kemampuan koordinasi tim yang excellent.' },
      { skill: 'Problem Solving Cepat', reasoning: 'Menyelesaikan masalah sehari-hari rumah tangga secara kreatif dan efisien menunjukkan kemampuan problem solving yang bisa diterapkan di dunia kerja remote.' }
    ],
    'Karyawan swasta': [
      { skill: 'Professional Communication', reasoning: 'Pengalaman bekerja di lingkungan formal mengasah kemampuan komunikasi profesional, email etiquette, dan workplace diplomacy yang sangat dibutuhkan remote work.' },
      { skill: 'Deadline Management', reasoning: 'Terbiasa dengan target dan deadline perusahaan membuat Anda ahli dalam time management dan delivery yang tepat waktu - essential skill untuk freelancer.' },
      { skill: 'Adaptasi Sistem Kerja', reasoning: 'Pengalaman beradaptasi dengan SOP, tools, dan culture perusahaan menunjukkan fleksibilitas tinggi untuk menyesuaikan diri dengan client requirements yang bervariasi.' }
    ],
    'Fresh graduate': [
      { skill: 'Learning Agility', reasoning: 'Sebagai fresh graduate, Anda memiliki mindset belajar yang fresh dan adaptif. Kemampuan menyerap informasi baru dengan cepat sangat berharga di dunia remote work yang dinamis.' },
      { skill: 'Tech Literacy', reasoning: 'Generasi digital native dengan kemampuan teknologi yang mumpuni. Anda lebih mudah menguasai tools dan platform baru yang dibutuhkan untuk remote work.' },
      { skill: 'Research Excellence', reasoning: 'Kebiasaan riset untuk tugas kuliah, skripsi, dan project akademik melatih kemampuan research yang mendalam - skill berharga untuk content creation dan analysis.' }
    ],
    'Freelancer': [
      { skill: 'Self Management', reasoning: 'Pengalaman freelance membuktikan kemampuan mengatur diri sendiri tanpa supervisi langsung - inti dari successful remote work.' },
      { skill: 'Client Relations', reasoning: 'Mengelola hubungan dengan berbagai client, negosiasi fee, dan maintain satisfaction menunjukkan business development skills yang mature.' },
      { skill: 'Business Development', reasoning: 'Mencari client, pitching services, dan membangun reputation sebagai freelancer mengasah entrepreneurial mindset yang berharga.' }
    ],
    'Mahasiswa': [
      { skill: 'Research & Analysis', reasoning: 'Kebiasaan mengerjakan tugas kuliah, paper, dan research melatih kemampuan analisis mendalam dan critical thinking.' },
      { skill: 'Presentation Skills', reasoning: 'Sering presentasi di kelas dan seminar mengasah communication skills dan confidence dalam menyampaikan ide.' },
      { skill: 'Social Media Expertise', reasoning: 'Generasi yang tumbuh dengan social media memiliki intuitive understanding tentang digital engagement dan content creation.' }
    ],
    'Pengusaha': [
      { skill: 'Strategic Thinking', reasoning: 'Pengalaman menjalankan bisnis mengembangkan kemampuan berpikir strategis, perencanaan jangka panjang, dan business acumen.' },
      { skill: 'Leadership & Delegation', reasoning: 'Mengelola tim dan operasional bisnis melatih leadership skills dan kemampuan mendelegasikan tugas secara efektif.' },
      { skill: 'Risk Management', reasoning: 'Mengambil keputusan bisnis dengan kalkulasi risiko mengasah analytical thinking dan decision making skills.' }
    ],
    'Pensiunan': [
      { skill: 'Mentoring & Knowledge Transfer', reasoning: 'Pengalaman kerja puluhan tahun memberikan wisdom dan kemampuan mentoring yang sangat berharga untuk consulting atau training roles.' },
      { skill: 'Industry Expertise', reasoning: 'Deep knowledge di bidang tertentu dari pengalaman bertahun-tahun menjadi aset berharga untuk specialized consulting.' },
      { skill: 'Work-Life Balance Master', reasoning: 'Pemahaman mendalam tentang sustainable working dan life priorities yang bisa dibagikan sebagai life coach atau consultant.' }
    ]
  };

  // Tambah skill berdasarkan background
  if (backgroundSkills[data.background]) {
    detectedSkills.push(...backgroundSkills[data.background]);
  }

  // ANALISIS BERDASARKAN PENGALAMAN SPESIFIK
  const experienceMapping: { [key: string]: { skills: SkillWithReasoning[], jobs: string[] } } = {
    'Event organizing': {
      skills: [
        { skill: 'Project Coordination Master', reasoning: 'Mengorganisir event melatih kemampuan koordinasi timeline, vendor, dan stakeholder multiple - skill premium untuk project management remote.' },
        { skill: 'Crisis Management', reasoning: 'Menangani situasi darurat saat event mengasah kemampuan problem solving under pressure dan quick decision making.' }
      ],
      jobs: ['Virtual Event Planner', 'Project Coordinator', 'Wedding Planner Online']
    },
    'Civil Engineering/Sipil': {
      skills: [
        { skill: 'Technical Analysis Expert', reasoning: 'Background engineering melatih analytical thinking yang sistematis dan detail-oriented approach yang sangat dibutuhkan untuk technical consulting remote.' },
        { skill: 'Regulatory Compliance', reasoning: 'Pemahaman mendalam tentang building codes dan standards mengasah kemampuan compliance dan quality assurance.' }
      ],
      jobs: ['Remote Civil Engineer', 'CAD Drafter', 'Construction Consultant', 'Structural Analysis Specialist']
    },
    'Teaching/Training': {
      skills: [
        { skill: 'Knowledge Simplification', reasoning: 'Kemampuan menjelaskan konsep kompleks dengan sederhana sangat berharga untuk content creation, technical writing, dan client communication.' },
        { skill: 'Audience Engagement', reasoning: 'Pengalaman mempertahankan attention dan engagement siswa/trainee mengasah presentation dan communication skills.' }
      ],
      jobs: ['Online Tutor', 'Course Creator', 'Corporate Trainer']
    }
  };

  // Process experiences dengan reasoning
  data.experience.forEach(exp => {
    if (experienceMapping[exp]) {
      detectedSkills.push(...experienceMapping[exp].skills);
      recommendedJobs.push(...experienceMapping[exp].jobs);
    }
  });

  // ANALISIS BERDASARKAN TOOLS
  const toolsMapping: { [key: string]: { skills: SkillWithReasoning[], jobs: string[] } } = {
    'AutoCAD': {
      skills: [
        { skill: 'Technical Precision', reasoning: 'Menguasai AutoCAD menunjukkan attention to detail dan precision yang tinggi - skill berharga untuk technical drafting dan design remote work.' }
      ],
      jobs: ['CAD Drafter', 'Technical Drafter', 'Design Specialist']
    },
    'Microsoft Office': {
      skills: [
        { skill: 'Data Organization Master', reasoning: 'Advanced Excel dan Office skills menunjukkan kemampuan mengorganisir dan menganalisis data yang essential untuk administrative dan analytical roles.' }
      ],
      jobs: ['Virtual Assistant', 'Administrative Support', 'Data Analyst']
    }
  };

  // Process tools dengan reasoning
  data.tools.forEach(tool => {
    if (toolsMapping[tool]) {
      detectedSkills.push(...toolsMapping[tool].skills);
      recommendedJobs.push(...toolsMapping[tool].jobs);
    }
  });

  // ANALISIS TIME ZONE
  const timeZoneAnalysis = analyzeTimeZone(data);

  // ANALISIS WORK PREFERENCES
  data.workPreference.forEach(pref => {
    switch (pref) {
      case 'freelance':
        workTypes.push('🎯 Freelancer');
        break;
      case 'part-time':
        workTypes.push('⏰ Part-time Remote Worker');
        break;
      case 'full-time':
        workTypes.push('💼 Full-time Remote Employee');
        break;
      case 'entrepreneur':
        workTypes.push('🚀 Digital Entrepreneur');
        break;
      case 'consultant':
        workTypes.push('🎓 Consultant/Expert');
        break;
    }
  });

  // Generate reasoning for multiple work preferences
  if (data.workPreference.length > 1) {
    reasoning = `Anda memiliki fleksibilitas tinggi dengan minat pada ${workTypes.join(' dan ')}. Ini menunjukkan mindset yang adaptif dan membuka berbagai peluang income stream. Dengan waktu ${data.timeAvailability} dan English level ${data.englishLevel}, Anda bisa mengkombinasikan beberapa tipe remote work untuk memaksimalkan earning potential.`;
  } else {
    reasoning = `Fokus Anda pada ${workTypes[0]} menunjukkan clarity yang baik dalam career direction. Dengan waktu ${data.timeAvailability} dan kemampuan bahasa Inggris ${data.englishLevel}, ini adalah pilihan yang realistic dan achievable.`;
  }

  // ANALISIS BERDASARKAN LEVEL BAHASA INGGRIS
  const englishLevelMapping: { [key: string]: string[] } = {
    'pemula': ['Data Entry', 'Virtual Assistant (Local)', 'Graphic Designer', 'Content Creator (Bahasa Indonesia)'],
    'menengah': ['Customer Service', 'Social Media Manager', 'Content Writer', 'Online Tutor'],
    'baik': ['Project Manager', 'Business Analyst', 'Technical Writer', 'Marketing Specialist'],
    'sangat-baik': ['International Consultant', 'Global Account Manager', 'Technical Lead', 'International Sales']
  };

  if (englishLevelMapping[data.englishLevel]) {
    englishBasedJobs.push(...englishLevelMapping[data.englishLevel]);
  }

  // FALLBACK
  if (recommendedJobs.length === 0) {
    recommendedJobs.push('Virtual Assistant', 'Content Writer', 'Social Media Manager');
    detectedSkills.push({
      skill: 'Digital Adaptability',
      reasoning: 'Kemampuan Anda mengisi assessment digital ini menunjukkan adaptability terhadap teknologi dan platform baru - skill fundamental untuk remote work.'
    });
  }

  // Remove duplicates
  const uniqueJobs = [...new Set(recommendedJobs)];
  const uniqueEnglishJobs = [...new Set(englishBasedJobs)];

  // Generate personalized next steps
  const nextSteps = [
    `Mulai membangun portfolio online yang showcase ${uniqueJobs.slice(0, 2).join(' atau ')} skills Anda`,
    `Target pencarian kerja di time zone ${timeZoneAnalysis.zones.slice(0, 2).join(' atau ')} untuk work-life balance optimal`,
    `Manfaatkan jam kerja ${data.availableHours?.split(', ')[0] || 'fleksibel'} untuk targeting client yang tepat`,
    'Join platform freelance dan set availability sesuai time zone analysis Anda',
    data.englishLevel === 'pemula' ? 'Tingkatkan kemampuan bahasa Inggris untuk akses job yang lebih luas' : 'Manfaatkan kemampuan bahasa Inggris Anda untuk target pasar global',
    'Bergabung dengan komunitas Remote Working Indonesia untuk networking dan support'
  ];

  return {
    detectedSkills: detectedSkills.slice(0, 8), // Limit untuk tidak overwhelming
    recommendedJobs: uniqueJobs.slice(0, 4),
    workTypes,
    reasoning,
    nextSteps: nextSteps.slice(0, 6),
    englishBasedJobs: uniqueEnglishJobs.slice(0, 4),
    timeZoneAnalysis
  };
}

function analyzeTimeZone(data: AssessmentData): TimeZoneRecommendation {
  const availableHours = data.availableHours?.split(', ') || [];
  let zones: string[] = [];
  let reasoning = '';
  let jobSearchTips: string[] = [];

  // Analisis berdasarkan jam kerja yang dipilih
  const timeAnalysis = {
    'Pagi (07:00 - 12:00 WIB)': {
      zones: ['GMT+7 (Indonesia)', 'GMT+8 (Singapore, Malaysia)', 'GMT+6 (Myanmar, Bangladesh)'],
      reasoning: 'Jam kerja pagi Anda cocok dengan negara-negara Asia Tenggara dan sebagian Asia Selatan.',
      tips: ['Target klien dari Singapore, Malaysia untuk same time zone', 'Bisa ambil project morning shift dari Australia (mereka pagi = siang kita)']
    },
    'Siang (12:00 - 17:00 WIB)': {
      zones: ['GMT+7 (Indonesia)', 'GMT+5 (Pakistan, Uzbekistan)', 'GMT+9 (Japan, Korea)'],
      reasoning: 'Waktu siang ideal untuk kolaborasi dengan Asia dan sebagian Timur Tengah.',
      tips: ['Perfect timing untuk klien Jepang dan Korea (mereka sore = siang kita)', 'Good overlap dengan Middle East business hours']
    },
    'Sore (17:00 - 21:00 WIB)': {
      zones: ['GMT+3 (Russia, Turkey)', 'GMT+4 (UAE, Armenia)', 'GMT+5 (Pakistan)'],
      reasoning: 'Jam sore Anda bertepatan dengan business hours di Timur Tengah dan Asia Barat.',
      tips: ['Target pasar UAE dan Turkey untuk business hours overlap', 'Bisa handle European afternoon meetings']
    },
    'Malam (21:00 - 01:00 WIB)': {
      zones: ['GMT+1 (Central Europe)', 'GMT+2 (Eastern Europe)', 'GMT (UK, Ireland)'],
      reasoning: 'Waktu malam cocok dengan business hours Eropa dan sebagian Afrika.',
      tips: ['Perfect untuk klien Eropa (mereka siang = malam kita)', 'Bisa target UK dan Ireland market']
    },
    'Dini hari (01:00 - 07:00 WIB)': {
      zones: ['EST (US East Coast)', 'PST (US West Coast)', 'GMT-3 (Brazil, Argentina)'],
      reasoning: 'Jam dini hari optimal untuk market Amerika dan sebagian Amerika Selatan.',
      tips: ['Premium rate untuk US market karena timezone advantage', 'Target Brazilian dan Argentinian clients']
    }
  };

  // Analisis berdasarkan pilihan user
  if (availableHours.includes('Fleksibel sepanjang hari')) {
    zones = ['GMT+7 (Indonesia)', 'GMT+8 (Singapore)', 'GMT+6 (Myanmar)', 'GMT+9 (Japan)', 'GMT+5 (Pakistan)'];
    reasoning = 'Dengan fleksibilitas waktu penuh, Anda bisa target anywhere in the world. Fokus pada time zone GMT+5 hingga GMT+9 untuk work-life balance optimal (selisih maksimal 2 jam dari Indonesia).';
    jobSearchTips = [
      'Search dengan keyword "Anywhere in the world" atau "Global remote"',
      'Set profile availability 24/7 untuk maximum opportunities',
      'Target multinational companies yang butuh timezone coverage',
      'Premium rate untuk odd hours (malam/dini hari) dengan US/European clients'
    ];
  } else {
    // Kombinasikan analisis dari semua jam yang dipilih
    const selectedAnalysis = availableHours.map(hour => timeAnalysis[hour]).filter(Boolean);
    
    zones = [...new Set(selectedAnalysis.flatMap(a => a.zones))];
    
    reasoning = `Berdasarkan jam kerja yang Anda pilih (${availableHours.join(', ')}), Anda bisa menargetkan client di zona waktu yang overlap optimal dengan schedule Anda. Fokus pada zona dengan selisih maksimal 2 jam dari WIB untuk work-life balance yang sehat.`;
    
    jobSearchTips = [
      ...new Set(selectedAnalysis.flatMap(a => a.tips)),
      'Filter job search berdasarkan timezone requirements',
      'Mention timezone availability di profile dan proposal'
    ];
  }

  // Tambahkan tips umum
  jobSearchTips.push(
    'Set expectations yang jelas tentang response time di berbeda timezone',
    'Use timezone converter tools untuk scheduling meetings',
    'Communicate your "core working hours" dalam WIB dan equivalent timezone'
  );

  return {
    zones: zones.slice(0, 5), // Limit untuk readability
    reasoning,
    jobSearchTips: jobSearchTips.slice(0, 5)
  };
}

function getEnglishLevelDescription(level: string): string {
  const descriptions: { [key: string]: string } = {
    'pemula': 'Anda cocok untuk pekerjaan yang tidak memerlukan komunikasi bahasa Inggris intensif. Fokus pada klien lokal atau proyek berbahasa Indonesia terlebih dahulu.',
    'menengah': 'Kemampuan bahasa Inggris Anda cukup untuk komunikasi email dan chat dasar. Cocok untuk client support atau content creation.',
    'baik': 'Level bahasa Inggris Anda memungkinkan untuk meeting, presentasi, dan writing yang baik. Bisa menargetkan klien internasional.',
    'sangat-baik': 'Kemampuan bahasa Inggris yang sangat baik membuka peluang untuk pekerjaan high-level dengan klien global dan rate yang lebih tinggi.'
  };
  
  return descriptions[level] || 'Kemampuan bahasa Inggris akan mempengaruhi jenis dan scope pekerjaan yang bisa Anda ambil.';
}

function getJobDescription(job: string): string {
  const descriptions: { [key: string]: string } = {
    'Remote Civil Engineer': 'Konsultasi struktur, review design, analisis teknis untuk proyek konstruksi',
    'CAD Drafter': 'Membuat gambar teknik 2D/3D, shop drawing, as-built drawing untuk berbagai proyek',
    'Virtual Event Planner': 'Mengorganisir acara online, koordinasi vendor digital, manajemen timeline event virtual',
    'Virtual Assistant': 'Administrative support, email management, scheduling, data entry, customer service',
    'Content Writer': 'Menulis artikel, blog post, copy marketing, social media content',
    'Social Media Manager': 'Mengelola akun media sosial, content planning, community management'
  };
  
  return descriptions[job] || 'Pekerjaan remote yang sesuai dengan skill dan minat Anda';
}

function getJobReasoning(job: string, data: AssessmentData): string {
  const hasCAD = data.tools.some(tool => ['AutoCAD', 'Revit', 'SketchUp', 'SolidWorks'].includes(tool));
  const hasTechnicalExp = data.experience.some(exp => exp.includes('Engineering') || exp.includes('Architecture'));
  
  if (job.includes('CAD') || job.includes('Engineer')) {
    return `Cocok karena Anda ${hasCAD ? 'sudah menguasai CAD tools' : 'memiliki background teknis'} dan ${hasTechnicalExp ? 'berpengalaman di bidang teknik' : 'tertarik dengan technical work'}`;
  }
  
  return `Sesuai dengan profile dan minat remote work Anda dengan level English ${data.englishLevel}`;
}