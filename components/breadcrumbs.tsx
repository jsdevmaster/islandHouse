'use client'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb';
import { Slash } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Fragment } from 'react';

type BreadcrumbItemProps = {
  title: string;
  link: string;
};

const userInfoStr = localStorage.getItem('userinfo');
const userInfo = userInfoStr ? JSON.parse(userInfoStr) : {};

export function Breadcrumbs({ items }: { items: BreadcrumbItemProps[] }) {

  const router = useRouter();

  const chatting = () => {
    router.push('/mypage/chat');
  };

  return (
    <Breadcrumb>
      {userInfo.role === "user" ?
        <div>
          <Image src="/promo/web-cover.png" width={1000} height={500} className="mb-10 w-full" alt="cover" />
          <Image
            src="/chat-image.png"
            width={60}
            height={60}
            alt="chatting"
            className="absolute right-5 top-[87vh] z-50 cursor-pointer hover:scale-105 sm:right-14 sm:top-[85vh]"
            onClick={chatting}
          />
        </div>
        : ""
      }
      <BreadcrumbList>
        {items.map((item, index) => (
          <Fragment key={item.title}>
            {index !== items.length - 1 && (
              <BreadcrumbItem>
                <BreadcrumbLink href={item.link}>{item.title}</BreadcrumbLink>
              </BreadcrumbItem>
            )}
            {index < items.length - 1 && (
              <BreadcrumbSeparator>
                <Slash />
              </BreadcrumbSeparator>
            )}
            {index === items.length - 1 && (
              <BreadcrumbPage>{item.title}</BreadcrumbPage>
            )}
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
