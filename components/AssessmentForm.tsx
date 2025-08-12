import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Checkbox } from './ui/checkbox';
import { Progress } from './ui/progress';

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

interface AssessmentFormProps {
  onComplete: (data: AssessmentData) => void;
  userName: string;
}

const steps = [
  { id: 'background', title: 'Latar Belakang' },
  { id: 'experience', title: 'Pengalaman & Skill' },
  { id: 'preferences', title: 'Preferensi & Bahasa' },
  { id: 'tools', title: 'Tools & Minat' },
  { id: 'description', title: 'Deskripsi Bebas' }
];

export function AssessmentForm({ onComplete, userName }: AssessmentFormProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<AssessmentData>({
    background: '',
    experience: [],
    skills: [],
    timeAvailability: '',
    workPreference: [],  // Changed to array
    englishLevel: '',
    challenges: [],
    tools: [],
    interests: [],
    freeDescription: '',
    availableHours: ''
  });

  const backgroundOptions = [
    'Ibu rumah tangga',
    'Karyawan swasta',
    'Fresh graduate',
    'Freelancer',
    'Mahasiswa',
    'Pengusaha',
    'Pensiunan',
    'Lainnya'
  ];

  const experienceOptions = [
    'Event organizing',
    'Marketing/Sales',
    'Customer service',
    'Teaching/Training',
    'Writing/Content creation',
    'Design/Creative',
    'Programming/IT',
    'Finance/Accounting',
    'Project management',
    'Social media management',
    'Translation',
    'Research',
    'Data entry/analysis',
    'Photography/Videography',
    'Civil Engineering/Sipil',
    'Architecture/Arsitektur',
    'Mechanical Engineering',
    'Electrical Engineering',
    'Industrial Engineering',
    'Construction Management',
    'Survey/Surveying',
    'Structural Design',
    'Interior Design',
    'Urban Planning',
    'Environmental Engineering',
    'Budget/Cost Management',
    'Procurement/Purchasing',
    'Quality Control/Assurance',
    'Technical Drawing',
    'Site Supervision'
  ];

  const skillOptions = [
    'Komunikasi yang baik',
    'Manajemen waktu',
    'Problem solving',
    'Kreativitas',
    'Leadership',
    'Teamwork',
    'Adaptability',
    'Attention to detail',
    'Multitasking',
    'Analytical thinking',
    'Presentation skills',
    'Negotiation',
    'Critical thinking',
    'Technical writing',
    'Project planning'
  ];

  const challengeOptions = [
    'Tidak tahu cara memulai',
    'Kurang percaya diri',
    'Keterbatasan waktu',
    'Skill kurang memadai',
    'Tidak ada pengalaman remote work',
    'Kesulitan mencari klien/perusahaan',
    'Technology/tools baru',
    'Work-life balance',
    'Bahasa Inggris kurang lancar',
    'Networking terbatas'
  ];

  const toolOptions = [
    'Microsoft Office',
    'Google Workspace',
    'Canva/Design tools',
    'Social media platforms',
    'Video conferencing (Zoom, Meet)',
    'Project management tools',
    'Programming languages',
    'Photo/video editing',
    'Content management systems',
    'E-commerce platforms',
    'Email marketing tools',
    'Analytics tools',
    'AutoCAD',
    'SketchUp',
    'Revit',
    '3ds Max',
    'SolidWorks',
    'ETABS/SAP2000',
    'Civil 3D',
    'Lumion',
    'V-Ray',
    'Adobe Creative Suite',
    'BIM Software',
    'MS Project',
    'Primavera P6',
    'Excel (Advanced)',
    'PowerBI/Tableau',
    'GIS Software',
    'Survey Equipment'
  ];

  const interestOptions = [
    'Digital marketing',
    'Content creation',
    'Virtual assistance',
    'Online teaching',
    'E-commerce',
    'Web development',
    'Graphic design',
    'Translation services',
    'Consulting',
    'Data analysis',
    'Customer support',
    'Project coordination',
    'Technical consulting',
    'CAD drafting services',
    'BIM modeling',
    '3D visualization',
    'Engineering analysis',
    'Construction planning',
    'Cost estimation',
    'Quality assurance',
    'Technical writing',
    'Online tutoring (technical)',
    'Remote surveying',
    'Design review services'
  ];

  // Work preference options
  const workPreferenceOptions = [
    {
      value: 'freelance',
      label: 'Freelance',
      description: 'Project based, fleksibel, bayar per project'
    },
    {
      value: 'part-time',
      label: 'Part-time',
      description: 'Jadwal tetap tapi tidak full, gaji bulanan'
    },
    {
      value: 'full-time',
      label: 'Full-time',
      description: 'Komitmen penuh seperti kantor, benefits lengkap'
    },
    {
      value: 'entrepreneur',
      label: 'Digital Entrepreneur',
      description: 'Bisnis sendiri, jual produk/jasa digital'
    },
    {
      value: 'consultant',
      label: 'Consultant',
      description: 'Konsultasi expertise, rate per jam/session'
    }
  ];

  const availableHoursOptions = [
    'Pagi (07:00 - 12:00 WIB)',
    'Siang (12:00 - 17:00 WIB)', 
    'Sore (17:00 - 21:00 WIB)',
    'Malam (21:00 - 01:00 WIB)',
    'Dini hari (01:00 - 07:00 WIB)',
    'Fleksibel sepanjang hari'
  ];

  const handleCheckboxChange = (field: keyof AssessmentData, value: string, checked: boolean) => {
    setFormData(prev => {
      const currentArray = prev[field] as string[];
      if (checked) {
        return { ...prev, [field]: [...currentArray, value] };
      } else {
        return { ...prev, [field]: currentArray.filter(item => item !== value) };
      }
    });
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <div className="bg-blue-50 p-4 rounded-lg text-center">
              <p className="text-blue-700">
                Halo <strong>{userName}</strong>! Mari kita mulai dengan mengenal latar belakang Anda saat ini.
              </p>
            </div>
            <div>
              <Label className="text-base font-medium">Apa latar belakang Anda saat ini?</Label>
              <RadioGroup 
                value={formData.background} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, background: value }))}
                className="mt-3 grid grid-cols-2 gap-3"
              >
                {backgroundOptions.map(option => (
                  <div key={option} className="flex items-center space-x-2">
                    <RadioGroupItem value={option} id={option} />
                    <Label htmlFor={option}>{option}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <div className="bg-blue-50 p-4 rounded-lg text-center">
              <p className="text-blue-700">
                Bagus {userName}! Sekarang ceritakan pengalaman dan skill yang Anda miliki.
              </p>
            </div>
            <div>
              <Label className="text-base font-medium">Pengalaman apa yang pernah Anda lakukan? (Pilih semua yang sesuai)</Label>
              <div className="mt-3 grid grid-cols-2 gap-3 max-h-80 overflow-y-auto">
                {experienceOptions.map(option => (
                  <div key={option} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`exp-${option}`}
                      checked={formData.experience.includes(option)}
                      onCheckedChange={(checked) => handleCheckboxChange('experience', option, checked as boolean)}
                    />
                    <Label htmlFor={`exp-${option}`}>{option}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label className="text-base font-medium">Soft skill apa yang Anda miliki? (Pilih semua yang sesuai)</Label>
              <div className="mt-3 grid grid-cols-2 gap-3">
                {skillOptions.map(option => (
                  <div key={option} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`skill-${option}`}
                      checked={formData.skills.includes(option)}
                      onCheckedChange={(checked) => handleCheckboxChange('skills', option, checked as boolean)}
                    />
                    <Label htmlFor={`skill-${option}`}>{option}</Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="bg-blue-50 p-4 rounded-lg text-center">
              <p className="text-blue-700">
                Hampir selesai {userName}! Mari tentukan preferensi kerja remote Anda.
              </p>
            </div>
            
            <div>
              <Label className="text-base font-medium">Berapa waktu yang bisa Anda dedikasikan untuk bekerja remote per hari?</Label>
              <RadioGroup 
                value={formData.timeAvailability} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, timeAvailability: value }))}
                className="mt-3 space-y-3"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="1-2 jam" id="time1" />
                  <Label htmlFor="time1">1-2 jam (sangat terbatas)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="3-4 jam" id="time2" />
                  <Label htmlFor="time2">3-4 jam (part-time)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="6-8 jam" id="time3" />
                  <Label htmlFor="time3">6-8 jam (full-time)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="fleksibel" id="time4" />
                  <Label htmlFor="time4">Sangat fleksibel, tergantung proyek</Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label className="text-base font-medium">Jam kerja mana yang paling cocok untuk Anda? (Pilih semua yang sesuai)</Label>
              <div className="mt-3 grid grid-cols-1 gap-3">
                {availableHoursOptions.map(option => (
                  <div key={option} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`hours-${option}`}
                      checked={formData.availableHours?.includes(option) || false}
                      onCheckedChange={(checked) => {
                        setFormData(prev => {
                          const currentHours = prev.availableHours?.split(', ') || [];
                          if (checked) {
                            return { ...prev, availableHours: [...currentHours, option].join(', ') };
                          } else {
                            return { ...prev, availableHours: currentHours.filter(h => h !== option).join(', ') };
                          }
                        });
                      }}
                    />
                    <Label htmlFor={`hours-${option}`}>{option}</Label>
                  </div>
                ))}
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Informasi ini akan membantu menentukan time zone optimal untuk pencarian kerja remote Anda
              </p>
            </div>

            <div>
              <Label className="text-base font-medium">Preferensi kerja remote Anda? (Pilih semua yang sesuai)</Label>
              <div className="mt-3 space-y-3">
                {workPreferenceOptions.map(option => (
                  <div key={option.value} className="flex items-start space-x-2 p-3 border rounded-lg">
                    <Checkbox 
                      id={`work-${option.value}`}
                      checked={formData.workPreference.includes(option.value)}
                      onCheckedChange={(checked) => handleCheckboxChange('workPreference', option.value, checked as boolean)}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <Label htmlFor={`work-${option.value}`} className="font-medium">{option.label}</Label>
                      <p className="text-sm text-muted-foreground">{option.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label className="text-base font-medium">Seberapa lancar kemampuan bahasa Inggris Anda?</Label>
              <RadioGroup 
                value={formData.englishLevel} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, englishLevel: value }))}
                className="mt-3 space-y-3"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="pemula" id="eng1" />
                  <Label htmlFor="eng1">Pemula - bisa membaca dasar, tapi sulit berbicara</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="menengah" id="eng2" />
                  <Label htmlFor="eng2">Menengah - bisa komunikasi sederhana, email dasar</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="baik" id="eng3" />
                  <Label htmlFor="eng3">Baik - bisa meeting, presentasi, writing cukup lancar</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="sangat-baik" id="eng4" />
                  <Label htmlFor="eng4">Sangat baik - hampir seperti native speaker</Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label className="text-base font-medium">Tantangan terbesar yang Anda hadapi? (Pilih semua yang sesuai)</Label>
              <div className="mt-3 grid grid-cols-1 gap-3">
                {challengeOptions.map(option => (
                  <div key={option} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`challenge-${option}`}
                      checked={formData.challenges.includes(option)}
                      onCheckedChange={(checked) => handleCheckboxChange('challenges', option, checked as boolean)}
                    />
                    <Label htmlFor={`challenge-${option}`}>{option}</Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="bg-blue-50 p-4 rounded-lg text-center">
              <p className="text-blue-700">
                Excellent {userName}! Sekarang mari tentukan tools dan bidang yang menarik untuk Anda.
              </p>
            </div>
            <div>
              <Label className="text-base font-medium">Tools/software apa yang sudah Anda kuasai? (Pilih semua yang sesuai)</Label>
              <div className="mt-3 grid grid-cols-2 gap-3 max-h-80 overflow-y-auto">
                {toolOptions.map(option => (
                  <div key={option} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`tool-${option}`}
                      checked={formData.tools.includes(option)}
                      onCheckedChange={(checked) => handleCheckboxChange('tools', option, checked as boolean)}
                    />
                    <Label htmlFor={`tool-${option}`}>{option}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label className="text-base font-medium">Bidang pekerjaan remote apa yang menarik minat Anda? (Pilih semua yang sesuai)</Label>
              <div className="mt-3 grid grid-cols-2 gap-3 max-h-80 overflow-y-auto">
                {interestOptions.map(option => (
                  <div key={option} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`interest-${option}`}
                      checked={formData.interests.includes(option)}
                      onCheckedChange={(checked) => handleCheckboxChange('interests', option, checked as boolean)}
                    />
                    <Label htmlFor={`interest-${option}`}>{option}</Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="bg-blue-50 p-4 rounded-lg text-center">
              <p className="text-blue-700">
                Langkah terakhir {userName}! Ceritakan pengalaman unik Anda yang mungkin bisa jadi skill remote work.
              </p>
            </div>
            <div>
              <Label className="text-base font-medium">
                Ceritakan lebih detail tentang pengalaman, keahlian, atau aktivitas sehari-hari Anda yang mungkin bisa menjadi skill untuk remote work
              </Label>
              <Textarea 
                value={formData.freeDescription}
                onChange={(e) => setFormData(prev => ({ ...prev, freeDescription: e.target.value }))}
                placeholder="Contoh: Saya sering mengorganisir acara keluarga dan liburan, mengelola group WhatsApp komunitas, membantu teman membuat undangan digital, pernah mengerjakan gambar teknik untuk proyek kecil..."
                className="mt-3 min-h-32"
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0: return formData.background !== '';
      case 1: return formData.experience.length > 0 && formData.skills.length > 0;
      case 2: return formData.timeAvailability !== '' && formData.workPreference.length > 0 && formData.englishLevel !== '';
      case 3: return formData.tools.length > 0 && formData.interests.length > 0;
      case 4: return formData.freeDescription.trim() !== '';
      default: return false;
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete(formData);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex justify-between items-center mb-4">
          <CardTitle>Assessment Skill Remote Work - {userName}</CardTitle>
          <span className="text-sm text-muted-foreground">
            {currentStep + 1} dari {steps.length}
          </span>
        </div>
        <Progress value={((currentStep + 1) / steps.length) * 100} className="w-full" />
        <div className="flex justify-between text-xs text-muted-foreground mt-2">
          {steps.map((step, index) => (
            <span key={step.id} className={index === currentStep ? 'font-medium text-primary' : ''}>
              {step.title}
            </span>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {renderStep()}
          
          <div className="flex justify-between pt-6">
            <Button 
              variant="outline" 
              onClick={handlePrev}
              disabled={currentStep === 0}
            >
              Sebelumnya
            </Button>
            <Button 
              onClick={handleNext}
              disabled={!canProceed()}
            >
              {currentStep === steps.length - 1 ? 'Lihat Hasil' : 'Selanjutnya'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}