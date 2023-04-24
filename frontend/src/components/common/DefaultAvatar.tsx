import "../../styles/components/common.scss";

interface PropsType {
  type: "TEAM" | "USER";
  width: number;
  height: number;
  imageUrl?: string | null;
  uniqueNum?: number;
  alt: string;
}

const DefaultAvatar = ({
  width,
  height,
  uniqueNum = 0,
  imageUrl = null,
  alt,
  type,
}: PropsType) => {
  const getDefaultImg = () => {
    const colorUnit = uniqueNum % 5;

    if (type === "TEAM") {
      if (colorUnit === 0) return "/icons/default-team-avatar-pupple.svg";
      if (colorUnit === 1) return "/icons/default-team-avatar-blue.svg";
      if (colorUnit === 2) return "/icons/dafault-team-avatar-green.svg";
      if (colorUnit === 3) return "/icons/default-team-avatar-yellow.svg";
      if (colorUnit === 4) return "/icons/default-team-avatar-red.svg";
    }

    if (type === "USER") {
      if (colorUnit === 0) return "/icons/default-user-avatar-pupple.svg";
      if (colorUnit === 1) return "/icons/default-user-avatar-blue.svg";
      if (colorUnit === 2) return "/icons/default-user-avatar-green.svg";
      if (colorUnit === 3) return "/icons/default-user-avatar-yellow.svg";
      if (colorUnit === 4) return "/icons/default-user-avatar-red.svg";
    }
  };

  return (
    <span className="default-avatar">
      <img
        src={imageUrl ? `${imageUrl}` : `${getDefaultImg()}`}
        width={width}
        height={height}
        alt={alt}
      />
    </span>
  );
};

export default DefaultAvatar;
