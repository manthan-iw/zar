'use client';

import { useCallback, useEffect, useState } from 'react';
import { Country, State, City } from 'country-state-city';
import Button from '@/components/ui/atoms/Button/Button';
import InputField from '@/components/ui/atoms/InputField/InputField';
import PhoneField from '@/components/ui/atoms/PhoneField/PhoneField';
import SelectField from '@/components/ui/atoms/SelectField/SelectField';
import TextareaField from '@/components/ui/atoms/TextareaField/TextareaField';
import CustomCaptcha from '@/components/ui/molecules/CustomCaptcha/CustomCaptcha';
import { submitBuildConnection } from '@/lib/api/partner';
import styles from './page.module.css';

export default function PartnerForm() {
  const [submitMessage, setSubmitMessage] = useState('');
  const [submitError, setSubmitError] = useState(false);
  const [captchaValue, setCaptchaValue] = useState('');
  const [isCaptchaValid, setIsCaptchaValid] = useState(false);
  const [captchaRefreshKey, setCaptchaRefreshKey] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [countries, setCountries] = useState<{ name: string; isoCode: string }[]>([]);
  const [statesList, setStatesList] = useState<{ name: string; isoCode: string }[]>([]);
  const [citiesList, setCitiesList] = useState<{ name: string }[]>([]);
  const [selectedCountryCode, setSelectedCountryCode] = useState('');
  const [selectedCountryName, setSelectedCountryName] = useState('');
  const [selectedStateCode, setSelectedStateCode] = useState('');
  const [selectedStateName, setSelectedStateName] = useState('');
  const [selectedCityName, setSelectedCityName] = useState('');

  const handleCaptchaStatusChange = useCallback(
    ({ value, isValid }: { value: string; isValid: boolean }) => {
      setCaptchaValue(value);
      setIsCaptchaValid(isValid);
    },
    []
  );

  useEffect(() => {
    setCountries(Country.getAllCountries().map((country) => ({
      name: country.name,
      isoCode: country.isoCode,
    })));
  }, []);

  useEffect(() => {
    if (!selectedCountryCode) {
      setStatesList([]);
      setSelectedStateCode('');
      setSelectedStateName('');
      setCitiesList([]);
      setSelectedCityName('');
      return;
    }

    setStatesList(
      State.getStatesOfCountry(selectedCountryCode).map((state) => ({
        name: state.name,
        isoCode: state.isoCode,
      }))
    );
    setSelectedStateCode('');
    setSelectedStateName('');
    setCitiesList([]);
    setSelectedCityName('');
  }, [selectedCountryCode]);

  useEffect(() => {
    if (!selectedCountryCode || !selectedStateCode) {
      setCitiesList([]);
      setSelectedCityName('');
      return;
    }

    setCitiesList(
      City.getCitiesOfState(selectedCountryCode, selectedStateCode).map((city) => ({
        name: city.name,
      }))
    );
    setSelectedCityName('');
  }, [selectedCountryCode, selectedStateCode]);

  const onSubmit = (event: { preventDefault: () => void; currentTarget: HTMLFormElement }) => {
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

    const getValue = (key: string) => {
      const formData = new FormData(form);
      const value = formData.get(key);

      if (key === 'country') {
        return selectedCountryName || (typeof value === 'string' ? value.trim() : '');
      }

      if (key === 'state') {
        return selectedStateName || (typeof value === 'string' ? value.trim() : '');
      }

      if (key === 'city') {
        return selectedCityName || (typeof value === 'string' ? value.trim() : '');
      }

      return typeof value === 'string' ? value.trim() : '';
    };

    const payload = {
      fullName: getValue('name'),
      companyName: getValue('company'),
      email: getValue('email'),
      country: getValue('country'),
      state: getValue('state'),
      city: getValue('city'),
      pincode: getValue('pincode'),
      contact: getValue('phone'),
      category: getValue('category'),
      referredBy: getValue('referred_by'),
      companyWebsite: getValue('website'),
      message: getValue('message'),
    };

    const submitAsync = async () => {
      try {
        setIsSubmitting(true);
        const result = await submitBuildConnection(payload);

        if (!result.success) {
          setSubmitError(true);
          setSubmitMessage(result.message || 'Unable to submit your request. Please try again.');
          return;
        }

        form.reset();
        setSelectedCountryCode('');
        setSelectedCountryName('');
        setSelectedStateCode('');
        setSelectedStateName('');
        setSelectedCityName('');
        setCaptchaValue('');
        setIsCaptchaValid(false);
        setSubmitError(false);
        setSubmitMessage(
          result.message || 'Your request has been submitted successfully. Our team will contact you soon.'
        );
      } catch {
        setSubmitError(true);
        setSubmitMessage('Network error. Please try again in a moment.');
      } finally {
        setCaptchaValue('');
        setIsCaptchaValid(false);
        setCaptchaRefreshKey((current) => current + 1);
        setIsSubmitting(false);
      }
    };

    void submitAsync();
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
            options={countries.map((country) => ({
              label: country.name,
              value: country.isoCode,
            }))}
            wrapperClassName={styles.inputGroup}
            required
            value={selectedCountryCode}
            onChange={(event) => {
              const code = event.target.value;
              setSelectedCountryCode(code);
              const selectedCountry = countries.find((country) => country.isoCode === code);
              setSelectedCountryName(selectedCountry?.name ?? '');
            }}
          />
          <SelectField
            id="state"
            name="state"
            label="State"
            placeholder="Select your state"
            options={statesList.map((state) => ({
              label: state.name,
              value: state.isoCode,
            }))}
            wrapperClassName={styles.inputGroup}
            required
            value={selectedStateCode}
            onChange={(event) => {
              const code = event.target.value;
              setSelectedStateCode(code);
              const selectedState = statesList.find((state) => state.isoCode === code);
              setSelectedStateName(selectedState?.name ?? '');
            }}
            disabled={!selectedCountryCode || statesList.length === 0}
          />
        </div>
        <div className={styles.formRow}>
          <SelectField
            id="city"
            name="city"
            label="City"
            placeholder="Select your city"
            options={citiesList.map((city) => ({
              label: city.name,
              value: city.name,
            }))}
            wrapperClassName={styles.inputGroup}
            required
            value={selectedCityName}
            onChange={(event) => setSelectedCityName(event.target.value)}
            disabled={!selectedStateCode || citiesList.length === 0}
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
              { label: 'Customer', value: 'customer' },
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
              { label: 'ZAR', value: 'zar' },
              { label: 'Marketing', value: 'marketing' },
              { label: 'Director', value: 'director' },
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

        <Button variant="primary" showArrow type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Submit'}
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