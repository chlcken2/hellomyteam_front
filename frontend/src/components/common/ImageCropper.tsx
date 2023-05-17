import { createRef, useRef, useState } from "react";
import Cropper, { ReactCropperElement } from "react-cropper";
import "cropperjs/dist/cropper.css";
import Button from "./Button";

interface PropsType {
  onCrop: (image: string) => void;
  aspectRatio: number;
  children: React.ReactNode;
}

const ImageCropper = ({ children, aspectRatio, onCrop }: PropsType) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [image, setImage] = useState<null | string>(null);
  const cropperRef = createRef<ReactCropperElement>();

  const handleButtonClick = () => {
    inputRef.current.click();
  };

  const handleFileChange = (e: any) => {
    e.preventDefault();
    let files;
    if (e.dataTransfer) {
      files = e.dataTransfer.files;
    } else if (e.target) {
      files = e.target.files;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result as string);
    };
    reader.readAsDataURL(files[0]);
  };

  const getCropData = () => {
    if (typeof cropperRef.current?.cropper !== "undefined") {
      onCrop(cropperRef.current?.cropper.getCroppedCanvas().toDataURL());
      setImage(null);
    }
  };

  return (
    <>
      <input
        type="file"
        ref={inputRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
      <div role="presentation" onClick={handleButtonClick}>
        {children}
      </div>
      {image && (
        <div className="image-cropper-container">
          <div className="backdrop" />
          <div className="image-cropper-modal">
            <h3>이미지 편집하기</h3>
            <div className="image-cropper-modal-content-wrapper">
              <div className="image-cropper-modal-content">
                <Cropper
                  ref={cropperRef}
                  aspectRatio={aspectRatio}
                  src={image}
                  viewMode={1}
                  width={800}
                  height={500}
                  background={false}
                  responsive
                  autoCropArea={1}
                  checkOrientation={false}
                  guides
                />
              </div>
            </div>
            <div className="image-cropper-modal-footer">
              <Button
                color="white"
                text="취소"
                handler={() => {
                  setImage(null);
                }}
              />
              <Button color="blue" text="적용하기" handler={getCropData} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ImageCropper;
