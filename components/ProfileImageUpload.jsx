"use client";

import { useState } from "react";
import Image from "next/image";

export default function ProfileImageUpload({ initialImage }) {
  const [preview, setPreview] = useState(initialImage || null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("profileImage", file);

    try {
      const res = await fetch("/api/upload-profile-image", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (res.ok) {
        setPreview(data.imageUrl);
        setMessage("Uploaded!");
        // Trigger page revalidation
        window.location.reload();
      } else {
        setMessage(data.error || "Failed");
      }
    } catch (err) {
      setMessage("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      {preview ? (
        <Image src={preview} alt="Profile" width={140} height={140} className="rounded-full" />
      ) : (
        <div className="w-36 h-36 bg-gray-200 rounded-full flex items-center justify-center">
          No image
        </div>
      )}
      <input type="file" accept="image/jpeg,image/png" onChange={handleUpload} disabled={uploading} />
      {uploading && <p>Uploading...</p>}
      {message && <p className={message.includes("fail") ? "text-red-600" : "text-green-600"}>{message}</p>}
    </div>
  );
}