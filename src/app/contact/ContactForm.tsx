'use client';

import { useCallback, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import Button from '@/components/ui/atoms/Button/Button';
import CustomCaptcha from '@/components/ui/molecules/CustomCaptcha/CustomCaptcha';
import InputField from '@/components/ui/atoms/InputField/InputField';
import PhoneField from '@/components/ui/atoms/PhoneField/PhoneField';
import SelectField from '@/components/ui/atoms/SelectField/SelectField';
import TextareaField from '@/components/ui/atoms/TextareaField/TextareaField';
import AppLoader from '@/components/ui/organisms/AppLoader/AppLoader';
import { submitContactInquiry } from '@/lib/api/contact';
import styles from './page.module.css';

type ContactFormValues = {
  name: string;
  company: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
};

const NAME_REGEX = /^[A-Za-z][A-Za-z\s'.-]{1,79}$/;
const COMPANY_REGEX = /^[A-Za-z0-9][A-Za-z0-9\s'&.,()-]{1,99}$/;
const EMAIL_REGEX = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
const MESSAGE_REGEX = /^[A-Za-z0-9\s.,'"?!@#$%&*()\-:+;[\]{}]{10,1000}$/;

export default function ContactForm() {
  const [submitMessage, setSubmitMessage] = useState('');
  const [submitError, setSubmitError] = useState(false);
  const [captchaValue, setCaptchaValue] = useState('');
  const [isCaptchaValid, setIsCaptchaValid] = useState(false);
  const [captchaRefreshKey, setCaptchaRefreshKey] = useState(0);

  const handleCaptchaStatusChange = useCallback(
    ({ value, isValid }: { value: string; isValid: boolean }) => {
      setCaptchaValue(value);
      setIsCaptchaValid(isValid);
    },
    []
  );

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    defaultValues: {
      name: '',
      company: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
    },
    mode: 'onBlur',
  });

  const onSubmit = handleSubmit(async (values) => {
    setSubmitMessage('');
    setSubmitError(false);

    if (!captchaValue || !isCaptchaValid) {
      setSubmitError(true);
      setSubmitMessage('Please complete the 4-digit captcha correctly before submitting.');
      return;
    }

    try {
      const result = await submitContactInquiry({
        fullName: values.name,           // ← Mapping
        companyName: values.company || undefined,
        email: values.email,
        contactNumber: values.phone,     // ← Mapping
        inquiryType: values.subject,     // ← Mapping
        message: values.message,
      });

      if (!result.success) {
        setSubmitError(true);
        setSubmitMessage(result.message || 'Unable to submit your message. Please try again.');
        return;
      }

      reset();
      setCaptchaValue('');
      setIsCaptchaValid(false);
      setCaptchaRefreshKey((current) => current + 1);
      setSubmitError(false);
      setSubmitMessage(result.message || 'Your message has been submitted successfully.');
    } catch {
      setSubmitError(true);
      setSubmitMessage('Network error. Please try again in a moment.');
    }
  });

  return (
    <div className={styles.formSection}>
      <h2 className="formHeading">Send us a Message</h2>
      <form className={styles.form} onSubmit={onSubmit} noValidate>
        <div className={styles.formRow}>
          <InputField
            id="name"
            label="Full Name"
            placeholder="Your full name"
            wrapperClassName={styles.inputGroup}
            required
            errorMessage={errors.name?.message}
            {...register('name', {
              required: 'Full name is required.',
              pattern: {
                value: NAME_REGEX,
                message: 'Enter a valid full name.',
              },
              minLength: {
                value: 2,
                message: 'Full name must be at least 2 characters.',
              },
              maxLength: {
                value: 80,
                message: 'Full name cannot exceed 80 characters.',
              },
            })}
          />

          <InputField
            id="company"
            label="Company Name"
            placeholder="Your company name"
            wrapperClassName={styles.inputGroup}
            errorMessage={errors.company?.message}
            {...register('company', {
              validate: (value) => {
                if (!value) {
                  return true;
                }

                return COMPANY_REGEX.test(value) || 'Enter a valid company name.';
              },
              maxLength: {
                value: 100,
                message: 'Company name cannot exceed 100 characters.',
              },
            })}
          />
        </div>

        <div className={styles.formRow}>
          <InputField
            id="email"
            type="email"
            label="Email ID"
            placeholder="you@email.com"
            wrapperClassName={styles.inputGroup}
            required
            errorMessage={errors.email?.message}
            {...register('email', {
              required: 'Email is required.',
              pattern: {
                value: EMAIL_REGEX,
                message: 'Enter a valid email address.',
              },
            })}
          />

          <Controller
            name="phone"
            control={control}
            rules={{
              required: 'Contact number is required.',
              validate: (value) => {
                const digits = value.replace(/\D/g, '');
                return (
                  (digits.length >= 7 && digits.length <= 15) ||
                  'Enter a valid contact number.'
                );
              },
            }}
            render={({ field }) => (
              <PhoneField
                id="phone"
                name={field.name}
                label="Contact No."
                placeholder="Enter number"
                wrapperClassName={styles.inputGroup}
                required
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                errorMessage={errors.phone?.message}
              />
            )}
          />
        </div>

        <div className={styles.formRow}>
          <SelectField
            id="subject"
            label="Enquiry Type"
            placeholder="Select enquiry type"
            options={[
              { label: 'Product Enquiry', value: 'product' },
              { label: 'Bulk Order', value: 'bulk' },
              { label: 'Partnership', value: 'partnership' },
              { label: 'General Enquiry', value: 'general' },
            ]}
            wrapperClassName={styles.inputGroup}
            required
            errorMessage={errors.subject?.message}
            {...register('subject', {
              required: 'Please select an enquiry type.',
            })}
            defaultValue=""
          />

          <TextareaField
            id="message"
            label="Message"
            placeholder="Your message..."
            wrapperClassName={styles.inputGroup}
            required
            errorMessage={errors.message?.message}
            {...register('message', {
              required: 'Message is required.',
              pattern: {
                value: MESSAGE_REGEX,
                message: 'Message contains invalid characters.',
              },
              minLength: {
                value: 10,
                message: 'Message must be at least 10 characters.',
              },
              maxLength: {
                value: 1000,
                message: 'Message cannot exceed 1000 characters.',
              },
            })}
          />
        </div>

        <CustomCaptcha key={captchaRefreshKey} onStatusChange={handleCaptchaStatusChange} />

        <Button variant="primary" showArrow type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <span className={styles.submitLoadingInline}>
              {/* <AppLoader size={28} delayMs={0} label="Submitting form" showLabel={false} /> */}
              <span>Submitting...</span>
            </span>
          ) : (
            'Send Message'
          )}
        </Button>

        {submitMessage && (
          <p
            className={submitError ? styles.submitStatusError : styles.submitStatusSuccess}
            role="status"
            aria-live="polite"
          >
            {submitMessage}
          </p>
        )}
      </form>
    </div>
  );
}
