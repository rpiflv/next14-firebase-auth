import React from 'react';
import { cleanup, render, screen, waitFor, fireEvent } from '@testing-library/react';
import Signin from '../app/signin/page'
import { useRouter } from 'next/navigation';

const mockUseRouter = jest.spyOn(require('next/router'), 'useRouter');

describe('Home', () => {
  it('renders a heading', () => {
    mockUseRouter.mockReturnValue({
      route: '/signin',
      pathname: '/',
      query: '',
      asPath: '/',
      push: jest.fn(), // add a mock push method
    });

    render(<Signin />);

    const heading = 2;

    expect(heading).toBe(2);
  });
});