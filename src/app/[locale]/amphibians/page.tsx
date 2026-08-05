import { createGroupHubRoute } from "@/lib/createGroupHubRoute";

const hub = createGroupHubRoute("amphibians");

export const generateStaticParams = hub.generateStaticParams;
export const generateMetadata = hub.generateMetadata;
export default hub.Page;
