import LogoIcon from '@/components/icons/logo';

export default function LogoSquare({ size }: { size?: 'sm' | number }) {
  return (
    <div
      className={`flex flex-none items-center justify-center border border-neutral-200 bg-white dark:border-neutral-700 dark:bg-black ${
        size === 'sm' ? 'h-[40px] w-[40px] rounded-xl' : 'h-full w-full rounded-lg'
      }`}
      style={
        typeof size === 'number'
          ? {
              height: `${size}px`,
              width: `${size}px`
            }
          : {}
      }
    >
      <LogoIcon
        className={
          size === 'sm' ? 'h-[16px] w-[16px]' : 'h-[20px] w-[20px]'
        }
      />
    </div>
  );
}