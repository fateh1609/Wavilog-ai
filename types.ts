
// Added React import to provide access to React namespace types
import React from 'react';

export interface ServiceCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

export interface AgentPersona {
  name: string;
  role: string;
  description: string;
  icon: React.ReactNode;
}