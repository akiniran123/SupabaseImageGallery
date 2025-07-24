import logo from './logo.svg';
import { useState, useEffect } from 'react';
import './App.css';
import { Container, Form, Button, Row, Col, Card } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";
import { v4 as uuidv4 } from 'uuid';

// https://znvgxowkyhkrfxbzwedo.supabase.co/storage/v1/object/public/images/41fb287f-7bd4-4896-b4aa-db24f145e388/ffe676d5-b440-4b24-a1ca-4480839a3c80

const CDNURL = "https://kzfmunxbdfdfxumerulj.supabase.co/storage/v1/object/public/images/";

// CDNURL + user.id + "/" + image.name

function App() {
  const [previewImage, setPreviewImage] = useState(null); // ảnh dạng base64 hoặc blob
const [selectedFile, setSelectedFile] = useState(null); // giữ file để upload
  const [ email, setEmail ] = useState("");
  const [ images, setImages ] = useState([]);
  const user = useUser();
  const supabase = useSupabaseClient();
  console.log(email);

  async function getImages() {
    const { data, error } = await supabase
      .storage
      .from('images')
      .list(user?.id + "/", {
        limit: 100,
        offset: 0,
        sortBy: { column: "name", order: "asc"}
      });   // Cooper/
      // data: [ image1, image2, image3 ]
      // image1: { name: "subscribeToCooperCodes.png" }

      // to load image1: CDNURL.com/subscribeToCooperCodes.png -> hosted image

      if(data !== null) {
        setImages(data);
      } else {
        alert("Error loading images");
        console.log(error);
      }
  }
  
  useEffect(() => {
    if(user) {
      getImages();
    }
  }, [user]);

async function signInWithGoogle() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
  });

  if (error) {
    console.log("OAuth error:", error.message);
    alert("Đăng nhập thất bại!");
  }
}


  async function signOut() {
    const { error } = await supabase.auth.signOut();
  }
function handleSelectFile(e) {
  const file = e.target.files[0];
  if (!file) return;

  setSelectedFile(file); // Lưu file để upload sau

  const reader = new FileReader();
  reader.onloadend = () => {
    setPreviewImage(reader.result); // base64 preview
  };
  reader.readAsDataURL(file);
}
async function uploadImage() {
  if (!selectedFile || !user) {
    alert("Chưa có ảnh được chọn hoặc chưa đăng nhập.");
    return;
  }

  const filePath = user.id + "/" + selectedFile.name;

  const { data, error } = await supabase
    .storage
    .from("images")
    .upload(filePath, selectedFile);

  if (error) {
    console.error("Lỗi upload:", error.message);
    alert("Upload thất bại.");
  } else {
    getImages();
    setSelectedFile(null);
    setPreviewImage(null);
  }
}



  async function deleteImage(imageName) {
    const { error } = await supabase
      .storage
      .from('images')
      .remove([ user.id + "/" + imageName])
    
    if(error) {
      alert(error);
    } else {
      getImages();
    }
  }


  return (
    <Container align="center" className="container-sm mt-4">
      {/* 
        if they dont exist: show them the login page
        if the user exists: show them the images / upload images page
      */}
      { user === null ? 
        <>
          <h1>Welcome to ImageWall</h1>
     <Button variant="danger" onClick={signInWithGoogle}>
  Đăng nhập bằng Google
</Button>

        </>
      : 
        <>
          <h1>Your ImageWall</h1>
          <Button onClick={() => signOut()}>Sign Out</Button>
          <p>Current user: {user.email}</p>
          <p>Use the Choose File button below to upload an image to your gallery</p>
          <Form.Group className="mb-3" style={{ maxWidth: "500px" }}>
  <Form.Label>Chọn ảnh để upload:</Form.Label>
  <Form.Control
    type="file"
    accept="image/png, image/jpeg"
    onChange={handleSelectFile}
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
    <Button variant="success" onClick={uploadImage}>
      Upload ảnh
    </Button>
  </div>
)}

         

          <hr />
          <h3>Your Images</h3>
          {/* 
            to get an image: CDNURL + user.id + "/" + image.name 
            images: [image1, image2, image3]  
          */ }
          <Row xs={1} md={3} className="g-4">
            {images.map((image) => {
              return (
                <Col key={CDNURL + user.id + "/" + image.name}>
                  <Card>
                    <Card.Img variant="top" src={CDNURL + user.id + "/" + image.name} />
                    <Card.Body>
                      <Button variant="danger" onClick={() => deleteImage(image.name)}>Delete Image</Button>
                    </Card.Body>
                  </Card>
                </Col>
              )
            })}
          </Row>
        </>
      }
    </Container>
  );
}

export default App;
