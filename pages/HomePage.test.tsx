import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import HomePage from '../pages/index';
import { useRouter } from 'next/router';
import { SessionProvider } from 'next-auth/react';

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

describe('HomePage', () => {
  // afterEach(() => {
  //   jest.clearAllMocks();
  // });

  it('renders the ActivitySearchForm when the user is authenticated', () => {
    (useRouter as jest.Mock).mockReturnValue({});

    render(
      <SessionProvider
        session={{
          user: {
            name: 'test user',
          },
          expires: "1"
        }}
      >
        <HomePage />
      </SessionProvider>
    );
    expect(screen.getByTestId('activity-search-form')).toBeInTheDocument();
  });
});
