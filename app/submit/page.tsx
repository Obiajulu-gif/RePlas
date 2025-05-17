"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"
import { Camera, Upload, Check, Info, AlertTriangle } from "lucide-react"
import { useWallet } from "@/components/wallet-provider"

export default function SubmitPage() {
  const { isConnected } = useWallet()
  const { toast } = useToast()
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    plasticType: "",
    weight: "",
    location: "",
    notes: "",
    hasQrCode: "no",
    qrCode: "",
    imageUploaded: false,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleRadioChange = (value: string) => {
    setFormData((prev) => ({ ...prev, hasQrCode: value }))
  }

  const handleImageUpload = () => {
    // Simulate image upload
    setFormData((prev) => ({ ...prev, imageUploaded: true }))
    toast({
      title: "Image Uploaded",
      description: "Your plastic image has been uploaded successfully.",
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate submission delay
    setTimeout(() => {
      setIsSubmitting(false)
      setStep(3) // Move to success step

      // Calculate token reward based on plastic type and weight
      const weight = Number.parseFloat(formData.weight)
      let tokenRate = 0

      switch (formData.plasticType) {
        case "PET":
          tokenRate = 8
          break
        case "HDPE":
          tokenRate = 6
          break
        case "PVC":
          tokenRate = 2
          break
        case "LDPE":
          tokenRate = 4
          break
        case "PP":
          tokenRate = 5
          break
        default:
          tokenRate = 3
      }

      const estimatedTokens = Math.round(weight * tokenRate)

      toast({
        title: "Submission Successful",
        description: `Your plastic submission has been recorded. You'll receive approximately ${estimatedTokens} RePlas tokens after verification.`,
      })
    }, 2000)
  }

  if (!isConnected) {
    return (
      <div className="container mx-auto py-6">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Connect Wallet</CardTitle>
            <CardDescription>You need to connect your wallet to submit plastic for recycling</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center py-6">
            <AlertTriangle className="h-16 w-16 text-amber-500" />
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={() => (window.location.href = "/")}>
              Go to Home Page
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Submit Plastic for Recycling</h1>

        <div className="mb-8">
          <div className="flex items-center justify-between relative">
            <div className="flex flex-col items-center">
              <div
                className={`h-10 w-10 rounded-full flex items-center justify-center ${step >= 1 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
              >
                1
              </div>
              <span className="text-sm mt-1">Details</span>
            </div>

            <div className="flex-1 h-1 mx-2 bg-muted">
              <div className={`h-full bg-primary transition-all ${step >= 2 ? "w-full" : "w-0"}`}></div>
            </div>

            <div className="flex flex-col items-center">
              <div
                className={`h-10 w-10 rounded-full flex items-center justify-center ${step >= 2 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
              >
                2
              </div>
              <span className="text-sm mt-1">Verification</span>
            </div>

            <div className="flex-1 h-1 mx-2 bg-muted">
              <div className={`h-full bg-primary transition-all ${step >= 3 ? "w-full" : "w-0"}`}></div>
            </div>

            <div className="flex flex-col items-center">
              <div
                className={`h-10 w-10 rounded-full flex items-center justify-center ${step >= 3 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
              >
                3
              </div>
              <span className="text-sm mt-1">Complete</span>
            </div>
          </div>
        </div>

        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>Plastic Details</CardTitle>
              <CardDescription>Provide information about the plastic you're recycling</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="plasticType">Plastic Type</Label>
                  <select
                    id="plasticType"
                    name="plasticType"
                    value={formData.plasticType}
                    onChange={handleChange}
                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                    required
                  >
                    <option value="">Select plastic type</option>
                    <option value="PET">PET (Type 1) - Water bottles, soda bottles</option>
                    <option value="HDPE">HDPE (Type 2) - Milk jugs, detergent bottles</option>
                    <option value="PVC">PVC (Type 3) - Pipes, food wrapping</option>
                    <option value="LDPE">LDPE (Type 4) - Plastic bags, squeeze bottles</option>
                    <option value="PP">PP (Type 5) - Yogurt containers, bottle caps</option>
                    <option value="PS">PS (Type 6) - Disposable cups, food containers</option>
                    <option value="OTHER">Other (Type 7) - Mixed plastics</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="weight">Weight (kg)</Label>
                  <Input
                    id="weight"
                    name="weight"
                    type="number"
                    placeholder="Enter weight in kg"
                    min="0.1"
                    step="0.1"
                    value={formData.weight}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Collection Location</Label>
                  <Input
                    id="location"
                    name="location"
                    placeholder="Enter location"
                    value={formData.location}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Notes (Optional)</Label>
                  <Textarea
                    id="notes"
                    name="notes"
                    placeholder="Any additional information about the plastic"
                    value={formData.notes}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Does the plastic have a QR code?</Label>
                  <RadioGroup value={formData.hasQrCode} onValueChange={handleRadioChange} className="flex space-x-4">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="qr-yes" />
                      <Label htmlFor="qr-yes">Yes</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="qr-no" />
                      <Label htmlFor="qr-no">No</Label>
                    </div>
                  </RadioGroup>
                </div>

                {formData.hasQrCode === "yes" && (
                  <div className="space-y-2">
                    <Label htmlFor="qrCode">QR Code Value</Label>
                    <Input
                      id="qrCode"
                      name="qrCode"
                      placeholder="Enter QR code or scan"
                      value={formData.qrCode}
                      onChange={handleChange}
                    />
                    <p className="text-xs text-muted-foreground">
                      You can manually enter the QR code value or use the scanner in the next step
                    </p>
                  </div>
                )}
              </form>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                onClick={() => setStep(2)}
                disabled={!formData.plasticType || !formData.weight || !formData.location}
              >
                Continue to Verification
              </Button>
            </CardFooter>
          </Card>
        )}

        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle>Verification</CardTitle>
              <CardDescription>Upload photo evidence of your plastic for verification</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="border-2 border-dashed rounded-lg p-6 text-center">
                  {formData.imageUploaded ? (
                    <div className="flex flex-col items-center">
                      <div className="h-16 w-16 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mb-4">
                        <Check className="h-8 w-8 text-green-600 dark:text-green-400" />
                      </div>
                      <p className="font-medium">Image Uploaded Successfully</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Your image has been uploaded and is ready for verification
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <Camera className="h-16 w-16 mb-4 text-muted-foreground" />
                      <p className="font-medium">Upload Photo Evidence</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Take a clear photo of the plastic you're recycling
                      </p>
                      <div className="flex gap-4 mt-4">
                        <Button onClick={handleImageUpload} className="flex items-center gap-2">
                          <Camera className="h-4 w-4" />
                          Take Photo
                        </Button>
                        <Button variant="outline" onClick={handleImageUpload} className="flex items-center gap-2">
                          <Upload className="h-4 w-4" />
                          Upload Image
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="bg-muted p-4 rounded-lg">
                  <div className="flex items-start gap-3">
                    <Info className="h-5 w-5 text-blue-500 mt-0.5" />
                    <div>
                      <p className="font-medium">Verification Process</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Your submission will be verified using our AI system and blockchain technology. Verification
                        typically takes 1-24 hours. You'll receive RePlas tokens once verified.
                      </p>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="font-medium mb-2">Submission Summary</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Plastic Type:</span>
                      <span className="font-medium">{formData.plasticType || "Not specified"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Weight:</span>
                      <span className="font-medium">{formData.weight} kg</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Location:</span>
                      <span className="font-medium">{formData.location}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Has QR Code:</span>
                      <span className="font-medium">{formData.hasQrCode === "yes" ? "Yes" : "No"}</span>
                    </div>
                    {formData.hasQrCode === "yes" && formData.qrCode && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">QR Code:</span>
                        <span className="font-medium">{formData.qrCode}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button onClick={handleSubmit} disabled={!formData.imageUploaded || isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit for Verification"}
              </Button>
            </CardFooter>
          </Card>
        )}

        {step === 3 && (
          <Card>
            <CardHeader>
              <CardTitle>Submission Complete</CardTitle>
              <CardDescription>Your plastic recycling submission has been recorded</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center py-6">
              <div className="h-20 w-20 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mb-6">
                <Check className="h-10 w-10 text-green-600 dark:text-green-400" />
              </div>
              <h2 className="text-xl font-bold mb-2">Thank You for Recycling!</h2>
              <p className="text-center text-muted-foreground mb-6">
                Your submission is now being verified. You'll receive RePlas tokens once the verification is complete.
              </p>

              <div className="w-full bg-muted p-4 rounded-lg mb-6">
                <h3 className="font-medium mb-2">Submission Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Submission ID:</span>
                    <span className="font-medium">SUB-{Math.floor(Math.random() * 10000)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Plastic Type:</span>
                    <span className="font-medium">{formData.plasticType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Weight:</span>
                    <span className="font-medium">{formData.weight} kg</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Estimated Tokens:</span>
                    <span className="font-medium text-green-600 dark:text-green-400">
                      {Math.round(
                        Number.parseFloat(formData.weight) *
                          (formData.plasticType === "PET"
                            ? 8
                            : formData.plasticType === "HDPE"
                              ? 6
                              : formData.plasticType === "PVC"
                                ? 2
                                : formData.plasticType === "LDPE"
                                  ? 4
                                  : formData.plasticType === "PP"
                                    ? 5
                                    : 3),
                      )}{" "}
                      RPL
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status:</span>
                    <span className="font-medium text-amber-600 dark:text-amber-400">Pending Verification</span>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex gap-4">
              <Button variant="outline" className="flex-1" onClick={() => (window.location.href = "/")}>
                Go to Dashboard
              </Button>
              <Button
                className="flex-1"
                onClick={() => {
                  setStep(1)
                  setFormData({
                    plasticType: "",
                    weight: "",
                    location: "",
                    notes: "",
                    hasQrCode: "no",
                    qrCode: "",
                    imageUploaded: false,
                  })
                }}
              >
                Submit Another
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  )
}
