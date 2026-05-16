import { useState, useCallback, useRef } from "react";
import {
  Stack,
  Card,
  Text,
  Spinner,
  Flex,
  Box,
  Dialog,
  Button,
} from "@sanity/ui";
import { useFormValue } from "sanity";

// Anthropic Clay (official brand color used for the Claude Spark).
const CLAY = "#D97757";
const CLAY_DEEP = "#B85F42";

const ENDPOINT = process.env.SANITY_STUDIO_EXTRACT_ENDPOINT;
const SECRET = process.env.SANITY_STUDIO_EXTRACT_SECRET;

// Official Claude Spark mark from Anthropic's media kit.
function ClaudeMark({ size = 56, color = CLAY }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 94 94"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M18.7657 62.4437L37.1822 52.1167L37.4857 51.2122L37.1822 50.7085H36.2715L33.1852 50.5208L22.6615 50.2391L13.5545 49.8636L4.70044 49.3942L2.47428 48.9248L0.399902 46.1553L0.602281 44.794L2.47428 43.5266L5.15579 43.7613L11.0754 44.1837L19.98 44.794L26.4055 45.1695L35.9679 46.1553H37.4857L37.6881 45.545L37.1822 45.1695L36.7774 44.794L27.5692 38.5508L17.6021 31.9791L12.3908 28.1769L9.60812 26.2524L8.19147 24.4686L7.58433 20.5256L10.1141 17.7091L13.5545 17.9438L14.4146 18.1785L17.9056 20.8542L25.343 26.6279L35.0572 33.7629L36.4739 34.9364L37.0443 34.5514L37.1316 34.2792L36.4739 33.1996L31.212 23.6706L25.596 13.9539L23.0663 9.91695L22.4086 7.52296C22.1538 6.51831 22.0038 5.68714 22.0038 4.65957L24.8877 0.716544L26.5067 0.200195L30.4025 0.716544L32.0215 2.12477L34.4501 7.66379L38.3458 16.3478L44.4172 28.1769L46.188 31.6975L47.1493 34.9364L47.5035 35.9222H48.1106V35.3589L48.6166 28.6933L49.5273 20.5256L50.438 10.0108L50.7415 7.05356L52.2088 3.48605L55.1433 1.56148L57.42 2.64112L59.292 5.31674L59.039 7.05356L57.926 14.2824L55.7504 25.5952L54.3337 33.1996H55.1433L56.1046 32.2138L59.9497 27.1442L66.3752 19.0704L69.2085 15.8784L72.5478 12.3579L74.6728 10.668H78.7203L81.6548 15.0804L80.3394 19.6337L76.1906 24.8911L72.7502 29.3504L67.8172 35.9595L64.7562 41.2734L65.0307 41.7118L65.7681 41.6489L76.8989 39.255L82.9197 38.1753L90.1041 36.9549L93.3422 38.457L93.6963 40.006L92.4315 43.151L84.7411 45.0287L75.7353 46.8594L62.3244 50.0164L62.1759 50.1358L62.3512 50.3958L68.399 50.9432L70.9794 51.084H77.3037L89.0922 51.9759L92.1785 53.9944L93.9999 56.4822L93.6963 58.4068L88.9404 60.8008L82.5655 59.2987L67.6401 55.7312L62.5301 54.4638H61.8217V54.8862L66.0717 59.064L73.9139 66.1051L83.6786 75.2116L84.1845 77.4648L82.9197 79.2485L81.6042 79.0608L73.0032 72.5829L69.6639 69.6726L62.1759 63.3356H61.67V63.9928L63.3902 66.5276L72.5478 80.2812L73.0032 84.5059L72.3454 85.8672L69.9675 86.7121L67.3871 86.2427L61.9735 78.6852L56.4587 70.2359L52.0064 62.6315L51.4687 62.971L48.8189 91.2654L47.6047 92.7206L44.7714 93.8002L42.3934 92.0164L41.1286 89.1061L42.3934 83.3324L43.9113 75.8219L45.1255 69.8604L46.2386 62.4437L46.9184 59.9661L46.8583 59.8003L46.3153 59.8916L40.7238 67.5603L32.2239 79.0608L25.4948 86.2427L23.8758 86.8999L21.0931 85.4447L21.3461 82.863L22.9145 80.5629L32.2239 68.7338L37.8399 61.3641L41.4594 57.1337L41.4242 56.5218L41.2244 56.5048L16.489 72.6299L12.0873 73.1932L10.1647 71.4094L10.4176 68.4991L11.3283 67.5603L18.7657 62.4437Z"
        fill={color}
      />
    </svg>
  );
}

