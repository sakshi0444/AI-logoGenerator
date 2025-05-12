// Fix 2: Correct the import case sensitivity in provider.jsx

import React from 'react';
import Header from './_components/Header'; // Corrected capitalization to match the file name

function Provider({ children }) {
  return (
    <div>
      <Header />
      <div className='px-10 lg:px-32 xl:px-48 2xl:px-56 '>
      {children}
      </div>
      
    </div>
  );
}

export default Provider;