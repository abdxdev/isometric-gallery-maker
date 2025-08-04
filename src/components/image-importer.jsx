"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, Link, Plus, X } from "lucide-react";

export function ImageImporter({ onImageAdd, onImageRemove, recentImages = [] }) {
  const [urlInput, setUrlInput] = useState("");
  const fileInputRef = useRef();

  const handleUrlAdd = () => {
    if (urlInput.trim()) {
      onImageAdd(urlInput.trim());
      setUrlInput("");
    }
  };

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    files.forEach((file) => {
      if (file.type.startsWith("image/")) {
        const url = URL.createObjectURL(file);
        onImageAdd(url);
      }
    });
    // Reset the input
    event.target.value = "";
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };
  return (
    <div className="space-y-4">
      {/* URL Import */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Label className="text-sm font-medium">Add from URL</Label>
        </div>
        <div className="flex w-full max-w-sm items-center gap-2">
          <Input 
            placeholder="https://example.com/image.jpg"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleUrlAdd()} 
            className="flex-1"
          />
          <Button type="submit" variant="outline">
            <Plus size={16} />
          </Button>
        </div>
      </div>

      {/* File Upload */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Label className="text-sm font-medium">Upload Files</Label>
        </div>
        <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleFileUpload} className="hidden" />
        <Button onClick={triggerFileUpload} variant="outline" className="w-full">
          <Upload size={16} className="w-4 h-4" />
          Choose Images
        </Button>
      </div>
    </div>
  );
}
