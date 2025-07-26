import { useState, useEffect, useRef } from 'react';
import './App.css';
import { Container, Form, Button, Row, Col, Card, InputGroup } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";
import { v4 as uuidv4 } from 'uuid';

const CDNURL = "https://kzfmunxbdfdfxumerulj.supabase.co/storage/v1/object/public/images/";

function App() {
  const [previewImage, setPreviewImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [title, setTitle] = useState("");
  const [images, setImages] = useState([]);
  const [editingTitles, setEditingTitles] = useState({});
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("desc");
  const fileInputRef = useRef(null);

  const user = useUser();
  const supabase = useSupabaseClient();

  async function getImages() {
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
  }

  useEffect(() => {
    if (user) {
      getImages();
    }
  }, [user, sortOrder]);

  async function signInWithGoogle() {
    const { error } = await supabase.auth.signInWithOAuth({ provider: 'google' });
    if (error) {
      console.error("OAuth error:", error.message);
      alert("Đăng nhập thất bại!");
    }
  }

  async function signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Sign out error:", error.message);
    }
  }

  function handleSelectFile(e) {
    const file = e.target.files[0];
    if (!file) return;

    setSelectedFile(file);

    const reader = new FileReader();
    reader.onloadend = () => setPreviewImage(reader.result);
    reader.readAsDataURL(file);
  }

  async function uploadImage() {
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
  }

  async function deleteImage(fileName) {
    const { error: deleteError } = await supabase
      .storage
      .from("images")
      .remove([user.id + "/" + fileName]);

    const { error: metaError } = await supabase
      .from("image_metadata")
      .delete()
      .eq("user_id", user.id)
      .eq("file_name", fileName);

    if (deleteError || metaError) {
      alert("Không thể xoá ảnh.");
    } else {
      getImages();
    }
  }

  async function updateTitle(fileName) {
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
  }

  const filteredImages = images.filter((img) =>
    img.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container align="center" className="container-sm mt-4">
      {user === null ? (
        <>
          <h1>Welcome to ImageWall</h1>
          <Button variant="danger" onClick={signInWithGoogle}>
            Đăng nhập bằng Google
          </Button>
        </>
      ) : (
        <>
          <h1>Your ImageWall</h1>
          <Button onClick={signOut}>Sign Out</Button>
          <p>Current user: {user.email}</p>

          <Form.Group className="mb-3" style={{ maxWidth: "500px" }}>
            <Form.Label>Tiêu đề ảnh:</Form.Label>
            <Form.Control
              type="text"
              placeholder="Nhập tiêu đề"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" style={{ maxWidth: "500px" }}>
            <Form.Label>Chọn ảnh để upload:</Form.Label>
            <Form.Control
              type="file"
              accept="image/png, image/jpeg"
              onChange={handleSelectFile}
              ref={fileInputRef}
            />
          </Form.Group>

          {previewImage && (
            <div style={{ maxWidth: "400px", margin: "20px auto" }}>
              <h5>Preview:</h5>
              <img
                src={previewImage}
                alt="Preview"
                style={{
                  width: "100%",
                  objectFit: "cover",
                  borderRadius: "8px",
                  boxShadow: "0 0 10px rgba(0,0,0,0.1)",
                  marginBottom: "10px"
                }}
              />
              <Button variant="success" onClick={uploadImage} disabled={uploading}>
                {uploading ? "Đang tải lên..." : "Upload ảnh"}
              </Button>
            </div>
          )}

          <hr />
          <h3>Your Images</h3>

          <Form className="mb-3" style={{ maxWidth: 500 }}>
            <Form.Control
              type="text"
              placeholder="Tìm theo tiêu đề ảnh..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Form>

          <Form.Group className="mb-4" style={{ maxWidth: 300 }}>
            <Form.Label>Sắp xếp theo ngày:</Form.Label>
            <Form.Select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <option value="desc">Mới nhất trước</option>
              <option value="asc">Cũ nhất trước</option>
            </Form.Select>
          </Form.Group>

          {loading ? (
            <p>Đang tải ảnh...</p>
          ) : filteredImages.length === 0 ? (
            <p>Không tìm thấy ảnh nào.</p>
          ) : (
            <Row xs={1} md={3} className="g-4">
              {filteredImages.map((image) => (
                <Col key={image.file_name}>
                  <Card>
                    <Card.Img
                      variant="top"
                      src={CDNURL + user.id + "/" + image.file_name}
                      alt={image.title || "Uploaded image"}
                    />
                    <Card.Body>
                      <Form.Group>
                        <Form.Label>Tiêu đề:</Form.Label>
                        <InputGroup>
                          <Form.Control
                            type="text"
                            value={editingTitles[image.file_name] || ""}
                            onChange={(e) =>
                              setEditingTitles((prev) => ({
                                ...prev,
                                [image.file_name]: e.target.value,
                              }))
                            }
                          />
                          <Button
                            variant="outline-primary"
                            onClick={() => updateTitle(image.file_name)}
                            disabled={!editingTitles[image.file_name]?.trim()}
                          >
                            Lưu
                          </Button>
                        </InputGroup>
                      </Form.Group>
                      <p className="text-muted mt-2" style={{ fontSize: "0.9rem" }}>
                        Đăng lúc: {new Date(image.inserted_at).toLocaleString()}
                      </p>
                      <Button
                        variant="danger"
                        onClick={() => deleteImage(image.file_name)}
                      >
                        Xoá ảnh
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </>
      )}
    </Container>
  );
}

export default App;
