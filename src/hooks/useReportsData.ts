import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface Report {
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

export const useReportsData = (searchQuery: string = "") => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        
        // Fetching reports with join to get usernames
        const { data, error } = await supabase
          .from('reports')
          .select(`
            *,
            profiles:user_id (username)
          `)
          .order('created_at', { ascending: false });

        if (error) throw error;

        // Transform data to match Report interface
        const formattedReports: Report[] = data.map((report: any) => ({
          id: report.id,
          user_id: report.user_id,
          username: report.profiles?.username || 'Unknown User',
          report_type: report.report_type,
          reported_item_id: report.reported_item_id,
          reported_user_id: report.reported_user_id,
          subject: report.subject,
          description: report.description,
          status: report.status,
          priority: report.priority,
          created_at: report.created_at,
          updated_at: report.updated_at || report.created_at
        }));

        setReports(formattedReports);
        setError(null);
      } catch (err) {
        console.error('Error fetching reports:', err);
        setError('Failed to load reports');
      } finally {
        setLoading(false);
      }
    };

    fetchReports();

    // Set up real-time subscription for reports
    const reportsSubscription = supabase
      .channel('reports_channel')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'reports' 
        }, 
        (payload) => {
          fetchReports(); // Refetch all reports on change
        }
      )
      .subscribe();

    return () => {
      reportsSubscription.unsubscribe();
    };
  }, []);

  // Handle report status change
  const updateReportStatus = async (reportId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('reports')
        .update({ 
          status, 
          updated_at: new Date().toISOString() 
        })
        .eq('id', reportId);

      if (error) throw error;
      
      // Update local state to avoid refetching
      setReports(prev => 
        prev.map(report => 
          report.id === reportId 
            ? { ...report, status: status as any, updated_at: new Date().toISOString() } 
            : report
        )
      );
      
      return { success: true };
    } catch (err) {
      console.error('Error updating report status:', err);
      return { success: false, error: 'Failed to update report status' };
    }
  };

  // Handle report reply
  const submitReportReply = async (reportId: string, message: string) => {
    try {
      // First, find the report to get user_id
      const report = reports.find(r => r.id === reportId);
      if (!report) return { success: false, error: 'Report not found' };
      
      // Add reply to report_responses table
      const { error } = await supabase
        .from('report_responses')
        .insert({
          report_id: reportId,
          user_id: report.user_id,
          message,
          created_at: new Date().toISOString(),
          admin_response: true
        });

      if (error) throw error;
      
      // Update report updated_at timestamp
      await supabase
        .from('reports')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', reportId);
        
      return { success: true };
    } catch (err) {
      console.error('Error submitting report reply:', err);
      return { success: false, error: 'Failed to submit reply' };
    }
  };

  // Filter reports based on search query
  const filteredReports = reports.filter(report =>
    report.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    report.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    report.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    report.report_type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    report.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return {
    reports: filteredReports,
    loading,
    error,
    updateReportStatus,
    submitReportReply
  };
};