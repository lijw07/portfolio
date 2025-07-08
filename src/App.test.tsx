import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders portfolio app', () => {
  render(<App />);
  const titleElement = screen.getByText(/Jai Li/i);
  expect(titleElement).toBeInTheDocument();
});
