'use client';

import Link from 'next/link';                
import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, RadialBarChart, RadialBar } from 'recharts';
import styles from './page.module.css';
import Navbar from '@/components/Navbar'; 
const BANK_DETAILS_STORAGE_KEY = 'bankDetailsData';

interface BankDetails {
    accountHolderName?: string;
    accountNumber?: string;
    bankName?: string;
    branchCode?: string;
    ifscCode?: string;
    loanAmount?: number;
    interestRate?: number;
    loanTenure?: number;
    monthlyEMI?: number;
    creditScore?: number;
    transactionLimit?: number;
    lastTransactionDate?: string;
    nomineeName?: string;
    accountType?: string;
    customerID?: string;
}

interface ChartDataPoint {
    name: string;
    value: number;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export default function DashboardPage() {
    const [barChartData, setBarChartData] = useState<ChartDataPoint[]>([]);
    const [lineChartData, setLineChartData] = useState<ChartDataPoint[]>([]);
    const [pieChartData, setPieChartData] = useState<ChartDataPoint[]>([]);
    const [radialBarData, setRadialBarData] = useState<any[]>([]); 
    const [hasData, setHasData] = useState(false);

    useEffect(() => {
        const storedDataString = localStorage.getItem(BANK_DETAILS_STORAGE_KEY);
        if (storedDataString) {
            try {
                const parsedData: BankDetails = JSON.parse(storedDataString);
                setHasData(true);

             
                const newBarData: ChartDataPoint[] = [
                    { name: 'Loan Amt', value: parsedData.loanAmount || 0 },
                    { name: 'EMI', value: parsedData.monthlyEMI || 0 },
                    { name: 'Txn Limit', value: parsedData.transactionLimit || 0 },
                ];
                setBarChartData(newBarData);

                
                const newLineData: ChartDataPoint[] = [
                    { name: 'Int. Rate', value: parsedData.interestRate || 0 },
                    { name: 'Tenure', value: parsedData.loanTenure || 0 },
                    { name: 'Credit Score', value: parsedData.creditScore || 0 },
                ];
                setLineChartData(newLineData);
                
             
                const newPieData: ChartDataPoint[] = [
                        { name: 'Loan Amount', value: parsedData.loanAmount || 0 },
                        { name: 'Transaction Limit', value: parsedData.transactionLimit || 0 },
                     
                ];
                setPieChartData(newPieData.filter(d => d.value > 0)); 

                
                if (parsedData.creditScore !== undefined) {
                        setRadialBarData([
                                { name: 'Credit Score', uv: parsedData.creditScore, fill: '#8884d8', max: 850 } 
                        ]);
                }

            } catch (error) {
                console.error("Failed to parse bank details from local storage:", error);
                setHasData(false);
            }
        } else {
                setHasData(false);
        }
    }, []);

    return (
        <>
            <Navbar />
            <main className={styles.main}>
                <div className={styles.dashboardContainer}>
                    <div className={styles.header}>
                        <h1 className={styles.title}>Bank Details Dashboard</h1>
                        
                    </div>

                    {hasData ? (
                        <div className={styles.chartsGrid}>
                            <div className={styles.chartWrapper}>
                                <h2 className={styles.chartTitle}>Financial Overview</h2>
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={barChartData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Bar dataKey="value" fill="#8884d8" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>

                            <div className={styles.chartWrapper}>
                                <h2 className={styles.chartTitle}>Key Metrics Trend</h2>
                                <ResponsiveContainer width="100%" height={300}>
                                    <LineChart data={lineChartData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Line type="monotone" dataKey="value" stroke="#82ca9d" activeDot={{ r: 8 }} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                            
                            <div className={styles.chartWrapper}>
                                <h2 className={styles.chartTitle}>Amount Distribution</h2>
                                <ResponsiveContainer width="100%" height={300}>
                                        <PieChart>
                                                <Pie
                                                        data={pieChartData}
                                                        cx="50%"
                                                        cy="50%"
                                                        labelLine={false}
                                                        outerRadius={100}
                                                        fill="#8884d8"
                                                        dataKey="value"
                                                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                                >
                                                        {pieChartData.map((entry, index) => (
                                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                        ))}
                                                </Pie>
                                                <Tooltip />
                                                <Legend />
                                        </PieChart>
                                </ResponsiveContainer>
                            </div>

                            <div className={styles.chartWrapper}>
                                <h2 className={styles.chartTitle}>Credit Score Meter</h2>
                                {radialBarData.length > 0 ? (
                                        <ResponsiveContainer width="100%" height={300}>
                                                <RadialBarChart 
                                                        cx="50%" 
                                                        cy="50%" 
                                                        innerRadius="50%" 
                                                        outerRadius="80%" 
                                                        barSize={20} 
                                                        data={radialBarData}
                                                        startAngle={180}
                                                        endAngle={0}
                                                >
                                                        <RadialBar
                                                                minAngle={15}
                                                                label={{ position: 'insideStart', fill: '#fff', fontSize: '16px' }}
                                                                background
                                                                clockWise
                                                                dataKey="uv" 
                                                        />
                                                        <Legend iconSize={10} layout="vertical" verticalAlign="middle" align="right" />
                                                        <Tooltip />
                                                </RadialBarChart>
                                        </ResponsiveContainer>
                                ) : <p>Credit score data not available for meter.</p>}
                            </div>

                        </div>
                    ) : (
                        <p className={styles.noDataMessage}>No bank details found. Please go to the <Link href="/bank-form" className={styles.formLink}>Bank Details Form</Link> to enter data.</p>
                    )}
                </div>
            </main>
        </>
    );
}

