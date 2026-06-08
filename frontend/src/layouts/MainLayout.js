import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import LanguageSwitcher from '../components/LanguageSwitcher';

function MainLayout() {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div>
      <nav>
        <Link to="/search">{t('nav.home')}</Link>
        {user?.role === 'traveler' && <Link to="/bookings">{t('nav.bookings')}</Link>}
        {user?.role === 'driver' && <Link to="/driver/dashboard">{t('nav.dashboard')}</Link>}
        {user?.role === 'agency_admin' && <><Link to="/agency/dashboard">{t('nav.agency')}</Link><Link to="/analytics">{t('nav.analytics')}</Link></>}
        {user?.role === 'admin' && <><Link to="/admin/dashboard">{t('nav.admin')}</Link><Link to="/analytics">{t('nav.analytics')}</Link></>}
        <Link to="/events">{t('nav.events')}</Link>
        <Link to="/notifications">{t('nav.notifications')}</Link>
        <LanguageSwitcher />
        <button onClick={handleLogout}>{t('nav.logout')}</button>
      </nav>
      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default MainLayout;
