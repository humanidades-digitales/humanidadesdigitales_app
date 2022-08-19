import React, { useState } from 'react';
import '../assets/styles/tools.css';
import axios from 'axios';
import { Button, Input } from 'semantic-ui-react';
import parse from 'html-react-parser';

const Tools = ({ uniqueId, disabled, corpusSize }) => {
  const [intervalIdState, setIntervalIdState] = useState();
  const [processingOCR, setProcessingOCR] = useState(false);
  const [processingSearch, setProcessingSearch] = useState(false);
  const [cancelingOCR, setCancelingOCR] = useState(false);
  const [allProcessed, setAllProcessed] = useState(false);
  const [filesLeft, setFilesLeft] = useState(corpusSize);
  const [term, setTerm] = useState();
  const [searchResults, setSearchResults] = useState();

  React.useEffect(() => {
    axios.get('http://localhost:3000/ocr/' + uniqueId).then((response) => {
      if (response && response.data.isActive === true) {
        setProcessingOCR(true);
        checkOCR();
      }
      if (response && response.data.ocrProcessed === true) {
        setAllProcessed(true);
      }
    });
  }, []);

  const callOCR = async () => {
    await axios
      .post('http://localhost:3000/ocr/all?uniqueId=' + uniqueId)
      .then((response) => {
        setProcessingOCR(true);
        checkOCR();
      });
  };

  const formatResults = (results) => {
    var substr = term;
    let htmlString = results.replaceAll(substr, '<b>' + substr + '</b>');
    htmlString = htmlString.replaceAll('./', '<br><br>');
    htmlString = htmlString.replace(
      /(.+pdf)\:([0-9]+)\:/g,
      '<span className="searchTitles"><b>$1 - pág. $2 - </b></span><br>',
    );
    return htmlString;
  };

  const searchPDF = async () => {
    setProcessingSearch(true);
    await axios
      .post(
        `http://localhost:3000/search/all?uniqueId=${uniqueId}&term=${term}`,
      )
      .then((response) => {
        if (response && response.data) {
          setSearchResults(formatResults(response.data));
          setProcessingSearch(false);
        }
      });
  };

  const checkOCR = () => {
    const intervalId = setInterval(() => {
      setIntervalIdState(intervalId);
      axios.get('http://localhost:3000/ocr/' + uniqueId).then((response) => {
        setFilesLeft(response.data.filesLeft);
        if (response && response.data.isActive === false) {
          setProcessingOCR(false);
          setAllProcessed(true);
          clearInterval(intervalId);
        }
      });
    }, 2500);
  };

  const cancelOCR = () => {
    setCancelingOCR(true);
    clearInterval(intervalIdState);
    setFilesLeft(0);
    axios
      .post('http://localhost:3000/ocr/cancelAll?uniqueId=' + uniqueId)
      .then((response) => {
        if (response && response.data.isActive === false) {
          setProcessingOCR(false);
          setAllProcessed(false);
        }
      });
    setCancelingOCR(false);
  };

  const ocrDiv = () => {
    return (
      <div className="ocrDiv">
        <p className="toolsTitle">2. (Opcional) Convertir PDFs a "buscables"</p>
        <Button
          positive
          onClick={() => callOCR()}
          loading={processingOCR}
          disabled={disabled}>
          Convertir
        </Button>
        <Button
          negative
          onClick={() => cancelOCR()}
          disabled={!processingOCR}
          loading={cancelingOCR}>
          Cancelar
        </Button>
        {!disabled && allProcessed && !processingOCR ? (
          <div>
            <a href={`http://localhost:3000/files/download/${uniqueId}`}>
              <Button primary className="clipboardBtn">
                DESCARGAR PDFs CONVERTIDOS
              </Button>
            </a>
          </div>
        ) : (
          <div style={{ marginTop: '10px' }}>
            <p>{filesLeft} archivo(s) por procesar.</p>
          </div>
        )}
      </div>
    );
  };

  const searchDiv = () => {
    return (
      <div className="searchDiv">
        <p className="toolsTitle">3. Buscar dentro de PDFs</p>
        <Input
          placeholder="Palabra(s)..."
          onChange={(e) => setTerm(e.target.value)}
          disabled={disabled || processingSearch}
        />
        <Button
          positive
          className="searchBtn"
          onClick={() => searchPDF()}
          loading={processingSearch}
          disabled={disabled || !(term && term.length > 2)}>
          Buscar
        </Button>
        {!disabled && searchResults && !processingSearch ? (
          <div className="resultsDiv">
            <Button
              primary
              className="clipboardBtn"
              onClick={() => {
                navigator.clipboard.writeText(
                  searchResults.replace(/<\/?[^>]+(>|$)/g, ''),
                );
              }}>
              COPIAR RESULTADOS
            </Button>
            <p>{parse(searchResults)}</p>
          </div>
        ) : null}
      </div>
    );
  };

  return (
    <div className="tools">
      {ocrDiv()}
      {searchDiv()}
    </div>
  );
};

export default Tools;
