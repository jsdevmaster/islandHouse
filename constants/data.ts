import { NavItem } from '@/types';

export type UserRegister = {
  id: string;
  phonenumber: string;
  category: string;
  codenumber: string;
  loginid: string;
  passwordcode: string;
  date: Date;
  status: string;
};

export type Paymentredeems = {
  id: string;
  amount: number;
  btc: string;
  paymentoption: string;
  paymenttype: string;
  paymentstatus: string;
  dailyChecked: boolean;
  bonusChecked: boolean;
  date: Date;
  comdate: Date;
};

export type PaymentWithdrawals = {
  id: string;
  amount: number;
  paymentoption: string;
  paymenttype: string;
  paymentstatus: string;
  date: Date;
  comdate: Date;
};

export type AdminRegisterUsers = {
  _id: string;
  firstname: string;
  lastname: string;
  tag: number;
  email: string;
  ip: string;
  action: string;
  cashtag: string;
  venmo: string;
  paypal: string;
  zelle: string;
  bitcoin: string;
  user: any;
  register: UserRegister[];
  redeem: Paymentredeems[];
  withdrawal: PaymentWithdrawals[];
  totalAmount: any;
};

export const navItems: NavItem[] = [
  {
    title: 'Main',
    href: '/main',
    icon: 'dashboard',
    label: 'main'
  },
  {
    title: 'Register',
    href: '/main/register',
    icon: 'user',
    label: 'register'
  },
  {
    title: 'Code Verify',
    href: '/main/verify',
    icon: 'verify',
    label: 'verify'
  },
  {
    title: 'Deposit',
    icon: 'wallet',
    label: 'redeem',
    children: [
      {
        title: 'Request',
        href: '/main/redeem',
        icon: 'wallet',
        label: 'redeemRequest'
      },
      {
        title: 'History',
        href: '/main/redeemhistory',
        icon: 'notebookpen',
        label: 'redeemHistory'
      }
    ]
  },
  {
    title: 'Withdrawal',
    icon: 'wallet2',
    label: 'withdrawal',
    children: [
      {
        title: 'Request',
        href: '/main/withdrawal',
        icon: 'wallet2',
        label: 'withdrawalRequest'
      },
      {
        title: 'History',
        href: '/main/withdrawalhistory',
        icon: 'notebookpen',
        label: 'withdrawalHistory'
      }
    ]
  },
  {
    title: 'Payment Setting',
    href: '/main/cashappinfo',
    icon: 'settings',
    label: 'setting'
  },
  {
    title: 'User',
    href: '/main/user',
    icon: 'user2',
    label: 'user'
  },
  {
    title: 'Banned List',
    href: '/main/bannedlist',
    icon: 'warning',
    label: 'banned list'
  }
];

export const userNavItems: NavItem[] = [
  {
    title: 'Promotion',
    href: '/mypage',
    icon: 'product',
    label: 'mypage'
  },
  {
    title: 'Mypage',
    href: '/mypage/promotion',
    icon: 'userPen',
    label: 'promotion'
  },
  {
    title: 'Register',
    href: '/mypage/register',
    icon: 'user',
    label: 'register'
  },
  {
    title: 'Deposit',
    href: '/mypage/deposit',
    icon: 'wallet',
    label: 'redeem'
  },
  {
    title: 'Withdrawal',
    href: '/mypage/withdrawal',
    icon: 'wallet2',
    label: 'withdrawal'
  }
];
