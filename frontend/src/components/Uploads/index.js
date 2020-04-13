import React, { Component } from 'react';

import Dropzone from 'react-dropzone';
import { DropContainer, UploadMessage } from './styles'

// import { Container } from './styles';

export default class Uploads extends Component {
  
  renderDragMessage = (isDragActive, isDragReject) => {
    if (!isDragActive) {
      return <UploadMessage>Arraste aqui seus arquivos...</UploadMessage>
    }
    if (isDragReject) {
      return <UploadMessage type="error">Arquivo não suportado</UploadMessage>
    }
    return <UploadMessage type="success">Solte os arquvos aqui</UploadMessage>

  }

  render() {
    const { onUpload } = this.props;

    return (
      <Dropzone accept="image/*" onDropAccepted={onUpload}>
        {/* utiliza pattern render props
        (forma de repassar o chidren, que vem dentro da tag) 
        como uma função que recebe parametros 
        que tem a ver com o Dropzone, e que retorna um jsx
        */}
        {({ getRootProps, getInputProps, isDragActive, isDragReject}) => (
          <DropContainer 
            {...getRootProps() } //repassa as prop que daqui - props de upload
            isDragActive={isDragActive}
            isDragReject={isDragReject}
          >
            <input {...getInputProps()} />
            {this.renderDragMessage(isDragActive, isDragReject)}
            </DropContainer>
        )}
      </Dropzone>
      )
  }
}
