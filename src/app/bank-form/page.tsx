'use client';

import { useState } from 'react'; 
import { useRouter } from 'next/navigation'; 
import { useForm, SubmitHandler, FieldValues } from 'react-hook-form';
import styles from './page.module.css';
import Navbar from '@/components/Navbar';

interface BankDetailsFormInput extends FieldValues {
    accountHolderName: string;
    accountNumber: string;
    bankName: string;
    branchCode: string;
    ifscCode: string;
    loanAmount: number;
    interestRate: number;
    loanTenure: number;
    monthlyEMI: number;
    creditScore: number;
    transactionLimit: number;
    lastTransactionDate: string;
    nomineeName: string;
    accountType: string;
    customerID: string;
}

const BANK_DETAILS_STORAGE_KEY = 'bankDetailsData';

export default function BankFormPage() {
    const router = useRouter();
    const [formMessage, setFormMessage] = useState('');
    const [formMessageType, setFormMessageType] = useState<'success' | 'error' | ''>('');

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<BankDetailsFormInput>();

    const onSubmit: SubmitHandler<BankDetailsFormInput> = (data) => {
        try {
            localStorage.setItem(BANK_DETAILS_STORAGE_KEY, JSON.stringify(data));
            setFormMessage('Bank details saved successfully! Redirecting to dashboard...');
            setFormMessageType('success');
            reset();
            setTimeout(() => router.push('/dashboard'), 1500);
        } catch (error) {
            console.error('Failed to save bank details:', error);
            setFormMessage('Failed to save bank details.');
            setFormMessageType('error');
        }
    };

    const fieldDefinitions: { name: Extract<keyof BankDetailsFormInput, string>; label: string; type: string; requiredMsg: string, step?: string }[] = [
        { name: 'accountHolderName', label: 'Account Holder Name', type: 'text', requiredMsg: 'Account holder name is required' },
        { name: 'accountNumber', label: 'Account Number', type: 'text', requiredMsg: 'Account number is required' },
        { name: 'bankName', label: 'Bank Name', type: 'text', requiredMsg: 'Bank name is required' },
        { name: 'branchCode', label: 'Branch Code', type: 'text', requiredMsg: 'Branch code is required' },
        { name: 'ifscCode', label: 'IFSC Code', type: 'text', requiredMsg: 'IFSC code is required' },
        { name: 'loanAmount', label: 'Loan Amount (Numeric)', type: 'number', requiredMsg: 'Loan amount is required', step: "any" },
        { name: 'interestRate', label: 'Interest Rate (%) (Numeric)', type: 'number', requiredMsg: 'Interest rate is required', step: "any" },
        { name: 'loanTenure', label: 'Loan Tenure (Months) (Numeric)', type: 'number', requiredMsg: 'Loan tenure is required' },
        { name: 'monthlyEMI', label: 'Monthly EMI (Numeric)', type: 'number', requiredMsg: 'Monthly EMI is required', step: "any" },
        { name: 'creditScore', label: 'Credit Score (Numeric)', type: 'number', requiredMsg: 'Credit score is required' },
        { name: 'transactionLimit', label: 'Transaction Limit (Numeric)', type: 'number', requiredMsg: 'Transaction limit is required', step: "any" },
        { name: 'lastTransactionDate', label: 'Last Transaction Date', type: 'date', requiredMsg: 'Date is required' },
        { name: 'nomineeName', label: 'Nominee Name', type: 'text', requiredMsg: 'Nominee name is required' },
        { name: 'accountType', label: 'Account Type (e.g., Savings)', type: 'text', requiredMsg: 'Account type is required' },
        { name: 'customerID', label: 'Customer ID', type: 'text', requiredMsg: 'Customer ID is required' },
    ];


    return (
        <>
            <Navbar />
            <main className={styles.main}>
                <div className={styles.formContainer}>
                    <h1 className={styles.title}>Bank Details Form</h1>
                    <form onSubmit={handleSubmit(onSubmit)} className={styles.detailsForm}>
                        {fieldDefinitions.map(({ name, label, type, requiredMsg, step }) => (
                            <div key={name} className={styles.inputGroup}>
                                <label htmlFor={name}>{label}</label>
                                <input
                                    id={name}
                                    type={type}
                                    step={step}
                                    {...register(name, {
                                        required: requiredMsg,
                                        valueAsNumber: type === 'number' ? true : undefined
                                    })}
                                />
                                {errors[name] && <p className={styles.errorText}>{errors[name]?.message}</p>}
                            </div>
                        ))}
                        <button type="submit" className={styles.submitButton}>
                            Save Details & View Dashboard
                        </button>
                    </form>
                    {formMessage && (
                        <p className={`${styles.message} ${formMessageType === 'success' ? styles.success : styles.error}`}>
                            {formMessage}
                        </p>
                    )}
                </div>
            </main>
        </>
    );
}

