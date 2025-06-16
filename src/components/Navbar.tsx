'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from './Navbar.module.css';

const Navbar = () => {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    localStorage.removeItem('bankDetailsData');
    router.push('/');
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.logoContainer}>
        <Link href="/dashboard" className={styles.logo}>
          AppDashboard
        </Link>
      </div>
      <ul className={styles.navLinks}>
        <li>
          <Link href="/bank-form" className={styles.link}>
            Bank Details Form
          </Link>
        </li>
        <li>
          <Link href="/dashboard" className={styles.link}>
            Charts Dashboard
          </Link>
        </li>
      </ul>
      <button onClick={handleLogout} className={styles.logoutButton}>
        <Link href="/login">Logout</Link>
      </button>
    </nav>
  );
};

export default Navbar;