function UploadIcon({ size = 14 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M8 10.5V2.5M8 2.5L4.5 6M8 2.5L11.5 6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2.5 10.5V12.5C2.5 13.0523 2.94772 13.5 3.5 13.5H12.5C13.0523 13.5 13.5 13.0523 13.5 12.5V10.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ImageIcon({ size = 14 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect
        x="2"
        y="3"
        width="12"
        height="10"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="1.25"
      />
      <circle cx="6" cy="7" r="1" fill="currentColor" />
      <path
        d="M3 12L6.5 8.5L9 11L11 9L13 11.5"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(reader.error);
    reader.onload = () => {
      const result = reader.result || "";
      const comma = String(result).indexOf(",");
      resolve(String(result).slice(comma + 1));
    };
    reader.readAsDataURL(file);
  });
}

export default function AiImportField() {
  const documentId = useFormValue(["_id"]);
  const title = useFormValue(["title"]);

  // Lock hero-vs-compact on first mount so typing into the Title field
  // doesn't yank the layout from a 200px hero card to a 50px bar mid-edit.
  // Captured synchronously on first render via useState's lazy initializer:
  // existing docs see the title and start in compact; new docs have no title
  // and stay in hero for the whole session.
  const [compact] = useState(() => !!title);

  const fileInputRef = useRef(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [warnings, setWarnings] = useState([]);
  const [success, setSuccess] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [hover, setHover] = useState(false);
  // Pending file awaiting overwrite confirmation (compact mode only).
  const [pendingFile, setPendingFile] = useState(null);
  const [pendingPreviewUrl, setPendingPreviewUrl] = useState(null);

  const handleFile = useCallback(
    async (file) => {
      if (!file || !documentId) return;
      if (!file.type?.startsWith("image/")) {
        setError(`File "${file.name}" is not an image`);
        return;
      }
      if (!ENDPOINT || !SECRET) {
        setError(
          "Studio is missing SANITY_STUDIO_EXTRACT_ENDPOINT / SANITY_STUDIO_EXTRACT_SECRET",
        );
        return;
      }
      setSubmitting(true);
      setError(null);
      setWarnings([]);
      setSuccess(false);
      try {
        const imageBase64 = await fileToBase64(file);
        const res = await fetch(ENDPOINT, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${SECRET}`,
          },
          body: JSON.stringify({
            imageBase64,
            mediaType: file.type || "image/jpeg",
            targetDocumentId: documentId,
          }),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
        if (data.warnings?.length) setWarnings(data.warnings);
        else setSuccess(true);
      } catch (err) {
        setError(err.message || String(err));
      } finally {
        setSubmitting(false);
      }
    },
    [documentId],
  );

  // Gate file processing: in compact (overwrite) mode, prompt for confirmation
  // first so the user doesn't accidentally wipe their existing recipe.
  const requestFile = useCallback(
    (file) => {
      if (!file) return;
      if (compact) {
        setError(null);
        setWarnings([]);
        setPendingFile(file);
        setPendingPreviewUrl(URL.createObjectURL(file));
      } else {
        handleFile(file);
      }
    },
    [compact, handleFile],
  );

  const cancelPending = () => {
    if (pendingPreviewUrl) URL.revokeObjectURL(pendingPreviewUrl);
    setPendingFile(null);
    setPendingPreviewUrl(null);
  };

  const confirmPending = () => {
    const f = pendingFile;
    if (pendingPreviewUrl) URL.revokeObjectURL(pendingPreviewUrl);
    setPendingFile(null);
    setPendingPreviewUrl(null);
    if (f) handleFile(f);
  };

  const onPick = (e) => {
    requestFile(e.target.files?.[0]);
    e.target.value = "";
  };
  const onClick = () => {
    if (submitting || !documentId) return;
    fileInputRef.current?.click();
  };
  const onKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onClick();
    }
  };
  const onDragOver = (e) => {
    e.preventDefault();
    if (!submitting) setDragOver(true);
  };
  const onDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };
  const onDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (submitting) return;
    const file = e.dataTransfer?.files?.[0];
    if (file) requestFile(file);
  };
  const onPaste = (e) => {
    if (submitting) return;
    const item = Array.from(e.clipboardData?.items || []).find((i) =>
      i.type?.startsWith("image/"),
    );
    if (!item) return;
    const file = item.getAsFile();
    if (file) {
      e.preventDefault();
      requestFile(file);
    }
  };

  const active = dragOver || hover;
  const bg = dragOver
    ? "rgba(217, 119, 87, 0.22)"
    : hover
      ? "rgba(217, 119, 87, 0.14)"
      : "rgba(217, 119, 87, 0.08)";

  const sharedCardHandlers = {
    tabIndex: 0,
    role: "button",
    "aria-disabled": submitting || !documentId,
    onClick,
    onKeyDown,
    onDragOver,
    onDragLeave,
    onDrop,
    onPaste,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
  };

  const fileInput = (
    <input
      ref={fileInputRef}
      type="file"
      accept="image/*"
      capture="environment"
      onChange={onPick}
      disabled={submitting}
      style={{ display: "none" }}
    />
  );

  if (compact) {
    return (
      <Stack space={3}>
        <Card
          padding={3}
          radius={3}
          {...sharedCardHandlers}
          style={{
            border: `1.5px dashed ${dragOver ? CLAY_DEEP : CLAY}`,
            background: bg,
            cursor: submitting ? "progress" : "pointer",
            transition: "background 0.15s ease, border-color 0.15s ease",
            outline: "none",
          }}
        >
          <Flex align="center" gap={3}>
            <Box style={{ lineHeight: 0, flexShrink: 0 }}>
              <ClaudeMark size={22} color={active ? CLAY_DEEP : CLAY} />
            </Box>
            <Box flex={1}>
              <Text size={1} weight="medium" style={{ color: CLAY }}>
                {submitting
                  ? "Generating recipe..."
                  : "Regenerate recipe from photo"}
              </Text>
            </Box>
            {submitting ? (
              <Box paddingX={2}>
                <Spinner muted />
              </Box>
            ) : (
              <Flex
                align="center"
                gap={2}
                paddingY={1}
                paddingX={3}
                style={{
                  background: CLAY,
                  color: "white",
                  borderRadius: 999,
                  fontWeight: 600,
                  fontSize: 13,
                  pointerEvents: "none",
                  flexShrink: 0,
                }}
              >
                <UploadIcon size={12} />
                <span>Upload</span>
              </Flex>
            )}
          </Flex>
          {fileInput}
        </Card>

        {error && (
          <Card padding={3} tone="critical" border radius={2}>
            <Text size={1}>{error}</Text>
          </Card>
        )}

        {warnings.length > 0 && (
          <Card padding={3} tone="caution" border radius={2}>
            <Stack space={2}>
              <Text size={1} weight="semibold">
                Generated with warnings:
              </Text>
              {warnings.map((w, i) => (
                <Text key={i} size={1}>
                  • {w}
                </Text>
              ))}
            </Stack>
          </Card>
        )}

        {success && (
          <Card padding={3} tone="positive" border radius={2}>
            <Text size={1} weight="semibold">
              Recipe generated. Review the fields below and publish when ready.
            </Text>
          </Card>
        )}

        {pendingFile && (
          <Dialog
            id="ai-import-confirm"
            header="Overwrite this recipe?"
            onClose={cancelPending}
            width={1}
          >
            <Stack space={4} padding={4}>
              <Text>
                This will replace <strong>{title}</strong> with the recipe
                Claude generates from the uploaded photo. Ingredient amounts,
                method, category, and description will all be overwritten.
              </Text>
              {pendingPreviewUrl && (
                <Card padding={2} border radius={2}>
                  <img
                    src={pendingPreviewUrl}
                    alt="preview"
                    style={{
                      maxWidth: "100%",
                      maxHeight: 240,
                      display: "block",
                      margin: "0 auto",
                    }}
                  />
                </Card>
              )}
              <Flex gap={2} justify="flex-end">
                <Button text="Cancel" mode="ghost" onClick={cancelPending} />
                <Button
                  text="Overwrite recipe"
                  tone="critical"
                  onClick={confirmPending}
                />
              </Flex>
            </Stack>
          </Dialog>
        )}
      </Stack>
    );
  }

  return (
    <Stack space={3}>
      <Card
        padding={5}
        radius={3}
        {...sharedCardHandlers}
        style={{
          border: `2px dashed ${dragOver ? CLAY_DEEP : CLAY}`,
          background: bg,
          cursor: submitting ? "progress" : "pointer",
          transition:
            "background 0.15s ease, border-color 0.15s ease, transform 0.15s ease",
          transform: dragOver ? "scale(1.01)" : "scale(1)",
          outline: "none",
          minHeight: 200,
        }}
      >
        <Flex
          direction="column"
          align="center"
          justify="center"
          gap={4}
          style={{ minHeight: 180, textAlign: "center" }}
        >
          <Box style={{ lineHeight: 0 }}>
            <ClaudeMark size={56} color={active ? CLAY_DEEP : CLAY} />
          </Box>

          <Stack space={4} style={{ textAlign: "center" }}>
            <Text size={3} weight="semibold" style={{ color: CLAY }}>
              Generate recipe from photo
            </Text>
            {submitting ? (
              <Text size={1} muted>
                Generating recipe...
              </Text>
            ) : (
              <Flex
                align="center"
                justify="center"
                gap={2}
                style={{ color: "var(--card-muted-fg-color)" }}
              >
                <ImageIcon size={14} />
                <Text size={1} muted>
                  Drag or paste image here
                </Text>
              </Flex>
            )}
          </Stack>

          {submitting && (
            <Box paddingTop={2}>
              <Spinner muted />
            </Box>
          )}

          {!submitting && (
            <Flex
              align="center"
              gap={2}
              paddingY={2}
              paddingX={4}
              style={{
                background: CLAY,
                color: "white",
                borderRadius: 999,
                fontWeight: 600,
                fontSize: 14,
                letterSpacing: 0.2,
                marginTop: 6,
                pointerEvents: "none", // the whole card is clickable
              }}
            >
              <UploadIcon size={14} />
              <span>Upload</span>
            </Flex>
          )}
        </Flex>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={onPick}
          disabled={submitting}
          style={{ display: "none" }}
        />
      </Card>

      {error && (
        <Card padding={3} tone="critical" border radius={2}>
          <Text size={1}>{error}</Text>
        </Card>
      )}

      {warnings.length > 0 && (
        <Card padding={3} tone="caution" border radius={2}>
          <Stack space={2}>
            <Text size={1} weight="semibold">
              Generated with warnings:
            </Text>
            {warnings.map((w, i) => (
              <Text key={i} size={1}>
                • {w}
              </Text>
            ))}
          </Stack>
        </Card>
      )}

      {success && (
        <Card padding={3} tone="positive" border radius={2}>
          <Text size={1} weight="semibold">
            Recipe generated. Review the fields below and publish when ready.
          </Text>
        </Card>
      )}
    </Stack>
  );
}
