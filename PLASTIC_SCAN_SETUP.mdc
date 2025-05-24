# Plastic Scan Feature Setup Guide

This guide explains how to set up and use the Plastic Scan feature in the RePlas application.

## Overview

The Plastic Scan feature uses Google's Gemini 2.0 Flash preview model to analyze images of plastic items and identify their plastic type, recyclability, and other characteristics. This feature helps users properly categorize their plastic waste for recycling.

## Features

- **Camera and Gallery Integration**: Users can take a photo directly or upload from gallery
- **Client-side Image Compression**: Images are automatically compressed to optimize performance
- **Plastic Type Identification**: AI analyzes the recycling symbol (numbers 1-7) or plastic appearance
- **Confidence Score**: Shows how confident the AI is in its identification
- **Recyclability Status**: Indicates whether the plastic type is generally recyclable

## Setup Instructions

### 1. API Key Setup

1. Obtain a Google Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a `.env.local` file in the project root (copy from `.env.local.example`)
3. Add your Gemini API key to the `.env.local` file:
   ```
   NEXT_PUBLIC_GEMINI_API_KEY=your-gemini-api-key-here
   ```

### 2. Environment Configuration

The application uses the following environment variables:

- `NEXT_PUBLIC_GEMINI_API_KEY`: Your Gemini API key
- `NEXT_PUBLIC_ENABLE_AI`: Optional. Set to 'true' to enable AI features

### 3. Testing the Feature

1. Navigate to the Plastic Scan page (`/scan`)
2. Take a photo or upload an image of a plastic item
3. Enter the weight of the plastic item
4. Click "Analyze Plastic" to get the AI analysis

## Implementation Details

### Image Processing Flow

1. User captures/uploads an image
2. Image is compressed client-side before sending to the AI
3. Compressed image is temporarily stored in session storage
4. After weight input, the image and weight data are sent to Gemini for analysis
5. The AI returns structured data about the plastic type

### Models Used

- **Gemini 2.0 Flash preview**: Used for image analysis and plastic identification
- **Gemini 1.5 Pro**: Used for chat interactions about recycling (Chat page)

### Security Considerations

- API keys are handled securely using environment variables
- Client-side image compression reduces data transfer
- Error handling provides user-friendly messages without exposing sensitive details

## Troubleshooting

### Camera Permission Issues

If users encounter "Permission denied" errors:
- Ensure the site is running on HTTPS or localhost
- Check browser camera permissions
- Try using the "Upload from Gallery" option instead

### API Key Issues

If the AI analysis fails:
- Verify the API key is correctly set in `.env.local`
- Check the browser console for specific error messages
- Ensure the API key has access to the required Gemini models

### Other Issues

- Make sure the browser supports the required features (camera access, canvas, etc.)
- Check that JavaScript is enabled
- Try a different browser if issues persist 