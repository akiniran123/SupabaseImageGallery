import './styles/App.css';
import { Container, Button, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import useImageManager from './hooks/useImageManager';
import ImageCard from './components/ImageCard';
import ImageUploadForm from './components/ImageUploadForm';
import SearchAndSort from './components/SearchAndSort';
import { useSupabaseClient } from "@supabase/auth-helpers-react";

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

  const supabase = useSupabaseClient();

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
