import './styles/App.css';
import { Container, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import useImageManager from './hooks/useImageManager';
import ImageCard from './components/ImageCard';
import ImageUploadForm from './components/ImageUploadForm';
import SearchAndSort from './components/SearchAndSort';
import AuthButton from './components/AuthButton';

function App() {
  const {
    user,
    images,
    editingTitles,
    setEditingTitles,
    previewImage,
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
  } = useImageManager();

  const filteredImages = images.filter((img) =>
    img.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container align="center" className="container-sm mt-4">
      <AuthButton />

      {user && (
        <>
          <ImageUploadForm
            title={title}
            setTitle={setTitle}
            handleSelectFile={handleSelectFile}
            previewImage={previewImage}
            uploadImage={uploadImage}
            uploading={uploading}
          />

          <hr />
          <h3>Your Images</h3>

          <SearchAndSort
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            sortOrder={sortOrder}
            setSortOrder={setSortOrder}
          />

          {loading ? (
            <p>Đang tải ảnh...</p>
          ) : filteredImages.length === 0 ? (
            <p>Không tìm thấy ảnh nào.</p>
          ) : (
            <Row xs={1} md={3} className="g-4">
              {filteredImages.map((image) => (
                <Col key={image.file_name}>
                  <ImageCard
                    image={image}
                    userId={user.id}
                    editingTitle={editingTitles[image.file_name] || ""}
                    onTitleChange={(fileName, newTitle) =>
                      setEditingTitles((prev) => ({ ...prev, [fileName]: newTitle }))
                    }
                    onSaveTitle={updateTitle}
                    onDelete={deleteImage}
                  />
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
