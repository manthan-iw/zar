'use client';

import Image from 'next/image';
import { startTransition, useCallback, useEffect, useMemo, useState } from 'react';
import InputField from '@/components/ui/atoms/InputField/InputField';
import styles from './CustomCaptcha.module.css';

export type CaptchaStatus = {
    value: string;
    isValid: boolean;
};

type CustomCaptchaProps = {
    onStatusChange: (status: CaptchaStatus) => void;
    id?: string;
    label?: string;
    placeholder?: string;
    required?: boolean;
};

const CAPTCHA_LENGTH = 4;
const CAPTCHA_WIDTH = 160;
const CAPTCHA_HEIGHT = 42;

function getSeedValue(seed: string, index: number, fallback: number) {
    return seed.codePointAt(index) ?? fallback;
}

function getRandomDigits(length: number) {
    const values = new Uint32Array(length);
    globalThis.crypto.getRandomValues(values);
    return Array.from(values, (value) => (value % 10).toString()).join('');
}

function getNoiseSeed() {
    const values = new Uint32Array(8);
    globalThis.crypto.getRandomValues(values);
    return Array.from(values, (value) => value.toString(36)).join('');
}

function buildCaptchaImage(code: string, noiseSeed: string) {
    const digits = code.split('');
    const palette = ['#2f3437', '#6e7468', '#8f917f', '#9ea39b'];

    const digitMarkup = digits
        .map((digit, index) => {
            const rotate = (getSeedValue(noiseSeed, index, 0) % 17) - 8;
            const offsetY = 22 + ((getSeedValue(noiseSeed, index + 4, 0) % 7) - 3);
            const fill = palette[index % palette.length];
            const x = 22 + index * 31;

            return `<text x="${x}" y="${offsetY}" fill="${fill}" font-family="Georgia, 'Times New Roman', serif" font-size="26" font-weight="700" transform="rotate(${rotate} ${x} ${offsetY})">${digit}</text>`;
        })
        .join('');

    const dotMarkup = Array.from({ length: 28 }, (_, index) => {
        const source = getSeedValue(noiseSeed, index % Math.max(noiseSeed.length, 1), index * 13);
        const cx = 6 + ((source * 17 + index * 11) % (CAPTCHA_WIDTH - 12));
        const cy = 6 + ((source * 7 + index * 19) % (CAPTCHA_HEIGHT - 12));
        const radius = 0.9 + (source % 3) * 0.45;
        const fill = index % 2 === 0 ? '#d7d3e4' : '#bfd2df';
        return `<circle cx="${cx}" cy="${cy}" r="${radius}" fill="${fill}" opacity="0.9" />`;
    }).join('');

    const lineMarkup = Array.from({ length: 3 }, (_, index) => {
        const source = getSeedValue(noiseSeed, index + 2, index * 29);
        const y1 = 10 + ((source * 5) % 18);
        const y2 = 14 + ((source * 9) % 18);
        return `<path d="M 8 ${y1} C 48 ${y1 - 8}, 92 ${y2 + 8}, 152 ${y2}" fill="none" stroke="#c8d5cf" stroke-width="1.4" stroke-linecap="round" opacity="0.8" />`;
    }).join('');

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${CAPTCHA_WIDTH}" height="${CAPTCHA_HEIGHT}" viewBox="0 0 ${CAPTCHA_WIDTH} ${CAPTCHA_HEIGHT}" role="img" aria-label="4 digit captcha"><rect x="0.5" y="0.5" width="159" height="41" rx="4" fill="#f8f6f2" stroke="#cfc9c1" /><rect x="3" y="3" width="154" height="36" rx="3" fill="#f5f4f1" />${dotMarkup}${lineMarkup}${digitMarkup}</svg>`;

    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

export default function CustomCaptcha({
    onStatusChange,
    id = 'captcha-input',
    label = 'Enter captcha',
    placeholder = 'Enter captcha',
    required = true,
}: Readonly<CustomCaptchaProps>) {
    const [captchaCode, setCaptchaCode] = useState('');
    const [captchaValue, setCaptchaValue] = useState('');
    const [noiseSeed, setNoiseSeed] = useState('');

    useEffect(() => {
        startTransition(() => {
            setCaptchaCode(getRandomDigits(CAPTCHA_LENGTH));
            setNoiseSeed(getNoiseSeed());
        });
    }, []);

    const normalizedValue = useMemo(
        () => captchaValue.replace(/\D/g, '').slice(0, CAPTCHA_LENGTH),
        [captchaValue]
    );

    const isValid = captchaCode.length === CAPTCHA_LENGTH && normalizedValue === captchaCode;
    const captchaImage = useMemo(() => {
        if (!captchaCode || !noiseSeed) {
            return '';
        }

        return buildCaptchaImage(captchaCode, noiseSeed);
    }, [captchaCode, noiseSeed]);

    const refreshCaptcha = useCallback(() => {
        setCaptchaCode(getRandomDigits(CAPTCHA_LENGTH));
        setNoiseSeed(getNoiseSeed());
        setCaptchaValue('');
    }, []);

    useEffect(() => {
        onStatusChange({
            value: normalizedValue,
            isValid,
        });
    }, [isValid, normalizedValue, onStatusChange]);

    return (
        <div className={styles.captchaBlock}>
            <div className={styles.captchaHeaderRow}>
                {/* <label htmlFor={id} className={styles.captchaLabel}>
          Security Check <span className="required">*</span>
        </label> */}

            </div>

            <div className={styles.captchaRow}>
                <div className={styles.captchaImageWrapper}>
                    <div className={styles.captchaImageFrame} aria-live="polite">
                        {captchaImage && (
                            <Image
                                src={captchaImage}
                                alt="4 digit captcha"
                                className={styles.captchaImage}
                                width={CAPTCHA_WIDTH}
                                height={CAPTCHA_HEIGHT}
                                unoptimized
                            />
                        )}
                    </div>
                    <button
                        type="button"
                        className={styles.captchaRefreshButton}
                        onClick={refreshCaptcha}
                        aria-label="Refresh captcha"
                    >
                        <span className={styles.captchaRefreshIcon} aria-hidden="true">
                            ↻
                        </span>
                    </button>
                </div>
                <InputField
                    id={id}
                    label={label}
                    placeholder={placeholder}
                    inputMode="numeric"
                    autoComplete="off"
                    maxLength={CAPTCHA_LENGTH}
                    value={captchaValue}
                    onChange={(event) => {
                        setCaptchaValue(event.target.value.replace(/\D/g, '').slice(0, CAPTCHA_LENGTH));
                    }}
                    wrapperClassName={styles.captchaInputGroup}
                    errorMessage={
                        captchaValue.length > 0 && !isValid ? 'Captcha code does not match.' : undefined
                    }
                    required={required}
                />
            </div>
        </div>
    );
}