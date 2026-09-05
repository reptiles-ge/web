import { createClusterGuideRoute } from "@/lib/createClusterGuideRoute";

const guide = createClusterGuideRoute("spider-venomous");

export const generateStaticParams = guide.generateStaticParams;
export const generateMetadata = guide.generateMetadata;
export default guide.Page;
