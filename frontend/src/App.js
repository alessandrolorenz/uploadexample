import React, { Component } from 'react';
import { uniqueId } from 'lodash';
import filesize from 'filesize';

import api from './services/api'

import GlobalStyle from './styles/global'

import { Container, Content } from './styles'
import Upload from './components/Uploads';
import FileList from './components/FileList'



class App extends Component {
//armazenar as infos dentro do App que passa para os filhos upload e filelist
 state = {
  uploadedFiles: [],
 };

 async componentDidMount() {
   const response = await api.get('posts');

   this.setState({
     uploadedFiles: response.data.map(file => ({
      id: file._id,
      name: file.name,
      readableSize: filesize(file.size),
      preview: file.url,
      uploaded: true,
      url: file.url
     }))
   })
    
 }

 //receb np Uload comp a props.handleUpload
 handleUpload = files => { 
   const uploadedFiles = files.map(file => ({
     file,
     id: uniqueId(),
     name: file.name,
     reabebleSize: filesize(file.size),
     preview: URL.createObjectURL(file),
     progress: 0,
     uploaded: false,
     error: false,
     url: null,
    }))
    
    this.setState({
      uploadedFiles: this.state.uploadedFiles.concat(uploadedFiles)
    });
    //processar um c processe 2 c
    uploadedFiles.forEach(this.processUpload);
  };

  updateFile = (id, data) => {
    this.setState({uploadedFiles: this.state.uploadedFiles.map(uploadedFile => {
      return id === uploadedFile.id ? { ...uploadedFile, ...data } : uploadedFile;
      // { ...uploadedFile, ...data }  copia todos os dados e sobrescreve
    })})
  }

  processUpload = (uploadedFile) => {
    const data = new FormData(); // como se estivesse dando um submit de um form pelo javascript
    // é como se fosse o objeto que o html tranforma os campos do form dentro do js 
    data.append('file', uploadedFile.file, uploadedFile.name); // manda na requisição
    //cria o campo 'file', e envia o file e o nome  
    api.post('posts', data, {
      onUploadProgress: e => {
        //recebe um evento e dentro dele coleta as informaçoes de progresso
        const progress = parseInt(Math.round((e.loaded * 100) / e.total ));

        this.updateFile(uploadedFile.id, {
          progress,
          // progress: progress
        })
      }
    }).then(response => {
      this.updateFile(uploadedFile.id, {
        uploaded: true,
        id: response.data._id,
        url: response.data.url
      })
    }).catch(() => {
      this.updateFile(uploadedFile.id, {
        error: true,
      });
    })
  }

  handleDelete = async id => {
    await api.delete(`posts/${id}`);

    this.setState({
      uploadedFiles: this.state.uploadedFiles.filter(file=> file.id !== id),
    })
  }

  componentWillUnmount() {
    this.uploadedFiles.forEach(file => URL.revokeObjectURL(file.preview));
  }

  render(){
    const { uploadedFiles } = this.state;
  return (
    <Container>
      <Content>
        <Upload onUpload={this.handleUpload} />
       { !!uploadedFiles.length && (
          <FileList files={uploadedFiles} onDelete={this.handleDelete} />
       ) }
      </Content>
      <GlobalStyle />
    </Container>

    
  );
 }
 
}

export default App;
