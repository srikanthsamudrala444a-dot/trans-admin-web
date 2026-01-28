import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

// Interfaces
export interface GeneralSettings {
  appName: string;
  appVersion: string;
  defaultCurrency: string;
  currencySymbol: string;
  distanceUnit: string;
  weightUnit: string;
  timeZone: string;
  dateFormat: string;
  timeFormat: string;
  language: string;
  maintenanceMode: boolean;
  debugMode: boolean;
}

export interface NotificationSettings {
  emailEnabled: boolean;
  smsEnabled: boolean;
  pushEnabled: boolean;
  emailHost: string;
  emailPort: number;
  emailUsername: string;
  emailPassword: string;
  smsProvider: string;
  smsApiKey: string;
  smsFromNumber: string;
}

export interface IntegrationSettings {
  googleMapsApiKey: string;
  firebaseApiKey: string;
  stripePublishableKey: string;
  stripeSecretKey: string;
  twilioAccountSid: string;
  twilioAuthToken: string;
  awsAccessKey: string;
  awsSecretKey: string;
  awsRegion: string;
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  variables: string[];
  isActive: boolean;
  lastModified: string;
}

export interface SmsTemplate {
  id: string;
  name: string;
  message: string;
  variables: string[];
  isActive: boolean;
  lastModified: string;
}

