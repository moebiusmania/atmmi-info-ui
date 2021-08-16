import React from 'react';

import Header from './components/Header';
import Dashboard from './components/Dashboard';
import Footer from './components/Footer';

const App = (): JSX.Element => {
  return (
    <div className="bg-gray-50 h-screen">
      <Header />
      <Dashboard />
      <Footer />
    </div>
  );
}

export default App;
