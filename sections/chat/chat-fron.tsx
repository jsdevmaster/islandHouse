'use client';

import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function UserChat() {
  const router = useRouter();

  const facebook = () => {
    router.push(
      'https://www.facebook.com/profile.php?id=61564819906157&mibextid=ZbWKwL'
    );
  };

  const instagram = () => {
    router.push('https://www.instagram.com/islandhouse2000/');
  };

  const goback = () => {
    router.push('/mypage');
  };

  return (
    <div>
      <div className="mt-10 w-full rounded-xl border border-4 border-solid border-gray-200 bg-blue-400 p-3">
        <p className="mt-2 text-center text-sm font-semibold text-white ">
          Sorry, chat function will be added soon! Until then, please use
          Instagram and Facebook🙂
        </p>
      </div>
      <div className="lg:evenly mt-10 flex justify-evenly">
        <Image
          src="/facebook.png"
          width={100}
          height={100}
          className="hover:cursor-pointer hover:opacity-80"
          onClick={facebook}
          alt="facebook"
        ></Image>
        <Image
          src="/instagram.png"
          width={100}
          height={100}
          className="hover:cursor-pointer hover:opacity-80"
          onClick={instagram}
          alt="instagram"
        ></Image>
      </div>
      <div className="mt-10 flex justify-center">
        <Button
          variant="default"
          handleClick={goback}
          className="w-[80vw] text-white"
        >
          Back to Main Page
        </Button>
      </div>
    </div>
  );
}
