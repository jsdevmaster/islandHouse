'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

export const GameLink = () => {
  const router = useRouter();

  const firekirin = () => {
    router.push('http://start.firekirin.xyz:8580/');
  };
  const gamevault = () => {
    router.push('https://download.gamevault999.com/');
  };
  const juwa = () => {
    router.push('https://dl.juwa777.com/');
  };
  const milkyway = () => {
    router.push('http://milkywayapp.xyz');
  };
  const orionstar = () => {
    router.push('http://start.orionstars.vip:8580/');
  };
  const panda = () => {
    router.push('https://www.ultrapanda.mobi/');
  };
  const vblink = () => {
    router.push('https://www.vblink777.club/');
  };
  const vagrs = () => {
    router.push('https://m.lasvegassweeps.com/');
  };
  const yolo = () => {
    router.push('https://yolo777.game');
  };
  return (
    <div className="flex w-full overflow-x-auto lg:justify-center">
      <Image
        src="/Glogo 1.png"
        width={100}
        height={100}
        alt="firekirin"
        className="hover:cursor-pointer hover:opacity-85"
        onClick={firekirin}
      />
      <Image
        src="/Glogo 2.png"
        width={100}
        height={100}
        alt="gamevault"
        className="hover:cursor-pointer hover:opacity-85"
        onClick={milkyway}
      />
      <Image
        src="/Glogo 3.jpg"
        width={100}
        height={100}
        alt="juwa"
        className="hover:cursor-pointer hover:opacity-85"
        onClick={orionstar}
      />
      <Image
        src="/Glogo 4.png"
        width={100}
        height={100}
        alt="milkyway"
        className="hover:cursor-pointer hover:opacity-85"
        onClick={juwa}
      />
      <Image
        src="/Glogo 5.jpg"
        width={100}
        height={100}
        alt="orionstar"
        className="hover:cursor-pointer hover:opacity-85"
        onClick={gamevault}
      />
      <Image
        src="/Glogo 6.png"
        width={100}
        height={100}
        alt="panda"
        className="hover:cursor-pointer hover:opacity-85"
        onClick={vagrs}
      />
      <Image
        src="/Glogo 7.png"
        width={100}
        height={100}
        alt="vblink"
        className="hover:cursor-pointer hover:opacity-85"
        onClick={yolo}
      />
      <Image
        src="/Glogo 8.png"
        width={100}
        height={100}
        alt="vegrs"
        className="hover:cursor-pointer hover:opacity-85"
        onClick={panda}
      />
      <Image
        src="/Glogo 9.png"
        width={100}
        height={100}
        alt="yolo"
        className="hover:cursor-pointer hover:opacity-85"
        onClick={vblink}
      />
    </div>
  );
};
