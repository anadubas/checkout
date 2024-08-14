import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import OrderForm from './OrderForm';

describe('OrderForm Component', () => {
  it('should render the form correctly', () => {
    render(<OrderForm />);

    expect(screen.getByText(/Booking storage at:/i)).toBeInTheDocument();
    expect(screen.getByText(/Cody's Cookie Store/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Customer Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Customer Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Card Number/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Order Price/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Book/i })).toBeInTheDocument();
  });
});
