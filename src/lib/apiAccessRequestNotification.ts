import type {
  ApiAccessData,
  ApiAccessProjectType,
  ApiAccessRequest,
  ApiAccessVolume,
} from "@/lib/apiAccessRequestInput";

const PROJECT_TYPES: Record<ApiAccessProjectType, string> = {
  education: "Education",
  media: "Media",
  other: "Other",
  research: "Research",
  tourism: "Tourism",
};

const DATA: Record<ApiAccessData, string> = {
  photos: "photos",
  regions: "regions",
  risk: "risk information",
  species: "species",
};

const VOLUMES: Record<ApiAccessVolume, string> = {
  "10kTo100k": "10–100k requests a month",
  over100k: "over 100k requests a month",
  under10k: "up to 10k requests a month",
};

export function formatApiAccessRequestNotification(request: ApiAccessRequest) {
  return [
    "🔑 API access request",
    `👤 ${request.name}`,
    `✉️ ${request.email}`,
    request.organization ? `🏢 ${request.organization}` : "",
    `🔗 ${request.website}`,
    `📁 ${PROJECT_TYPES[request.projectType]}`,
    request.data.length > 0
      ? `📦 ${request.data.map((item) => DATA[item]).join(", ")}`
      : "",
    `📈 ${VOLUMES[request.volume]}`,
    `🌐 ${request.locale}`,
    request.description ? `\n💬 ${request.description}` : "",
  ]
    .filter(Boolean)
    .join("\n");
}
