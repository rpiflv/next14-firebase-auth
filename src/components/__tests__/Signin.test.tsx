import React from 'react';
import { render, screen } from '@testing-library/react';
import Signin from '../../components/Signin';
import '@testing-library/jest-dom/';


jest.mock('next/navigation', () => require('next-router-mock'));

describe('Sign In', () => {
  it('renders a button', () => {
    render(<Signin />);

    const button = screen.getByRole('button', { name: /Sign in/i });

    expect(button).toBeInTheDocument();
  });
});