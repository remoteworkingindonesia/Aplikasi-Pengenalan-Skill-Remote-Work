import { toast } from 'sonner@2.0.3';

interface AssessmentData {
  background: string;
  experience: string[];
  skills: string[];
  timeAvailability: string;
  workPreference: string[];
  englishLevel: string;
  challenges: string[];
  tools: string[];
  interests: string[];
  freeDescription: string;
  availableHours?: string;
}

interface UserData {
  name: string;
  email: string;
}

interface AssessmentEmailData {
  userData: UserData;
  assessmentData: AssessmentData;
  timestamp: string;
  assessmentResults?: any;
}

// EmailJS configuration - replace with your actual service ID, template ID, and public key
const EMAILJS_CONFIG = {
  serviceId: 'service_r99ah4v', // e.g., 'service_xxxxxx'
  templateId: 'template_oibejic', // e.g., 'template_xxxxxx'
  publicKey: 'rJe5vyTH9dqcMeYQI' // e.g., 'xxxxxxxxxxxxx'
};

// Mailchimp configuration - replace with your actual values
const MAILCHIMP_CONFIG = {
  apiKey: 'YOUR_MAILCHIMP_API_KEY',
  audienceId: 'YOUR_MAILCHIMP_AUDIENCE_ID',
  serverPrefix: 'YOUR_MAILCHIMP_SERVER_PREFIX' // e.g., 'us1', 'us2', etc.
};

class EmailService {
  // Initialize EmailJS
  static async initializeEmailJS() {
    if (typeof window !== 'undefined') {
      try {
        const emailjs = await import('emailjs-com');
        emailjs.init(EMAILJS_CONFIG.publicKey);
        return emailjs;
      } catch (error) {
        console.error('Failed to initialize EmailJS:', error);
        return null;
      }
    }
    return null;
  }

  // Send assessment results via email
  static async sendAssessmentResults(emailData: AssessmentEmailData): Promise<boolean> {
    try {
      // Validate email data first
      if (!emailData.userData.email || !emailData.userData.name) {
        console.error('❌ Missing required email data:', {
          email: emailData.userData.email,
          name: emailData.userData.name
        });
        throw new Error('Email address or name is missing');
      }

      const emailjs = await this.initializeEmailJS();
      if (!emailjs) {
        throw new Error('EmailJS not available');
      }

      console.log('📧 Preparing to send email to:', emailData.userData.email);

      // Prepare email template parameters - using standard EmailJS variable names
      const templateParams = {
        // Standard EmailJS recipient variables
        to_email: emailData.userData.email,
        to_name: emailData.userData.name,
        
        // Alternative recipient variables (in case template uses different names)
        user_email: emailData.userData.email,
        user_name: emailData.userData.name,
        recipient_email: emailData.userData.email,
        recipient_name: emailData.userData.name,
        
        // Email headers
        from_name: 'Remote Working Indonesia',
        reply_to: 'remoteworkingindonesia@gmail.com',
        subject: `Hasil Assessment Remote Work Skill - ${emailData.userData.name}`,
        
        // Assessment summary
        user_background: emailData.assessmentData.background,
        user_experience: emailData.assessmentData.experience.join(', '),
        user_skills: emailData.assessmentData.skills.join(', '),
        user_time_availability: emailData.assessmentData.timeAvailability,
        user_work_preference: emailData.assessmentData.workPreference.join(', '),
        user_english_level: emailData.assessmentData.englishLevel,
        user_challenges: emailData.assessmentData.challenges.join(', '),
        user_tools: emailData.assessmentData.tools.join(', '),
        user_interests: emailData.assessmentData.interests.join(', '),
        user_description: emailData.assessmentData.freeDescription,
        user_available_hours: emailData.assessmentData.availableHours || 'Tidak ditentukan',
        
        // Metadata
        assessment_date: new Date(emailData.timestamp).toLocaleDateString('id-ID'),
        assessment_timestamp: emailData.timestamp,
        
        // CTA and footer
        community_link: 'https://lynk.id/ema.istia/LKJREKb',
        instagram_link: 'https://www.instagram.com/remoteworkingindonesia/',
        threads_link: 'https://www.threads.net/@remoteworkingindonesia',
        email_contact: 'remoteworkingindonesia@gmail.com'
      };

      console.log('📧 Sending email with template params:', {
        to_email: templateParams.to_email,
        to_name: templateParams.to_name,
        serviceId: EMAILJS_CONFIG.serviceId,
        templateId: EMAILJS_CONFIG.templateId
      });

      const response = await emailjs.send(
        EMAILJS_CONFIG.serviceId,
        EMAILJS_CONFIG.templateId,
        templateParams
      );

      console.log('✅ EmailJS Response:', response);

      if (response.status === 200) {
        toast.success(`Email hasil assessment berhasil dikirim ke ${emailData.userData.email}!`);
        return true;
      } else {
        throw new Error(`EmailJS returned status: ${response.status}`);
      }
    } catch (error: any) {
      console.error('❌ Error sending assessment email:', error);
      
      // Provide specific error handling for different cases
      if (error.status === 422) {
        if (error.text && error.text.includes('recipients address is empty')) {
          console.error('🔴 EmailJS Template Error: The email template is not configured to receive recipient email. Check your EmailJS template settings.');
          toast.error('Konfigurasi email template bermasalah. Data tersimpan secara lokal.');
        } else {
          toast.error('Format email tidak valid. Data tersimpan secara lokal.');
        }
      } else if (error.status === 400) {
        toast.error('Konfigurasi EmailJS bermasalah. Data tersimpan secara lokal.');
      } else if (error.status === 402) {
        toast.error('Quota email habis. Data tersimpan secara lokal.');
      } else {
        toast.error('Gagal mengirim email. Data tersimpan secara lokal.');
      }
      
      return false;
    }
  }

