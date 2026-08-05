import { createGroupHubRoute } from "@/lib/createGroupHubRoute";

const hub = createGroupHubRoute("lizards");

export const generateStaticParams = hub.generateStaticParams;
export const generateMetadata = hub.generateMetadata;
export default hub.Page;
