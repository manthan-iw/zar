'use client';

import { useCallback, useState, type FormEvent } from 'react';
import Button from '@/components/ui/atoms/Button/Button';
import InputField from '@/components/ui/atoms/InputField/InputField';
import PhoneField from '@/components/ui/atoms/PhoneField/PhoneField';
import SelectField from '@/components/ui/atoms/SelectField/SelectField';
import TextareaField from '@/components/ui/atoms/TextareaField/TextareaField';
import CustomCaptcha from '@/components/ui/molecules/CustomCaptcha/CustomCaptcha';
import styles from './page.module.css';

export default function PartnerForm() {
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

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitMessage('');
    setSubmitError(false);

    const form = event.currentTarget;

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    if (!captchaValue || !isCaptchaValid) {
      setSubmitError(true);
      setSubmitMessage('Please complete the 4-digit captcha correctly before submitting.');
      return;
    }

    form.reset();
    setCaptchaValue('');
    setIsCaptchaValid(false);
    setCaptchaRefreshKey((current) => current + 1);
    setSubmitError(false);
    setSubmitMessage('Your request has been submitted successfully. Our team will contact you soon.');
  };

  return (
    <div className={styles.formSection}>
      <h2 className="formHeading">Build A Connection With Zar</h2>
      <form className={styles.form} onSubmit={onSubmit} noValidate>
        <div className={styles.formRow}>
          <InputField
            id="name"
            name="name"
            label="Full Name"
            placeholder="Type full name here"
            wrapperClassName={styles.inputGroup}
            required
          />
          <InputField
            id="company"
            name="company"
            label="Company Name"
            placeholder="Type your company name here"
            wrapperClassName={styles.inputGroup}
            required
          />
        </div>
        <div className={styles.formRow}>
          <SelectField
            id="country"
            name="country"
            label="Country"
            placeholder="Select your country"
            options={[
              { label: 'India', value: 'india' },
              { label: 'Other', value: 'other' },
            ]}
            wrapperClassName={styles.inputGroup}
            required
            defaultValue=""
          />
          <SelectField
            id="state"
            name="state"
            label="State"
            placeholder="Select your state"
            options={[
              { label: 'Maharashtra', value: 'maharashtra' },
              { label: 'Gujarat', value: 'gujarat' },
              { label: 'Other', value: 'other' },
            ]}
            wrapperClassName={styles.inputGroup}
            required
            defaultValue=""
          />
        </div>
        <div className={styles.formRow}>
          <SelectField
            id="city"
            name="city"
            label="City"
            placeholder="Select your city"
            options={[
              { label: 'Mumbai', value: 'mumbai' },
              { label: 'Surat', value: 'surat' },
              { label: 'Other', value: 'other' },
            ]}
            wrapperClassName={styles.inputGroup}
            required
            defaultValue=""
          />
          <InputField
            id="pincode"
            name="pincode"
            label="Pincode"
            placeholder="Enter your pincode"
            wrapperClassName={styles.inputGroup}
            required
          />
        </div>
        <div className={styles.formRow}>
          <InputField
            id="email"
            name="email"
            type="email"
            label="Email ID"
            placeholder="Enter your email ID"
            wrapperClassName={styles.inputGroup}
            required
          />
          <PhoneField
            id="phone"
            name="phone"
            label="Contact No."
            placeholder="Enter your contact number"
            wrapperClassName={styles.inputGroup}
            required
          />
        </div>
        <div className={styles.formRow}>
          <SelectField
            id="category"
            name="category"
            label="Category"
            placeholder="Select Category"
            options={[
              { label: 'Distributor', value: 'distributor' },
              { label: 'Retailer', value: 'retailer' },
              { label: 'Wholesaler', value: 'wholesaler' },
            ]}
            wrapperClassName={styles.inputGroup}
            required
            defaultValue=""
          />
          <SelectField
            id="referred_by"
            name="referred_by"
            label="Referred By"
            placeholder="Select referred by"
            options={[
              { label: 'ZAR Retail Partner', value: 'zar_retail_partner' },
              { label: 'Distributor', value: 'distributor' },
              { label: 'Social Media', value: 'social_media' },
            ]}
            wrapperClassName={styles.inputGroup}
            required
            defaultValue=""
          />
        </div>
        <div className={styles.formRow}>
          <InputField
            id="website"
            name="website"
            label="Company Website"
            placeholder="Type your company website URL here"
            wrapperClassName={styles.inputGroup}
            required
          />
        </div>
        <div className={styles.formRow}>
          <TextareaField
            id="message"
            name="message"
            label="Message"
            placeholder="Type here..."
            wrapperClassName={styles.inputGroup}
            required
          />
        </div>

        <CustomCaptcha key={captchaRefreshKey} onStatusChange={handleCaptchaStatusChange} />

        <Button variant="primary" showArrow type="submit">
          Submit
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