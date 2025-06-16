'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, SubmitHandler } from 'react-hook-form';
import Image from 'next/image';
import styles from './page.module.css';

interface LoginFormInput {
  username: string;
  password: string;
}

export default function LoginPage() {
  const router = useRouter();
  const [apiMessage, setApiMessage] = useState('');
  const [apiMessageType, setApiMessageType] = useState<'success' | 'error' | ''>('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInput>();

  const onSubmit: SubmitHandler<LoginFormInput> = async (data) => {
    setApiMessage('');
    setApiMessageType('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        setApiMessage(result.message || 'Login successful! Redirecting...');
        setApiMessageType('success');
        setTimeout(() => {
          router.push('/bank-form'); 
        }, 1000); 
      } else {
        setApiMessage(result.message || 'Login failed.');
        setApiMessageType('error');
      }
    } catch (error) {
      console.error('Login request error:', error);
      setApiMessage('An unexpected error occurred.');
      setApiMessageType('error');
    }
  };

  return (
    <main className={styles.main}>
      <div className={styles.loginContainer}>
        <div className={styles.brandingContainer}>
          <Image
            src="/qualtechedge_logo.jpeg" 
            alt="Qualtech Edge Logo"
            width={100}
            height={100}
            className={styles.logoImage}
            priority 
          />
          <h1 className={styles.brandName}>Qualtech Edge</h1>
        </div>
        <h2 className={styles.title}>Login</h2>
        <form onSubmit={handleSubmit(onSubmit)} className={styles.loginForm}>
          <div className={styles.inputGroup}>
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              {...register('username', { required: 'Username is required' })}
            />
            {errors.username && <p className={styles.errorText}>{errors.username.message}</p>}
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              {...register('password', { required: 'Password is required' })}
            />
            {errors.password && <p className={styles.errorText}>{errors.password.message}</p>}
          </div>
          <button type="submit" className={styles.loginButton}>
            Login
          </button>
        </form>
        {apiMessage && (
          <p className={`${styles.message} ${apiMessageType === 'success' ? styles.success : styles.error}`}>
            {apiMessage}
          </p>
        )}
        <p className={styles.securityNote}>
          <strong>Demo Credentials:</strong> <code>user123</code> / <code>password123</code>
        </p>
      </div>
    </main>
  );
}


