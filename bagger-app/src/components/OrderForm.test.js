import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import OrderForm from '../OrderForm';

// Mock the `channel` module
jest.mock('../channels/orderChannel', () => ({
  push: jest.fn().mockReturnThis(),
  receive: jest.fn().mockImplementation((_, callback) => {
    callback({ value: '100.00' });
    return this;
  })
}));

const mockAxios = new MockAdapter(axios);

describe('OrderForm Component', () => {
  beforeEach(() => {
    mockAxios.reset();
  });

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

  it('should update number of bags correctly', () => {
    render(<OrderForm />);

    fireEvent.click(screen.getByText(/-/i));
    expect(screen.getByLabelText(/Order Price/i)).toHaveValue('100.00'); // Value should update to mock response

    fireEvent.change(screen.getByLabelText(/Number of Bags/i), { target: { value: '3' } });
    fireEvent.click(screen.getByText(/\+/i));
    expect(screen.getByLabelText(/Order Price/i)).toHaveValue('100.00'); // Value should update to mock response
  });

  it('should handle form submission', async () => {
    render(<OrderForm />);

    mockAxios.onPost('http://localhost:4000/api/orders').reply(200, {
      order: {
        customerName: 'John Doe',
        customerEmail: 'john.doe@example.com',
        cardNumber: '1234567812345678',
        bags: 1,
        value: '100.00'
      }
    });

    fireEvent.change(screen.getByLabelText(/Customer Name/i), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText(/Customer Email/i), { target: { value: 'john.doe@example.com' } });
    fireEvent.change(screen.getByLabelText(/Card Number/i), { target: { value: '1234567812345678' } });

    fireEvent.submit(screen.getByRole('form'));

    await waitFor(() => {
      expect(screen.getByText(/Booking placed successfully!/i)).toBeInTheDocument();
    });
  });

  it('should display error messages for failed submission', async () => {
    render(<OrderForm />);

    mockAxios.onPost('http://localhost:4000/api/orders').reply(402, {
      error: 'Payment required'
    });

    fireEvent.change(screen.getByLabelText(/Customer Name/i), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText(/Customer Email/i), { target: { value: 'john.doe@example.com' } });
    fireEvent.change(screen.getByLabelText(/Card Number/i), { target: { value: '1234567812345678' } });

    fireEvent.submit(screen.getByRole('form'));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Payment required');
    });
  });

  it('should handle modal close', async () => {
    render(<OrderForm />);

    mockAxios.onPost('http://localhost:4000/api/orders').reply(200, {
      order: {
        customerName: 'John Doe',
        customerEmail: 'john.doe@example.com',
        cardNumber: '1234567812345678',
        bags: 1,
        value: '100.00'
      }
    });

    fireEvent.change(screen.getByLabelText(/Customer Name/i), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText(/Customer Email/i), { target: { value: 'john.doe@example.com' } });
    fireEvent.change(screen.getByLabelText(/Card Number/i), { target: { value: '1234567812345678' } });

    fireEvent.submit(screen.getByRole('form'));

    await waitFor(() => {
      expect(screen.getByText(/Booking placed successfully!/i)).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: /Close/i }));
    await waitFor(() => {
      expect(screen.queryByText(/Booking placed successfully!/i)).not.toBeInTheDocument();
    });
  });
});
