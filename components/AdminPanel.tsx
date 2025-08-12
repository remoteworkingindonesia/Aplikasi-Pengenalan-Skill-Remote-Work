import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Download, Users, Mail, FileText, Eye, EyeOff, TestTube, BarChart3, Bug } from 'lucide-react';
import EmailService, { AssessmentEmailData } from './EmailService';
import { EmailDebugHelper } from './EmailDebugHelper';

interface AdminPanelProps {
  isVisible: boolean;
  onToggle: () => void;
}

export function AdminPanel({ isVisible, onToggle }: AdminPanelProps) {
  const [assessments, setAssessments] = useState<AssessmentEmailData[]>([]);
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalAssessments: 0,
    totalSubscriptions: 0,
    uniqueEmails: 0,
    todayAssessments: 0,
    weeklyAssessments: 0,
    conversionRate: 0
  });

  useEffect(() => {
    if (isVisible) {
      loadData();
    }
  }, [isVisible]);

  const loadData = () => {
    const assessmentData = EmailService.getStoredAssessments();
    const subscriptionData = EmailService.getStoredSubscriptions();
    
    setAssessments(assessmentData);
    setSubscriptions(subscriptionData);

    // Calculate enhanced stats
    const today = new Date();
    const todayStr = today.toDateString();
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    const todayCount = assessmentData.filter(assessment => 
      new Date(assessment.timestamp).toDateString() === todayStr
    ).length;

    const weeklyCount = assessmentData.filter(assessment => 
      new Date(assessment.timestamp) >= weekAgo
    ).length;

    const allEmails = new Set([
      ...assessmentData.map(a => a.userData.email),
      ...subscriptionData.map(s => s.email_address)
    ]);

    // Calculate conversion rate (subscriptions / assessments)
    const conversionRate = assessmentData.length > 0 
      ? Math.round((subscriptionData.length / assessmentData.length) * 100)
      : 0;

    setStats({
      totalAssessments: assessmentData.length,
      totalSubscriptions: subscriptionData.length,
      uniqueEmails: allEmails.size,
      todayAssessments: todayCount,
      weeklyAssessments: weeklyCount,
      conversionRate
    });
  };

  const handleExportAssessments = () => {
    const csvContent = EmailService.exportAssessmentsAsCSV();
    if (csvContent) {
      const filename = `RWI-Assessments-${new Date().toISOString().split('T')[0]}.csv`;
      EmailService.downloadCSV(csvContent, filename);
    }
  };

  const handleExportSubscriptions = () => {
    const csvContent = EmailService.exportSubscriptionsAsCSV();
    if (csvContent) {
      const filename = `RWI-Subscriptions-${new Date().toISOString().split('T')[0]}.csv`;
      EmailService.downloadCSV(csvContent, filename);
    }
  };

  const handleExportEmails = () => {
    const allEmails = new Set([
      ...assessments.map(a => a.userData.email),
      ...subscriptions.map(s => s.email_address)
    ]);
    
    const emailList = Array.from(allEmails).join('\n');
    const blob = new Blob([emailList], { type: 'text/plain;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `RWI-Email-List-${new Date().toISOString().split('T')[0]}.txt`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getBackgroundDistribution = () => {
    const distribution = assessments.reduce((acc, assessment) => {
      const bg = assessment.assessmentData.background;
      acc[bg] = (acc[bg] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(distribution)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5);
  };

  const getEnglishLevelDistribution = () => {
    const distribution = assessments.reduce((acc, assessment) => {
      const level = assessment.assessmentData.englishLevel;
      acc[level] = (acc[level] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(distribution);
  };

  if (!isVisible) {
    return (
      <Button
        onClick={onToggle}
        size="sm"
        variant="outline"
        className="fixed bottom-4 right-4 z-50"
      >
        <Eye className="w-4 h-4 mr-2" />
        Admin Panel
      </Button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Admin Panel - RWI Assessment Data
            </CardTitle>
            <Button onClick={onToggle} variant="ghost" size="sm">
              <EyeOff className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent>
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="data" className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Data Export
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                Analytics
              </TabsTrigger>
              <TabsTrigger value="debug" className="flex items-center gap-2">
                <Bug className="w-4 h-4" />
                Email Debug
              </TabsTrigger>
              <TabsTrigger value="testing" className="flex items-center gap-2">
                <TestTube className="w-4 h-4" />
                Testing
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Enhanced Stats Overview */}
              <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-blue-600">{stats.totalAssessments}</div>
                    <div className="text-sm text-muted-foreground">Total Assessments</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-green-600">{stats.totalSubscriptions}</div>
                    <div className="text-sm text-muted-foreground">Newsletter Subs</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-purple-600">{stats.uniqueEmails}</div>
                    <div className="text-sm text-muted-foreground">Unique Emails</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-orange-600">{stats.todayAssessments}</div>
                    <div className="text-sm text-muted-foreground">Today</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-cyan-600">{stats.weeklyAssessments}</div>
                    <div className="text-sm text-muted-foreground">This Week</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-pink-600">{stats.conversionRate}%</div>
                    <div className="text-sm text-muted-foreground">Conversion</div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Assessments */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Recent Assessments</h3>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {assessments.slice(0, 10).map((assessment, index) => (
                    <Card key={index} className="p-3">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <div className="font-medium">{assessment.userData.name}</div>
                          <div className="text-sm text-muted-foreground">{assessment.userData.email}</div>
                          <div className="flex gap-2">
                            <Badge variant="outline">{assessment.assessmentData.background}</Badge>
                            <Badge variant="secondary">{assessment.assessmentData.englishLevel}</Badge>
                            <Badge variant="outline">{assessment.assessmentData.workPreference.join(', ')}</Badge>
                          </div>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(assessment.timestamp).toLocaleDateString('id-ID')}
                        </div>
                      </div>
                    </Card>
                  ))}
                  {assessments.length === 0 && (
                    <p className="text-center text-muted-foreground py-8">
                      Belum ada data assessment tersimpan
                    </p>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="data" className="space-y-6">
              {/* Export Actions */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Export Data</h3>
                <div className="flex flex-wrap gap-2">
                  <Button onClick={handleExportAssessments} className="flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    Export Assessments (CSV)
                  </Button>
                  <Button onClick={handleExportSubscriptions} variant="outline" className="flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    Export Subscriptions (CSV)
                  </Button>
                  <Button onClick={handleExportEmails} variant="secondary" className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Export Email List (TXT)
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  Data disimpan secara lokal di browser. Untuk implementasi production, 
                  integrasikan dengan database dan email service provider.
                </p>
              </div>

              {/* Implementation Guide */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Implementation Guide</h3>
                <div className="bg-blue-50 p-4 rounded-lg text-sm space-y-2">
                  <h4 className="font-medium text-blue-700">Next Steps for Production:</h4>
                  <ol className="list-decimal list-inside space-y-1 text-blue-600">
                    <li>Setup Supabase untuk permanent data storage</li>
                    <li>Setup Mailchimp account dan dapatkan API Key dan Audience ID</li>
                    <li>Buat Zapier webhook untuk integrasi Mailchimp</li>
                    <li>Configure email domain validation di EmailJS</li>
                    <li>Setup monitoring untuk email delivery rates</li>
                  </ol>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              {/* Background Distribution */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">User Background Distribution</h3>
                <div className="space-y-2">
                  {getBackgroundDistribution().map(([background, count]) => (
                    <div key={background} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span className="text-sm">{background}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${(count / stats.totalAssessments) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium">{count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* English Level Distribution */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">English Level Distribution</h3>
                <div className="space-y-2">
                  {getEnglishLevelDistribution().map(([level, count]) => (
                    <div key={level} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span className="text-sm capitalize">{level}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-600 h-2 rounded-full" 
                            style={{ width: `${(count / stats.totalAssessments) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium">{count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Conversion Insights */}
              <div className="bg-purple-50 p-4 rounded-lg">
                <h4 className="font-medium text-purple-700 mb-2">📊 Key Insights</h4>
                <ul className="text-purple-600 text-sm space-y-1">
                  <li>• Conversion rate: {stats.conversionRate}% (industry avg: 15-25%)</li>
                  <li>• Average assessments per day: {Math.round(stats.totalAssessments / Math.max(1, assessments.length > 0 ? Math.ceil((Date.now() - new Date(assessments[assessments.length - 1].timestamp).getTime()) / (1000 * 60 * 60 * 24)) : 1))}</li>
                  <li>• Most common background: {getBackgroundDistribution()[0]?.[0] || 'N/A'}</li>
                  <li>• Weekly growth: {stats.weeklyAssessments} new assessments</li>
                </ul>
              </div>
            </TabsContent>

            <TabsContent value="debug" className="space-y-6">
              <EmailDebugHelper />
            </TabsContent>

            <TabsContent value="testing" className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Testing Tools</h3>
                <p className="text-sm text-muted-foreground">
                  Tools untuk testing dan debugging email functionality
                </p>
                
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-700 mb-2">Current Status</h4>
                  <p className="text-blue-600 text-sm">
                    EmailJS sedang mengalami error "recipients address is empty". 
                    Gunakan Email Debug tab untuk troubleshooting.
                  </p>
                </div>
                
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-medium text-green-700 mb-2">Working Features</h4>
                  <ul className="text-green-600 text-sm space-y-1">
                    <li>• Assessment data collection ✅</li>
                    <li>• Local data storage ✅</li>
                    <li>• Newsletter signup ✅</li>
                    <li>• PDF generation ✅</li>
                    <li>• Admin data export ✅</li>
                  </ul>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}