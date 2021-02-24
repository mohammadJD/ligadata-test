import React, {useState, useEffect, useRef} from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { articleActions } from '../../_actions';
import SunEditor from 'suneditor-react';
import 'suneditor/dist/css/suneditor.min.css'; // Import Sun Editor's CSS File
import './article.css';
import {articleService} from "../../_services";

function AddArticlePage({ match }) {
    const [item, setItem] = useState({
        title: '',
        content: '',
        date: '',
        image: ""
    });
    // const [image, setImage] = useState(null);
    const [isImageExceededSize, setIsImageExceededSize] = useState(false);
    const [isTypeImage, setIsTypeImage] = useState(true);
    const [isEdit, setIsEdit] = useState(false);

    const [submitted, setSubmitted] = useState(false);
    const adding = useSelector(state => state.addArticle.adding);
    const article = useSelector(state => state.articles);
    const dispatch = useDispatch();
    const {id} = match.params;

    // const editorRef = useRef();

    // reset login status
    useEffect(() => {
        if(id!==undefined){
            setIsEdit(true);
            console.log("editing...");

            getArticle();
            // dispatch(articleActions.getById(id));
            // setItem(item => ({ ...item, ['title']: article.item.title }));
        }
    }, []);

    function getArticle(){
        dispatch(articleActions.getByIdRequest());
        articleService.getById(id)
            .then(
                item => {
                    dispatch(articleActions.getByIdSuccess(item));
                    console.log(item);
                    if(item!==undefined) setItem(item);
                },
                error => dispatch(articleActions.getByIdFailure(error.toString()))
            );
    }
    function handleChange(e) {
        const { name, value } = e.target;
        setItem(item => ({ ...item, [name]: value }));
    }

    function handleEditorChange(content){
        //Get Content Inside Editor
        setItem(item => ({ ...item, ['content']: content }))
    }

    async function handleFileRead(event){
        const file = event.target.files[0];
        setIsImageExceededSize(false);
        setIsTypeImage(true);
        setItem(item => ({ ...item, ['image']: '' }));
        console.log("file");
        console.log(file);

        const size = file.size / (1024*1024);
        const type = file.type.split('/')[0];
        if(type!=='image') setIsTypeImage(false);
        if(size > 4) {
            setIsImageExceededSize(true);
        }

        // console.log("size : "+size);
        // console.log("type : "+type);
        if(type!=='image' || size>4) return;

        const base64 = await convertBase64(file);
        setItem(item => ({ ...item, ['image']: base64 }));
    }

     function convertBase64(file){
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(file);
            fileReader.onload = () => {
                resolve(fileReader.result);
            }
            fileReader.onerror = (error) => {
                reject(error);
            }
        })
    }

    function handleSubmit(e) {
        e.preventDefault();

        setSubmitted(true);

        if (item.title && item.content && item.date && item.image &&isTypeImage && !isImageExceededSize) {
            if(isEdit) {
                item['id'] = parseInt(id);
                if(isNaN(item['id'])) item['id'] = 0;
                dispatch(articleActions.updateItem(item));
            }
            else dispatch(articleActions.addItem(item));
        }
    }

    return (
        <div className="add-article-page">
         <div className="col-lg-8 offset-lg-2">
            <h2>{isEdit?'Update':'Add New'} Article</h2>
             {article.loading && <em>Loading article...</em>}
            <form name="form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Title</label>
                    <input type="text" name="title" value={item.title} onChange={handleChange} className={'form-control' + (submitted && !item.title ? ' is-invalid' : '')} />
                    {submitted && !item.title &&
                    <div className="invalid-feedback">Title is required</div>
                    }
                </div>
                <div className="form-group">
                    <label>Content</label>
                    <input type="text" className={'form-control d-none' + (submitted && !item.content ? ' is-invalid' : '')} />

                    <SunEditor setContents={item.content} name="content" onChange={handleEditorChange} height="150"/>
                    {submitted && !item.content &&
                    <div className="invalid-feedback">Content is required</div>
                    }
                </div>
                <div className="form-group">
                    <label>Date</label>
                    <input type="date" name="date" value={item.date} onChange={handleChange} className={'form-control' + (submitted && !item.date ? ' is-invalid' : '')} />
                    {submitted && !item.date &&
                    <div className="invalid-feedback">Date is required</div>
                    }
                </div>

                <div className="form-group">
                    <label>Upload Image</label>
                    <input type="file" accept="image/*" onChange={handleFileRead} className={'form-control file-input' + (submitted && !item.image ? ' is-invalid' : '')} />
                    {submitted && isImageExceededSize &&
                    <div className="invalid-feedback">File size should not exceed 4MB</div>
                    }
                    {submitted && !isTypeImage &&
                    <div className="invalid-feedback">The file type must be an image</div>
                    }
                    {submitted && !item.image && isTypeImage && !isImageExceededSize &&
                    <div className="invalid-feedback">Image is required</div>
                    }
                    {item.image &&
                        // <img className="image-thumb" src={item.image}/>
                    <div className="image-thumb" style={{'backgroundImage': "url('" + item.image + "')"}}/>
                    }

                </div>

                <div className="form-group">
                    <button className="btn btn-primary">
                        {adding && <span className="spinner-border spinner-border-sm mr-1"></span>}
                        {isEdit?'Update':'Add'}
                    </button>
                    <Link to="/articles" className="btn btn-link">Cancel</Link>
                </div>
            </form>
        </div>
        </div>

    );
}

export { AddArticlePage };
