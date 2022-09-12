import "./Profile.css"
import { upload } from "../../utils/config"

//components
import Message from "../../components/Message"
import { Link } from "react-router-dom"
import { BsFillEyeFill, BsPencilFill, BsXLg } from "react-icons/bs"

//hooks
import { useState, useEffect, useRef } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useParams } from "react-router-dom"

//redux
import { getUserDetails } from "../../slices/userSlice"
import { publishPhoto, resetMessage, getUserPhotos, deletePhoto, updatePhoto } from "../../slices/photoSlice"

const Profile = () => {
    const {id} = useParams()
    const dispatch = useDispatch()
    //usuário por id
    const {user, loading} = useSelector((state) => state.user)
    //usuário logado
    const {user: userAuth} = useSelector((state) => state.auth)

    const {photos, loading: loadingPhoto, message: messagePhoto, error: errorPhoto} = useSelector((state) => state.photo)
    const [title, setTitle] = useState("")
    const [image, setImage] = useState("")

    const [editTitle, setEditTitle] = useState("")
    const [editImage, setEditImage] = useState("")
    const [editId, setEditId] = useState("")

    //new form and edit form refs
    const newPhotoForm = useRef()
    const editPhotoForm = useRef()

    //load user data
    useEffect(() => {
        dispatch(getUserDetails(id))
        dispatch(getUserPhotos(id))
    }, [dispatch, id])

    const handleFile = (e) => {
        const image = e.target.files[0]

        setImage(image)
    }

    const resetComponentMessage = () => {
        setTimeout(() => {
            dispatch(resetMessage())
        }, 2000)
    }

    const submitHandle = async(e) => {
        e.preventDefault();

        const photoData = {
            title,
            image
        }

        //build formData
        const formData = new FormData();

        const photoFormData = Object.keys(photoData).forEach((key) => formData.append(key, photoData[key]))

        formData.append("photo", formData)

        await dispatch(publishPhoto(formData))

        setTitle("")

        resetComponentMessage()
    }
    
    const handleDelete = (id) => {
        dispatch(deletePhoto(id))

        resetComponentMessage()
    }

    //show or hide forms
    const hideOrShowForms = () => {
        newPhotoForm.current.classList.toggle("hide")
        editPhotoForm.current.classList.toggle("hide")
    }

    //update a photo
    const handleUpdate = (e) => {
        e.preventDefault()

        const photoData = {
            title: editTitle,
            id: editId
        }

        dispatch(updatePhoto(photoData))

        resetComponentMessage()
    }

    //open edit form
    const handleEdit = (photo) => {
        if(editPhotoForm.current.classList.contains("hide")) {
            hideOrShowForms()
        }

        setEditImage(photo.image)
        setEditTitle(photo.title)
        setEditId(photo._id)
    }

    //close edit form
    const handleCancelEdit = () => {
        hideOrShowForms()
    }

    if(loading) {
        return <p>Carregando...</p>
    }
  return (
    <div id="profile">
        <div className="profile-header">
            {user.profileImage && (
                <img src={`${upload}/users/${user.profileImage}`} alt={user.name} />
            )}
            <div className="profile-description">
                <h2>{user.name}</h2>
                <p>{user.bio}</p>
            </div>
        </div>
        {id === userAuth._id && (
            <>
                <div className="new-photo" ref={newPhotoForm}>
                    <h3>Compartilhe algum momento seu:</h3>
                    <form onSubmit={submitHandle}>
                        <label>
                            <span>Título para a foto:</span>
                            <input type="text" placeholder="Insira um título" onChange={(e) => setTitle(e.target.value)} value={title} />
                        </label>
                        <label>
                            <span>Imagem:</span>
                            <input type="file" onChange={handleFile} />
                        </label>
                        {loadingPhoto ? <input type="submit" value="Aguarde..." disabled /> : <input type="submit" value="Postar" />}
                    </form>
                </div>
                <div className="edit-photo hide" ref={editPhotoForm}>
                    <p>Editando:</p>
                    {editImage && (
                        <img src={`${upload}/photos/${editImage}`} alt={editTitle} />
                    )}
                    <form onSubmit={handleUpdate}>
                    <input type="text" placeholder="Insira um título" onChange={(e) => setEditTitle(e.target.value)} value={editTitle} />
                    <input type="submit" value="Atualizar" />
                    <button className="cancel-btn" onClick={handleCancelEdit}>Cancelar edição</button>
                    </form>
                </div>
                {errorPhoto && <Message msg={errorPhoto} type="error" />}
                {messagePhoto && <Message msg={messagePhoto} type="success" />}
            </>
        )}
        <div className="user-photos">
            <h2>Fotos publicadas:</h2>
            <div className="photos-container">
                {photos && photos.map((photo) => (
                    <div className="photo" key={photo._id}>
                        {photo.image && (
                            <img src={`${upload}/photos/${photo.image}`} alt={photo.title} />
                        )}
                        {id === userAuth._id ? (
                        <div className="actions">
                            <Link to={`/photos/${photo._id}`}>
                                <BsFillEyeFill />
                            </Link>
                            <BsPencilFill onClick={() => handleEdit(photo)} />
                            <BsXLg onClick={() => handleDelete(photo._id)}/>
                        </div>
                        ): (
                            <Link className="btn" to={`/photos/${photo._id}`}>Ver</Link>
                        )}
                    </div>
                ))}
                {photos.length === 0 && <p>Ainda não há fotos publicadas</p>}
            </div>
        </div>
    </div>
  )
}

export default Profile