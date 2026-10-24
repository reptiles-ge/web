import { decodePhoto, photoCodecs } from "./photoCodecs";
import { encodePhoto } from "./photoEncoding";

self.onmessage = async (event: MessageEvent<File>) => {
  try {
    const photo = await encodePhoto(await decodePhoto(event.data), photoCodecs);
    self.postMessage({ photo });
  } catch (error) {
    self.postMessage({
      error: error instanceof Error ? error.message : "Could not encode photo",
    });
  }
};
