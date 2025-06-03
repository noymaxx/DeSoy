import { Router } from "express";
import { AssetController } from "../controllers/asset.controller";
import { InvestmentController } from "../controllers/investment.controller";
import { assetValidations, investmentValidations } from "../middlewares/validators";

const router = Router();
const assetController = new AssetController();
const investmentController = new InvestmentController();

// Health check route
router.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// Asset routes
router.post("/assets", assetValidations.createAsset, assetController.createAsset);
router.get("/assets", assetController.listAssets);
router.get("/assets/:id", assetController.getAssetById);
router.put("/assets/:id", assetValidations.updateAsset, assetController.updateAsset);
router.patch("/assets/:id/status", assetValidations.updateStatus, assetController.updateAssetStatus);
router.delete("/assets/:id", assetController.deleteAsset);

// Investment routes
router.post("/investments", investmentValidations.createInvestment, investmentController.createInvestment);
router.get("/investments", investmentController.listInvestments);
router.get("/investments/:id", investmentController.getInvestmentById);
router.put("/investments/:id", investmentValidations.updateInvestment, investmentController.updateInvestment);
router.delete("/investments/:id", investmentController.deleteInvestment);

export default router;
