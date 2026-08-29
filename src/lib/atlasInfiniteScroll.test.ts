import assert from "node:assert/strict";
import { test } from "node:test";
import {
  ATLAS_PAGE_SIZE,
  initialAtlasVisibleCount,
  nextAtlasVisibleCount,
} from "./atlasInfiniteScroll";

test("initialAtlasVisibleCount caps the first page", () => {
  assert.equal(initialAtlasVisibleCount(0), 0);
  assert.equal(initialAtlasVisibleCount(5), 5);
  assert.equal(initialAtlasVisibleCount(110), ATLAS_PAGE_SIZE);
});

test("nextAtlasVisibleCount appends a page until the catalog ends", () => {
  assert.equal(nextAtlasVisibleCount(12, 110), 24);
  assert.equal(nextAtlasVisibleCount(108, 110), 110);
  assert.equal(nextAtlasVisibleCount(110, 110), 110);
  assert.equal(nextAtlasVisibleCount(0, 0), 0);
});
