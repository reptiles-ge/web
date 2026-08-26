import { createGroupHubRoute } from "@/lib/createGroupHubRoute";

const hub = createGroupHubRoute("mammals");

export const generateMetadata = hub.generateMetadata;
export default hub.Page;
