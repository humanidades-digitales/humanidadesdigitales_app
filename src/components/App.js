import React, { useState } from 'react';
import 'semantic-ui-css/semantic.min.css';
import { BrowserRouter as Router } from 'react-router-dom';
import Header from './Header';
import Dropzone from './Dropzone';
import Tools from './Tools';
import '../assets/styles/app.css';

const App = () => {
  const uniqueId = localStorage.getItem('uniqueId') || new Date().valueOf();
  if (!localStorage.getItem('uniqueId')) {
    localStorage.setItem('uniqueId', uniqueId);
  }
  const [disabled, setDisabled] = useState(true);
  const [corpusSize, setCorpusSize] = useState(0);

  const onCorpus = (contentExists) => {
    setDisabled(!contentExists);
    setCorpusSize(contentExists);
  };

  return (
    <Router>
      <div className="mainContainer">
        <Header />
        <Dropzone uniqueId={uniqueId} onCorpus={onCorpus} />
        <Tools
          uniqueId={uniqueId}
          disabled={disabled}
          corpusSize={corpusSize}
        />
      </div>
    </Router>
  );
};

export default App;
