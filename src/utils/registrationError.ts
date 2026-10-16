export type RegistrationFieldErrors = Record<string, string>;

export interface RegistrationErrorResult {
  message: string;
  fieldErrors: RegistrationFieldErrors;
}

const PLATFORM_ERROR = 'Something went wrong on our side. Please try again in a moment.';
const NETWORK_ERROR = "We couldn't reach our service just now. Please try again in a moment.";

const fieldNames: Record<string, string> = {
  email: 'email',
  emailaddress: 'email',
  password: 'password',
  confirmpassword: 'confirmPassword',
  passwordconfirmation: 'confirmPassword',
  fullname: 'fullName',
  name: 'fullName',
  phone: 'phone',
  phonenumber: 'phone',
  companyname: 'companyName',
  companyaddress: 'companyAddress',
  cacnumber: 'cacNumber',
  registrationnumber: 'cacNumber',
  cacfile: 'cacFile',
  certificate: 'cacFile',
  idfile: 'idFile',
  governmentid: 'idFile',
};

const fieldMessages: Record<string, string> = {
  email: 'Enter a valid email address.',
  password: 'Choose a password that meets the requirements.',
  confirmPassword: 'Passwords do not match.',
  fullName: 'Enter your full name.',
  phone: 'Enter a valid phone number.',
  companyName: 'Enter your company name.',
  companyAddress: 'Enter your company address.',
  cacNumber: 'Enter a valid registration number.',
  cacFile: 'Upload a valid registration certificate.',
  idFile: 'Upload a valid government-issued ID.',
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function normalizeCode(value: unknown): string {
  return typeof value === 'string' ? value.toLowerCase().replace(/[\s-]+/g, '_') : '';
}

function mapFieldErrors(errors: unknown): RegistrationFieldErrors {
  if (!isRecord(errors)) return {};

  const mapped: RegistrationFieldErrors = {};
  for (const key of Object.keys(errors)) {
    const normalizedKey = key.replace(/([a-z])([A-Z])/g, '$1$2').toLowerCase().replace(/[^a-z0-9]/g, '');
    const field = fieldNames[normalizedKey];
    if (field) mapped[field] = fieldMessages[field];
  }
  return mapped;
}

export function mapRegistrationError(error: unknown): RegistrationErrorResult {
  if (!isRecord(error)) return { message: PLATFORM_ERROR, fieldErrors: {} };

  const status = error.status;
  const payload = error.data;
  const body = isRecord(payload) ? payload : null;
  const statusCode = typeof status === 'number' ? status : undefined;
  const code = normalizeCode(body?.code ?? body?.error ?? body?.type);
  const backendMessage = typeof body?.message === 'string' ? body.message.toLowerCase() : '';

  if (
    statusCode === 429 ||
    code.includes('rate_limit') ||
    code.includes('too_many_requests') ||
    /rate.?limit|too many requests/.test(backendMessage)
  ) {
    return { message: 'Please wait a little before trying again.', fieldErrors: {} };
  }

  if (
    statusCode === 409 ||
    ['conflict', 'already_exists', 'email_exists', 'account_exists', 'duplicate'].some((value) =>
      code.includes(value)
    ) ||
    /already (exists|registered|in use)|duplicate/.test(backendMessage)
  ) {
    return {
      message: 'An account with these details already exists. Sign in or use different details.',
      fieldErrors: {},
    };
  }

  if (statusCode !== undefined && statusCode >= 500) {
    return { message: PLATFORM_ERROR, fieldErrors: {} };
  }

  if (status === 'PARSING_ERROR') {
    return { message: PLATFORM_ERROR, fieldErrors: {} };
  }

  if (typeof status === 'string') {
    return { message: NETWORK_ERROR, fieldErrors: {} };
  }

  if (!body) return { message: PLATFORM_ERROR, fieldErrors: {} };

  const fieldErrors = mapFieldErrors(body.errors);
  if (Object.keys(fieldErrors).length > 0) {
    return { message: '', fieldErrors };
  }

  if (body.success === false && typeof body.message === 'string' && body.message.trim()) {
    return { message: 'Please check your details and try again.', fieldErrors: {} };
  }

  if (isRecord(body.errors) && Object.keys(body.errors).length > 0) {
    return { message: 'Please check your details and try again.', fieldErrors: {} };
  }

  return { message: PLATFORM_ERROR, fieldErrors: {} };
}