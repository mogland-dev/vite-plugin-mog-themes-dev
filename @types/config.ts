interface Seo {
  title: string;
  description: string;
  keyword?: string[];
  avatar?: string;
}

interface Site {
  fount_url: string;
  server_url: string;
}

interface Webhook {
  name: string;
  description: string;
  url: string;
}

interface Email {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  pass: string;
}

export interface Theme {
  id: string;
  name: string;
  active?: boolean;
  package?: string;
  version?: string;
  config?: string;
  path: string;
}

enum ScheduleType {
  // code, // run code in schedule
  url = 'url', // fetch url in schedule
  event = 'event', // trigger event
}

enum AfterSchedule {
  store = 'store', // store data from event
  url = 'url',
  none = 'none',
  // email, // send email from event
  // webhook, // send webhook from event
}


interface Schedule {
  name: string;
  description: string;
  token: string;
  type: ScheduleType;
  action: any;
  after: AfterSchedule;
  error?: {
    message: string;
    time: Date
  }[]
  active: boolean;
}

export interface Config {
  seo: Seo;
  site: Site;
  webhooks: Webhook[];
  email: Email;
  themes: Theme[];
  schedule: Schedule[];
}