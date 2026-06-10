interface AvatarProps {
  src?: string;
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export function Avatar({ src, name = 'User', size = 'md', className = '' }: AvatarProps) {
  const getInitials = (n: string) => {
    return n
      .slice(0, 2)
      .toUpperCase();
  };

  const sizes = {
    xs: 'w-6 h-6 text-[10px]',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-lg',
    xl: 'w-20 h-20 text-2xl',
  };

  return (
    <div
      className={`relative flex items-center justify-center rounded-full overflow-hidden bg-neutral-200 text-neutral-600 font-medium select-none shrink-0 dark:bg-neutral-800 dark:text-neutral-300 ${sizes[size]} ${className}`}
    >
      {src ? (
        <img
          src={src}
          alt={name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover"
          onError={(e) => {
            // Remove image layout on loading error and fallback to initials
            (e.currentTarget as HTMLImageElement).style.display = 'none';
          }}
        />
      ) : null}
      <span className="absolute">{getInitials(name)}</span>
    </div>
  );
}
