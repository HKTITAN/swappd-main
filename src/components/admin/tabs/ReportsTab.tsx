import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, CheckCircle, XCircle, MessageSquare } from "lucide-react";

interface Report {
  id: string;
  user_id: string;
  username: string;
  report_type: string;
  reported_item_id: string | null;
  reported_user_id: string | null;
  subject: string;
  description: string;
  status: 'open' | 'investigating' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'critical';
  created_at: string;
  updated_at: string;
}

interface ReportsTabProps {
  reports: Report[];
  onStatusChange: (reportId: string, status: string) => void;
  onReplySubmit: (reportId: string, message: string) => void;
}

export const ReportsTab = ({ reports, onStatusChange, onReplySubmit }: ReportsTabProps) => {
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [replyText, setReplyText] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'bg-blue-500/20 text-blue-700 hover:bg-blue-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-700 hover:bg-yellow-500/30';
      case 'high': return 'bg-orange-500/20 text-orange-700 hover:bg-orange-500/30';
      case 'critical': return 'bg-red-500/20 text-red-700 hover:bg-red-500/30';
      default: return 'bg-monochrome-500/20 text-monochrome-700 hover:bg-monochrome-500/30';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-blue-500/20 text-blue-700 hover:bg-blue-500/30';
      case 'investigating': return 'bg-purple-500/20 text-purple-700 hover:bg-purple-500/30';
      case 'resolved': return 'bg-green-500/20 text-green-700 hover:bg-green-500/30';
      case 'closed': return 'bg-monochrome-500/20 text-monochrome-700 hover:bg-monochrome-500/30';
      default: return 'bg-monochrome-500/20 text-monochrome-700 hover:bg-monochrome-500/30';
    }
  };

  const handleViewReport = (report: Report) => {
    setSelectedReport(report);
    setDialogOpen(true);
  };

  const handleStatusChange = (status: string) => {
    if (selectedReport) {
      onStatusChange(selectedReport.id, status);
      setSelectedReport({
        ...selectedReport,
        status: status as 'open' | 'investigating' | 'resolved' | 'closed'
      });
    }
  };

  const handleReplySubmit = () => {
    if (selectedReport && replyText.trim()) {
      onReplySubmit(selectedReport.id, replyText);
      setReplyText("");
    }
  };

  // Count reports by status
  const openReports = reports.filter(r => r.status === 'open').length;
  const investigatingReports = reports.filter(r => r.status === 'investigating').length;
  const resolvedReports = reports.filter(r => r.status === 'resolved').length;
  const closedReports = reports.filter(r => r.status === 'closed').length;

  // Count reports by type
  const itemReports = reports.filter(r => r.reported_item_id).length;
  const userReports = reports.filter(r => r.reported_user_id).length;
  const generalReports = reports.filter(r => !r.reported_item_id && !r.reported_user_id).length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">User Reports & Issues</h2>
        <p className="text-muted-foreground">Handle user reports and platform issues</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Open Reports</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center">
            <AlertCircle className="h-4 w-4 text-blue-500 mr-2" />
            <div className="text-2xl font-bold">{openReports}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Investigating</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center">
            <MessageSquare className="h-4 w-4 text-purple-500 mr-2" />
            <div className="text-2xl font-bold">{investigatingReports}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Resolved</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center">
            <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
            <div className="text-2xl font-bold">{resolvedReports}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Closed</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center">
            <XCircle className="h-4 w-4 text-monochrome-500 mr-2" />
            <div className="text-2xl font-bold">{closedReports}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Reports</TabsTrigger>
          <TabsTrigger value="open">Open</TabsTrigger>
          <TabsTrigger value="investigating">Investigating</TabsTrigger>
          <TabsTrigger value="resolved">Resolved</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all">
          <ReportTable 
            reports={reports} 
            getPriorityColor={getPriorityColor} 
            getStatusColor={getStatusColor} 
            onViewReport={handleViewReport}
          />
        </TabsContent>
        
        <TabsContent value="open">
          <ReportTable 
            reports={reports.filter(r => r.status === 'open')} 
            getPriorityColor={getPriorityColor} 
            getStatusColor={getStatusColor} 
            onViewReport={handleViewReport}
          />
        </TabsContent>
        
        <TabsContent value="investigating">
          <ReportTable 
            reports={reports.filter(r => r.status === 'investigating')} 
            getPriorityColor={getPriorityColor} 
            getStatusColor={getStatusColor} 
            onViewReport={handleViewReport}
          />
        </TabsContent>
        
        <TabsContent value="resolved">
          <ReportTable 
            reports={reports.filter(r => r.status === 'resolved' || r.status === 'closed')} 
            getPriorityColor={getPriorityColor} 
            getStatusColor={getStatusColor} 
            onViewReport={handleViewReport}
          />
        </TabsContent>
      </Tabs>
      
      {/* Report Detail Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Report Details</DialogTitle>
            <DialogDescription>
              Reported by {selectedReport?.username} on {selectedReport && new Date(selectedReport.created_at).toLocaleDateString()}
            </DialogDescription>
          </DialogHeader>
          
          {selectedReport && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className={getPriorityColor(selectedReport.priority)}>
                    {selectedReport.priority.charAt(0).toUpperCase() + selectedReport.priority.slice(1)} Priority
                  </Badge>
                  <Badge variant="outline" className={getStatusColor(selectedReport.status)}>
                    {selectedReport.status.charAt(0).toUpperCase() + selectedReport.status.slice(1)}
                  </Badge>
                </div>
                <div>
                  <Badge variant="outline">
                    {selectedReport.report_type}
                  </Badge>
                </div>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle>{selectedReport.subject}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-wrap">{selectedReport.description}</p>
                </CardContent>
              </Card>
              
              {selectedReport.status !== 'closed' && (
                <div className="space-y-4">
                  <div className="grid gap-2">
                    <Textarea
                      placeholder="Type your response here..."
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      className="h-24"
                    />
                  </div>
                  
                  <div className="flex gap-2">
                    <Button onClick={handleReplySubmit}>Send Reply</Button>
                  </div>
                </div>
              )}
              
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  onClick={() => handleStatusChange('open')}
                  className={selectedReport.status === 'open' ? 'bg-blue-500/10' : ''}
                >
                  Mark as Open
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleStatusChange('investigating')}
                  className={selectedReport.status === 'investigating' ? 'bg-purple-500/10' : ''}
                >
                  Mark as Investigating
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleStatusChange('resolved')}
                  className={selectedReport.status === 'resolved' ? 'bg-green-500/10' : ''}
                >
                  Mark as Resolved
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleStatusChange('closed')}
                  className={selectedReport.status === 'closed' ? 'bg-monochrome-500/10' : ''}
                >
                  Close Report
                </Button>
              </div>
            </div>
          )}
          
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Helper component for the reports table
interface ReportTableProps {
  reports: Report[];
  getPriorityColor: (priority: string) => string;
  getStatusColor: (status: string) => string;
  onViewReport: (report: Report) => void;
}

const ReportTable = ({ reports, getPriorityColor, getStatusColor, onViewReport }: ReportTableProps) => {
  if (reports.length === 0) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>No reports found</AlertTitle>
        <AlertDescription>
          There are no reports matching the current filter.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Subject</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>User</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reports.map(report => (
            <TableRow key={report.id}>
              <TableCell className="font-medium max-w-[180px] truncate">{report.subject}</TableCell>
              <TableCell>{report.report_type}</TableCell>
              <TableCell>{report.username}</TableCell>
              <TableCell className="text-muted-foreground">{new Date(report.created_at).toLocaleDateString()}</TableCell>
              <TableCell>
                <Badge variant="outline" className={getPriorityColor(report.priority)}>
                  {report.priority}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant="outline" className={getStatusColor(report.status)}>
                  {report.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <Button variant="outline" size="sm" onClick={() => onViewReport(report)}>
                  View Details
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};