import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { User } from 'lucide-react';

interface PersonalInfoFormProps {
  onComplete: (name: string) => void;
}

export function PersonalInfoForm({ onComplete }: PersonalInfoFormProps) {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onComplete(name.trim());
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            <User className="w-5 h-5 text-blue-600" />
            Mari Berkenalan!
          </CardTitle>
          <p className="text-muted-foreground">
            Sebelum memulai assessment, perkenalkan diri Anda agar hasil yang diberikan lebih personal.
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Nama Lengkap *</Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Masukkan nama lengkap Anda"
                required
                className="mt-2"
              />
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-700">
                <strong>Privasi Anda terjamin!</strong> Nama ini hanya digunakan untuk personalisasi hasil assessment dan laporan PDF Anda.
              </p>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={!name.trim()}
            >
              Lanjut ke Assessment 🚀
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}