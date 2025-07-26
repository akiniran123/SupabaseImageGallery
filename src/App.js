import logo from './logo.svg';
import { useState, useEffect } from 'react';
import './App.css';
import { Container, Form, Button, Row, Col, Card } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";
import { v4 as uuidv4 } from 'uuid';

// https://znvgxowkyhkrfxbzwedo.supabase.co/storage/v1/object/public/images/41fb287f-7bd4-4896-b4aa-db24f145e388/ffe676d5-b440-4b24-a1ca-4480839a3c80

const CDNURL = "https://znvgxowkyhkrfxbzwedo.supabase.co/storage/v1/object/public/images/";

// CDNURL + user.id + "/" + image.name

function App() {
<<<<<<< Updated upstream
  const [ email, setEmail ] = useState("");
  const [ images, setImages ] = useState([]);
=======
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

>>>>>>> Stashed changes
  const user = useUser();
  const supabase = useSupabaseClient();
  console.log(email);

  async function getImages() {
    const { data, error } = await supabase
<<<<<<< Updated upstream
      .storage
      .from('images')
      .list(user?.id + "/", {
        limit: 100,
        offset: 0,
        sortBy: { column: "name", order: "asc"}
      });   // Cooper/
      // data: [ image1, image2, image3 ]
      // image1: { name: "subscribeToCooperCodes.png" }
=======
      .from("image_metadata")
      .select("*")
      .eq("user_id", user.id)
      .order("inserted_at", { ascending: sortOrder === "asc" });
>>>>>>> Stashed changes

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
  }, [user, sortOrder]);

  async function magicLinkLogin() {
    const { data, error } = await supabase.auth.signInWithOtp({
      email: email
    });

    if(error) {
      alert("Error communicating with supabase, make sure to use a real email address!");
      console.log(error);
    } else {
      alert("Check your email for a Supabase Magic Link to log in!");
    }
  }

  async function signOut() {
    const { error } = await supabase.auth.signOut();
  }

  async function uploadImage(e) {
    let file = e.target.files[0];

    // userid: Cooper
    // Cooper/
    // Cooper/myNameOfImage.png
    // Lindsay/myNameOfImage.png

    const { data, error } = await supabase
      .storage
      .from('images')
      .upload(user.id + "/" + uuidv4(), file)  // Cooper/ASDFASDFASDF uuid, taylorSwift.png -> taylorSwift.png

    if(data) {
      getImages();
    } else {
      console.log(error);
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

<<<<<<< Updated upstream
=======
  const filteredImages = images.filter((img) =>
    img.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
>>>>>>> Stashed changes

  return (
    <Container align="center" className="container-sm mt-4">
      {/* 
        if they dont exist: show them the login page
        if the user exists: show them the images / upload images page
      */}
      { user === null ? 
        <>
          <h1>Welcome to ImageWall</h1>
          <Form>
            <Form.Group className="mb-3" style={{maxWidth: "500px"}}>
              <Form.Label>Enter an email to sign in with a Supabase Magic Link</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>
            <Button variant="primary" onClick={() => magicLinkLogin()}>
              Get Magic Link
            </Button>
          </Form>
        </>
      : 
        <>
          <h1>Your ImageWall</h1>
          <Button onClick={() => signOut()}>Sign Out</Button>
          <p>Current user: {user.email}</p>
          <p>Use the Choose File button below to upload an image to your gallery</p>
          <Form.Group className="mb-3" style={{maxWidth: "500px"}}>
            <Form.Control type="file" accept="image/png, image/jpeg" onChange={(e) => uploadImage(e)}/>
          </Form.Group>
          <hr />
          <h3>Your Images</h3>
<<<<<<< Updated upstream
          {/* 
            to get an image: CDNURL + user.id + "/" + image.name 
            images: [image1, image2, image3]  
          */ }
          <Row xs={1} md={3} className="g-4">
            {images.map((image) => {
              return (
                <Col key={CDNURL + user.id + "/" + image.name}>
=======

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
>>>>>>> Stashed changes
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
