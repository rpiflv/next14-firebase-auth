import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import ForgotPassword from '../../components/ForgotPassword';

import '@testing-library/jest-dom/';

jest.mock('next/navigation', () => require('next-router-mock'));
jest.mock('firebase/app', () => ({
    initializeApp: jest.fn(),
    getApps: jest.fn(() => [{}]),
  }));
jest.mock('firebase/auth', () => ({
getAuth: jest.fn(() => ({ 
    signInWithEmailAndPassword: jest.fn(),
    })),
}));  
jest.mock('firebase/firestore', () => ({
    getFirestore: jest.fn(() => ({ collection: jest.fn() })),
  }));

describe('Forgot Password', () => {
    afterEach(() => {
        cleanup();
        jest.clearAllMocks();
    });
    it('renders a button', async () => {
        render(<ForgotPassword />);

        const button = await screen.findByRole('button', { name: /Send forgot password email/i });

        expect(button).toBeInTheDocument();
    });
});