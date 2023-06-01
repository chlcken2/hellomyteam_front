import DefaultAvatar from "components/common/DefaultAvatar";
import ImageCropper from "components/common/ImageCropper";
import {
  useRegistTeamBannerImageMutation,
  useRegistTeamProfileImageMutation,
} from "quires/profile/useTeamProfileMutation";
import {
  useGetTeamBannerImageQuery,
  useGetTeamProfileImageQuery,
  useGetTeamProfileInfoQuery,
} from "quires/profile/useTeamProfileQuery";
import { FC, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import UserState from "recoil/userAtom";

import "styles/pages/profile.scss";
import { ProfileInfoType } from "types/profileType";
import { base64toFile, formatBirthday } from "utils/common";

const TEMP_TEAM_MEMBER_INFO_ID = 142;

const Profile: FC = () => {
  const navigate = useNavigate();
  const user = useRecoilValue(UserState);
  const [profileInfo, setProfileInfo] = useState<ProfileInfoType>(null);
  const [profileImage, setProfileImage] = useState<string>(null);
  const [bannerImage, setBannerImage] = useState<string>(null);
  const [bannerColor, setBannerColor] = useState<string>(null);

  const { data: bannerImageData } = useGetTeamBannerImageQuery({
    teamMemberInfoId: TEMP_TEAM_MEMBER_INFO_ID,
  });

  const { data: profileImageData } = useGetTeamProfileImageQuery({
    teamMemberInfoId: TEMP_TEAM_MEMBER_INFO_ID,
  });

  const { data: profileInfoData } = useGetTeamProfileInfoQuery({
    teamMemberInfoId: TEMP_TEAM_MEMBER_INFO_ID,
    teamId: user?.selectedTeamId,
  });

  const { mutate: registProfileImage } = useRegistTeamProfileImageMutation(
    TEMP_TEAM_MEMBER_INFO_ID,
  );

  const { mutate: registBannerImage } = useRegistTeamBannerImageMutation(
    TEMP_TEAM_MEMBER_INFO_ID,
  );

  const navigateProfileEditPage = () => navigate("/profile/edit");

  const uploadProfileImage = (image: string) => {
    const imageFile = base64toFile(image, "profile_image");
    const formData = new FormData();
    formData.append("imgFile", imageFile);

    registProfileImage(formData);
  };

  const uploadBannerImage = (image: string) => {
    const imageFile = base64toFile(image, "profile_image");
    const formData = new FormData();
    formData.append("imgFile", imageFile);

    registBannerImage(formData);
  };

  const getAverageColor = (): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "Anonymous";
      img.src = profileImage;

      img.onload = () => {
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");

        if (!context) {
          return;
        }

        const { width, height } = img;

        canvas.width = width;
        canvas.height = height;

        context.drawImage(img, 0, 0, width, height);

        const imageData = context.getImageData(0, 0, width, height);
        const rgb = getRGB(imageData.data);

        resolve(rgb);
      };

      img.onerror = (err) => {
        console.log(err, "dd");
        reject(err);
      };
    });
  };

  const getRGB = (imageData: Uint8ClampedArray) => {
    let r = 0;
    let g = 0;
    let b = 0;

    for (let i = 0; i < imageData.length; i += 4) {
      r += imageData[i];
      g += imageData[i + 1];
      b += imageData[i + 2];
    }

    const pixelCount = imageData.length / 4;
    const avgR = Math.floor(r / pixelCount);
    const avgG = Math.floor(g / pixelCount);
    const avgB = Math.floor(b / pixelCount);

    return `rgb(${avgR}, ${avgG}, ${avgB})`;
  };

  useEffect(() => {
    if (profileImage && !bannerImage) {
      getAverageColor().then((color) => {
        setBannerColor(color);
      });
    }
  }, [profileImage, bannerImage]);

  console.log(profileImageData);

  useEffect(() => {
    if (profileImageData?.data) {
      setProfileImage(profileImageData.data.imgUrl);
    }
  }, [profileImageData]);

  useEffect(() => {
    if (bannerImageData?.data) {
      setBannerImage(bannerImageData.data.imgUrl);
    }
  }, [bannerImageData]);

  useEffect(() => {
    if (profileInfoData?.data) {
      setProfileInfo(profileInfoData.data);
    }
  }, [profileInfoData]);

  return (
    <div className="profile-container">
      <div
        className="profile-banner"
        style={bannerColor ? { backgroundColor: bannerColor } : null}
      >
        {bannerImage && (
          <img src={bannerImage} alt="banner" className="profile-banner-img" />
        )}
        <ImageCropper aspectRatio={4.0625 / 1} onCrop={uploadBannerImage}>
          <button className="profile-banner-edit-button">
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10.0003 14.5833C11.042 14.5833 11.9275 14.2186 12.657 13.4892C13.3864 12.7597 13.7509 11.8744 13.7503 10.8333C13.7503 9.79167 13.3856 8.90611 12.6562 8.17667C11.9267 7.44722 11.0414 7.08278 10.0003 7.08333C8.95866 7.08333 8.0731 7.44806 7.34366 8.1775C6.61422 8.90694 6.24977 9.79222 6.25033 10.8333C6.25033 11.875 6.61505 12.7606 7.34449 13.49C8.07394 14.2194 8.95922 14.5839 10.0003 14.5833ZM10.0003 12.9167C9.41699 12.9167 8.92394 12.7153 8.52116 12.3125C8.11838 11.9097 7.91699 11.4167 7.91699 10.8333C7.91699 10.25 8.11838 9.75694 8.52116 9.35417C8.92394 8.95139 9.41699 8.75 10.0003 8.75C10.5837 8.75 11.0767 8.95139 11.4795 9.35417C11.8823 9.75694 12.0837 10.25 12.0837 10.8333C12.0837 11.4167 11.8823 11.9097 11.4795 12.3125C11.0767 12.7153 10.5837 12.9167 10.0003 12.9167ZM3.33366 17.5C2.87533 17.5 2.48283 17.3367 2.15616 17.01C1.82949 16.6833 1.66644 16.2911 1.66699 15.8333V5.83333C1.66699 5.375 1.83033 4.9825 2.15699 4.65583C2.48366 4.32917 2.87588 4.16611 3.33366 4.16667H5.95866L7.50033 2.5H12.5003L14.042 4.16667H16.667C17.1253 4.16667 17.5178 4.33 17.8445 4.65667C18.1712 4.98333 18.3342 5.37556 18.3337 5.83333V15.8333C18.3337 16.2917 18.1703 16.6842 17.8437 17.0108C17.517 17.3375 17.1248 17.5006 16.667 17.5H3.33366ZM16.667 15.8333V5.83333H13.292L11.7712 4.16667H8.22949L6.70866 5.83333H3.33366V15.8333H16.667Z"
                fill="white"
              />
            </svg>
          </button>
        </ImageCropper>
      </div>
      <div className="profile-info-container">
        <div className="profile-intro-img-wrapper">
          <div className="profile-intro-img">
            {profileImage ? (
              <img src={profileImage} alt="profile" />
            ) : (
              <DefaultAvatar
                width={120}
                height={120}
                alt="avatar"
                type="USER"
                uniqueNum={0}
              />
            )}
          </div>
          <ImageCropper aspectRatio={1 / 1} onCrop={uploadProfileImage}>
            <button className="profile-intro-img-edit-button">
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10.0003 14.5833C11.042 14.5833 11.9275 14.2186 12.657 13.4892C13.3864 12.7597 13.7509 11.8744 13.7503 10.8333C13.7503 9.79167 13.3856 8.90611 12.6562 8.17667C11.9267 7.44722 11.0414 7.08278 10.0003 7.08333C8.95866 7.08333 8.0731 7.44806 7.34366 8.1775C6.61422 8.90694 6.24977 9.79222 6.25033 10.8333C6.25033 11.875 6.61505 12.7606 7.34449 13.49C8.07394 14.2194 8.95922 14.5839 10.0003 14.5833ZM10.0003 12.9167C9.41699 12.9167 8.92394 12.7153 8.52116 12.3125C8.11838 11.9097 7.91699 11.4167 7.91699 10.8333C7.91699 10.25 8.11838 9.75694 8.52116 9.35417C8.92394 8.95139 9.41699 8.75 10.0003 8.75C10.5837 8.75 11.0767 8.95139 11.4795 9.35417C11.8823 9.75694 12.0837 10.25 12.0837 10.8333C12.0837 11.4167 11.8823 11.9097 11.4795 12.3125C11.0767 12.7153 10.5837 12.9167 10.0003 12.9167ZM3.33366 17.5C2.87533 17.5 2.48283 17.3367 2.15616 17.01C1.82949 16.6833 1.66644 16.2911 1.66699 15.8333V5.83333C1.66699 5.375 1.83033 4.9825 2.15699 4.65583C2.48366 4.32917 2.87588 4.16611 3.33366 4.16667H5.95866L7.50033 2.5H12.5003L14.042 4.16667H16.667C17.1253 4.16667 17.5178 4.33 17.8445 4.65667C18.1712 4.98333 18.3342 5.37556 18.3337 5.83333V15.8333C18.3337 16.2917 18.1703 16.6842 17.8437 17.0108C17.517 17.3375 17.1248 17.5006 16.667 17.5H3.33366ZM16.667 15.8333V5.83333H13.292L11.7712 4.16667H8.22949L6.70866 5.83333H3.33366V15.8333H16.667Z"
                  fill="white"
                />
              </svg>
            </button>
          </ImageCropper>
        </div>
        <button onClick={navigateProfileEditPage} className="profile-edit-button">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M15.232 5.23233L18.768 8.76833M16.732 3.73233C17.2009 3.26343 17.8369 3 18.5 3C19.1631 3 19.7991 3.26343 20.268 3.73233C20.7369 4.20123 21.0003 4.8372 21.0003 5.50033C21.0003 6.16346 20.7369 6.79943 20.268 7.26833L6.5 21.0363H3V17.4643L16.732 3.73233V3.73233Z"
              stroke="#7A7A7A"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <h2 className="profile-intro-name">{profileInfo?.name}</h2>
        <p className="profile-intro-message">
          {profileInfo?.memberOneIntro || "한줄소개 미등록"}
        </p>
        <div className="profile-intro-state">
          {profileInfo?.conditionStatus || "상태 미등록"}
        </div>
        <div className="profile-info-card-container">
          <div className="profile-info-card">
            <h3 className="info-title">기본</h3>
            <div className="info-container">
              <div className="info-wrapper">
                <div className="info-label">활동 지역</div>
                <div className="info-content">미등록</div>
              </div>
              <div className="info-wrapper">
                <div className="info-label">휴대폰 번호</div>
                <div className="info-content">{profileInfo?.phone || "미등록"}</div>
              </div>
              <div className="info-wrapper">
                <div className="info-label">생년월일</div>
                <div className="info-content">
                  {profileInfo?.birthday
                    ? formatBirthday(profileInfo?.birthday)
                    : "미등록"}
                </div>
              </div>
            </div>
          </div>
          <div className="profile-info-card">
            <h3 className="info-title">팀</h3>
            <div className="info-container">
              <div className="info-wrapper">
                <div className="info-label">등번호</div>
                <div className="info-content">{profileInfo?.backNumber || "미등록"}</div>
              </div>
              <div className="info-wrapper">
                <div className="info-label">선호 포지션</div>
                <div className="info-content">
                  {profileInfo?.preferPosition || "미등록"}
                </div>
              </div>
              <div className="info-wrapper">
                <div className="info-label">약발 정보</div>
                <div className="info-content">
                  {profileInfo?.leftRightFoot || "미등록"}
                </div>
              </div>
            </div>
          </div>
          <div className="profile-info-card">
            <h3 className="info-title">기타</h3>
            <div className="info-container">
              <div className="info-wrapper">
                <div className="info-label">컨디션</div>
                <div className="info-content">
                  {profileInfo?.conditionIndicator || "미등록"}
                </div>
              </div>
              <div className="info-wrapper">
                <div className="info-label">주량</div>
                <div className="info-content">
                  {profileInfo?.drinkingCapacity || "미등록"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
