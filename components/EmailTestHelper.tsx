import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { Mail, Send, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import EmailService from './EmailService';

export function EmailTestHelper() {
  const [testData, setTestData] = useState({
    name: 'Test User',
    email: 'test@example.com',
    background: 'Karyawan swasta',
    experience: ['Programming/IT'],
    skills: ['Problem solving'],
    timeAvailability: 'Pagi (6-12)',
    workPreference: ['freelance'],
    englishLevel: 'baik',
    challenges: ['Tidak tahu cara memulai'],
    tools: ['Microsoft Office'],
    interests: ['Technology'],
    freeDescription: 'Saya memiliki pengalaman dalam development dan ingin mencoba remote work.',
    availableHours: '8 jam per hari'
  });
  
  const [emailStatus, setEmailStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [lastEmailResult, setLastEmailResult] = useState<string>('');

  const handleTestEmail = async () => {
    setEmailStatus('sending');
    
    const emailData = {
      userData: { name: testData.name, email: testData.email },
      assessmentData: testData,
      timestamp: new Date().toISOString()
    };

    try {
      const success = await EmailService.sendAssessmentResults(emailData);
      if (success) {
        setEmailStatus('success');
        setLastEmailResult('Test email berhasil dikirim! Check inbox Anda.');
        toast.success('Test email berhasil dikirim!');
      } else {
        setEmailStatus('error');
        setLastEmailResult('Test email gagal dikirim. Check konfigurasi EmailJS.');
        toast.error('Test email gagal dikirim');
      }
    } catch (error) {
      setEmailStatus('error');
      setLastEmailResult(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      toast.error('Terjadi kesalahan saat mengirim email');
    }
  };

  const handleNewsletterTest = async () => {
    try {
      const success = await EmailService.subscribeToNewsletter(
        { name: testData.name, email: testData.email },
        { newsletter: true, updates: true }
      );
      
      if (success) {
        toast.success('Test newsletter subscription berhasil!');
      }
    } catch (error) {
      toast.error('Test newsletter subscription gagal');
    }
  };

  const getStatusIcon = () => {
    switch (emailStatus) {
      case 'sending': return <Mail className="w-4 h-4 animate-spin text-blue-500" />;
      case 'success': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error': return <AlertCircle className="w-4 h-4 text-red-500" />;
      default: return <Info className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStoredData = () => {
    const assessments = EmailService.getStoredAssessments();
    const subscriptions = EmailService.getStoredSubscriptions();
    return { assessments: assessments.length, subscriptions: subscriptions.length };
  };

  const storedData = getStoredData();

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="w-5 h-5 text-blue-600" />
          Email System Test Helper
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Tool untuk testing email functionality setelah konfigurasi EmailJS
        </p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Configuration Status */}
        <Alert>
          <Info className="w-4 h-4" />
          <AlertDescription>
            EmailJS sudah dikonfigurasi dengan Service ID: <code>service_r99ah4v</code> dan Template ID: <code>template_oibejic</code>
          </AlertDescription>
        </Alert>

        {/* Data Statistics */}
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{storedData.assessments}</div>
              <div className="text-sm text-muted-foreground">Stored Assessments</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{storedData.subscriptions}</div>
              <div className="text-sm text-muted-foreground">Newsletter Subscriptions</div>
            </CardContent>
          </Card>
        </div>

        {/* Test Data Form */}
        <div className="space-y-4">
          <h3 className="font-medium">Test Data</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Test Name</label>
              <Input
                value={testData.name}
                onChange={(e) => setTestData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter test name"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium">Test Email</label>
              <Input
                type="email"
                value={testData.email}
                onChange={(e) => setTestData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="Enter test email"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Free Description</label>
            <Textarea
              value={testData.freeDescription}
              onChange={(e) => setTestData(prev => ({ ...prev, freeDescription: e.target.value }))}
              placeholder="Test description"
              rows={3}
            />
          </div>
        </div>

        {/* Test Actions */}
        <div className="space-y-4">
          <h3 className="font-medium">Test Actions</h3>
          
          <div className="flex gap-4">
            <Button 
              onClick={handleTestEmail}
              disabled={emailStatus === 'sending'}
              className="flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              {emailStatus === 'sending' ? 'Sending...' : 'Test Assessment Email'}
            </Button>
            
            <Button 
              variant="outline"
              onClick={handleNewsletterTest}
              className="flex items-center gap-2"
            >
              <Mail className="w-4 h-4" />
              Test Newsletter Signup
            </Button>
          </div>
        </div>

        {/* Status Display */}
        {emailStatus !== 'idle' && (
          <Alert className={
            emailStatus === 'success' ? 'border-green-200 bg-green-50' :
            emailStatus === 'error' ? 'border-red-200 bg-red-50' :
            'border-blue-200 bg-blue-50'
          }>
            {getStatusIcon()}
            <AlertDescription>
              {lastEmailResult}
            </AlertDescription>
          </Alert>
        )}

        {/* Email Template Preview */}
        <div className="space-y-4">
          <h3 className="font-medium">Email Template Variables</h3>
          <div className="bg-gray-50 p-4 rounded-lg text-sm space-y-2">
            <p><strong>Available Variables untuk EmailJS Template:</strong></p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <code>to_name</code>
              <code>to_email</code>
              <code>user_background</code>
              <code>user_experience</code>
              <code>user_skills</code>
              <code>user_time_availability</code>
              <code>user_work_preference</code>
              <code>user_english_level</code>
              <code>user_challenges</code>
              <code>user_tools</code>
              <code>user_interests</code>
              <code>user_description</code>
              <code>user_available_hours</code>
              <code>assessment_date</code>
              <code>community_link</code>
              <code>instagram_link</code>
              <code>email_contact</code>
            </div>
          </div>
        </div>

        {/* Troubleshooting */}
        <div className="space-y-4">
          <h3 className="font-medium">Troubleshooting</h3>
          <div className="bg-yellow-50 p-4 rounded-lg text-sm space-y-2">
            <p><strong>Jika email tidak terkirim:</strong></p>
            <ul className="list-disc list-inside space-y-1 text-yellow-700">
              <li>Pastikan EmailJS Service ID dan Template ID benar</li>
              <li>Check quota EmailJS account (free plan: 200 emails/month)</li>
              <li>Verify template variables sesuai dengan yang dikirim</li>
              <li>Check browser console untuk error messages</li>
              <li>Test dengan email address yang berbeda</li>
            </ul>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg text-sm space-y-2">
            <p><strong>Production Tips:</strong></p>
            <ul className="list-disc list-inside space-y-1 text-blue-700">
              <li>Setup email domain validation di EmailJS</li>
              <li>Configure proper SPF/DKIM records</li>
              <li>Monitor email delivery rates</li>
              <li>Setup webhook untuk delivery notifications</li>
              <li>Consider upgrading EmailJS plan untuk volume tinggi</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}