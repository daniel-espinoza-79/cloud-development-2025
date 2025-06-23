interface AvatarProps {
  titleName: string | null | undefined;
}

const Avatar = ({ titleName }: AvatarProps) => {
  const getInitials = (name: string | null | undefined) => {

    if (!name) {
      return "UN";
    }

    const names = name.split(" ");
    if (names.length === 1) {
      return names[0].slice(0, 2).toUpperCase();
    }
    const initials = names
      .slice(0, 2)
      .map((name) => name.charAt(0).toUpperCase())
      .join("");
    return initials;
  };

  const initials = getInitials(titleName);
  return (
    <div className="w-10 h-10 degrade-main-color rounded-full flex items-center justify-center shadow-md">
      <span className="text-white font-semibold text-sm">{initials}</span>
    </div>
  );
};

export default Avatar;
