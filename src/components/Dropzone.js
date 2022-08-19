import React, { useState } from 'react';
import '../assets/styles/dropzone.css';
import axios from 'axios';

// Import React FilePond
import { FilePond, registerPlugin } from 'react-filepond';

// Import FilePond styles
import 'filepond/dist/filepond.min.css';

// Import the File Type Validation plugin
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';

// Register the plugin with FilePond
registerPlugin(FilePondPluginFileValidateType);

// Get a file input reference
const input = document.querySelector('input[type="file"]');

const Dropzone = ({ uniqueId, onCorpus }) => {
  React.useEffect(() => {
    axios
      .get(`http://localhost:3000/files?uniqueId=${uniqueId}`)
      .then((response) => {
        setFiles(response.data);
        onCorpus(response.data.length);
      });
  }, []);

  // Update button based on files in server
  const checkFilesInServer = async () => {
    await axios
      .get(`http://localhost:3000/files?uniqueId=${uniqueId}`)
      .then((response) => {
        onCorpus(response.data.length);
      });
  };

  const [files, setFiles] = useState([]);

  const updateFiles = (newFiles) => {
    setFiles(newFiles);
    checkFilesInServer();
  };

  return (
    <div className="dropzone">
      <FilePond
        files={files}
        onupdatefiles={(newFiles) => updateFiles(newFiles)}
        onprocessfiles={checkFilesInServer}
        allowMultiple={true}
        maxFiles={50}
        acceptedFileTypes={['application/pdf']}
        server={{
          url: 'http://localhost:3000',
          process: {
            url: '/files/upload?uniqueId=' + uniqueId,
            method: 'POST',
          },
          load: {
            url: `/files/${uniqueId}/`,
            method: 'GET',
          },
          revert: {
            url: `/files/${uniqueId}/`,
          },
          remove: async (source, load, error) => {
            // Should somehow send `source` to server so server can remove the file with this source
            await axios
              .delete(`http://localhost:3000/files/${uniqueId}/` + source)
              .then(() => {
                load();
              });

            // Can call the error method if something is wrong, should exit after
            error('oh my goodness');

            //await checkFilesInServer();
          },
        }}
        name="files"
        labelIdle='1. Arrastrar PDFs aquí o <span class="filepond--label-action">Explorar</span>'
        labelFileLoading="Cargando"
        labelFileLoadError="Error durante la carga"
        labelFileProcessing="Cargando"
        labelFileProcessingComplete="Carga completa"
        labelFileProcessingAborted="Carga cancelada"
        labelFileProcessingError="Error durante la carga"
        labelFileProcessingRevertError="Error durante la reversión"
        labelFileRemoveError="Error durante la eliminación"
        labelTapToCancel="toca para cancelar"
        labelTapToRetry="tocar para volver a intentar"
        labelTapToUndo="tocar para deshacer"
        labelButtonRemoveItem="Eliminar"
        labelButtonAbortItemLoad="Abortar"
        labelButtonRetryItemLoad="Reintentar"
        labelButtonAbortItemProcessing="Cancelar"
        labelButtonUndoItemProcessing="Deshacer"
        labelButtonRetryItemProcessing="Reintentar"
        labelButtonProcessItem="Cargar"
        labelMaxFileSizeExceeded="El archivo es demasiado grande"
        labelMaxFileSize="El tamaño máximo del archivo es {filesize}"
        labelMaxTotalFileSizeExceeded="Tamaño total máximo excedido"
        labelMaxTotalFileSize="El tamaño total máximo del archivo es {filesize}"
        labelFileTypeNotAllowed="Archivo de tipo no válido"
        fileValidateTypeLabelExpectedTypes="Espera {allButLastType} o {lastType}"
        imageValidateSizeLabelFormatError="Tipo de imagen no compatible"
        imageValidateSizeLabelImageSizeTooSmall="La imagen es demasiado pequeña"
        imageValidateSizeLabelImageSizeTooBig="La imagen es demasiado grande"
        imageValidateSizeLabelExpectedMinSize="El tamaño mínimo es {minWidth} × {minHeight}"
        imageValidateSizeLabelExpectedMaxSize="El tamaño máximo es {maxWidth} × {maxHeight}"
        imageValidateSizeLabelImageResolutionTooLow="La resolución es demasiado baja"
        imageValidateSizeLabelImageResolutionTooHigh="La resolución es demasiado alta"
        imageValidateSizeLabelExpectedMinResolution="La resolución mínima es {minResolution}"
        imageValidateSizeLabelExpectedMaxResolution="La resolución máxima es {maxResolution}"
      />
    </div>
  );
};

export default Dropzone;
