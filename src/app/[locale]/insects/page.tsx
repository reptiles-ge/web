import { createGroupHubRoute } from "@/lib/createGroupHubRoute";

const hub = createGroupHubRoute("insects");

export const generateMetadata = hub.generateMetadata;
export const generateStaticParams = hub.generateStaticParams;
export default hub.Page;
