import React, { useState } from 'react';
import { Col } from 'react-bootstrap';

const Blog = () => {
    const [posts, setPosts] = useState([
        // { id: 6, title: "Intro to Open Source file encryption tool.", date: "1/12/2025", content:[
        //     `The EncryptionMagic.com Free WinApp (1.0)`
        // ]},
        //     ,
        // { id: 4, title: "Using (custom) base64 passwords for full 256 bit entropy.", date: "1/10/2025", content: [
        //     ``,
        //     ``
        // ]},
        // { id: 3, title: "File encryption and the .enm file type", date: "1/10/2025", content: [
        //     ``,
        //     ``
        // ]},
        { id: 2, title: "Text to text encryption", date: "1/10/2025", content: [
            `Text to text encryption`,
            ``
        ]}
    ]);

    return (
        <Col>
            <h1>Blogs</h1>
            {posts.sort((a,b) => b.id - a.id).map((post) => (
                <div key={post.id} style={{border: '1px solid #ddd', padding: '10px', margin: '10px 0'}}>
                    <h3>{post.title + ' - ' + post.date}</h3>
                    <br></br>
                    {post.content.map((paragraph) => (<p dangerouslySetInnerHTML={{ __html: paragraph }}></p>))}
                </div>
            ))}
        </Col>
    );
};

export default Blog;
