import React from 'react';
import Layout from '../layouts/Layout';
import TestSecureStorage from '../components/TestSecureStorage';

const TestPage: React.FC = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <TestSecureStorage />
      </div>
    </Layout>
  );
};

export default TestPage;
