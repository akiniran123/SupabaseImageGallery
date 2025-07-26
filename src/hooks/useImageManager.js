import { useState, useEffect, useRef } from 'react';
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";
import { v4 as uuidv4 } from 'uuid';

export default function useImageManager() {
  const user = useUser();
  const supabase = useSupabaseClient();

  const [images, setImages] = useState([]);
  const [editingTitles, setEditingTitles] = useState({});
  const [previewImage, setPreviewImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [title, setTitle] = useState("");
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("desc");
  const fileInputRef = useRef(null);

  const getImages = async () => {
    if (!user) return;
    setLoading(true);

    const { data, error } = await supabase
      .from("image_metadata")
      .select("*")
      .eq("user_id", user.id)
      .order("inserted_at", { ascending: sortOrder === "asc" });

    if (error) {
      console.error("Lỗi tải ảnh:", error.message);
      alert("Không thể tải danh sách ảnh.");
    } else {
      setImages(data);
      const editTitles = {};
      data.forEach(img => editTitles[img.file_name] = img.title);
      setEditingTitles(editTitles);
    }

    setLoading(false);
  };

  const handleSelectFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSelectedFile(file);

    const reader = new FileReader();
    reader.onloadend = () => setPreviewImage(reader.result);
    reader.readAsDataURL(file);
  };

  const uploadImage = async () => {
    if (!selectedFile || !user || title.trim() === "") {
      alert("Cần chọn ảnh và nhập tiêu đề.");
      return;
    }

    setUploading(true);
    const fileName = uuidv4() + "-" + selectedFile.name;
    const filePath = user.id + "/" + fileName;

    const { error: uploadError } = await supabase
      .storage
      .from("images")
      .upload(filePath, selectedFile);

    if (uploadError) {
      console.error("Lỗi upload ảnh:", uploadError.message);
      alert("Upload ảnh thất bại.");
      setUploading(false);
      return;
    }

    const { error: insertError } = await supabase
      .from("image_metadata")
      .insert({
        user_id: user.id,
        file_name: fileName,
        title: title.trim(),
      });

    setUploading(false);

    if (insertError) {
      console.error("Lỗi lưu tiêu đề:", insertError.message);
      alert("Không thể lưu tiêu đề ảnh.");
    } else {
      getImages();
      setSelectedFile(null);
      setPreviewImage(null);
      setTitle("");
      if (fileInputRef.current) {
        fileInputRef.current.value = null;
      }
    }
  };

  const deleteImage = async (fileName) => {
    await supabase
      .storage
      .from("images")
      .remove([user.id + "/" + fileName]);

    await supabase
      .from("image_metadata")
      .delete()
      .eq("user_id", user.id)
      .eq("file_name", fileName);

    getImages();
  };

  const updateTitle = async (fileName) => {
    const newTitle = editingTitles[fileName]?.trim();
    if (!newTitle) {
      alert("Tiêu đề không được để trống.");
      return;
    }

    const { error } = await supabase
      .from("image_metadata")
      .update({ title: newTitle })
      .eq("user_id", user.id)
      .eq("file_name", fileName);

    if (error) {
      console.error("Lỗi cập nhật tiêu đề:", error.message);
      alert("Không thể cập nhật tiêu đề.");
    } else {
      getImages();
    }
  };

  useEffect(() => {
    if (user) {
      getImages();
    }
  }, [user, sortOrder]);

  return {
    user,
    images,
    editingTitles,
    setEditingTitles,
    previewImage,
    selectedFile,
    setTitle,
    title,
    handleSelectFile,
    uploadImage,
    uploading,
    loading,
    deleteImage,
    updateTitle,
    searchTerm,
    setSearchTerm,
    sortOrder,
    setSortOrder,
    fileInputRef,
  };
}
