import { useCallback, useRef, useState } from "react";
import { Box, Card, Flex, Spinner, Text, useToast } from "@sanity/ui";
import { set, setIfMissing, useClient } from "sanity";
// CSP build avoids dynamic eval — required under the Studio's Content-Security-Policy.
import { heicTo } from "heic-to/csp";

const JPEG_QUALITY = 0.92;

// Browsers can't decode HEIC and Sanity's asset backend rejects it with a 422
// (Unprocessable Entity), so the file never makes it past upload. iPhones shoot
// HEIC by default, so we convert to JPEG in-browser before Sanity sees the file.
// Detected synchronously (by type/extension) so we can decide whether to
// intercept inside the capture-phase event handler; non-HEIC files fall through
// to Sanity's native upload untouched.
function looksHeic(file) {
  return (
    /image\/hei[cf]/i.test(file?.type || "") ||
    /\.(heic|heif)$/i.test(file?.name || "")
  );
}

export default function HeicImageInput(props) {
  const { onChange, renderDefault } = props;
  const client = useClient({ apiVersion: "2024-01-01" });
  const toast = useToast();
  const [converting, setConverting] = useState(false);
  const wrapperRef = useRef(null);

  const handleHeic = useCallback(
    async (file) => {
      setConverting(true);
      try {
        const jpeg = await heicTo({
          blob: file,
          type: "image/jpeg",
          quality: JPEG_QUALITY,
        });
        const filename = (file.name || "image").replace(
          /\.(heic|heif)$/i,
          ".jpg",
        );
        const asset = await client.assets.upload("image", jpeg, {
          filename,
          contentType: "image/jpeg",
        });
        onChange([
          setIfMissing({ _type: "image" }),
          set({ _type: "reference", _ref: asset._id }, ["asset"]),
        ]);
        toast.push({
          status: "success",
          title: "HEIC converted to JPEG and uploaded",
        });
      } catch (err) {
        toast.push({
          status: "error",
          title: "Couldn't convert HEIC image",
          description: err?.message || String(err),
        });
      } finally {
        setConverting(false);
      }
    },
    [client, onChange, toast],
  );

  // Capture phase fires before Sanity's own drop/change handlers, so a HEIC file
  // can be pulled out and converted before the default input tries (and fails)
  // to upload it. stopPropagation keeps Sanity from also handling the same file.
  const onDropCapture = useCallback(
    (e) => {
      const file = e.dataTransfer?.files?.[0];
      if (file && looksHeic(file)) {
        e.preventDefault();
        e.stopPropagation();
        handleHeic(file);
      }
    },
    [handleHeic],
  );

  const onChangeCapture = useCallback(
    (e) => {
      const input = e.target;
      if (input?.type !== "file") return;
      const file = input.files?.[0];
      if (file && looksHeic(file)) {
        e.preventDefault();
        e.stopPropagation();
        input.value = "";
        handleHeic(file);
      }
    },
    [handleHeic],
  );

  return (
    <div
      ref={wrapperRef}
      onDropCapture={onDropCapture}
      onChangeCapture={onChangeCapture}
      style={{ position: "relative" }}
    >
      {renderDefault(props)}
      {converting && (
        <Card
          radius={2}
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(255,255,255,0.82)",
            zIndex: 1,
          }}
        >
          <Flex
            align="center"
            justify="center"
            gap={3}
            style={{ height: "100%" }}
          >
            <Spinner muted />
            <Box>
              <Text size={1} muted>
                Converting HEIC to JPEG…
              </Text>
            </Box>
          </Flex>
        </Card>
      )}
    </div>
  );
}
