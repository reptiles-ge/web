import { NotFoundBoundary } from "@/components/NotFoundBoundary";
import { NotFoundHeading } from "@/components/NotFoundHeading";
import { OptimizedImageScope } from "@/components/OptimizedImageScope";
import { images } from "@/data/speciesMedia";

export function NotFoundShell() {
  return (
    <div data-hide-footer data-not-found-shell>
      <NotFoundHeading />
      <OptimizedImageScope srcs={[images.cta]}>
        <NotFoundBoundary />
      </OptimizedImageScope>
    </div>
  );
}
