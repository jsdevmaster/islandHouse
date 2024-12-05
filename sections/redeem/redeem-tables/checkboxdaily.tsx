'use client';
import React, { useState } from 'react';

export const CheckboxDaily = ({ userId, redeemDate, checkboxStatus }: any) => {
  const [isChecked, setIsChecked] = useState(checkboxStatus);

  const handleCheckboxChange = async () => {
    const newCheckedState = !isChecked;
    setIsChecked(newCheckedState);

    try {
      const response = await checkboxDaily({
        id: userId,
        isChecked: newCheckedState,
        date: redeemDate
      });

      if (response.error) {
        return;
      }
    } catch (error) {}
  };

  const checkboxDaily = async (userData: {
    isChecked: boolean;
    id: string;
    date: any;
  }) => {
    try {
      const response = await fetch('/api/admin/checkboxdaily', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        return { error: errorData.message || 'redeem failed' };
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  };

  return (
    <div>
      <input
        type="checkbox"
        checked={isChecked}
        onChange={handleCheckboxChange}
        className="h-4 w-4 rounded"
      />
    </div>
  );
};
