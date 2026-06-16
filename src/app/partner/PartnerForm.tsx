'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Country, State, City } from 'country-state-city';
import { Controller, useForm } from 'react-hook-form';
import Button from '@/components/ui/atoms/Button/Button';
import InputField from '@/components/ui/atoms/InputField/InputField';
import PhoneField from '@/components/ui/atoms/PhoneField/PhoneField';
import SelectField from '@/components/ui/atoms/SelectField/SelectField';
import TextareaField from '@/components/ui/atoms/TextareaField/TextareaField';
import CustomCaptcha from '@/components/ui/molecules/CustomCaptcha/CustomCaptcha';
import { submitBuildConnection } from '@/lib/api/partner';
import { useToast } from '@/components/ui/Toast/ToastContext';
import styles from './page.module.css';

type PartnerFormValues = {
  name: string;
  company: string;
  country: string;
  state: string;
  city: string;
  pincode: string;
  email: string;
  phone: string;
  category: string;
  referred_by: string;
  website: string;
  message: string;
};

const NAME_REGEX = /^[A-Za-z][A-Za-z\s'.-]{1,79}$/;
const COMPANY_REGEX = /^[A-Za-z0-9][A-Za-z0-9\s'&.,()-]{1,99}$/;
const EMAIL_REGEX = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
const MESSAGE_REGEX = /^[A-Za-z0-9\s.,'"?!@#$%&*()\-:+;[\]{}]{10,1000}$/;

export default function PartnerForm() {
  const router = useRouter();
  const { showToast } = useToast();
  const [captchaValue, setCaptchaValue] = useState('');
  const [isCaptchaValid, setIsCaptchaValid] = useState(false);
  const [captchaRefreshKey, setCaptchaRefreshKey] = useState(0);
  const [countries, setCountries] = useState<{ name: string; isoCode: string }[]>([]);
  const [statesList, setStatesList] = useState<{ name: string; isoCode: string }[]>([]);
  const [citiesList, setCitiesList] = useState<{ name: string }[]>([]);
  const [selectedCountryCode, setSelectedCountryCode] = useState('');
  const [selectedCountryName, setSelectedCountryName] = useState('');
  const [selectedStateCode, setSelectedStateCode] = useState('');
  const [selectedStateName, setSelectedStateName] = useState('');

  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<PartnerFormValues>({
    defaultValues: {
      name: '',
      company: '',
      country: '',
      state: '',
      city: '',
      pincode: '',
      email: '',
      phone: '',
      category: '',
      referred_by: '',
      website: '',
      message: '',
    },
    mode: 'onBlur',
  });

  const handleCaptchaStatusChange = useCallback(
    ({ value, isValid }: { value: string; isValid: boolean }) => {
      setCaptchaValue(value);
      setIsCaptchaValid(isValid);
    },
    []
  );

  useEffect(() => {
    setCountries(
      Country.getAllCountries().map((country) => ({
        name: country.name,
        isoCode: country.isoCode,
      }))
    );
  }, []);

  useEffect(() => {
    if (!selectedCountryCode) {
      setStatesList([]);
      setSelectedStateCode('');
      setSelectedStateName('');
      setCitiesList([]);
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
  }, [selectedCountryCode]);

  useEffect(() => {
    if (!selectedCountryCode || !selectedStateCode) {
      setCitiesList([]);
      return;
    }

    setCitiesList(
      City.getCitiesOfState(selectedCountryCode, selectedStateCode).map((city) => ({
        name: city.name,
      }))
    );
  }, [selectedCountryCode, selectedStateCode]);

  const onPartnerSubmit = handleSubmit(async (values) => {
    if (!captchaValue || !isCaptchaValid) {
      showToast('Please complete the 4-digit captcha correctly before submitting.', 'error');
      return;
    }

    const payload = {
      fullName: values.name,
      companyName: values.company,
      email: values.email,
      country: selectedCountryName,
      state: selectedStateName,
      city: values.city,
      pincode: values.pincode,
      contact: values.phone,
      category: values.category,
      referredBy: values.referred_by,
      companyWebsite: values.website,
      message: values.message,
    };

    try {
      const result = await submitBuildConnection(payload);

      if (!result.success) {
        showToast(result.message || 'Unable to submit your request. Please try again.', 'error');
        return;
      }

      reset();
      setSelectedCountryCode('');
      setSelectedCountryName('');
      setSelectedStateCode('');
      setSelectedStateName('');
      setSelectedCityName('');
      setCaptchaValue('');
      setIsCaptchaValid(false);
      router.push('/thank-you');
    } catch {
      showToast('Network error. Please try again in a moment.', 'error');
    } finally {
      setCaptchaRefreshKey((current) => current + 1);
    }
  });

  return (
    <div className={styles.formSection}>
      <h2 className="formHeading">Build A Connection With Zar</h2>
      <form className={styles.form} onSubmit={onPartnerSubmit} noValidate>
        <div className={styles.formRow}>
          <InputField
            id="name"
            label="Full Name"
            placeholder="Type full name here"
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
            placeholder="Type your company name here"
            wrapperClassName={styles.inputGroup}
            required
            errorMessage={errors.company?.message}
            {...register('company', {
              required: 'Company name is required.',
              pattern: {
                value: COMPANY_REGEX,
                message: 'Enter a valid company name.',
              },
              maxLength: {
                value: 100,
                message: 'Company name cannot exceed 100 characters.',
              },
            })}
          />
        </div>

        <div className={styles.formRow}>
          <Controller
            name="country"
            control={control}
            render={({ field }) => (
              <SelectField
                id="country"
                label="Country"
                placeholder="Select your country"
                options={countries.map((country) => ({
                  label: country.name,
                  value: country.isoCode,
                }))}
                wrapperClassName={styles.inputGroup}
                value={field.value}
                onChange={(event) => {
                  const code = event.target.value;
                  field.onChange(code);
                  setSelectedCountryCode(code);
                  const selectedCountry = countries.find((country) => country.isoCode === code);
                  setSelectedCountryName(selectedCountry?.name ?? '');
                  setValue('state', '');
                  setValue('city', '');
                }}
                onBlur={field.onBlur}
              />
            )}
          />

          <Controller
            name="state"
            control={control}
            render={({ field }) => (
              <SelectField
                id="state"
                label="State"
                placeholder="Select your state"
                options={statesList.map((state) => ({
                  label: state.name,
                  value: state.isoCode,
                }))}
                wrapperClassName={styles.inputGroup}
                value={field.value}
                onChange={(event) => {
                  const code = event.target.value;
                  field.onChange(code);
                  setSelectedStateCode(code);
                  const selectedState = statesList.find((state) => state.isoCode === code);
                  setSelectedStateName(selectedState?.name ?? '');
                  setValue('city', '');
                }}
                onBlur={field.onBlur}
                disabled={!selectedCountryCode || statesList.length === 0}
              />
            )}
          />
        </div>

        <div className={styles.formRow}>
          <Controller
            name="city"
            control={control}
            render={({ field }) => (
              <SelectField
                id="city"
                label="City"
                placeholder="Select your city"
                options={citiesList.map((city) => ({
                  label: city.name,
                  value: city.name,
                }))}
                wrapperClassName={styles.inputGroup}
                value={field.value}
                onChange={(event) => {
                  field.onChange(event.target.value);

          />
        </div>

        <div className={styles.formRow}>
          <InputField
            id="email"
            type="email"
            label="Email ID"
            placeholder="Enter your email ID"
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
                if (!value) return 'Contact number is required.';
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
                placeholder="Enter your contact number"
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
            id="category"
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
            errorMessage={errors.category?.message}
            {...register('category', {
              required: 'Please select a category.',
            })}
          />

          <SelectField
            id="referred_by"
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
            errorMessage={errors.referred_by?.message}
            {...register('referred_by', {
              required: 'Please select referred by.',
            })}
          />
        </div>

        <div className={styles.formRow}>
          <InputField
            id="website"
            label="Company Website"
            placeholder="Type your company website URL here"
            wrapperClassName={styles.inputGroup}
            required
            errorMessage={errors.website?.message}
            {...register('website', {
              required: 'Company website is required.',
            })}
          />
        </div>

        <div className={styles.formRow}>
          <TextareaField
            id="message"
            label="Message"
            placeholder="Type here..."
            wrapperClassName={styles.inputGroup}
            errorMessage={errors.message?.message}
            {...register('message', {
              validate: (value) => {
                if (!value) return true;
                return MESSAGE_REGEX.test(value) || 'Message contains invalid characters.';
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
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </Button>
      </form>
    </div>
  );
}