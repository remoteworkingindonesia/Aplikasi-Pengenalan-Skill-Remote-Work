import { useState } from 'react';
import { Header } from './components/Header';
import { PersonalInfoForm } from './components/PersonalInfoForm';
import { AssessmentForm } from './components/AssessmentForm';
import { ResultsDisplay } from './components/ResultsDisplay';
import { EmailSignup } from './components/EmailSignup';
import { PDFGenerator } from './components/PDFGenerator';
import { AdminPanel } from './components/AdminPanel';
import { Toaster } from './components/ui/sonner';
import EmailService from './components/EmailService';

interface AssessmentData {
  background: string;
  experience: string[];
  skills: string[];
  timeAvailability: string;
  workPreference: string[];  // Changed to array for multiple selection
  englishLevel: string;
  challenges: string[];
  tools: string[];
  interests: string[];
  freeDescription: string;
  availableHours?: string;  // New field for specific working hours
}

interface UserData {
  name: string;
  email: string;
}

type AppState = 'welcome' | 'personal-info' | 'assessment' | 'results' | 'email-signup' | 'pdf-download' | 'complete';

export default function App() {
  const [currentState, setCurrentState] = useState<AppState>('welcome');
  const [userName, setUserName] = useState<string>('');
  const [assessmentData, setAssessmentData] = useState<AssessmentData | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [showAdminPanel, setShowAdminPanel] = useState(false);

  const handlePersonalInfoComplete = (name: string) => {
    setUserName(name);
    setCurrentState('assessment');
  };

  const handleAssessmentComplete = (data: AssessmentData) => {
    setAssessmentData(data);
    setCurrentState('results');
  };

  const handleEmailSignup = () => {
    setCurrentState('email-signup');
  };

  const handleEmailComplete = async (data: UserData) => {
    setUserData(data);
    
    // Store assessment data and send email
    if (assessmentData) {
      const emailData = {
        userData: data,
        assessmentData: assessmentData,
        timestamp: new Date().toISOString()
      };
      
      // Store assessment data locally
      EmailService.storeAssessmentData(emailData);
      
      // Attempt to send assessment results via email
      try {
        await EmailService.sendAssessmentResults(emailData);
      } catch (error) {
        console.error('Failed to send assessment email:', error);
        // Continue with flow even if email fails
      }
    }
    
    setCurrentState('pdf-download');
  };

  const handlePDFGenerate = () => {
    setCurrentState('complete');
  };

  const handleRestartAssessment = () => {
    setCurrentState('personal-info');
    setUserName('');
    setAssessmentData(null);
    setUserData(null);
  };

  // Admin panel toggle (hidden feature - press Ctrl+Shift+A)
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.ctrlKey && e.shiftKey && e.key === 'A') {
      setShowAdminPanel(!showAdminPanel);
    }
  };

  const renderContent = () => {
    switch (currentState) {
      case 'welcome':
        return (
          <div className="text-center space-y-8 max-w-2xl mx-auto">
            <div className="space-y-4">
              <p className="text-lg leading-relaxed">
                Selamat datang di <strong>Skill Discovery Tool</strong> dari Remote Working Indonesia! 
                Tool ini akan membantu Anda mengenali skill tersembunyi yang mungkin belum Anda sadari 
                untuk memulai karir remote working.
              </p>
              
              <div className="bg-blue-50 p-6 rounded-lg text-left">
                <h3 className="font-medium text-blue-700 mb-3">🎯 Apa yang akan Anda dapatkan:</h3>
                <ul className="space-y-2 text-blue-600">
                  <li>• Identifikasi skill tersembunyi</li>
                  <li>• Rekomendasi jenis pekerjaan remote yang cocok</li>
                  <li>• Analisis tipe remote work yang sesuai</li>
                  <li>• Analisis time zone optimal untuk pencarian kerja</li>
                  <li>• Langkah konkret untuk memulai karir remote</li>
                  <li>• Laporan lengkap dalam format PDF</li>
                  <li>• Email hasil assessment dan newsletter RWI</li>
                </ul>
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg">
                <p className="text-yellow-700 text-sm">
                  <strong>💡 Tips:</strong> Jawab pertanyaan dengan jujur dan detail. 
                  Tool ini mencakup berbagai bidang termasuk engineering, teknik, dan profesi lainnya.
                  Semakin lengkap informasi yang Anda berikan, semakin akurat rekomendasi yang akan diberikan.
                </p>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-green-700 text-sm">
                  <strong>📧 Bonus:</strong> Setelah assessment, Anda akan mendapatkan hasil via email 
                  dan bisa bergabung dengan newsletter RWI untuk tips remote work terbaru!
                </p>
              </div>
            </div>

            <button
              onClick={() => setCurrentState('personal-info')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg text-lg font-medium transition-colors"
            >
              🚀 Mulai Assessment
            </button>

            <p className="text-sm text-muted-foreground">
              Assessment membutuhkan waktu sekitar 5-10 menit untuk diselesaikan
            </p>
          </div>
        );

      case 'personal-info':
        return <PersonalInfoForm onComplete={handlePersonalInfoComplete} />;

      case 'assessment':
        return <AssessmentForm onComplete={handleAssessmentComplete} userName={userName} />;

      case 'results':
        return assessmentData ? (
          <ResultsDisplay 
            data={assessmentData}
            userName={userName}
            onGeneratePDF={handleEmailSignup}
          />
        ) : null;

      case 'email-signup':
        return <EmailSignup onComplete={handleEmailComplete} userName={userName} />;

      case 'pdf-download':
        return assessmentData && userData ? (
          <PDFGenerator 
            data={assessmentData}
            userName={userData.name}
            userEmail={userData.email}
          />
        ) : null;

      case 'complete':
        return (
          <div className="text-center space-y-6 max-w-2xl mx-auto">
            <div className="space-y-4">
              <h2 className="text-2xl font-medium text-green-600">
                🎉 Selamat {userName}! Assessment Anda Telah Selesai
              </h2>
              
              <p className="text-lg">
                Terima kasih telah menggunakan Skill Discovery Tool dari Remote Working Indonesia. 
                Anda telah berhasil:
              </p>

              <div className="bg-green-50 p-6 rounded-lg text-left">
                <ul className="space-y-2 text-green-700">
                  <li>✅ Menyelesaikan assessment lengkap</li>
                  <li>✅ Mendapatkan analisis skill tersembunyi dengan reasoning</li>
                  <li>✅ Menerima rekomendasi pekerjaan remote dan time zone</li>
                  <li>✅ Terdaftar di newsletter RWI</li>
                  <li>✅ Download laporan lengkap</li>
                  <li>✅ Email hasil assessment dikirim ke inbox Anda</li>
                </ul>
              </div>

              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="font-medium text-blue-700 mb-3">🚀 Langkah Selanjutnya:</h3>
                <ul className="text-blue-600 text-left space-y-1">
                  <li>• Check email Anda untuk hasil assessment dan konfirmasi newsletter</li>
                  <li>• Join komunitas RWI di Instagram @remoteworkingindonesia</li>
                  <li>• Mulai implement rekomendasi yang diberikan</li>
                  <li>• Follow update program mentoring dan workshop RWI</li>
                  <li>• Share assessment ini ke teman yang butuh guidance remote work</li>
                </ul>
              </div>
            </div>

            <div className="space-x-4">
              <button
                onClick={handleRestartAssessment}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                🔄 Ambil Assessment Lagi
              </button>
              <button
                onClick={() => window.open('https://www.instagram.com/remoteworkingindonesia/', '_blank')}
                className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                📱 Follow RWI di Instagram
              </button>
            </div>

            <div className="text-sm text-muted-foreground">
              <p>
                Untuk konsultasi lebih lanjut atau bantuan memulai remote work, 
                hubungi tim RWI melalui email atau media sosial kami.
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100"
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <div className="container mx-auto px-4 py-8">
        <Header />
        <main className="mt-8">
          {renderContent()}
        </main>
        
        {/* Footer */}
        <footer className="mt-16 text-center text-sm text-muted-foreground border-t pt-8">
          <p>
            © 2025 Remote Working Indonesia. 
            <span className="mx-2">•</span>
            <a href="#" className="hover:text-blue-600">Privacy Policy</a>
            <span className="mx-2">•</span>
            <a href="#" className="hover:text-blue-600">Terms of Service</a>
            <span className="mx-2">•</span>
            <a href="mailto:remoteworkingindonesia@gmail.com" className="hover:text-blue-600">Contact Us</a>
          </p>
          <p className="mt-2">
            Semangat Lokal, Ruang Kerja Global 🇮🇩
          </p>
          <p className="text-xs mt-1 opacity-70">
            Press Ctrl+Shift+A for admin access
          </p>
        </footer>
      </div>

      {/* Admin Panel */}
      <AdminPanel 
        isVisible={showAdminPanel} 
        onToggle={() => setShowAdminPanel(!showAdminPanel)} 
      />
      
      <Toaster />
    </div>
  );
}