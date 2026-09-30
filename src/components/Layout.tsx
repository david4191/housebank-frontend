import { useState } from 'react';

import Footer from './Footer.tsx';
import Header from './Header.tsx';
import { Outlet } from 'react-router-dom';
import AuthLeftPanel from './AuthLeftPanel.tsx';

const sampleData = [
  {
    title:
      'I was overwhelmed with choices before, but Housebank simplified everything. I found the perfect apartment in no time!',
    imageUrl:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face&auto=format',
    name: 'Chindoze, Amara',
    rating: 5,
  },
  {
    title:
      'HouseBank made finding my dream home so easy. The platform is intuitive and the team was incredibly helpful!',
    imageUrl:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face&auto=format',
    name: 'Johnson, Mark',
    rating: 3,
  },
  {
    title:
      'As a Realtor, HouseBank has completely transformed how I connect with clients. Highly recommended!',
    imageUrl:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face&auto=format',
    name: 'Olivia, Chen',
    rating: 4,
  },
];

export const AuthLayout: React.FC<{}> = () => {
  const [mode] = useState<string>('light');
  return (
    <div
      className={`${mode} w-full min-h-[100vh] mx-auto grid grid-cols-1 md:grid-cols-[35%_65%] gap-2 bg-[color:var(--color-bg)] font-poppins`}
    >
      <AuthLeftPanel testimonialData={sampleData} />
      <Outlet />
    </div>
  );
};

export const Layout = () => {
  const [mode] = useState<string>('light');
  return (
    <div
      className={`${mode} w-full mx-auto h-[100vh] bg-[color:var(--color-bg)] font-poppins`}
    >
      <Header />
      <div className={`${mode} w-full`}>
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};
