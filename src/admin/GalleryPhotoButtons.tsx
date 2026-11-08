import { Space } from "antd";
import { type ComponentProps, useRef } from "react";

import { PhotoCandidatesButton } from "./PhotoCandidatesButton";
import { PhotoUploadButton, type PhotoUploadHandle } from "./PhotoUploadButton";

export function GalleryPhotoButtons({
  gallery,
  id,
  onSessionExpired,
  onUploaded,
  scientificName,
}: {
  gallery: ComponentProps<typeof PhotoCandidatesButton>["gallery"];
  id: string;
  onSessionExpired: () => void;
  onUploaded: () => void;
  scientificName: string;
}) {
  const upload = useRef<PhotoUploadHandle>(null);
  return (
    <Space wrap>
      <PhotoUploadButton
        id={id}
        onSessionExpired={onSessionExpired}
        onUploaded={onUploaded}
        ref={upload}
      />
      <PhotoCandidatesButton
        gallery={gallery}
        id={id}
        onPicked={(result, observationUrl) =>
          upload.current?.openWith(result, observationUrl)
        }
        onSessionExpired={onSessionExpired}
        scientificName={scientificName}
      />
    </Space>
  );
}
