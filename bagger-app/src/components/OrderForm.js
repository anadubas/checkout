import React, { useState, useEffect } from "react";
import axios from "axios";
import channel from "../channels/orderChannel";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  CircularProgress,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle
} from '@mui/material';

const OrderForm = () => {
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [bags, setBags] = useState(1);
  const [orderValue, setOrderValue] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [apiErrors, setApiErrors] = useState({
    customerName: "",
    customerEmail: "",
    cardNumber: "",
    bags: "",
    orderValue: ""
  });

  const fetchValue = (numberOfBags) => {
    channel.push("updateBags", numberOfBags)
      .receive("ok", (resp) => {
        if (resp && resp.value) {
          setOrderValue(resp.value);
        } else {
          console.error("Invalid response", resp);
        }
      })
      .receive("error", (resp) => {
        console.error("Error updating bags", resp);
      });
  };

  useEffect(() => {
    fetchValue(bags);
  }, [bags]); 

  const handleUpdateBags = (value) => {
    const newBags = Math.max(1, value);
    setBags(newBags);
  };

  const handleIncrement = () => handleUpdateBags(bags + 1);
  const handleDecrement = () => handleUpdateBags(Math.max(1, bags - 1));

  const handleOrderSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    setApiErrors({
      customerName: "",
      customerEmail: "",
      cardNumber: "",
      bags: "",
      orderValue: ""
    });

    try {
      const response = await axios.post("http://localhost:4000/api/orders", {
        order: {
          customerName: customerName,
          customerEmail: customerEmail,
          cardNumber: cardNumber,
          bags: parseInt(bags, 10),
          value: orderValue
        }
      }, 
      { headers: { "Content-Type": "application/json" } });
      
      setSuccess(response.data.order);
      setOpenModal(true);
    } catch (err) {
      console.error(err);
      if (err.response && err.response.data && err.response.data.status === 412) {
        setApiErrors(err.response.data.error);
      } else if (err.response && err.response.data && err.response.data.status === 402) {
        setError(err.response.data.error);
      } else {
        setError("Failed to create order. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setCustomerName("");
    setCustomerEmail("");
    setCardNumber("");
    setBags(1);
    setOrderValue("");
    setError(null);
    setApiErrors({
      customerName: "",
      customerEmail: "",
      cardNumber: "",
      bags: "",
      orderValue: ""
    });
    setSuccess(null);

    setOpenModal(false);
  };

  return (
    <Container sx={{ mt: 5, p: 3, bgcolor: 'white', borderRadius: 1, boxShadow: 3, mx: 'auto', width: '460px' }}>
      <Typography variant="h6" align="left" color="textSecondary" gutterBottom>
        Booking storage at:
      </Typography>
      <Typography variant="h4" component="h1" align="left" gutterBottom>
        Cody's Cookie Store
      </Typography>
      
      <form onSubmit={handleOrderSubmit}>

        <Box display="flex" alignItems="center" mt={2}>
          <Typography variant="h6" align="left" color="text" gutterBottom sx={{ mt: 2, width: '60%' }}>
            Number of Bags
          </Typography>

          <Box display="flex" alignItems="center" justifyContent="flex-end" mt={2}>
            <Button onClick={handleDecrement} color="primary" variant="contained" sx={{ minWidth: '40px', height: '40px', fontSize: '18px' }}>-</Button>
            <TextField
              variant="outlined"
              margin="normal"
              type="number"
              value={bags}
              onChange={(e) => handleUpdateBags(Number(e.target.value))}
              error={!!apiErrors.bags}
              helperText={apiErrors.bags}
              inputProps={{ 
                min: 0
              }}
              sx={{
                width: 100,
                flex: 1,
                '& input': {
                  textAlign: 'center',
                },
                '& .MuiOutlinedInput-root': {
                  borderRadius: 0,
                  '& fieldset': {
                    border: 'none',
                  }
                },
                '& .MuiInputBase-root': {
                  padding: 0
                },
                '& input::-webkit-inner-spin-button, & input::-webkit-outer-spin-button': {
                  display: 'none',
                  '-webkit-appearance': 'none',
                },
                '& input[type="number"]': {
                  '-moz-appearance': 'textfield', // For Firefox
                }
              }}
            />
            <Button onClick={handleIncrement} color="primary" variant="contained" sx={{ minWidth: '40px', height: '40px', fontSize: '18px' }}>+</Button>
          </Box>
        </Box>

        <Box mt={2} pt={3} sx={{ borderTop: '1px solid #e0e0e0' }}>
          <Typography variant="h6" align="left" color="text" gutterBottom>
            Personal Details
          </Typography>

          <TextField
            fullWidth
            label="Customer Name"
            variant="outlined"
            margin="normal"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            error={!!apiErrors.customerName}
            helperText={apiErrors.customerName}
            required
          />
          <TextField
            fullWidth
            label="Customer Email"
            variant="outlined"
            margin="normal"
            type="email"
            value={customerEmail}
            onChange={(e) => setCustomerEmail(e.target.value)}
            error={!!apiErrors.customerEmail}
            helperText={apiErrors.customerEmail}
            required
          />
        </Box>

        <Box mt={2} pt={3} sx={{ borderTop: '1px solid #e0e0e0' }}>
          <Typography variant="h6" align="left" color="text" gutterBottom>
            Payment Information
          </Typography>

          <TextField
            fullWidth
            label="Card Number"
            variant="outlined"
            margin="normal"
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value)}
            error={!!apiErrors.cardNumber}
            helperText={apiErrors.cardNumber}
            required
          />
        </Box>

        <Box display="flex" alignItems="center" mt={2} pt={3} sx={{ borderTop: '1px solid black' }}>
          <TextField
            label="Order Price"
            variant="standard"
            margin="normal"
            value={orderValue}
            InputProps={{
              readOnly: true,
              disableUnderline: true
            }}
            sx={{ flex: 1 }}
          />
          <Box ml={8}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
              sx={{
                padding: '6px 32px 6px 32px'
              }}
            >
              {loading ? <CircularProgress size={24} /> : "Book"}
            </Button>
          </Box>
        </Box>
      </form>

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}

      <Dialog
        open={openModal}
        onClose={handleCloseModal}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Booking placed successfully!</DialogTitle>
        <DialogContent>
          {success && (
            <div>
              <Typography><strong>Customer Name:</strong> {success.customerName}</Typography>
              <Typography><strong>Customer Email:</strong> {success.customerEmail}</Typography>
              <Typography><strong>Card Number:</strong> {success.cardNumber}</Typography>
              <Typography><strong>Bags:</strong> {success.bags}</Typography>
              <Typography><strong>Order Value:</strong> {success.value}</Typography>
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default OrderForm;