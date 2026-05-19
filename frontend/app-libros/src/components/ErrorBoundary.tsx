import React from "react";

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error no controlado:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          color: "var(--color-texto-principal, #e0e0e0)",
          textAlign: "center",
          padding: "2rem",
        }}>
          <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>
            Algo salió mal
          </h1>
          <p style={{ marginBottom: "1.5rem", color: "#94a3b8" }}>
            Ocurrió un error inesperado. Intenta recargar la página.
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: "0.75rem 1.5rem",
              background: "var(--color-primario, #6366f1)",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "1rem",
            }}
          >
            Recargar página
          </button>
          {this.state.error && (
            <details style={{ marginTop: "1rem", color: "#94a3b8", fontSize: "0.8rem" }}>
              <summary>Ver detalle del error</summary>
              <pre style={{ marginTop: "0.5rem", whiteSpace: "pre-wrap" }}>
                {this.state.error.message}
              </pre>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}
