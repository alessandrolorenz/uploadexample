import React from 'react';
import { CircularProgressbar } from 'react-circular-progressbar';
// CircularProgressbar tem um css padrao que tem que importar 
// importa no global.js pra nao ter que ficar importando cada vez
import { MdCheckCircle, MdError, MdLink } from 'react-icons/md';

import { Container, FileInfo, Preview } from './styles';

const FileList = ({files, onDelete}) => (
  <Container>
    {files.map(uploadedFile => (      
      <li key={uploadedFile.id}>
      <FileInfo>
        <Preview src={uploadedFile.preview} />
        <div>
          <strong>{uploadedFile.name}</strong>
          <span>
            {uploadedFile.readebleSize}
            { !!uploadedFile.url && (
               <button onClick={() => {onDelete(uploadedFile.id)}}>Excluir</button>
            )}
            </span>
        </div>
      </FileInfo>
      <div>
        {!uploadedFile.uploaded && !uploadedFile.error && (
                  <CircularProgressbar
                  styles={{
                    root: {width: 24},
                    path: {stroke: '#7159c1'}
                  }}
                  strokeWidth= {10}
                  percentage={uploadedFile.progress}
                  />
        )}
        {uploadedFile.url && (
                  <a
                  href={uploadedFile.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  >
                  <MdLink style={{margin: 8}} size={24} color="#222" />
                  </a>
        )}
          { uploadedFile.uploaded && (
            <MdCheckCircle size={24} color="#78e5d5" />
          )}
          { uploadedFile.error &&(
            <MdError size={24} color="#e57878" />
          )}
      </div>
    </li>
    ))}

  </Container>
);

export default FileList;
