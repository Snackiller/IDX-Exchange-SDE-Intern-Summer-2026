import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      hasError: false,
    };
  }

  static getDerivedStateFromError() {
    return {
      hasError: true,
    };
  }

  componentDidCatch(error, errorInfo) {
    console.error(
      "React Error Boundary caught an error:",
      error,
      errorInfo
    );
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <main
          style={{
            maxWidth: "700px",
            margin: "80px auto",
            padding: "24px",
            textAlign: "center",
          }}
        >
          <h1>Something went wrong</h1>

          <p>
            The application encountered an unexpected
            error.
          </p>

          <button
            type="button"
            onClick={this.handleReload}
          >
            Reload Application
          </button>
        </main>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;