// import react
import React from 'react';

//import icon & image
import { AiOutlineCloudUpload } from 'react-icons/ai';

// import style
import style from './FileView.module.css';

function FileView({title , name , link}){
    return (
        <div className={style.file}>
            <h2>{title}</h2>
            <a href={link} download={name}>
                <AiOutlineCloudUpload color='var(--word-color)' size='20px'/>{name}
            </a>
        </div>
    )
}

export default FileView;