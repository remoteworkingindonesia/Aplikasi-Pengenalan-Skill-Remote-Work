import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { Mail, TestTube, AlertCircle, CheckCircle } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import EmailService from './EmailService';

export function EmailDebugHelper() {
  const [testEmail, setTestEmail] = useState('test@example.com');
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [testResult, setTestResult] = useState<string>('');

  const handleTestEmail = async () => {
    setTestStatus('testing');
    
    try {
      const result = await EmailService.testEmailConnection(testEmail);
      
      if (result.success) {
        setTestStatus('success');
        setTestResult(`✅ ${result.message}`);
        toast.success('Test email berhasil!');
      } else {
        setTestStatus('error');
        setTestResult(`❌ ${result.message}`);
        toast.error('Test email gagal');
      }
    } catch (error) {
      setTestStatus('error');
      setTestResult(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      toast.error('Test email error');
    }
  };

  const getStatusIcon = () => {
    switch (testStatus) {
      case 'testing': return <Mail className="w-4 h-4 animate-spin text-blue-500" />;
      case 'success': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error': return <AlertCircle className="w-4 h-4 text-red-500" />;
      default: return <TestTube className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="w-5 h-5 text-blue-600" />
          EmailJS Debug Helper
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Debug tool untuk mengatasi error "recipients address is empty"
        </p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Current Issue */}
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="w-4 h-4" />
          <AlertDescription>
            <strong>Current Issue:</strong> Error 422 - "The recipients address is empty"<br/>
            <strong>Cause:</strong> EmailJS template tidak menerima email address dengan benar<br/>
            <strong>Solution:</strong> Check EmailJS template configuration
          </AlertDescription>
        </Alert>

        {/* EmailJS Configuration Status */}
        <div className="space-y-4">
          <h3 className="font-medium">📋 Configuration Status</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-green-50 p-3 rounded">
              <div className="text-sm">
                <strong>Service ID:</strong><br/>
                <code className="text-xs bg-white px-2 py-1 rounded">service_r99ah4v</code>
                <Badge variant="default" className="ml-2 text-xs">✅ Valid</Badge>
              </div>
            </div>
            
            <div className="bg-green-50 p-3 rounded">
              <div className="text-sm">
                <strong>Template ID:</strong><br/>
                <code className="text-xs bg-white px-2 py-1 rounded">template_oibejic</code>
                <Badge variant="default" className="ml-2 text-xs">✅ Valid</Badge>
              </div>
            </div>
            
            <div className="bg-green-50 p-3 rounded">
              <div className="text-sm">
                <strong>Public Key:</strong><br/>
                <code className="text-xs bg-white px-2 py-1 rounded">rJe5vyTH9dqcMeYQI</code>
                <Badge variant="default" className="ml-2 text-xs">✅ Set</Badge>
              </div>
            </div>
            
            <div className="bg-yellow-50 p-3 rounded">
              <div className="text-sm">
                <strong>Template Variables:</strong><br/>
                <Badge variant="destructive" className="text-xs">❌ Needs Check</Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Test Section */}
        <div className="space-y-4">
          <h3 className="font-medium">🧪 Test Email Functionality</h3>
          
          <div className="flex gap-2">
            <Input
              type="email"
              value={testEmail}
              onChange={(e) => setTestEmail(e.target.value)}
              placeholder="Enter test email"
              className="flex-1"
            />
            <Button 
              onClick={handleTestEmail}
              disabled={testStatus === 'testing'}
              className="flex items-center gap-2"
            >
              {getStatusIcon()}
              {testStatus === 'testing' ? 'Testing...' : 'Test Email'}
            </Button>
          </div>

          {testStatus !== 'idle' && (
            <Alert className={
              testStatus === 'success' ? 'border-green-200 bg-green-50' :
              testStatus === 'error' ? 'border-red-200 bg-red-50' :
              'border-blue-200 bg-blue-50'
            }>
              {getStatusIcon()}
              <AlertDescription>
                {testResult}
              </AlertDescription>
            </Alert>
          )}
        </div>

        {/* Solution Steps */}
        <div className="space-y-4">
          <h3 className="font-medium">🔧 How to Fix "Recipients Address Empty" Error</h3>
          
          <div className="bg-blue-50 p-4 rounded-lg space-y-3">
            <h4 className="font-medium text-blue-700">Step 1: Check Your EmailJS Template</h4>
            <ol className="text-sm text-blue-600 space-y-2 list-decimal list-inside">
              <li>Go to <strong>EmailJS Dashboard → Email Templates → template_oibejic</strong></li>
              <li>Check the "To email" field in your template</li>
              <li>Make sure it uses one of these variables:</li>
              <ul className="ml-4 list-disc list-inside space-y-1">
                <li><code>{'{{to_email}}'}</code> (most common)</li>
                <li><code>{'{{user_email}}'}</code></li>
                <li><code>{'{{recipient_email}}'}</code></li>
              </ul>
            </ol>
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg space-y-3">
            <h4 className="font-medium text-yellow-700">Step 2: Template Configuration Example</h4>
            <div className="text-sm text-yellow-600">
              <p><strong>In your EmailJS template, the "To email" field should contain:</strong></p>
              <code className="block bg-white p-2 rounded mt-2">{'{{to_email}}'}</code>
              <p className="mt-2"><strong>Subject example:</strong></p>
              <code className="block bg-white p-2 rounded mt-1">{'{{subject}}'}</code>
            </div>
          </div>

          <div className="bg-green-50 p-4 rounded-lg space-y-3">
            <h4 className="font-medium text-green-700">Step 3: Test & Verify</h4>
            <p className="text-sm text-green-600">
              After updating your template, use the test button above to verify the fix.
            </p>
          </div>
        </div>

        {/* Template Variables Reference */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium mb-2">📝 Available Template Variables</h4>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <code>to_email</code>
            <code>to_name</code>
            <code>user_email</code>
            <code>user_name</code>
            <code>subject</code>
            <code>user_background</code>
            <code>user_experience</code>
            <code>user_skills</code>
            <code>user_challenges</code>
            <code>assessment_date</code>
            <code>community_link</code>
            <code>email_contact</code>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-2 pt-4 border-t">
          <Button 
            variant="outline"
            onClick={() => window.open('https://dashboard.emailjs.com/admin/templates', '_blank')}
          >
            Open EmailJS Templates
          </Button>
          <Button 
            variant="outline"
            onClick={() => window.open('https://dashboard.emailjs.com/admin/templates/template_oibejic', '_blank')}
          >
            Edit Template oibejic
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}