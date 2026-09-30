import express from "express";

import {
  getHeroMedia,
  getHeroGallery,
  getPortfolioMedia,
  getWorksCTA,
  getAllMedia,
  uploadMedia,
  updateMedia,
  updateMediaThumbnail,
  updateMediaAsset,
  deleteMedia,
} from "../controllers/mediaController.js";

import adminAuth from "../middlewares/adminAuth.js";
import upload from "../middlewares/upload.js";

const mediaRouter = express.Router();

/*
|--------------------------------------------------------------------------
| PUBLIC
|--------------------------------------------------------------------------
*/

/*
|--------------------------------------------------------------------------
| Hero
|--------------------------------------------------------------------------
| GET /api/media/hero
|--------------------------------------------------------------------------
*/

mediaRouter.get("/hero", getHeroMedia);

/*
|--------------------------------------------------------------------------
| Hero Gallery
|--------------------------------------------------------------------------
| GET /api/media/hero/gallery
|--------------------------------------------------------------------------
*/

mediaRouter.get("/hero/gallery", getHeroGallery);

/*
|--------------------------------------------------------------------------
| Portfolio
|--------------------------------------------------------------------------
| GET /api/media/portfolio
|--------------------------------------------------------------------------
*/

mediaRouter.get("/portfolio", getPortfolioMedia);

/*
|--------------------------------------------------------------------------
| Works CTA
|--------------------------------------------------------------------------
| GET /api/media/works-cta
|--------------------------------------------------------------------------
*/

mediaRouter.get("/works-cta", getWorksCTA);

/*
|--------------------------------------------------------------------------
| ADMIN
|--------------------------------------------------------------------------
*/

/*
|--------------------------------------------------------------------------
| Get All Media
|--------------------------------------------------------------------------
| GET /api/media/admin
|--------------------------------------------------------------------------
*/

mediaRouter.get("/admin", adminAuth, getAllMedia);

/*
|--------------------------------------------------------------------------
| Upload Media
|--------------------------------------------------------------------------
| POST /api/media/admin/upload
|
| Category:
|
| website
|   -> thumbnail
|   -> projectUrl
|
| image
|   -> media
|
| video
|   -> media
|   -> NO thumbnail
|--------------------------------------------------------------------------
*/

mediaRouter.post(
  "/admin/upload",
  adminAuth,
  upload.fields([
    {
      name: "media",
      maxCount: 1,
    },
    {
      name: "thumbnail",
      maxCount: 1,
    },
  ]),
  uploadMedia,
);

/*
|--------------------------------------------------------------------------
| Update Media Information
|--------------------------------------------------------------------------
| PATCH /api/media/admin/:id
|
| Updates:
|
| title
| clientName
| customTag
| projectUrl
| isFeatured
| showInCTA
| showInHero
|
| Category itself cannot be switched through this endpoint.
|--------------------------------------------------------------------------
*/

mediaRouter.patch("/admin/:id", adminAuth, updateMedia);

/*
|--------------------------------------------------------------------------
| Replace Website Thumbnail
|--------------------------------------------------------------------------
| PATCH /api/media/admin/:id/thumbnail
|
| Only Website media can use this endpoint.
|
| Video media NEVER uses this endpoint.
|--------------------------------------------------------------------------
*/

mediaRouter.patch(
  "/admin/:id/thumbnail",
  adminAuth,
  upload.single("thumbnail"),
  updateMediaThumbnail,
);

/*
|--------------------------------------------------------------------------
| Replace Actual Media
|--------------------------------------------------------------------------
| PATCH /api/media/admin/:id/media
|
| Image
|   -> replaces image
|
| Video
|   -> replaces video
|   -> no thumbnail
|
| Website
|   -> rejected
|   -> use /thumbnail endpoint instead
|--------------------------------------------------------------------------
*/

mediaRouter.patch(
  "/admin/:id/media",
  adminAuth,
  upload.single("media"),
  updateMediaAsset,
);

/*
|--------------------------------------------------------------------------
| Delete Media
|--------------------------------------------------------------------------
| DELETE /api/media/admin/:id
|--------------------------------------------------------------------------
*/

mediaRouter.delete("/admin/:id", adminAuth, deleteMedia);

export default mediaRouter;
