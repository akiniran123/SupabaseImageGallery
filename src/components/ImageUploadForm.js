import { useRef } from 'react';
import { Form, Button } from 'react-bootstrap';

export default function ImageUploadForm({
  title,
  setTitle,
  handleSelectFile,
  previewImage,
  uploadImage,
  uploading,
}) {
  const fileInputRef = useRef(null);

  return (
    <>
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
    </>
  );
}
