import React from 'react';
import { render, screen, fireEvent, cleanup, waitFor } from '@testing-library/react';
import Signup from '../../components/Signup';
import '@testing-library/jest-dom/';
import { createUserWithEmailAndPassword } from 'firebase/auth';



jest.mock('next/navigation', () => require('next-router-mock'));

jest.mock('firebase/auth', () => {
  const mockAuthInstance = {
    currentUser: {
      uid: '123',
      email: 'test@test.com',
    },
  }
  return {
    __esModule: true,
    getAuth: jest.fn(() => mockAuthInstance),
    createUserWithEmailAndPassword: jest.fn(() => Promise.resolve({ user: { uid: '123', email: 'test@test.com'  } })),
  };
});


describe('Sign Up', () => {

  afterEach(() => {
      cleanup();
      jest.clearAllMocks();
  });

  it('renders a button', async () => {
    render(<Signup />);

    const button = await screen.findByRole('button', { name: /Sign up/i });

    expect(button).toBeInTheDocument();
  });

  it('checks if button is enabled when form is filled correctly',  () => {
    render(<Signup />);

    const emailInput =  screen.getByTestId('email');
    const passwordAgainInput =  screen.getByTestId('confirm-password');
    const passwordInput =  screen.getByTestId('password');
    const termsCheckbox =  screen.getByTestId('checkbox-tou');

    fireEvent.change(emailInput, { target: { value: 'test@test.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password' } });
    fireEvent.change(passwordAgainInput, { target: { value: 'password' } });
    fireEvent.click(termsCheckbox);

    const button = screen.getByRole('button', { name: /Sign Up/i });

    expect(button).toBeEnabled();
  });

  it('creates a user when the form is submitted', async () => {
    const mockCreateUser = createUserWithEmailAndPassword as jest.MockedFunction<typeof createUserWithEmailAndPassword>;

    render(<Signup />);
  
    const emailInput =  screen.getByTestId('email');
    const passwordAgainInput =  screen.getByTestId('confirm-password');
    const passwordInput =  screen.getByTestId('password');
    const termsCheckbox =  screen.getByTestId('checkbox-tou');
  
    fireEvent.change(emailInput, { target: { value: 'test@test.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password' } });
    fireEvent.change(passwordAgainInput, { target: { value: 'password' } });
    fireEvent.click(termsCheckbox);
  
    const button = screen.getByRole('button', { name: /Sign Up/i });
    fireEvent.click(button);
    await waitFor(() => expect(mockCreateUser).toHaveBeenCalledWith(expect.anything(), 'test@test.com', 'password'));
  });
});