import { join } from "path";

export const HTTP_PORT = process.env.PORT || 80;
export const HTTPS_PORT = process.env.HTTPS_PORT || 443;

export const DATA_DIR = join(__dirname, "../../data");

export const FE_BUILD_DIR = join(__dirname, "../../frontend/build");

// Scraped images
export const IMAGES_DIR = join(DATA_DIR, "/images");
export const IMAGES_ORIGINAL_DIR = join(IMAGES_DIR, "/original");
export const IMAGES_THUMBNAILS_DIR = join(IMAGES_DIR, "/thumbnail");
export const IMAGES_LARGE_DIR = join(IMAGES_DIR, "/large");

// Scraped data
export const EXTENDED_FILE = join(DATA_DIR, "/extended/latest.json");

// NSL data
export const APNI_NAMES = join(DATA_DIR, "/nsl/latest/APNI-names.csv");
export const APNI_COMMON = join(DATA_DIR, "/nsl/latest/APNI-common-names.csv");
export const APC_TAXON = join(DATA_DIR, "/nsl/latest/APC-taxon.csv");

export const WIKIPEDIA_FILE = join(
    DATA_DIR,
    "/wikipedia/Wikipedia-20221115004414.xml"
);
export const WIKIPEDIA_LATEST = join(DATA_DIR, "/wikipedia/latest.json");
