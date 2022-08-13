import { Route, useNavigate } from "react-router-dom";
import React, { useState } from 'react'
import axios from 'axios'
import {
    CButton,
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CForm,
    CFormCheck,
    CFormInput,
    CFormFeedback,
    CFormLabel,
    CFormSelect,
    CFormTextarea,
    CInputGroup,
    CInputGroupText,
    CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
    cilImage,
} from '@coreui/icons'
import { Image } from 'cloudinary-react'

function AddBlog() {
    const [imageSelected, setImageSelected] = useState("");
    const [imgName, setImgName] = useState();
    const formData = new FormData();
    const navigate = useNavigate();

    const [post, setPost,] = useState({
        description: '',
        blogPicture: '',
    });
    var token;
    token = localStorage.getItem("token");
    var imageurl;
    const { description, blogPicture } = post;

    const onInputChange = e => {
        setPost({ ...post, [e.target.name]: e.target.value })
    };
    const uploadImage = async () => {
        formData.append("file", imageSelected);
        formData.append("upload_preset", "o4vgyinu");
    };

    const handleSubmit = async (event) => {
        uploadImage();
        event.preventDefault();
        const result = await axios.post("https://api.cloudinary.com/v1_1/dw7junf8b/image/upload", formData);
        console.log("url", result.data.secure_url);
        console.log(result);
        imageurl = result.data.secure_url;
        console.log("variable imageurl", imageurl);
        setImgName(result.data.secure_url);

        var data = {
            description: description,
            content: imageurl,
            likes: 0
        };
        console.log("data from blog ", data);

        var config = {
            method: 'post',
            url: 'http://localhost:3003/admin/createBlog',
            headers: {
                'Authorization': `${token}`
            },
            data: data
        };
        console.log("data from blog 2", data);
        const serverResponse = await axios(config);
        console.log(serverResponse.data);
        if (serverResponse.data){
            alert("Post added");
        }
       window.location.reload();
    }

    return (
        <CForm
            onSubmit={handleSubmit}
        >
            <CCard>
                <CCardHeader>
                    Create Blog

                </CCardHeader>
                <CCardBody >
                    <div className="justify-content-center">
                        <CRow >
                            <CCol>
                                <div>
                                    <label for="exampleFormControlTextarea1" class="form-label">Description</label>

                                    <textarea class="form-control" id="exampleFormControlTextarea1" rows="3" name="description" value={description} onChange={e => onInputChange(e)}></textarea>
                                </div>

                            </CCol>
                            <CCol>
                                <img
                                    style={{ height: "120px", width: "120px" }}
                                    src={
                                        imageSelected
                                            ? URL.createObjectURL(imageSelected)
                                            : "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"
                                    }
                                    alt=""
                                />

                                <CCol>
                                    <CFormLabel htmlFor="file" style={{ marginTop: "10px" }}>
                                        Upload Image
                                        <input
                                            type="file"
                                            name="blogPicture"
                                            id="file"
                                            onChange={(e) => setImageSelected(e.target.files[0])}
                                            style={{ display: "none" }}
                                        />
                                    </CFormLabel>
                                </CCol>
                            </CCol>
                        </CRow>
                        <CRow>
                            <CButton color="secondary" type="submit" style={{ width: "6em", marginLeft: "10px", marginTop: "0px" }}>
                                Post Blog
                            </CButton>
                        </CRow>
                    </div>
                </CCardBody>
            </CCard>
        </CForm>
    )
}

export default AddBlog