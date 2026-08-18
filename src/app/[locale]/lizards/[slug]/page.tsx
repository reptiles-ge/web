import { createSpeciesHubRoute } from "@/lib/createSpeciesRoute";

const route = createSpeciesHubRoute("lizards");

export const dynamicParams = false;
export const generateStaticParams = route.generateStaticParams;
export const generateMetadata = route.generateMetadata;
export default route.Page;
