import React, { useState, useEffect } from 'react';
import { Atom, Box, Fingerprint, Zap, Shuffle } from 'lucide-react';
import { useDVCClient } from '@devcycle/react-client-sdk';

const Button = ({ children, onClick, className, disabled }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`px-4 py-2 rounded-md font-medium flex items-center justify-center ${className}`}
  >
    {children}
  </button>
);

const QuantumFlag = ({ name, state, onObserve, isCollapsed }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isCollapsed) {
        setPosition({
          x: Math.sin(Date.now() / 1000 + parseInt(name.length)) * 10,
          y: Math.cos(Date.now() / 1000 + parseInt(name.length)) * 10
        });
      }
    }, 50);
    return () => clearInterval(interval);
  }, [isCollapsed, name]);

  return (
    <div 
      className="relative w-48 h-24 m-4 cursor-pointer"
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`
      }}
      onClick={onObserve}
    >
      <div 
        className={`absolute inset-0 flex flex-col items-center justify-center rounded-lg transition-all duration-500 ${
          isCollapsed 
            ? state 
              ? 'bg-green-500 shadow-lg' 
              : 'bg-red-500 shadow-lg'
            : 'bg-purple-500 blur-sm animate-pulse'
        }`}
      >
        <div className="flex items-center justify-center mb-2">
          {isCollapsed ? (
            <Box className="w-8 h-8 text-white" />
          ) : (
            <Atom className="w-8 h-8 text-white animate-spin" />
          )}
        </div>
        <div className="text-white font-medium text-center px-2">
          {name.split('_').join(' ')}
        </div>
        {isCollapsed && (
          <div className="text-white text-sm mt-1">
            {state ? 'ENABLED' : 'DISABLED'}
          </div>
        )}
      </div>
    </div>
  );
};

const QuantumStateVisualizer = () => {
  const dvcClient = useDVCClient();
  const [features, setFeatures] = useState({});
  const [flagStates, setFlagStates] = useState({});
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (dvcClient) {
      try {
        const allFeatures = dvcClient.allFeatures();
        console.log("allFeaturs"+allFeatures);
        setFeatures(allFeatures);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch features');
        setLoading(false);
      }
    }
  }, [dvcClient]);

  const collapseWavefunction = () => {
    try {
      const allFeatures = dvcClient.allFeatures();
      const newStates = {};
      
      // Randomly set each feature to true/false when collapsing
      Object.keys(allFeatures).forEach((key) => {
        // 50/50 chance of being true/false
        newStates[key] = Math.random() < 0.5;
      });
      
      setFlagStates(newStates);
      setIsCollapsed(true);
    } catch (err) {
      setError('Failed to collapse quantum states');
    }
  };
  const resetStates = () => {
    setFlagStates({});
    setIsCollapsed(false);
    setError(null);
  };

  const observeSingleFlag = (flagName) => {
    if (isCollapsed) return;

    try {
      const feature = features[flagName];
      setFlagStates(prev => ({
        ...prev,
        [flagName]: feature.value
      }));
    } catch (err) {
      setError(`Failed to observe state for ${flagName}`);
    }
  };

  if (loading) {
    return (
      <div className="w-full max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-center">
          <Atom className="w-8 h-8 animate-spin text-purple-600" />
          <span className="ml-2">Initializing quantum system...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-6">
      <div className="mb-4">
        <div className="flex items-center gap-2 text-xl font-bold mb-4">
          <Fingerprint className="w-6 h-6" />
          Quantum Feature Flag Demo
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <div className="mb-4 p-4 bg-gray-100 rounded-lg">
        <p className="text-sm text-gray-600">
          All feature flags begin in quantum superposition (both enabled and disabled simultaneously).
          Click individual flags to observe their state, or collapse all flags simultaneously.
          States are determined by DevCycle feature flag service.
        </p>
      </div>
      
      <div className="flex flex-wrap justify-center mb-6">
        {Object.keys(features).map((flagName) => (
          <QuantumFlag
            key={flagName}
            name={flagName}
            state={flagStates[flagName]}
            isCollapsed={flagStates.hasOwnProperty(flagName)}
            onObserve={() => observeSingleFlag(flagName)}
          />
        ))}
      </div>
      
      <div className="flex justify-center gap-4">
        <Button 
          onClick={collapseWavefunction}
          className="bg-purple-600 hover:bg-purple-700 text-white disabled:opacity-50"
          disabled={isCollapsed}
        >
          <Zap className="w-4 h-4 mr-2" />
          Collapse All Flags
        </Button>
        
        <Button 
          onClick={resetStates}
          className="border border-gray-300 hover:bg-gray-100"
        >
          <Shuffle className="w-4 h-4 mr-2" />
          Reset to Superposition
        </Button>
      </div>
      
      <div className="mt-6 p-4 bg-gray-100 rounded-lg">
        <div className="text-sm space-y-2">
          <p className="font-bold">System Status:</p>
          <p>
            {isCollapsed 
              ? "All feature flags have collapsed to definite states"
              : "Feature flags are in quantum superposition"}
          </p>
          {isCollapsed && (
            <div className="mt-2">
              <p className="font-bold">Final Flag States:</p>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {Object.entries(flagStates).map(([flag, state]) => (
                  <div key={flag} className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${state ? 'bg-green-500' : 'bg-red-500'}`} />
                    <span>{flag.split('_').join(' ')}: {state ? 'Enabled' : 'Disabled'}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuantumStateVisualizer;