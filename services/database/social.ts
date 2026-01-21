
/**
 * DATABASE SOCIAL
 * Logic untuk Review, Laporan, Notifikasi, dan Request
 */
import { sendToBackend, fetchFromBackend } from './core';

export const dbFetchReviews = async () => {
  const response = await fetchFromBackend({ action: 'get_reviews' });
  if (response && (response.success === true || response.status === 'success') && Array.isArray(response.data)) {
    return response.data;
  }
  return [];
};

export const dbSubmitReview = async (review: any) => {
  if (!review.userEmail || !review.rating) return { success: false, message: 'Wajib diisi' };
  const payload = { ...review };
  const response = await sendToBackend('submit_review', payload);
  if (response && (response.success === true || response.status === 'success')) return { success: true };
  return { success: false };
};

export const dbFetchReports = async () => {
  const response = await fetchFromBackend({ action: 'get_reports' });
  if (response && (response.success === true || response.status === 'success') && Array.isArray(response.data)) return response.data;
  return [];
};

export const dbSubmitReport = async (report: any) => {
  if (!report.reporterEmail || !report.description) return { success: false };
  const payload = { ...report, reportType: report.reportType || "OTHER", title: report.title || "Laporan" };
  const response = await sendToBackend('submit_report', payload);
  if (response && (response.success === true || response.status === 'success')) return { success: true };
  return { success: false };
};

export const dbFetchNotifications = async (email: string) => {
  const response = await fetchFromBackend({ action: 'get_notifications', email });
  if (response && (response.success === true || response.status === 'success') && Array.isArray(response.data)) return response.data;
  return [];
};

export const dbLogQualityCheck = async (result: any, partnerName: string) => {
  const payload = { partnerName, isSafe: result.isSafe, qualityPercentage: result.qualityPercentage, reasoning: result.reasoning };
  const response = await sendToBackend('log_quality_check', payload);
  return response && (response.success === true || response.status === 'success');
};

export const dbCreateRequest = async (request: any) => {
  const response = await sendToBackend('create_request', request);
  if (response && (response.success === true || response.status === 'success')) return { success: true };
  return { success: false };
};
