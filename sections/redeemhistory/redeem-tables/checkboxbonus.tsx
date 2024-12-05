'use client';
import React from 'react';

export const CheckboxBonus = (checkedStatus: any) => {
  const isChecked = checkedStatus.checkedStatus;

  return (
    <div>
      <input type="checkbox" checked={isChecked} className="h-4 w-4 rounded" />
    </div>
  );
};
