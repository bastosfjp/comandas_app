import React from 'react';
import { Box, Typography, Button } from '@mui/material';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // log minimal string details to avoid React DevTools formatting issues
    try {
      const msg = error && (error.message || String(error)) ? (error.message || String(error)) : 'Unknown error';
      const stack = error && error.stack ? error.stack : '';
      const compStack = info && info.componentStack ? info.componentStack : '';
      console.error('ErrorBoundary caught:', msg, stack, compStack);
    } catch (e) {
      // ignore logging failures
    }
  }

  handleBack = () => {
    window.location.href = '/comandas';
  };

  render() {
    if (this.state.hasError) {
      const message = this.state.error && (this.state.error.message || String(this.state.error)) ? (this.state.error.message || String(this.state.error)) : 'Erro desconhecido';
      const stack = this.state.error && this.state.error.stack ? this.state.error.stack : '';
      const compStack = this.state.error && this.state.error.componentStack ? this.state.error.componentStack : '';
      return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: 2, p: 3 }}>
          <Typography variant="h6" color="error">Ocorreu um erro ao carregar a página</Typography>
          <Typography variant="body2" color="text.secondary">Tente novamente ou volte para a listagem de comandas.</Typography>
          <Typography variant="caption" color="text.secondary" sx={{ whiteSpace: 'pre-wrap', mt: 1 }}>{message}</Typography>
          {stack && (
            <Typography variant="caption" color="text.disabled" sx={{ whiteSpace: 'pre-wrap', mt: 1, maxWidth: '80%' }}>{stack}</Typography>
          )}
          <Button variant="contained" onClick={this.handleBack}>Voltar para Comandas</Button>
        </Box>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
