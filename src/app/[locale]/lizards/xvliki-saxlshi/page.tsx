import { createClusterGuideRoute } from "@/lib/createClusterGuideRoute";

const guide = createClusterGuideRoute("lizard-house");

export const generateStaticParams = guide.generateStaticParams;
export const generateMetadata = guide.generateMetadata;
export default guide.Page;
