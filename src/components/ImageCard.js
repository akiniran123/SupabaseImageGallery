import { Card, Button, Form, InputGroup } from 'react-bootstrap';

const CDNURL = "https://kzfmunxbdfdfxumerulj.supabase.co/storage/v1/object/public/images/";

export default function ImageCard({ image, userId, editingTitle, onTitleChange, onSaveTitle, onDelete }) {
  return (
    <Card>
      <Card.Img
        variant="top"
        src={`${CDNURL}${userId}/${image.file_name}`}
        alt={image.title || "Uploaded image"}
      />
      <Card.Body>
        <Form.Group>
          <Form.Label>Tiêu đề:</Form.Label>
          <InputGroup>
            <Form.Control
              type="text"
              value={editingTitle}
              onChange={(e) => onTitleChange(image.file_name, e.target.value)}
            />
            <Button
              variant="outline-primary"
              onClick={() => onSaveTitle(image.file_name)}
              disabled={!editingTitle?.trim()}
            >
              Lưu
            </Button>
          </InputGroup>
        </Form.Group>
        <p className="text-muted mt-2" style={{ fontSize: "0.9rem" }}>
          Đăng lúc: {new Date(image.inserted_at).toLocaleString()}
        </p>
        <Button variant="danger" onClick={() => onDelete(image.file_name)}>
          Xoá ảnh
        </Button>
      </Card.Body>
    </Card>
  );
}
