"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, FileText, Save, Coins } from "lucide-react";
import DashboardHeader from "../components/DashboardHeader";
import TokenizeConfirmationModal from "../components/TokenizeConfirmationModal";
import { createAsset } from "../services/asset.service";

export default function TokenizePage() {
    const [formData, setFormData] = useState({
        assetType: "",
        quantity: "",
        pricePerUnit: "",
        expectedHarvestDate: "",
        expectedDeliveryDate: "",
        location: {
            latitude: 0,
            longitude: 0,
            address: "",
        },
        description: "",
    });

    const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
    const [isConfirmationModalOpen, setIsConfirmationModalOpen] =
        useState(false);

    const handleInputChange = (
        field: string,
        value: string | { latitude: number; longitude: number; address: string }
    ) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleFileUpload = () => {
        // Simulate file upload
        setUploadedFiles((prev) => [
            ...prev,
            `Document_${prev.length + 1}.pdf`,
        ]);
    };

    const handlePublishProject = () => {
        setIsConfirmationModalOpen(true);
    };

    const handleConfirmPublication = () => {
        // Reset form after successful publication
        setFormData({
            assetType: "",
            quantity: "",
            pricePerUnit: "",
            expectedHarvestDate: "",
            expectedDeliveryDate: "",
            location: {
                latitude: 0,
                longitude: 0,
                address: "",
            },
            description: "",
        });
        setUploadedFiles([]);
        setIsConfirmationModalOpen(false);
    };

    const platformFee = 2.5;
    const interestRate = 8.5;
    const maxValue = formData.pricePerUnit
        ? (
              Number.parseFloat(formData.pricePerUnit) *
              Number.parseFloat(formData.quantity) *
              0.7
          ).toFixed(0)
        : "0";

    const isFormValid =
        formData.assetType &&
        formData.quantity &&
        formData.pricePerUnit &&
        formData.expectedHarvestDate &&
        formData.expectedDeliveryDate &&
        formData.location.latitude &&
        formData.location.longitude &&
        formData.location.address;

    return (
        <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black">
            <DashboardHeader />

            <main className="container mx-auto px-4 py-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="max-w-4xl mx-auto"
                >
                    <div className="mb-8">
                        <h1 className="text-4xl font-bold text-white mb-2">
                            Tokenize New Harvest
                        </h1>
                        <p className="text-gray-300">
                            Transform your agricultural production into an NFT
                            for financing access
                        </p>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Main Form */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Crop Information */}
                            <Card className="bg-gray-800/50 border-gray-700">
                                <CardHeader>
                                    <CardTitle className="text-white flex items-center">
                                        <Coins className="w-5 h-5 mr-2 text-yellow-400" />
                                        Crop Information
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div>
                                            <Label
                                                htmlFor="assetType"
                                                className="text-gray-200"
                                            >
                                                Asset Type
                                            </Label>
                                            <Select
                                                onValueChange={(value) =>
                                                    handleInputChange(
                                                        "assetType",
                                                        value
                                                    )
                                                }
                                                value={formData.assetType}
                                            >
                                                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                                                    <SelectValue placeholder="Select crop type" />
                                                </SelectTrigger>
                                                <SelectContent className="bg-gray-700 border-gray-600">
                                                    <SelectItem value="soybean">
                                                        Soybean
                                                    </SelectItem>
                                                    <SelectItem value="corn">
                                                        Corn
                                                    </SelectItem>
                                                    <SelectItem value="wheat">
                                                        Wheat
                                                    </SelectItem>
                                                    <SelectItem value="coffee">
                                                        Coffee
                                                    </SelectItem>
                                                    <SelectItem value="cotton">
                                                        Cotton
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div>
                                            <Label
                                                htmlFor="quantity"
                                                className="text-gray-200"
                                            >
                                                Quantity
                                            </Label>
                                            <Input
                                                id="quantity"
                                                type="number"
                                                placeholder="Ex: 500"
                                                value={formData.quantity}
                                                onChange={(e) =>
                                                    handleInputChange(
                                                        "quantity",
                                                        e.target.value
                                                    )
                                                }
                                                className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div>
                                            <Label
                                                htmlFor="pricePerUnit"
                                                className="text-gray-200"
                                            >
                                                Price per Unit (USDC)
                                            </Label>
                                            <Input
                                                id="pricePerUnit"
                                                type="number"
                                                placeholder="Ex: 500"
                                                value={formData.pricePerUnit}
                                                onChange={(e) =>
                                                    handleInputChange(
                                                        "pricePerUnit",
                                                        e.target.value
                                                    )
                                                }
                                                className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                                            />
                                        </div>
                                        <div>
                                            <Label
                                                htmlFor="expectedHarvestDate"
                                                className="text-gray-200"
                                            >
                                                Expected Harvest Date
                                            </Label>
                                            <Input
                                                id="expectedHarvestDate"
                                                type="date"
                                                value={
                                                    formData.expectedHarvestDate
                                                }
                                                onChange={(e) =>
                                                    handleInputChange(
                                                        "expectedHarvestDate",
                                                        e.target.value
                                                    )
                                                }
                                                className="bg-gray-700 border-gray-600 text-white"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div>
                                            <Label
                                                htmlFor="expectedDeliveryDate"
                                                className="text-gray-200"
                                            >
                                                Expected Delivery Date
                                            </Label>
                                            <Input
                                                id="expectedDeliveryDate"
                                                type="date"
                                                value={
                                                    formData.expectedDeliveryDate
                                                }
                                                onChange={(e) =>
                                                    handleInputChange(
                                                        "expectedDeliveryDate",
                                                        e.target.value
                                                    )
                                                }
                                                className="bg-gray-700 border-gray-600 text-white"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <Label
                                            htmlFor="location"
                                            className="text-gray-200"
                                        >
                                            Location
                                        </Label>
                                        <div className="grid md:grid-cols-3 gap-4">
                                            <Input
                                                placeholder="Latitude"
                                                type="number"
                                                step="0.000001"
                                                value={
                                                    formData.location.latitude
                                                }
                                                onChange={(e) =>
                                                    handleInputChange(
                                                        "location",
                                                        {
                                                            ...formData.location,
                                                            latitude:
                                                                parseFloat(
                                                                    e.target
                                                                        .value
                                                                ),
                                                        }
                                                    )
                                                }
                                                className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                                            />
                                            <Input
                                                placeholder="Longitude"
                                                type="number"
                                                step="0.000001"
                                                value={
                                                    formData.location.longitude
                                                }
                                                onChange={(e) =>
                                                    handleInputChange(
                                                        "location",
                                                        {
                                                            ...formData.location,
                                                            longitude:
                                                                parseFloat(
                                                                    e.target
                                                                        .value
                                                                ),
                                                        }
                                                    )
                                                }
                                                className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <Label
                                            htmlFor="description"
                                            className="text-gray-200"
                                        >
                                            Additional Description
                                        </Label>
                                        <Textarea
                                            id="description"
                                            placeholder="Describe production details, technologies used, property history..."
                                            value={formData.description}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    "description",
                                                    e.target.value
                                                )
                                            }
                                            className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 min-h-[100px]"
                                        />
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Documentation */}
                            <Card className="bg-gray-800/50 border-gray-700">
                                <CardHeader>
                                    <CardTitle className="text-white flex items-center">
                                        <FileText className="w-5 h-5 mr-2 text-yellow-400" />
                                        Documentation
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center">
                                        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                        <p className="text-gray-300 mb-2">
                                            Drag files or click to select
                                        </p>
                                        <p className="text-sm text-gray-500 mb-4">
                                            CAR, Lease Contract, Licenses, Soil
                                            Analysis, etc.
                                        </p>
                                        <Button
                                            onClick={handleFileUpload}
                                            variant="outline"
                                            className="border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black"
                                        >
                                            Select Files
                                        </Button>
                                    </div>

                                    {uploadedFiles.length > 0 && (
                                        <div className="mt-4 space-y-2">
                                            {uploadedFiles.map(
                                                (file, index) => (
                                                    <div
                                                        key={index}
                                                        className="flex items-center p-2 bg-gray-700 rounded"
                                                    >
                                                        <FileText className="w-4 h-4 text-yellow-400 mr-2" />
                                                        <span className="text-white text-sm">
                                                            {file}
                                                        </span>
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>

                        {/* Tokenization Summary */}
                        <div className="lg:col-span-1">
                            <Card className="bg-gray-800/50 border-gray-700 sticky top-8">
                                <CardHeader>
                                    <CardTitle className="text-white">
                                        Tokenization Summary
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-300">
                                            Platform Fee
                                        </span>
                                        <span className="text-yellow-400 font-semibold">
                                            {platformFee}%
                                        </span>
                                    </div>

                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-300">
                                            Interest Rate
                                        </span>
                                        <span className="text-yellow-400 font-semibold">
                                            {interestRate}% p.a.
                                        </span>
                                    </div>

                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-300">
                                            Max Available Value
                                        </span>
                                        <span className="text-yellow-400 font-semibold">
                                            ${maxValue} USDC
                                        </span>
                                    </div>

                                    <div className="border-t border-gray-600 pt-4">
                                        <div className="text-xs text-gray-400 space-y-1">
                                            <p>
                                                • Document will be validated by
                                                Chainlink oracles
                                            </p>
                                            <p>
                                                • 70% of expected revenue
                                                available for financing
                                            </p>
                                            <p>
                                                • Project will be published and
                                                available for investment
                                            </p>
                                        </div>
                                    </div>

                                    <div className="space-y-3 pt-4">
                                        <Button
                                            variant="outline"
                                            className="w-full border-gray-600 text-gray-300 hover:bg-gray-700"
                                        >
                                            <Save className="w-4 h-4 mr-2" />
                                            Save Draft
                                        </Button>
                                        <Button
                                            className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold"
                                            disabled={!isFormValid}
                                            onClick={handlePublishProject}
                                        >
                                            <Coins className="w-4 h-4 mr-2" />
                                            Publish Project
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </motion.div>
            </main>

            {/* Confirmation Modal */}
            <TokenizeConfirmationModal
                isOpen={isConfirmationModalOpen}
                onClose={() => setIsConfirmationModalOpen(false)}
                formData={formData}
                uploadedFiles={uploadedFiles}
                onConfirm={handleConfirmPublication}
            />
        </div>
    );
}
