import React from 'react';
import { DevCycleProvider } from '@devcycle/react-client-sdk';
import QuantumStateVisualizer from './QuantumStateVisualizer';

const DEVCYCLE_CLIENT_KEY = 'dvc_client_f307821e_5904_48eb_af7d_36c5fbfec016_cba8923';

export default function App() {
  return (
    <DevCycleProvider
      config={{
        sdkKey: DEVCYCLE_CLIENT_KEY,
        user: {
          user_id: 'quantum-user-' + Math.random().toString(36).substr(2, 9),
          email: 'quantum@example.com',
        }
      }}
    >
      <QuantumStateVisualizer />
    </DevCycleProvider>
  );
}