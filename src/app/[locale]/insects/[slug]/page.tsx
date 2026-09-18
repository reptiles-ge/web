import { createSpeciesHubRoute } from "@/lib/createSpeciesRoute";

const route = createSpeciesHubRoute("insects");

export const generateMetadata = route.generateMetadata;
export const generateStaticParams = route.generateStaticParams;
export default route.Page;
