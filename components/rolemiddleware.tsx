'use client';

import React from 'react';
import NotFound from '@/app/not-found';

export default function RoleMiddleware({
  children,
  accessRight
}: {
  children: React.ReactNode;
  accessRight: string;
}) {
  const userInfoStr = localStorage.getItem('userinfo');
  const userInfo = userInfoStr ? JSON.parse(userInfoStr) : {};

  if (userInfo.role === accessRight || !userInfo.role) {
    return (<div>
      {children}</div>);
  } else {
    return <NotFound />;
  };
}