export interface SystemSettingsData {
  generalSettings: GeneralSettings;
  notificationSettings: NotificationSettings;
  integrationSettings: IntegrationSettings;
  emailTemplates: EmailTemplate[];
  smsTemplates: SmsTemplate[];
}

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatTabsModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    MatChipsModule,
    MatTooltipModule
  ],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  generalForm!: FormGroup;
  notificationForm!: FormGroup;
  integrationForm!: FormGroup;
  emailTemplateForm!: FormGroup;
  smsTemplateForm!: FormGroup;

  loading = false;
  saving = false;
  settingsData: SystemSettingsData | null = null;
  selectedEmailTemplate: EmailTemplate | null = null;
  selectedSmsTemplate: SmsTemplate | null = null;
  isEditingEmailTemplate = false;
  isEditingSmsTemplate = false;

  // Options
  currencyOptions = [
    { value: 'USD', label: 'US Dollar ($)', symbol: '$' },
    { value: 'EUR', label: 'Euro (€)', symbol: '€' },
    { value: 'GBP', label: 'British Pound (£)', symbol: '£' },
    { value: 'INR', label: 'Indian Rupee (₹)', symbol: '₹' },
    { value: 'JPY', label: 'Japanese Yen (¥)', symbol: '¥' },
    { value: 'CAD', label: 'Canadian Dollar (C$)', symbol: 'C$' },
    { value: 'AUD', label: 'Australian Dollar (A$)', symbol: 'A$' }
  ];

  distanceUnitOptions = [
    { value: 'km', label: 'Kilometers' },
    { value: 'miles', label: 'Miles' }
  ];

  weightUnitOptions = [
    { value: 'kg', label: 'Kilograms' },
    { value: 'lbs', label: 'Pounds' }
  ];

  timezoneOptions = [
    { value: 'UTC', label: 'UTC' },
    { value: 'America/New_York', label: 'Eastern Time' },
    { value: 'America/Chicago', label: 'Central Time' },
    { value: 'America/Denver', label: 'Mountain Time' },
    { value: 'America/Los_Angeles', label: 'Pacific Time' },
    { value: 'Europe/London', label: 'London' },
    { value: 'Europe/Paris', label: 'Paris' },
    { value: 'Asia/Tokyo', label: 'Tokyo' },
    { value: 'Asia/Shanghai', label: 'Shanghai' },
    { value: 'Asia/Kolkata', label: 'India' }
  ];

  dateFormatOptions = [
    { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY' },
    { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY' },
    { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD' }
  ];

  timeFormatOptions = [
    { value: '12h', label: '12 Hour' },
    { value: '24h', label: '24 Hour' }
  ];

  languageOptions = [
    { value: 'en', label: 'English' },
    { value: 'es', label: 'Spanish' },
    { value: 'fr', label: 'French' },
    { value: 'de', label: 'German' },
    { value: 'it', label: 'Italian' },
    { value: 'pt', label: 'Portuguese' },
    { value: 'ru', label: 'Russian' },
    { value: 'zh', label: 'Chinese' },
    { value: 'ja', label: 'Japanese' },
    { value: 'ko', label: 'Korean' }
  ];

  smsProviderOptions = [
    { value: 'twilio', label: 'Twilio' },
    { value: 'aws-sns', label: 'AWS SNS' },
    { value: 'nexmo', label: 'Nexmo' },
    { value: 'messagebird', label: 'MessageBird' }
  ];

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.initializeForms();
  }

  ngOnInit(): void {
    this.loadSettings();
  }

  private initializeForms(): void {
    // General Settings Form
    this.generalForm = this.fb.group({
      appName: ['Transport Admin', Validators.required],
      appVersion: ['1.0.0', Validators.required],
      defaultCurrency: ['USD', Validators.required],
      currencySymbol: ['$', Validators.required],
      distanceUnit: ['km', Validators.required],
      weightUnit: ['kg', Validators.required],
      timeZone: ['UTC', Validators.required],
      dateFormat: ['DD/MM/YYYY', Validators.required],
      timeFormat: ['24h', Validators.required],
      language: ['en', Validators.required],
      maintenanceMode: [false],
      debugMode: [false]
    });

    // Notification Settings Form
    this.notificationForm = this.fb.group({
      emailEnabled: [true],
      smsEnabled: [true],
      pushEnabled: [true],
      emailHost: ['smtp.gmail.com', Validators.required],
      emailPort: [587, [Validators.required, Validators.min(1)]],
      emailUsername: ['', [Validators.required, Validators.email]],
      emailPassword: ['', Validators.required],
      smsProvider: ['twilio', Validators.required],
      smsApiKey: ['', Validators.required],
      smsFromNumber: ['', Validators.required]
    });

    // Integration Settings Form
    this.integrationForm = this.fb.group({
      googleMapsApiKey: ['', Validators.required],
      firebaseApiKey: ['', Validators.required],
      stripePublishableKey: ['', Validators.required],
      stripeSecretKey: ['', Validators.required],
      twilioAccountSid: [''],
      twilioAuthToken: [''],
      awsAccessKey: [''],
      awsSecretKey: [''],
      awsRegion: ['us-east-1']
    });

    // Email Template Form
    this.emailTemplateForm = this.fb.group({
      name: ['', Validators.required],
      subject: ['', Validators.required],
      body: ['', Validators.required],
      isActive: [true]
    });

    // SMS Template Form
    this.smsTemplateForm = this.fb.group({
      name: ['', Validators.required],
      message: ['', [Validators.required, Validators.maxLength(160)]],
      isActive: [true]
    });
  }

  loadSettings(): void {
    this.loading = true;
    this.getSettingsData().subscribe({
      next: (data) => {
        this.settingsData = data;
        this.populateForms(data);
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
        this.showSnackBar('Error loading settings', 'error');
      }
    });
  }

  private populateForms(data: SystemSettingsData): void {
    if (data && data.generalSettings) {
      this.generalForm.patchValue(data.generalSettings);
    }
    if (data && data.notificationSettings) {
      this.notificationForm.patchValue(data.notificationSettings);
    }
    if (data && data.integrationSettings) {
      this.integrationForm.patchValue(data.integrationSettings);
    }
  }

  saveGeneralSettings(): void {
    if (this.generalForm.valid) {
      this.saving = true;
      // Simulate API call
      setTimeout(() => {
        this.saving = false;
        this.showSnackBar('General settings saved successfully', 'success');
      }, 1500);
    }
  }

  saveNotificationSettings(): void {
    if (this.notificationForm.valid) {
      this.saving = true;
      // Simulate API call
      setTimeout(() => {
        this.saving = false;
        this.showSnackBar('Notification settings saved successfully', 'success');
      }, 1500);
    }
  }

  saveIntegrationSettings(): void {
    if (this.integrationForm.valid) {
      this.saving = true;
      // Simulate API call
      setTimeout(() => {
        this.saving = false;
        this.showSnackBar('Integration settings saved successfully', 'success');
      }, 1500);
    }
  }

  testEmailConnection(): void {
    this.saving = true;
    // Simulate connection test
    setTimeout(() => {
      this.saving = false;
      this.showSnackBar('Email connection test successful', 'success');
    }, 2000);
  }

  testSmsConnection(): void {
    this.saving = true;
    // Simulate connection test
    setTimeout(() => {
      this.saving = false;
      this.showSnackBar('SMS connection test successful', 'success');
    }, 2000);
  }

  testIntegration(service: string): void {
    this.saving = true;
    // Simulate integration test
    setTimeout(() => {
      this.saving = false;
      this.showSnackBar(`${service} connection test successful`, 'success');
    }, 2000);
  }

  onCurrencyChange(currency: string): void {
    const selectedCurrency = this.currencyOptions.find(c => c.value === currency);
    if (selectedCurrency) {
      this.generalForm.patchValue({ currencySymbol: selectedCurrency.symbol });
    }
  }

  // Email Template Management
  editEmailTemplate(template: EmailTemplate): void {
    this.selectedEmailTemplate = template;
    this.emailTemplateForm.patchValue({
      name: template.name,
      subject: template.subject,
      body: template.body,
      isActive: template.isActive
    });
    this.isEditingEmailTemplate = true;
  }

  saveEmailTemplate(): void {
    if (this.emailTemplateForm.valid) {
      this.saving = true;
      // Simulate API call
      setTimeout(() => {
        this.saving = false;
        this.isEditingEmailTemplate = false;
        this.selectedEmailTemplate = null;
        this.emailTemplateForm.reset();
        this.showSnackBar('Email template saved successfully', 'success');
        this.loadSettings(); // Refresh data
      }, 1500);
    }
  }

  deleteEmailTemplate(template: EmailTemplate): void {
    if (confirm(`Are you sure you want to delete the template "${template.name}"?`)) {
      this.saving = true;
      // Simulate API call
      setTimeout(() => {
        this.saving = false;
        this.showSnackBar('Email template deleted successfully', 'success');
        this.loadSettings(); // Refresh data
      }, 1000);
    }
  }

  cancelEmailTemplateEdit(): void {
    this.isEditingEmailTemplate = false;
    this.selectedEmailTemplate = null;
    this.emailTemplateForm.reset();
  }

  // SMS Template Management
  editSmsTemplate(template: SmsTemplate): void {
    this.selectedSmsTemplate = template;
    this.smsTemplateForm.patchValue({
      name: template.name,
      message: template.message,
      isActive: template.isActive
    });
    this.isEditingSmsTemplate = true;
  }

  saveSmsTemplate(): void {
    if (this.smsTemplateForm.valid) {
      this.saving = true;
      // Simulate API call
      setTimeout(() => {
        this.saving = false;
        this.isEditingSmsTemplate = false;
        this.selectedSmsTemplate = null;
        this.smsTemplateForm.reset();
        this.showSnackBar('SMS template saved successfully', 'success');
        this.loadSettings(); // Refresh data
      }, 1500);
    }
  }

  deleteSmsTemplate(template: SmsTemplate): void {
    if (confirm(`Are you sure you want to delete the template "${template.name}"?`)) {
      this.saving = true;
      // Simulate API call
      setTimeout(() => {
        this.saving = false;
        this.showSnackBar('SMS template deleted successfully', 'success');
        this.loadSettings(); // Refresh data
      }, 1000);
    }
  }

  cancelSmsTemplateEdit(): void {
    this.isEditingSmsTemplate = false;
    this.selectedSmsTemplate = null;
    this.smsTemplateForm.reset();
  }

  insertVariable(variable: string, isEmail: boolean = true): void {
    if (isEmail) {
      const currentBody = this.emailTemplateForm.get('body')?.value || '';
      this.emailTemplateForm.patchValue({ body: currentBody + `{{${variable}}}` });
    } else {
      const currentMessage = this.smsTemplateForm.get('message')?.value || '';
      this.smsTemplateForm.patchValue({ message: currentMessage + `{{${variable}}}` });
    }
  }

  getCharacterCount(): number {
    return this.smsTemplateForm.get('message')?.value?.length || 0;
  }

  createNewEmailTemplate(): void {
    this.selectedEmailTemplate = null;
    this.emailTemplateForm.reset({
      name: '',
      subject: '',
      body: '',
      isActive: true
    });
    this.isEditingEmailTemplate = true;
  }

  selectEmailTemplate(template: EmailTemplate): void {
    this.editEmailTemplate(template);
  }

  createNewSmsTemplate(): void {
    this.selectedSmsTemplate = null;
    this.smsTemplateForm.reset({
      name: '',
      message: '',
      isActive: true
    });
    this.isEditingSmsTemplate = true;
  }

  selectSmsTemplate(template: SmsTemplate): void {
    this.editSmsTemplate(template);
  }

  exportSettings(): void {
    const settings = {
      general: this.generalForm.value,
      notification: this.notificationForm.value,
      // Don't export sensitive integration keys in real app
      exported: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(settings, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `system-settings-${new Date().getTime()}.json`;
    a.click();
    window.URL.revokeObjectURL(url);
    
    this.showSnackBar('Settings exported successfully', 'success');
  }

  importSettings(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const settings = JSON.parse(e.target?.result as string);
          this.generalForm.patchValue(settings.general || {});
          this.notificationForm.patchValue(settings.notification || {});
          this.showSnackBar('Settings imported successfully', 'success');
        } catch (error) {
          this.showSnackBar('Error importing settings file', 'error');
        }
      };
      reader.readAsText(file);
    }
  }

  private showSnackBar(message: string, type: 'success' | 'error' = 'success'): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: type === 'error' ? 'error-snackbar' : 'success-snackbar'
    });
  }

  // Mock data service
  private getSettingsData(): Observable<SystemSettingsData> {
    const mockData: SystemSettingsData = {
      generalSettings: {
        appName: 'Transport Admin',
        appVersion: '1.0.0',
        defaultCurrency: 'USD',
        currencySymbol: '$',
        distanceUnit: 'km',
        weightUnit: 'kg',
        timeZone: 'UTC',
        dateFormat: 'DD/MM/YYYY',
        timeFormat: '24h',
        language: 'en',
        maintenanceMode: false,
        debugMode: false
      },
      notificationSettings: {
        emailEnabled: true,
        smsEnabled: true,
        pushEnabled: true,
        emailHost: 'smtp.gmail.com',
        emailPort: 587,
        emailUsername: 'admin@transport.com',
        emailPassword: '********',
        smsProvider: 'twilio',
        smsApiKey: '********',
        smsFromNumber: '+1234567890'
      },
      integrationSettings: {
        googleMapsApiKey: 'AIza****************',
        firebaseApiKey: 'AIza****************',
        stripePublishableKey: 'pk_test_****************',
        stripeSecretKey: 'sk_test_****************',
        twilioAccountSid: 'AC****************',
        twilioAuthToken: '****************',
        awsAccessKey: 'AKIA****************',
        awsSecretKey: '****************',
        awsRegion: 'us-east-1'
      },
      emailTemplates: [
        {
          id: '1',
          name: 'Welcome Email',
          subject: 'Welcome to {{appName}}',
          body: 'Dear {{userName}},\n\nWelcome to our transport service! Your account has been created successfully.\n\nThank you for choosing us.\n\nBest regards,\nThe {{appName}} Team',
          variables: ['appName', 'userName', 'userEmail'],
          isActive: true,
          lastModified: '2024-10-14T10:00:00Z'
        },
        {
          id: '2',
          name: 'Booking Confirmation',
          subject: 'Booking Confirmed - {{bookingId}}',
          body: 'Dear {{userName}},\n\nYour booking #{{bookingId}} has been confirmed.\n\nPickup: {{pickupLocation}}\nDestination: {{destination}}\nDate: {{bookingDate}}\nTime: {{bookingTime}}\n\nDriver details will be shared shortly.\n\nThank you!',
          variables: ['userName', 'bookingId', 'pickupLocation', 'destination', 'bookingDate', 'bookingTime'],
          isActive: true,
          lastModified: '2024-10-14T10:30:00Z'
        },
        {
          id: '3',
          name: 'Driver Assigned',
          subject: 'Driver Assigned - {{bookingId}}',
          body: 'Dear {{userName}},\n\nA driver has been assigned to your booking #{{bookingId}}.\n\nDriver: {{driverName}}\nPhone: {{driverPhone}}\nVehicle: {{vehicleDetails}}\nETA: {{estimatedArrival}}\n\nHave a safe trip!',
          variables: ['userName', 'bookingId', 'driverName', 'driverPhone', 'vehicleDetails', 'estimatedArrival'],
          isActive: true,
          lastModified: '2024-10-14T11:00:00Z'
        }
      ],
      smsTemplates: [
        {
          id: '1',
          name: 'Booking Confirmation',
          message: 'Hi {{userName}}! Your booking #{{bookingId}} is confirmed for {{date}} at {{time}}. Driver details coming soon.',
          variables: ['userName', 'bookingId', 'date', 'time'],
          isActive: true,
          lastModified: '2024-10-14T10:00:00Z'
        },
        {
          id: '2',
          name: 'Driver En Route',
          message: '{{driverName}} is on the way! ETA: {{eta}} mins. Vehicle: {{vehicle}}. Contact: {{phone}}',
          variables: ['driverName', 'eta', 'vehicle', 'phone'],
          isActive: true,
          lastModified: '2024-10-14T10:15:00Z'
        },
        {
          id: '3',
          name: 'Trip Completed',
          message: 'Trip completed! Total: {{currency}}{{amount}}. Thank you for using {{appName}}! Rate your experience: {{ratingLink}}',
          variables: ['currency', 'amount', 'appName', 'ratingLink'],
          isActive: true,
          lastModified: '2024-10-14T10:30:00Z'
        }
      ]
    };

    return of(mockData).pipe(delay(800));
  }
}