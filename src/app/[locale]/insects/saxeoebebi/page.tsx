import { createClusterGuideRoute } from "@/lib/createClusterGuideRoute";

const guide = createClusterGuideRoute("insect-index");

export const generateMetadata = guide.generateMetadata;
export const generateStaticParams = guide.generateStaticParams;
export default guide.Page;
