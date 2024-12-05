// UserRegistrationForm.client.js
'use client'; // Ensures this is recognized as a client component
import { Button } from '@/components/ui/button';
import { useState, useRef, useTransition, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';

export default function CashAppInfoPageView() {
  const [cashtag, setCashtag] = useState("");
  const [paypalV, setPaypal] = useState("");
  const [venmoV, setVenmo] = useState("");
  const [zelleV, setZelle] = useState("");
  const [bitcoinV, setBitcoin] = useState("");
  const [loading, startTransition] = useTransition();
  const [cashapptag, setCashapptag] = useState(cashtag);
  const [paypalvalue, setPaypalValue] = useState(paypalV);
  const [venmovalue, setVenmoValue] = useState(venmoV);
  const [zellevalue, setZelleValue] = useState(zelleV);
  const [bitcoinvalue, setBitcoinValue] = useState(bitcoinV);

  const userInfoStr = localStorage.getItem('userinfo');
  const userInfo = userInfoStr ? JSON.parse(userInfoStr) : {};

  const cashappinfo = async () => {
    startTransition(async () => {
      try {
        const response = await cash({
          cashtag: cashapptag,
          token: userInfo.token
        });

        if (response.error) {
          console.error('Cashapptag updated error:', response.error);
          return;
        }

        toast({
          title: 'Cashapptag update successful!',
          description: 'Welcome! Your cashtag have updated successfully.'
        });

        location.reload();
      } catch (error) {
        toast({
          title: 'Chahapptag update failed!',
          description: 'Chahapptag update failed. Please try again!'
        });
      }
    });
  };

  const cash = async (userData: { cashtag: any; token: string }) => {
    try {
      const response = await fetch('/api/admin/cashapptag', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        return { error: errorData.message || 'Cashapptag update failed' };
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  };

  const paypalinfo = async () => {
    startTransition(async () => {
      try {
        const response = await paypaldata({
          paypal: paypalvalue,
          token: userInfo.token
        });

        if (response.error) {
          console.error('Paypal updated error:', response.error);
          return;
        }

        toast({
          title: 'Paypal update successful!',
          description: 'Welcome! Your paypal have updated successfully.'
        });

        location.reload();
      } catch (error) {
        toast({
          title: 'Paypal update failed!',
          description: 'Paypal update failed. Please try again!'
        });
      }
    });
  };

  const paypaldata = async (userData: { paypal: any; token: string }) => {
    try {
      const response = await fetch('/api/admin/paypal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        return { error: errorData.message || 'Cashapptag update failed' };
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  };

  const venmoinfo = async () => {
    startTransition(async () => {
      try {
        const response = await venmodata({
          venmo: venmovalue,
          token: userInfo.token
        });

        if (response.error) {
          return;
        }

        toast({
          title: 'Venmo update successful!',
          description: 'Welcome! Your Venmo have updated successfully.'
        });

        location.reload();
      } catch (error) {
        toast({
          title: 'Venmo update failed!',
          description: 'Venmo update failed. Please try again!'
        });
      }
    });
  };

  const venmodata = async (userData: { venmo: any; token: string }) => {
    try {
      const response = await fetch('/api/admin/venmo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        return { error: errorData.message || 'Cashapptag update failed' };
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  };

  const zelleinfo = async () => {
    startTransition(async () => {
      try {
        const response = await zelledata({
          zelle: zellevalue,
          token: userInfo.token
        });

        if (response.error) {
          return;
        }

        toast({
          title: 'Zelle update successful!',
          description: 'Welcome! Your zelle have updated successfully.'
        });

        location.reload();
      } catch (error) {
        toast({
          title: 'Zelle update failed!',
          description: 'Zelle update failed. Please try again!'
        });
      }
    });
  };

  const zelledata = async (userData: { zelle: any; token: string }) => {
    try {
      const response = await fetch('/api/admin/zelle', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        return { error: errorData.message || 'Cashapptag update failed' };
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  };

  const bitcoininfo = async () => {
    startTransition(async () => {
      try {
        const response = await bitcoindata({
          bitcoin: bitcoinvalue,
          token: userInfo.token
        });

        if (response.error) {
          return;
        }

        toast({
          title: 'Bitcoin update successful!',
          description:
            'Welcome! Your bidcoin address have updated successfully.'
        });

        location.reload();
      } catch (error) {
        toast({
          title: 'Bitcoin address update failed!',
          description: 'Bitcoin address update failed. Please try again!'
        });
      }
    });
  };

  const bitcoindata = async (userData: { bitcoin: any; token: string }) => {
    try {
      const response = await fetch('/api/admin/bitcoin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        return { error: errorData.message || 'Cashapptag update failed' };
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/api/admin/getadmin'); // Replace with your API endpoint
        const result = await response.json();
        setCashtag(result.data[0].cashtag);
        setPaypal(result.data[0].paypal);
        setVenmo(result.data[0].venmo);
        setZelle(result.data[0].zelle);
        setBitcoin(result.data[0].bitcoin);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Replace with a spinner or loading message if needed
  }

  return (
    <div>
      <div className="mt-16 flex items-center justify-center">
        <p className="w-[100px]">CashApp:</p>
        <input
          type="text"
          defaultValue={cashtag}
          className="w-1/3 rounded-md border p-2 text-center outline-none"
          onChange={(e) => {
            setCashapptag(e.target.value);
          }}
        />
        <Button
          className="ml-[10px] w-[20%] border p-5 text-white"
          handleClick={cashappinfo}
        >
          OK
        </Button>
      </div>
      <div className="mt-3 flex items-center justify-center">
        <p className="w-[100px]">Paypal:</p>
        <input
          type="text"
          defaultValue={paypalV}
          className="w-1/3 rounded-md border p-2 text-center outline-none"
          onChange={(e) => {
            setPaypalValue(e.target.value);
          }}
        />
        <Button
          className="ml-[10px] w-[20%] border p-5 text-white"
          handleClick={paypalinfo}
        >
          OK
        </Button>
      </div>
      <div className="mt-3 flex items-center justify-center">
        <p className="w-[100px]">Venmo:</p>
        <input
          type="text"
          defaultValue={venmoV}
          className="w-1/3 rounded-md border p-2 text-center outline-none"
          onChange={(e) => {
            setVenmoValue(e.target.value);
          }}
        />
        <Button
          className="ml-[10px] w-[20%] border p-5 text-white"
          handleClick={venmoinfo}
        >
          OK
        </Button>
      </div>
      <div className="mt-3 flex items-center justify-center">
        <p className="w-[100px]">Zelle:</p>
        <input
          type="text"
          defaultValue={zelleV}
          className="w-1/3 rounded-md border p-2 text-center outline-none"
          onChange={(e) => {
            setZelleValue(e.target.value);
          }}
        />
        <Button
          className="ml-[10px] w-[20%] border p-5 text-white"
          handleClick={zelleinfo}
        >
          OK
        </Button>
      </div>
      <div className="mt-3 flex items-center justify-center">
        <p className="w-[100px]">Bitcoin:</p>
        <input
          type="text"
          defaultValue={bitcoinV}
          className="w-1/3 rounded-md border p-2 text-center outline-none"
          onChange={(e) => {
            setBitcoinValue(e.target.value);
          }}
        />
        <Button
          className="ml-[10px] w-[20%] border p-5 text-white"
          handleClick={bitcoininfo}
        >
          OK
        </Button>
      </div>
    </div>
  );
}
