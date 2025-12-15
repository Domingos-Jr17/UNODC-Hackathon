// USSD Service Types

export interface USSDRequest {
  sessionId: string;
  serviceCode?: string;
  phoneNumber: string;
  text: string;
}

export interface USSDResponse {
  success: boolean;
  response: string;
  sessionId: string;
  step: string;
  phoneNumber?: string;
  shouldEndSession?: boolean;
}

export interface USSDSession {
  sessionId: string;
  phoneNumber: string;
  step: USSDStep;
  userCode?: string;
  userData?: UserData;
  lastActivity: number;
  startTime: number;
  lastResponse?: string;
  selectedCourse?: string;
}

export enum USSDStep {
  WELCOME = 'welcome',
  LOGIN = 'login',
  MAIN_MENU = 'main_menu',
  COURSES_LIST = 'courses_list',
  COURSE_DETAILS = 'course_details',
  PROGRESS_OVERVIEW = 'progress_overview',
  HELP = 'help'
}

export interface UserData {
  anonymous_code: string;
  real_name: string;
  phone: string;
  email: string;
  ngo_id: number;
  created_at: string;
}

export interface CourseData {
  id: string;
  name: string;
  percentage: number;
  completedModules: number;
  totalModules: number;
  duration: string;
}

export interface SMSService {
  sendSMS(phoneNumber: string, message: string): Promise<SMSRecord>;
  getSentMessages(): SMSRecord[];
  getWelcomeMessage(userName: string): string;
  getProgressMessage(userName: string, courses: CourseProgress[]): string;
  getCertificateMessage(userName: string, courseName: string): string;
  getReminderMessage(userName: string, lastActivity: string): string;
}

export interface SMSRecord {
  id: number;
  to: string;
  message: string;
  sentAt: string;
  status: string;
  provider: string;
}

export interface CourseProgress {
  name: string;
  percentage: number;
  completedModules: number;
  totalModules: number;
}

export interface USSDServiceStats {
  totalSessions: number;
  activeSessions: number;
  smsSent: number;
}

export interface USSDHealthCheck {
  service: string;
  status: string;
  shortcode: string;
  sessionTimeout: string;
  activeSessions: number;
  uptime?: number;
  timestamp: string;
}

export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface DemoSequence {
  step: string;
  response: string;
}

export interface DemoSequenceResponse {
  success: boolean;
  demoSequence: DemoSequence[];
  sessionId: string;
  phoneNumber: string;
}

export interface HealthCheckResponse {
  status: string;
  timestamp: string;
  uptime: number;
  environment: string;
  version: string;
  services: {
    api: string;
    ussd: string;
    sms: string;
    database: string;
  };
}