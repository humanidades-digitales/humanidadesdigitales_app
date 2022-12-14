import React, { useState } from 'react';
import '../assets/styles/dropzone.css';
import { hdapi, downloadUrl } from '../api/hdapi';

// Import React FilePond
import { FilePond, registerPlugin } from 'react-filepond';

// Import FilePond styles
import 'filepond/dist/filepond.min.css';

// Import the File Type Validation plugin
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';

// Register the plugin with FilePond
registerPlugin(FilePondPluginFileValidateType);

const Dropzone = ({ uniqueId, onCorpus }) => {
  React.useEffect(() => {
    hdapi.get(`/files?uniqueId=${uniqueId}`).then((response) => {
      setFiles(response.data);
      onCorpus(response.data.length);
    });
  }, []);

  // Update button based on files in server
  const checkFilesInServer = async () => {
    await hdapi.get(`/files?uniqueId=${uniqueId}`).then((response) => {
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
          url: downloadUrl,
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
            await hdapi.delete(`/files/${uniqueId}/` + source).then(() => {
              load();
            });

            // Can call the error method if something is wrong, should exit after
            error('oh my goodness');

            //await checkFilesInServer();
          },
        }}
        name="files"
        labelIdle='1. Arrastrar PDFs aqu?? o <span class="filepond--label-action">Explorar</span>'
        labelFileLoading="Cargando"
        labelFileLoadError="Error durante la carga"
        labelFileProcessing="Cargando"
        labelFileProcessingComplete="Carga completa"
        labelFileProcessingAborted="Carga cancelada"
        labelFileProcessingError="Error durante la carga"
        labelFileProcessingRevertError="Error durante la reversi??n"
        labelFileRemoveError="Error durante la eliminaci??n"
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
        labelMaxFileSize="El tama??o m??ximo del archivo es {filesize}"
        labelMaxTotalFileSizeExceeded="Tama??o total m??ximo excedido"
        labelMaxTotalFileSize="El tama??o total m??ximo del archivo es {filesize}"
        labelFileTypeNotAllowed="Archivo de tipo no v??lido"
        fileValidateTypeLabelExpectedTypes="Espera {allButLastType} o {lastType}"
        imageValidateSizeLabelFormatError="Tipo de imagen no compatible"
        imageValidateSizeLabelImageSizeTooSmall="La imagen es demasiado peque??a"
        imageValidateSizeLabelImageSizeTooBig="La imagen es demasiado grande"
        imageValidateSizeLabelExpectedMinSize="El tama??o m??nimo es {minWidth} ?? {minHeight}"
        imageValidateSizeLabelExpectedMaxSize="El tama??o m??ximo es {maxWidth} ?? {maxHeight}"
        imageValidateSizeLabelImageResolutionTooLow="La resoluci??n es demasiado baja"
        imageValidateSizeLabelImageResolutionTooHigh="La resoluci??n es demasiado alta"
        imageValidateSizeLabelExpectedMinResolution="La resoluci??n m??nima es {minResolution}"
        imageValidateSizeLabelExpectedMaxResolution="La resoluci??n m??xima es {maxResolution}"
      />
    </div>
  );
};

export default Dropzone;
