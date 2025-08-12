import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Checkbox } from './ui/checkbox';
import { Mail, User, CheckCircle } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import EmailService from './EmailService';

interface EmailSignupProps {
  onComplete: (data: { name: string; email: string }) => void;
  userName: string;
}

export function EmailSignup({ onComplete, userName }: EmailSignupProps) {
  const [formData, setFormData] = useState({
    name: userName,
    email: '',
    agreeNewsletter: false,
    agreeUpdates: false
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.agreeNewsletter) {
      toast.error('Mohon lengkapi semua field yang wajib');
      return;
    }

    setIsLoading(true);

    try {
      // Subscribe to newsletter
      const subscriptionSuccess = await EmailService.subscribeToNewsletter(
        { name: formData.name, email: formData.email },
        {
          newsletter: formData.agreeNewsletter,
          updates: formData.agreeUpdates
        }
      );

      if (subscriptionSuccess) {
        setIsSubmitted(true);
        
        // Complete the flow
        onComplete({
          name: formData.name,
          email: formData.email
        });
      }
    } catch (error) {
      console.error('Error during email signup:', error);
      toast.error('Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <Card className="max-w-md mx-auto">
        <CardContent className="text-center py-8">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-xl font-medium mb-2">Berhasil Terdaftar, {userName}!</h3>
          <p className="text-muted-foreground mb-4">
            Anda akan segera menerima email konfirmasi dan newsletter mingguan dari Remote Working Indonesia.
          </p>
          <div className="bg-green-50 p-4 rounded-lg text-sm">
            <p className="text-green-700">
              📧 Check email Anda untuk konfirmasi subscription<br/>
              💡 Jika tidak ada di inbox, cek folder spam/promotions
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="w-5 h-5 text-blue-600" />
          Daftar Newsletter RWI - {userName}
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Dapatkan tips remote work, job opportunities, dan update terbaru dari komunitas RWI
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Nama Lengkap *
            </Label>
            <Input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Masukkan nama lengkap Anda"
              required
              disabled={isLoading}
            />
          </div>

          <div>
            <Label htmlFor="email" className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Email Address *
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              placeholder="nama@email.com"
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-start space-x-2">
              <Checkbox 
                id="newsletter"
                checked={formData.agreeNewsletter}
                onCheckedChange={(checked) => 
                  setFormData(prev => ({ ...prev, agreeNewsletter: checked as boolean }))
                }
                className="mt-1"
                disabled={isLoading}
              />
              <Label htmlFor="newsletter" className="text-sm leading-relaxed">
                Ya, saya ingin menerima newsletter mingguan RWI dengan tips remote work, 
                job opportunities, dan event terbaru *
              </Label>
            </div>

            <div className="flex items-start space-x-2">
              <Checkbox 
                id="updates"
                checked={formData.agreeUpdates}
                onCheckedChange={(checked) => 
                  setFormData(prev => ({ ...prev, agreeUpdates: checked as boolean }))
                }
                className="mt-1"
                disabled={isLoading}
              />
              <Label htmlFor="updates" className="text-sm leading-relaxed">
                Saya ingin mendapatkan update tentang program mentoring, workshop, 
                dan event khusus RWI
              </Label>
            </div>
          </div>

          <div className="bg-blue-50 p-3 rounded-lg">
            <h4 className="font-medium text-blue-700 mb-2">📬 Apa yang akan Anda terima:</h4>
            <ul className="text-sm text-blue-600 space-y-1">
              <li>• Newsletter mingguan dengan job opportunities terbaru</li>
              <li>• Tips dan tricks remote working dari expert</li>
              <li>• Update workshop dan mentoring program</li>
              <li>• Case study success stories dari member RWI</li>
              <li>• Early access ke event dan program khusus</li>
            </ul>
          </div>

          <Button 
            type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-700"
            disabled={!formData.name || !formData.email || !formData.agreeNewsletter || isLoading}
          >
            {isLoading ? 'Mendaftar...' : '🚀 Daftar Newsletter RWI'}
          </Button>

          <div className="text-xs text-muted-foreground space-y-2">
            <p>
              Dengan mendaftar, Anda menyetujui untuk menerima komunikasi dari Remote Working Indonesia. 
              Anda dapat unsubscribe kapan saja.
            </p>
            <div className="space-y-1">
              <p><strong>Kontak RWI:</strong></p>
              <p>📧 remoteworkingindonesia@gmail.com</p>
              <p>📱 @remoteworkingindonesia (Instagram & Threads)</p>
              <p>🔗 https://lynk.id/ema.istia/LKJREKb</p>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}