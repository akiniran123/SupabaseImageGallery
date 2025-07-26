import { Form } from 'react-bootstrap';

export default function SearchAndSort({ searchTerm, setSearchTerm, sortOrder, setSortOrder }) {
  return (
    <>
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
    </>
  );
}