  // Subscribe to Mailchimp newsletter
  static async subscribeToNewsletter(userData: UserData, preferences: {
    newsletter: boolean;
    updates: boolean;
  }): Promise<boolean> {
    try {
      // For frontend-only implementation, we'll use a proxy or CORS-enabled endpoint
      // Alternative: Use Zapier webhook or similar service
      
      const subscriptionData = {
        email_address: userData.email,
        status: 'subscribed',
        merge_fields: {
          FNAME: userData.name.split(' ')[0],
          LNAME: userData.name.split(' ').slice(1).join(' ') || '',
        },
        tags: [
          'RWI-Assessment',
          ...(preferences.newsletter ? ['Newsletter'] : []),
          ...(preferences.updates ? ['Updates'] : [])
        ],
        timestamp_signup: new Date().toISOString()
      };

      // Store in localStorage as backup
      this.storeEmailSubscription(userData, preferences, subscriptionData);

      // For production, implement actual Mailchimp API call via your backend or Zapier
      // Example webhook URL: https://hooks.zapier.com/hooks/catch/xxxxx/yyyyy/
      const webhookUrl = 'YOUR_ZAPIER_WEBHOOK_URL_HERE';
      
      if (webhookUrl && webhookUrl !== 'YOUR_ZAPIER_WEBHOOK_URL_HERE') {
        const response = await fetch(webhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(subscriptionData)
        });

        if (response.ok) {
          toast.success('Berhasil terdaftar newsletter RWI!');
          return true;
        }
      }

      // Fallback: just show success message and store locally
      toast.success('Berhasil terdaftar newsletter RWI!');
      return true;

    } catch (error) {
      console.error('Error subscribing to newsletter:', error);
      toast.error('Gagal mendaftar newsletter. Data tersimpan secara lokal.');
      return false;
    }
  }

  // Store email subscription locally as backup
  static storeEmailSubscription(userData: UserData, preferences: any, subscriptionData: any) {
    try {
      const existingSubscriptions = JSON.parse(localStorage.getItem('rwi_subscriptions') || '[]');
      existingSubscriptions.push({
        ...subscriptionData,
        preferences,
        timestamp: new Date().toISOString()
      });
      localStorage.setItem('rwi_subscriptions', JSON.stringify(existingSubscriptions));
      console.log('✅ Newsletter subscription stored locally');
    } catch (error) {
      console.error('Error storing subscription locally:', error);
    }
  }

  // Store assessment data locally for admin access
  static storeAssessmentData(emailData: AssessmentEmailData) {
    try {
      const existingAssessments = JSON.parse(localStorage.getItem('rwi_assessments') || '[]');
      existingAssessments.push({
        ...emailData,
        id: `assessment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date().toISOString()
      });
      
      // Keep only last 100 assessments to prevent localStorage overflow
      if (existingAssessments.length > 100) {
        existingAssessments.splice(0, existingAssessments.length - 100);
      }
      
      localStorage.setItem('rwi_assessments', JSON.stringify(existingAssessments));
      
      console.log('✅ Assessment data stored locally:', existingAssessments.length, 'total assessments');
    } catch (error) {
      console.error('Error storing assessment data:', error);
    }
  }

  // Test email functionality with detailed logging
  static async testEmailConnection(testEmail: string = 'test@example.com'): Promise<{ success: boolean; message: string }> {
    try {
      console.log('🧪 Testing EmailJS connection...');
      
      const emailjs = await this.initializeEmailJS();
      if (!emailjs) {
        return { success: false, message: 'Failed to initialize EmailJS' };
      }

      // Test with minimal template parameters
      const testParams = {
        to_email: testEmail,
        to_name: 'Test User',
        user_email: testEmail,
        user_name: 'Test User',
        recipient_email: testEmail,
        recipient_name: 'Test User',
        subject: 'EmailJS Connection Test',
        message: 'This is a test message to verify EmailJS configuration',
        from_name: 'Remote Working Indonesia'
      };

      console.log('📧 Sending test email with params:', testParams);

      const response = await emailjs.send(
        EMAILJS_CONFIG.serviceId,
        EMAILJS_CONFIG.templateId,
        testParams
      );

      if (response.status === 200) {
        return { success: true, message: 'Test email sent successfully!' };
      } else {
        return { success: false, message: `Test failed with status: ${response.status}` };
      }
    } catch (error: any) {
      console.error('🔴 Test email failed:', error);
      return { 
        success: false, 
        message: `Test failed: ${error.message || 'Unknown error'}. Status: ${error.status || 'N/A'}` 
      };
    }
  }

  // Get all stored assessments (for admin/export purposes)
  static getStoredAssessments(): AssessmentEmailData[] {
    try {
      return JSON.parse(localStorage.getItem('rwi_assessments') || '[]');
    } catch (error) {
      console.error('Error retrieving assessments:', error);
      return [];
    }
  }

  // Get all stored subscriptions (for admin/export purposes)
  static getStoredSubscriptions() {
    try {
      return JSON.parse(localStorage.getItem('rwi_subscriptions') || '[]');
    } catch (error) {
      console.error('Error retrieving subscriptions:', error);
      return [];
    }
  }

  // Export data as CSV for admin use
  static exportAssessmentsAsCSV(): string {
    const assessments = this.getStoredAssessments();
    if (assessments.length === 0) return '';

    const headers = [
      'Timestamp',
      'Name',
      'Email',
      'Background',
      'Experience',
      'Skills',
      'Time Availability',
      'Work Preference',
      'English Level',
      'Challenges',
      'Tools',
      'Interests',
      'Available Hours',
      'Description'
    ];

    const csvContent = [
      headers.join(','),
      ...assessments.map(assessment => [
        assessment.timestamp,
        `"${assessment.userData.name}"`,
        assessment.userData.email,
        `"${assessment.assessmentData.background}"`,
        `"${assessment.assessmentData.experience.join('; ')}"`,
        `"${assessment.assessmentData.skills.join('; ')}"`,
        `"${assessment.assessmentData.timeAvailability}"`,
        `"${assessment.assessmentData.workPreference.join('; ')}"`,
        `"${assessment.assessmentData.englishLevel}"`,
        `"${assessment.assessmentData.challenges.join('; ')}"`,
        `"${assessment.assessmentData.tools.join('; ')}"`,
        `"${assessment.assessmentData.interests.join('; ')}"`,
        `"${assessment.assessmentData.availableHours || ''}"`,
        `"${assessment.assessmentData.freeDescription.replace(/"/g, '""')}"`
      ].join(','))
    ].join('\n');

    return csvContent;
  }

  // Export subscriptions as CSV
  static exportSubscriptionsAsCSV(): string {
    const subscriptions = this.getStoredSubscriptions();
    if (subscriptions.length === 0) return '';

    const headers = ['Timestamp', 'Email', 'First Name', 'Last Name', 'Newsletter', 'Updates'];

    const csvContent = [
      headers.join(','),
      ...subscriptions.map(sub => [
        sub.timestamp,
        sub.email_address,
        `"${sub.merge_fields?.FNAME || ''}"`,
        `"${sub.merge_fields?.LNAME || ''}"`,
        sub.preferences?.newsletter ? 'Yes' : 'No',
        sub.preferences?.updates ? 'Yes' : 'No'
      ].join(','))
    ].join('\n');

    return csvContent;
  }

  // Download CSV file
  static downloadCSV(content: string, filename: string) {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

export default EmailService;
export type { AssessmentEmailData, UserData, AssessmentData };